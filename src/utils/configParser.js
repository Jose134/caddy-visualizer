function extractHostnames(route) {
  return route.match?.find(m => m.host)?.host || null;
}

function extractUpstreams(route) {
  const upstreams = [];
  
  const processHandle = (handle, ipMatcher = null) => {
    if (handle.handler === "reverse_proxy") {
      handle.upstreams?.forEach(upstream => {
        upstreams.push({
          type: 'proxy',
          target: upstream.dial,
          ipMatcher
        });
      });
    } else if (handle.handler === "static_response" && handle.abort) {
      upstreams.push({
        type: 'abort',
        target: handle.body || 'Abort Request',
        ipMatcher
      });
    } else if (handle.handler === "static_response") {
      upstreams.push({
        type: 'static',
        target: handle.body || 'Static Response',
        ipMatcher
      });
    }
  };

  const processRoute = (routeObj) => {
    // Check for IP matchers at route level
    let ipMatcher = null;
    if (routeObj.match) {
      const ipMatch = routeObj.match.find(m => m.remote_ip || (m.not && m.not.some(n => n.remote_ip)));
      if (ipMatch) {
        if (ipMatch.remote_ip) {
          ipMatcher = {
            not: false,
            ranges: ipMatch.remote_ip.ranges
          };
        } else if (ipMatch.not) {
          ipMatcher = {
            not: true,
            ranges: ipMatch.not.map(n => n.remote_ip.ranges).flat()
          };
        }
      }
    }

    // Process handlers at this level
    if (routeObj.handle) {
      routeObj.handle.forEach(handle => processHandle(handle, ipMatcher));
    }

    // Process subroutes
    if (routeObj.handle) {
      routeObj.handle.forEach(handle => {
        if (handle.handler === "subroute" && handle.routes) {
          handle.routes.forEach(subroute => processRoute(subroute));
        }
      });
    }
  };

  processRoute(route);
  return upstreams;
}

export function flattenCaddyConfig(config) {
  const servers = config?.apps?.http?.servers || {};
  const flattened = [];

  Object.entries(servers).forEach(([serverName, server]) => {
    const serverInfo = {
      name: serverName,
      ports: server.listen || [],
      routes: []
    };

    (server.routes || []).forEach((route, index) => {
      const hostnames = extractHostnames(route);
      const upstreams = extractUpstreams(route);

      serverInfo.routes.push({
        id: `${serverName}-${index}`,
        hostnames,
        upstreams,
        originalRoute: route
      });
    });

    // Sort routes by hostname
    serverInfo.routes = serverInfo.routes.sort((a, b) => {
      const hostnameA = Array.isArray(a.hostnames) ? a.hostnames[0] : a.hostnames;
      const hostnameB = Array.isArray(b.hostnames) ? b.hostnames[0] : b.hostnames;
      return hostnameA?.localeCompare(hostnameB) || 0;
    });

    flattened.push(serverInfo);
  });

  return flattened;
} 
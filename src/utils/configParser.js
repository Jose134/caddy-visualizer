function extractHostnames(route) {
  return route.match?.find(m => m.host)?.host || null;
}

function extractUpstreamTarget(route) {
  let target = null;
  
  // Helper function to recursively search for reverse_proxy handler
  const findReverseProxy = (handles) => {
    for (const handle of handles || []) {
      if (handle.handler === "reverse_proxy") {
        return handle.upstreams?.[0]?.dial;
      }
      if (handle.handler === "subroute" && handle.routes) {
        for (const subroute of handle.routes) {
          const result = findReverseProxy(subroute.handle);
          if (result) return result;
        }
      }
    }
    return null;
  };

  target = findReverseProxy(route.handle);
  return target;
}

function extractSpecialConditions(route) {
  const conditions = {
    hasIPRestriction: false,
    isStaticResponse: false,
  };

  // Check for IP restrictions in the main route's match conditions
  if (route.match?.some(m => m.remote_ip || (m.not && m.not.some(n => n.remote_ip)))) {
    conditions.hasIPRestriction = true;
  }

  const findConditions = (handles) => {
    for (const handle of handles || []) {
      if (handle.handler === "static_response") {
        conditions.isStaticResponse = true;
      }
      if (handle.handler === "subroute" && handle.routes) {
        handle.routes.forEach(subroute => {
          // Check IP restrictions in subroute match conditions
          if (subroute.match?.some(m => m.remote_ip || (m.not && m.not.some(n => n.remote_ip)))) {
            conditions.hasIPRestriction = true;
          }
          findConditions(subroute.handle);
        });
      }
    }
  };

  findConditions(route.handle);
  return conditions;
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
      const target = extractUpstreamTarget(route);
      const conditions = extractSpecialConditions(route);

      serverInfo.routes.push({
        id: `${serverName}-${index}`,
        hostnames,
        target,
        ...conditions,
        isTerminal: route.terminal || false,
        originalRoute: route // Keep reference to original route for advanced editing
      });
    });

    flattened.push(serverInfo);
  });

  console.log('flattened', flattened);

  return flattened;
} 
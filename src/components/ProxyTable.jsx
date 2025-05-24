import { useState } from 'react';
import './ProxyTable.css';
import UpstreamStatus from './UpstreamStatus';

function ProxyTable({ serverInfo }) {
  const [search, setSearch] = useState('');

  const filteredRoutes = serverInfo.routes.filter(route => 
    route.hostnames.some(hostname => 
      hostname.toLowerCase().includes(search.toLowerCase())
    ) || route.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="proxy-server">
      <div className="server-header">
        <h2>{serverInfo.name}</h2>
        <div className="server-ports">
          Listening on: {serverInfo.ports.join(', ')}
        </div>
      </div>

      <table className="proxy-table">
        <thead>
          <tr>
            <th>Domains</th>
            <th>Upstream Target</th>
            <th>Special Rules</th>
            <th>Status</th>
          </tr>
          <tr className="search-input-container">
            <th colSpan={4} className="search-input-container">
              <input type="text" placeholder="Search" className="search-input" onChange={(e) => setSearch(e.target.value)} />
            </th>
          </tr>
        </thead>
        <tbody>
          {serverInfo.routes.map(route => (
            // Filter using visibility to avoid recreating UpstreamStatus components
            // which will ping the upstream server on instantiation
            <tr key={route.id} style={{display: filteredRoutes.includes(route) ? 'table-row' : 'none'}}>
              <td>{route.hostnames.map(hostname => <div key={hostname}>{hostname}</div>)}</td>
              <td>{route.target || '(static response)'}</td>
              <td>
                <div className="rules">
                  {route.hasIPRestriction && (
                    <span className="rule ip-restriction" title="IP Restriction Applied">
                      IP
                    </span>
                  )}
                  {route.isStaticResponse && (
                    <span className="rule static-response" title="Static Response">
                      Static
                    </span>
                  )}
                </div>
              </td>
              <td>
                <UpstreamStatus target={route.target} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProxyTable; 
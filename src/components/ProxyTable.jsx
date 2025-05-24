import { useState, Fragment } from 'react';
import './ProxyTable.css';
import UpstreamStatus from './UpstreamStatus';
import { LightAsync as SyntaxHighlighter} from 'react-syntax-highlighter';
import { tomorrowNight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function ProxyTable({ serverInfo }) {
  const [search, setSearch] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());

  const filteredRoutes = serverInfo.routes.filter(route => 
    route.hostnames.some(hostname => 
      hostname.toLowerCase().includes(search.toLowerCase())
    ) || route.target.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRow = (routeId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(routeId)) {
      newExpandedRows.delete(routeId);
    } else {
      newExpandedRows.add(routeId);
    }
    setExpandedRows(newExpandedRows);
  };

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
            <th>Actions</th>
          </tr>
          <tr className="search-input-container">
            <th colSpan={5} className="search-input-container">
              <input type="text" placeholder="Search" className="search-input" onChange={(e) => setSearch(e.target.value)} />
            </th>
          </tr>
        </thead>
        <tbody>
          {serverInfo.routes.map(route => (
            // Using React.Fragment to group the main row and json row
            <Fragment key={route.id}>
              {/* Main row */}
              <tr style={{display: filteredRoutes.includes(route) ? 'table-row' : 'none'}}>
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
                <td>
                  <button 
                    className={`action-button ${expandedRows.has(route.id) ? 'active' : ''}`}
                    onClick={() => toggleRow(route.id)}
                  >
                    <img src="/json.svg" alt="JSON"/>
                  </button>
                </td>
              </tr>
              {/* JSON row */}
              {expandedRows.has(route.id) && filteredRoutes.includes(route) && (
                <tr className="json-row">
                  <td colSpan={5}>
                    <SyntaxHighlighter language="json" style={tomorrowNight}>
                      {JSON.stringify(route.originalRoute, null, 2)}
                    </SyntaxHighlighter>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProxyTable; 
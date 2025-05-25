import { useState, Fragment } from 'react';
import './ProxyTable.css';
import UpstreamStatus from './UpstreamStatus';
import { LightAsync as SyntaxHighlighter} from 'react-syntax-highlighter';
import { tomorrowNight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function ProxyTable({ serverInfo, onRefresh }) {
  const [search, setSearch] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredRoutes = serverInfo.routes.filter(route => 
    route.hostnames.some(hostname => 
      hostname.toLowerCase().includes(search.toLowerCase())
    ) || route.upstreams.some(upstream => 
      upstream.target.toLowerCase().includes(search.toLowerCase())
    )
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderUpstreamCell = (upstream) => {
    return (
      <div className="upstream-entry" key={`${upstream.type}-${upstream.target}`}>
        <div className="upstream-type">
          <span className={`upstream-badge ${upstream.type}`}>
            {upstream.type.toUpperCase()}
          </span>
        </div>
        <div className="monospace">
          {upstream.target}
        </div>
      </div>
    );
  };

  const renderIPMatcherCell = (upstream) => 
    upstream.ipMatcher
      ? <span className="monospace">
          {upstream.ipMatcher.not ? <strong>NOT </strong> : ''}
          {upstream.ipMatcher.ranges.join(', ')}
        </span>
      : <span className="monospace">&mdash;</span>;

  const renderStatusCell = (upstream) =>
    upstream.type === 'proxy'
      ? <UpstreamStatus target={upstream.target} />
      : <span className="status static">Static</span>;

  return (
    <div className="proxy-server">
      <div className="server-header">
        <div className="server-header-content">
          <h2>{serverInfo.name}</h2>
          <div className="server-ports">
            Listening on: {serverInfo.ports.join(', ')}
          </div>
        </div>
        <button 
          className={`refresh-button ${isRefreshing ? 'refreshing' : ''}`}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <img src="/refresh.svg" alt="Refresh"/>
        </button>
      </div>

      <table className="proxy-table">
        <thead>
          <tr>
            <th>Domains</th>
            <th>Upstream Targets</th>
            <th>IP Matchers</th>
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
          {filteredRoutes.map(route => (
            <Fragment key={route.id}>
              <tr>
                <td>{route.hostnames.map(hostname => <div key={hostname}>{hostname}</div>)}</td>
                <td className="upstreams-cell">
                  {route.upstreams.map(renderUpstreamCell)}
                </td>
                <td className="ip-matchers-cell">
                  {route.upstreams.map((upstream, idx) => (
                    <div key={idx} className="ip-matcher-entry">
                      {renderIPMatcherCell(upstream)}
                    </div>
                  ))}
                </td>
                <td className="status-cell">
                  {route.upstreams.map((upstream, idx) => (
                    <div key={idx} className="status-entry">
                      {renderStatusCell(upstream)}
                    </div>
                  ))}
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
              {expandedRows.has(route.id) && (
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
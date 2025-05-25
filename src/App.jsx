import { useEffect, useState, useCallback } from 'react';
import './App.css'
import ProxyTable from './components/ProxyTable';
import { flattenCaddyConfig } from './utils/configParser';

async function fetchCaddyConfig() {
  const response = await fetch('/api/caddy/config/', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    console.error('Error fetching Caddy config:', response.statusText);
    return {};
  }
  const data = await response.json();
  return data;
}

function App() {
  const [servers, setServers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const result = await fetchCaddyConfig();
      setServers(flattenCaddyConfig(result));
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load config:', error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (mounted) {
        await loadData();
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [loadData]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <main>
        {servers.map(server => (
          <ProxyTable 
            key={server.name} 
            serverInfo={server} 
            onRefresh={loadData}
          />
        ))}
      </main>
    </div>
  );
}

export default App

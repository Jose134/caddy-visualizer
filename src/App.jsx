import { useEffect, useState } from 'react';
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

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const result = await fetchCaddyConfig();
        if (mounted) {
          setServers(flattenCaddyConfig(result));
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load config:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <main>
        {servers.map(server => (
          <ProxyTable key={server.name} serverInfo={server} />
        ))}
      </main>
    </div>
  );
}

export default App

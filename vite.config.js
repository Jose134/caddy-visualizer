import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Default Caddy API URL if not set in environment
  const caddyApiUrl = env.VITE_CADDY_API_URL
  console.log('Using Caddy API URL:', caddyApiUrl)

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/caddy': {
          target: caddyApiUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/caddy/, ''),
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.error('Proxy error:', err.message);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Proxying:', req.method, req.url, '=>', options.target + proxyReq.path);
            });
          }
        }
      }
    }
  }
})

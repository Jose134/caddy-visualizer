export async function checkUpstreamStatus(target) {
  if (!target) return false;

  try {
    // Extract host and port from target
    const [host, port] = target.split(':');
    
    // Try to fetch with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const protocol = port === '443' ? 'https' : 'http';
    await fetch(`${protocol}://${host}:${port}`, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors'
    });

    clearTimeout(timeoutId);
    return true; // If we get here, the server responded
  } catch (error) {
    console.debug(`Failed to ping ${target}:`, error.message);
    return false;
  }
} 
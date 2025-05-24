import { useState, useEffect } from 'react';
import { checkUpstreamStatus } from '../utils/pingUtils';
import './UpstreamStatus.css';

const PING_INTERVAL = 60000; // 1 minute in milliseconds

const UpstreamStatus = function UpstreamStatus({ target }) {
  const [isUp, setIsUp] = useState(null);

  useEffect(() => {
    let mounted = true;
    let intervalId = null;

    const checkStatus = async () => {
      if (!target) {
        if (mounted) {
          setIsUp(false);
        }
        return;
      }

      const status = await checkUpstreamStatus(target);
      if (mounted) {
        setIsUp(status);
      }
    };

    // Initial check
    checkStatus();

    // Set up periodic checking
    intervalId = setInterval(checkStatus, PING_INTERVAL);

    // Cleanup
    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [target]);

  if (isUp === null) {
    return <span className="status checking">Checking...</span>;
  }

  return (
    <span 
      className={`status ${isUp ? 'up' : 'down'}`}
    >
      {isUp ? 'Up' : 'Down'}
    </span>
  );
};

export default UpstreamStatus; 
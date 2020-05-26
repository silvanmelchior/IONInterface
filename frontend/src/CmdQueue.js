import React from 'react';

export default function useCmdQueue(poll_interval) {

  const queueRef = React.useRef(null);

  React.useEffect(() => {

    const handle = setInterval(() => {
      if(queueRef.current != null) {
        queueRef.current();
        queueRef.current = null;
      }
    }, poll_interval);

    return () => {
      clearInterval(handle);
    };

  }, [poll_interval]);

  return fn => queueRef.current = fn

}

import React from 'react';

let queue = null;

export function queueCMD(fn) {
  queue = fn
}

export function useCmdQueue(poll_interval) {
  React.useEffect(() => {
    const handle = setInterval(() => {
      if(queue != null) {
        queue();
        queue = null;
      }
    }, poll_interval);
    return () => {
      clearInterval(handle);
    };
  }, [poll_interval]);
}
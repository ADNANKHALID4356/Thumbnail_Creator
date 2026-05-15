import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fix for "Cannot set property fetch of #<Window> which has only a getter"
// This occurs when a library tries to assign to window.fetch, which is read-only in some environments.
(function fixFetch() {
  if (typeof window === 'undefined') return;
  try {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (descriptor && !descriptor.writable && !descriptor.set && descriptor.configurable) {
      Object.defineProperty(window, 'fetch', {
        value: window.fetch,
        writable: true,
        configurable: true,
        enumerable: true
      });
    }
  } catch (e) {
    console.debug('Fetch fix skipped:', e);
  }
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

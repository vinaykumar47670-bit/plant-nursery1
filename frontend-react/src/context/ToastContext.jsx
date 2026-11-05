import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

// Small pop-up messages, e.g. "Added to cart"
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((message, type = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => <div key={t.id} className={'toast-msg ' + t.type}>{t.message}</div>)}
      </div>
    </ToastContext.Provider>
  );
}

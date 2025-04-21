import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastContext } from "../services/getExportToastManager";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type, duration = 3000) => {
    const validTypes = ["success", "danger", "info", "warning"];
    if (!validTypes.includes(type)) {
      console.error(`Invalid toast type: ${type}`);
      return;
    }
    const id = uuidv4();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // TODO OBSERVAR SI FUNCIONA CORRECTAMENTE
  useEffect(() => {
    return () => {
      // Clear timeouts for all toasts when the component unmounts
      toasts.forEach((toast) => clearTimeout(toast.timeoutId));
    };
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 9999 }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast show align-items-center text-white bg-${toast.type} border-0 mb-2`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body">{toast.message}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => removeToast(toast.id)}
              ></button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
"success" → verde

"danger" → rojo

"info" → azul

"warning" → amarillo
 */

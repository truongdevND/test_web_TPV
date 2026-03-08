import { useCallback, useState } from "react";
import { ToastContext } from "./toastContext";

let toastId = 0;

function ToastContainer({ toasts, remove }) {
  return (
    <div className="fixed inset-0 z-60 pointer-events-none flex flex-col items-end gap-2 p-4 sm:p-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto w-full max-w-sm rounded-lg border shadow-lg bg-white overflow-hidden ${
            toast.type === "error"
              ? "border-red-200"
              : toast.type === "success"
              ? "border-emerald-200"
              : "border-slate-200"
          }`}
        >
          <div className="flex items-start gap-3 px-4 py-3">
            <div
              className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-white ${
                toast.type === "error"
                  ? "bg-red-500"
                  : toast.type === "success"
                  ? "bg-emerald-500"
                  : "bg-slate-500"
              }`}
            >
              {toast.type === "error" && (
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.75a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM10 13.75a1 1 0 100 2 1 1 0 000-2z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {toast.type === "success" && (
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414L9 13.414l4.707-4.707z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {toast.type === "info" && (
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9 9a1 1 0 012 0v5a1 1 0 11-2 0V9zm1-4a1.25 1.25 0 100 2.5A1.25 1.25 0 0010 5z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1">
              {toast.title && (
                <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
              )}
              {toast.message && (
                <p className="mt-0.5 text-sm text-slate-600">{toast.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => remove(toast.id)}
              className="ml-1 text-slate-400 hover:text-slate-600"
            >
              <span className="sr-only">Đóng</span>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toast) => {
    toastId += 1;
    const id = toastId;
    const duration = toast.duration ?? 4000;
    const type = toast.type || "info";

    setToasts((prev) => [...prev, { ...toast, id, type }]);

    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }
  }, [remove]);

  const contextValue = useCallback(
    () => ({
      show: showToast,
      success: (opts) =>
        showToast({ type: "success", ...opts }),
      error: (opts) =>
        showToast({ type: "error", ...opts }),
      info: (opts) =>
        showToast({ type: "info", ...opts }),
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={contextValue()}>
      {children}
      <ToastContainer toasts={toasts} remove={remove} />
    </ToastContext.Provider>
  );
}

export default ToastProvider;


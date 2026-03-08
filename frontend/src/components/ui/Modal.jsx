function Modal({ open, onClose, title, description, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-desc" : undefined}
      >
        {(title || description) && (
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-slate-800">
                {title}
              </h2>
            )}
            {description && (
              <p id="modal-desc" className="text-sm text-slate-500 mt-0.5">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default Modal;

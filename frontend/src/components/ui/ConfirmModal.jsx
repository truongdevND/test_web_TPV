import Modal from "./Modal";
import Button from "./Button";

function ConfirmModal({
  open,
  title = "Xác nhận",
  description,
  confirmText = "Đồng ý",
  cancelText = "Hủy",
  confirmVariant = "primary",
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <Modal open={open} onClose={loading ? undefined : onCancel} title={title} description={description}>
      <div className="p-6 space-y-4">
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            className="flex-1"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;

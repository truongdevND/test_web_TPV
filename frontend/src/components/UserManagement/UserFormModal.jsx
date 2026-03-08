import { useEffect, useMemo, useRef, useState } from "react";
import * as yup from "yup";
import { Modal, Input, DateInput, Button, ConfirmModal } from "../ui";

const INITIAL_FORM = {
  code: "",
  fullName: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  address: "",
};

const createUserSchema = (isEdit) =>
  yup.object({
    code: yup.string().trim().required("Vui lòng nhập mã"),
    fullName: yup.string().trim().required("Vui lòng nhập họ tên"),
    dateOfBirth: yup.string(),
    email: yup
      .string()
      .trim()
      .required("Vui lòng nhập email")
      .email("Email không hợp lệ"),
    phone: yup.string().trim().required("Vui lòng nhập số điện thoại"),
    address: yup.string(),
  });

function toInputDate(ddMMyyyy) {
  if (!ddMMyyyy) return "";
  const parts = ddMMyyyy.split("/");
  if (parts.length !== 3) return "";
  const [d, m, y] = parts;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function toApiDate(yyyyMMdd) {
  if (!yyyyMMdd) return "";
  const [y, m, d] = yyyyMMdd.split("-");
  return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
}

function UserFormModal({ open, onClose, mode, initialData, onSubmit, loading, onDirtyChange }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const initialFormRef = useRef(INITIAL_FORM);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  const isEdit = mode === "edit";

  useEffect(() => {
    if (open) {
      const nextForm = initialData
        ? {
            ...INITIAL_FORM,
            ...initialData,
            dateOfBirth:
              toInputDate(initialData.dateOfBirth) || initialData.dateOfBirth || "",
          }
        : { ...INITIAL_FORM };

      setForm(nextForm);
      initialFormRef.current = nextForm;
      setErrors({});
      setConfirmCancelOpen(false);
    }
  }, [open, mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const isDirty = useMemo(() => {
    const initial = initialFormRef.current;
    const keys = Object.keys(INITIAL_FORM);
    return keys.some((k) => (form?.[k] ?? "") !== (initial?.[k] ?? ""));
  }, [form]);

  useEffect(() => {
    onDirtyChange?.(open ? isDirty : false);
  }, [isDirty, open, onDirtyChange]);

  const requestClose = () => {
    if (loading) return;
    if (isDirty) {
      setConfirmCancelOpen(true);
      return;
    }
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const schema = createUserSchema(isEdit);
    try {
      await schema.validate(form, { abortEarly: false });
      setErrors({});
    } catch (err) {
      if (yup.ValidationError.isError(err)) {
        const next = {};
        err.inner.forEach((e) => {
          if (e.path) next[e.path] = e.message;
        });
        setErrors(next);
        return;
      }
      throw err;
    }
    const payload = {
      ...form,
      dateOfBirth: form.dateOfBirth ? toApiDate(form.dateOfBirth) : form.dateOfBirth,
    };
    onSubmit(payload);
  };

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={requestClose}
      title={isEdit ? "Cập nhật người dùng" : "Tạo mới người dùng"}
      description={
        isEdit ? "Chỉnh sửa thông tin người dùng" : "Điền thông tin người dùng mới"
      }
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <Input
          name="code"
          label="Mã"
          required
          value={form.code}
          onChange={handleChange}
          disabled={isEdit}
          placeholder="VD: U003"
          error={errors.code}
        />
        <Input
          name="fullName"
          label="Họ tên"
          required
          value={form.fullName}
          onChange={handleChange}
          placeholder="Nguyễn Văn A"
          error={errors.fullName}
        />
        <DateInput
          name="dateOfBirth"
          label="Ngày sinh"
          value={form.dateOfBirth}
          onChange={handleChange}
        />
        <Input
          name="email"
          type="email"
          label="Email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="email@example.com"
          error={errors.email}
        />
        <Input
          name="phone"
          label="Số điện thoại"
          required
          value={form.phone}
          onChange={handleChange}
          placeholder="0912345678"
          error={errors.phone}
        />
        <Input
          name="address"
          label="Địa chỉ"
          value={form.address}
          onChange={handleChange}
          placeholder="Thành phố, Quận/Huyện"
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={requestClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={loading || Object.keys(errors).some((k) => errors[k])}
          >
            {loading ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Tạo mới"}
          </Button>
        </div>
      </form>

      <ConfirmModal
        open={confirmCancelOpen}
        title="Xác nhận hủy"
        description="Bạn có chắc muốn hủy? Các thay đổi chưa lưu sẽ bị mất."
        confirmText="Hủy thay đổi"
        cancelText="Tiếp tục sửa"
        confirmVariant="danger"
        onCancel={() => setConfirmCancelOpen(false)}
        onConfirm={() => {
          setConfirmCancelOpen(false);
          onClose?.();
        }}
      />
    </Modal>
  );
}

export default UserFormModal;

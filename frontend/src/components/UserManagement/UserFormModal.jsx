import { useEffect, useState } from "react";
import { Modal, Input, DateInput, Button } from "../ui";

const INITIAL_FORM = {
  code: "",
  fullName: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  address: "",
};

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

function UserFormModal({ open, onClose, mode, initialData, onSubmit, loading }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const isEdit = mode === "edit";

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          ...INITIAL_FORM,
          ...initialData,
          dateOfBirth: toInputDate(initialData.dateOfBirth) || initialData.dateOfBirth || "",
        });
      } else {
        setForm({ ...INITIAL_FORM });
      }
      setErrors({});
    }
  }, [open, mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName?.trim()) next.fullName = "Vui lòng nhập họ tên";
    if (!form.email?.trim()) next.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Email không hợp lệ";
    if (!form.phone?.trim()) next.phone = "Vui lòng nhập số điện thoại";
    if (isEdit && !form.code?.trim()) next.code = "Vui lòng nhập mã";
    if (!isEdit && form.code !== undefined && !form.code?.trim()) next.code = "Vui lòng nhập mã";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
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
      onClose={onClose}
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
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Tạo mới"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default UserFormModal;

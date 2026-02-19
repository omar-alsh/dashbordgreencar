import "./EditUser.css"
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditUser() {
  const { id } = useParams(); // الحصول على ID المستخدم من الرابط
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "viewer"
  });

  const [loading, setLoading] = useState(true);

  // جلب بيانات المستخدم عند فتح الصفحة
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `https://backend-greencar.onrender.com/api/users/${id}`
        );
        const data = await res.json();

        setForm({
          name: data.name,
          email: data.email,
          password: "", // لا نعرض كلمة المرور
          role: data.role
        });

        setLoading(false);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        Swal.fire("خطأ", "تعذر تحميل بيانات المستخدم", "error");
      }
    };

    fetchUser();
  }, [id]);

  // تحديث البيانات
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      name: form.name,
      email: form.email,
      role: form.role
    };

    // إذا كتب كلمة مرور جديدة → نرسلها
    if (form.password.trim() !== "") {
      updatedData.password = form.password;
    }

    try {
      const res = await fetch(
        `https://backend-greencar.onrender.com/api/users/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData)
        }
      );

      if (!res.ok) {
        Swal.fire("خطأ", "تعذر تعديل المستخدم", "error");
        return;
      }

      Swal.fire("تم", "تم تعديل المستخدم بنجاح", "success");
      navigate("/DashbordGreenCar/all-user"); // ارجع لصفحة المستخدمين
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      Swal.fire("خطأ", "تعذر الاتصال بالسيرفر", "error");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <div className="continer">جاري التحميل...</div>;
  }

  return (
    <div className="Box">
      <div className="continer continerEditUser">
        <div className="MainEditUser">
          <div className="LogoEditUser">
            <img src="../../../public/green-car-logo.png" alt="Logo" />
            <h3>تعديل مستخدم</h3>
          </div>

          <div className="BoxFormEditUser">
            <form onSubmit={handleSubmit} className="EditUserForm">
              <label>الاسم</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>كلمة المرور الجديدة (اختياري)</label>
          <input
            type="password"
            name="password"
            placeholder="اتركه فارغًا إذا لا تريد تغييره"
            value={form.password}
            onChange={handleChange}
          />

          <label>الدور</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" className="SaveBtn">
            حفظ التعديلات
          </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

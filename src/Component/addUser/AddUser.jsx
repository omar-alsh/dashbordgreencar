import React, { useState } from "react";
import {useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import "./AddUser.css"

const AddUser = () => {
      const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "viewer"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://backend-greencar.onrender.com/api/users/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: data.message || "حدث خطأ أثناء إضافة المستخدم"
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "تمت الإضافة",
        text: "تم إنشاء المستخدم بنجاح"
      });
      navigate("/DashbordGreenCar/all-user"); // ارجع لصفحة المستخدمين

      setForm({
        name: "",
        email: "",
        password: "",
        role: "viewer"
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "تعذر الاتصال بالسيرفر"
      });
    }
  };

  return (
    <div className="Box">
      <div className="continer continerAddUser">
        <div className="MainAddUser">
          <div className="LogoAddUser">
            <img src="../../../public/green-car-logo.png"></img>
            <h2>إضافة مستخدم</h2>
          </div>
          <div className="BoxFormAddUser">
            <form onSubmit={handleSubmit}>
              <label>UserName</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <label>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <label>Admin OR User</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>

              <button type="submit">AddUser</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;

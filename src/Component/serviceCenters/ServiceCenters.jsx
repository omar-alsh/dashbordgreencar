import "./ServiceCenters.css";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Fill } from "react-icons/ri";

export default function ServiceCenters() {
  const [ServiceCenters, setServiceCenters] = useState([]);
  const [newServiceCenters, setNewServiceCenters] = useState({
    name: "",
    phone: "",
    type: "",
    location: "",
    image: ""
  });

  // جلب جميع المراكز و المتاجر
  useEffect(() => {
    axios
      .get("https://backend-greencar.onrender.com/api/service-centers")
      .then((res) => {
        console.log("البيانات المستلمة:", res.data); // تأكد من ظهور البيانات في Console المتصفح
        setServiceCenters(res.data);
      })
      .catch((err) => {
        console.error("خطأ في جلب البيانات:", err);
        Swal.fire("خطأ", "فشل الاتصال بالسيرفر لجلب البيانات", "error");
      });
  }, []);

  // حذف متجر او مركز
  const deleteServiceCenter = async (id, type) => {
    // تحديد نوع العنصر بالعربي
    const itemType = type === "auto_repair" ? "المركز" : "المتجر";

    Swal.fire({
      title: "هل أنت متأكد؟",
      text: `سيتم حذف ${itemType} نهائياً`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذفه",
      cancelButtonText: "إلغاء",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://backend-greencar.onrender.com/api/delete/service-centers/${id}`
          );

          // تحديث الحالة بعد الحذف
          setServiceCenters((prev) => prev.filter((item) => item._id !== id));

          Swal.fire("تم الحذف!", `تم حذف ${itemType} بنجاح`, "success");
          // eslint-disable-next-line no-unused-vars
        } catch (error) {
          Swal.fire("خطأ", `حدث خطأ أثناء حذف ${itemType}`, "error");
        }
      }
    });
  };

  // اضافة مركز او متجر
  // Handle input change
  const handleChange = (e) => {
    setNewServiceCenters({
      ...newServiceCenters,
      [e.target.name]: e.target.value
    });
  };

  // ⬇️ رفع الصورة مباشرة عند اختيارها
  const uploadCategoryImage = async (file, inputEl) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // غيّر حسب إعدادك

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dsnygnwcv/image/upload",
        formData
      );

      const imageUrl = res.data.secure_url;

      // تحديث حالة newCategory مع رابط الصورة
      setNewServiceCenters((prev) => ({
        ...prev,
        image: imageUrl
      }));

      // مسح الـ input
      if (inputEl) inputEl.value = "";

      Swal.fire({
        icon: "success",
        title: "تم رفع الصورة بنجاح"
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "فشل رفع الصورة"
      });
    }
  };

  // إضافة تصنيف
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newServiceCenters.image) {
      return Swal.fire({
        icon: "warning",
        title: "الرجاء رفع صورة أولاً"
      });
    }

    try {
      const res = await axios.post(
        "https://backend-greencar.onrender.com/api/add/service-centers",
        newServiceCenters
      );

      Swal.fire({
        icon: "success",
        title: "تمت إضافة التصنيف بنجاح"
      });

      setServiceCenters((prev) => [...prev, res.data.data]);

      setNewServiceCenters({
        name: "",
        phone: "",
        type: "",
        location: "",
        image: ""
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "حدث خطأ أثناء الإضافة",
        text: err.response?.data?.message || "يرجى المحاولة لاحقاً"
      });
    }
  };

  return (
    <div className="Box">
      <div className="continer continerServiceCenters">
        <div className="GridServiceCenters">
          {ServiceCenters.map((c) => (
            <div className="CardServiceCenters" key={c._id}>
              <img
                src={c.image}
                className="ServiceCentersImage"
                // style={{ width: "100px" }}
              />
              <div className="infoServiceCenters">
                <h3>{c.name}</h3>
                <p>{c.phone}</p>
                <p>{c.location}</p>
                <p>{c.type}</p>
              </div>
              <div className="ButtonServiceCenters">
                <Link
                  to={`/DashbordGreenCar/edit-Service-Centert/${c._id}`}
                  className="buttonEdit"
                >
                  <FiEdit2 />
                </Link>
                <button
                  className="buttonDelete"
                  onClick={() => deleteServiceCenter(c._id, c.type)}
                >
                  <RiDeleteBin6Fill />
                </button>
              </div>
            </div>
          ))}

          {/* اضافة متجر او مركز جديد */}
          {/* إضافة تصنيف */}
          <div className="addCategoryForm">
            <h3>إضافة مركز أو متجر جديد</h3>

            <form onSubmit={handleSubmit}>
              <div className="InputForm">
                {/* اسم المركز / المتجر */}
                <input
                  type="text"
                  name="name"
                  placeholder="أدخل اسم المركز أو المتجر"
                  value={newServiceCenters.name}
                  onChange={handleChange}
                  required
                />

                {/* رقم الهاتف */}
                <input
                  type="text"
                  name="phone"
                  placeholder="أدخل رقم الهاتف"
                  value={newServiceCenters.phone}
                  onChange={handleChange}
                  required
                />

                {/* الموقع */}
                <input
                  type="text"
                  name="location"
                  placeholder="أدخل الموقع"
                  value={newServiceCenters.location}
                  onChange={handleChange}
                  required
                />

                {/* نوع النشاط */}
                <select
                  name="type"
                  value={newServiceCenters.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">اختر النوع</option>
                  <option value="auto_repair">مركز صيانة</option>
                  <option value="auto_parts_store">متجر قطع غيار</option>
                </select>

                {/* رفع الصورة */}
                {!newServiceCenters.image ? (
                  <label className="upload-btn">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        uploadCategoryImage(e.target.files[0], e.target)
                      }
                    />
                    إضافة صورة
                  </label>
                ) : (
                  <div className="imagePreviewBox">
                    <div className="imageButtonsc">
                      {/* حذف الصورة */}
                      <button
                        type="button"
                        onClick={() =>
                          setNewServiceCenters({
                            ...newServiceCenters,
                            image: ""
                          })
                        }
                        className="deleteImageBtnc"
                      >
                        حذف
                      </button>

                      <img
                        src={newServiceCenters.image}
                        alt="preview"
                        className="previewImagec"
                      />

                      {/* تعديل الصورة */}
                      <label className="editImageBtnc">
                        تعديل
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            uploadCategoryImage(e.target.files[0], e.target)
                          }
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="Add-btn">
                إضافة
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

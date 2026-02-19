import "./AllCategory.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Fill } from "react-icons/ri";

export default function Category() {
  const [category, setCategory] = useState([]);
  const [newCategory, setNewCategory] = useState({
    slug: "",
    type: "",
    image: ""
  });

  // جلب التصنيفات
  useEffect(() => {
    axios
      .get("https://backend-greencar.onrender.com/api/categorys")
      .then((res) => setCategory(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setNewCategory({
      ...newCategory,
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
      setNewCategory((prev) => ({
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

    if (!newCategory.image) {
      return Swal.fire({
        icon: "warning",
        title: "الرجاء رفع صورة أولاً"
      });
    }

    try {
      const res = await axios.post(
        "https://backend-greencar.onrender.com/api/categorys/add",
        newCategory
      );

      Swal.fire({
        icon: "success",
        title: "تمت إضافة التصنيف بنجاح"
      });

      setCategory((prev) => [...prev, res.data.category]);
      setNewCategory({ slug: "", type: "", image: "" });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "حدث خطأ أثناء الإضافة",
        text: err.response?.data?.message || "يرجى المحاولة لاحقاً"
      });
    }
  };

  // حذف تصنيف
  const deleteCategory = async (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف التصنيف نهائياً",
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
            `https://backend-greencar.onrender.com/api/Delete/categorys/${id}`
          );
          setCategory((prev) => prev.filter((c) => c._id !== id));
          Swal.fire("تم الحذف!", "تم حذف التصنيف", "success");
          // eslint-disable-next-line no-unused-vars
        } catch (err) {
          Swal.fire("خطأ", "حدث خطأ أثناء الحذف", "error");
        }
      }
    });
  };

  return (
    <div className="Box">
      <div className="continer continerCategory">
        <div className="CatergoryGrid">
          {category.map((c) => (
            <div className="CardCategory" key={c._id}>
              <img
                src={c.image}
                alt={c.type}
                className="CategoryImage"
                style={{ width: "100px" }}
              />
              <div className="infoCategor">
                <h3>{c.slug}</h3>
                <p>{c.type}</p>
              </div>
              <div className="ButtonCategor">
                <Link className="buttonEdit">
                  <FiEdit2 />
                </Link>
                <button
                  className="buttonDelete"
                  onClick={() => deleteCategory(c._id)}
                >
                  <RiDeleteBin6Fill />
                </button>
              </div>
            </div>
          ))}

          {/* إضافة تصنيف */}
          <div className="addCategoryForm">
            <h3>إضافة تصنيف جديد</h3>
            <form onSubmit={handleSubmit}>
              <div className="InputForm">
                <input
                  type="text"
                  name="slug"
                  placeholder="أدخل اسم الشركة"
                  value={newCategory.slug}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="type"
                  placeholder="أدخل اسم الموديل"
                  value={newCategory.type}
                  onChange={handleChange}
                  required
                />

                {/* رفع الصورة */}
                {!newCategory.image ? (
                  <label className="upload-btn">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        uploadCategoryImage(e.target.files[0], e.target)
                      }
                    />
                    اضافة صورة
                  </label>
                ) : (
                  <div className="imagePreviewBox">
                    <div className="imageButtonsc">
                      {/* زر حذف الصورة */}
                      <button
                        type="button"
                        onClick={() =>
                          setNewCategory({ ...newCategory, image: "" })
                        }
                        className="deleteImageBtnc"
                      >
                        حذف
                      </button>
                      <img
                        src={newCategory.image}
                        alt="category"
                        className="previewImagec"
                      />
                      {/* زر تعديل الصورة */}
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

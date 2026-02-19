import "./EditServiceCentert.css"


import "./EditServiceCentert.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function EditServiceCentert() {
  const { id } = useParams(); // قراءة id من الرابط
  const navigate = useNavigate(); // للتوجيه بعد التعديل

  const [centerData, setCenterData] = useState({
    name: "",
    phone: "",
    type: "",
    location: "",
    image: ""
  });

  const [loading, setLoading] = useState(true);

  // جلب بيانات المركز عند التحميل
  useEffect(() => {
    axios
      .get(`https://backend-greencar.onrender.com/service-centers/${id}`)
      .then((res) => {
        setCenterData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("خطأ", "حدث خطأ أثناء جلب بيانات المركز", "error");
        setLoading(false);
      });
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setCenterData({
      ...centerData,
      [e.target.name]: e.target.value
    });
  };

  // رفع الصورة إلى Cloudinary
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

      setCenterData((prev) => ({
        ...prev,
        image: imageUrl
      }));

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

  // حذف الصورة
  const removeImage = () => {
    setCenterData((prev) => ({ ...prev, image: "" }));
  };

  // تحديث البيانات
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `https://backend-greencar.onrender.com/api/service-centers/${id}`,
        centerData
      );

      Swal.fire({
        icon: "success",
        title: "تم تعديل البيانات بنجاح"
      });

      // العودة تلقائيًا إلى ServiceCenters
      navigate("/DashbordGreenCar/service-centers");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "حدث خطأ أثناء التعديل",
        text: err.response?.data?.message || "يرجى المحاولة لاحقاً"
      });
    }
  };

  if (loading) {
    return <div className="Box">جاري تحميل بيانات المركز...</div>;
  }

  return (
    <div className="Box">
      <div className="continer continerEditServiceCentert">
        <h2>تعديل بيانات المركز / المتجر</h2>
        <div className="MainBoxFormEditServiceCentert" dir="rtl">
          <div className="BoxFormEditServiceCentert">
            <form onSubmit={handleUpdate}>
              <div className="InputForm">
                <label>اسم المركز/ المتجر:</label>
                <input
                  type="text"
                  name="name"
                  placeholder="اسم المركز أو المتجر"
                  value={centerData.name}
                  onChange={handleChange}
                  required
                />
                <label>رقم الموبايل:</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="رقم الهاتف"
                  value={centerData.phone}
                  onChange={handleChange}
                  required
                />
                <label>العنوان:</label>
                <input
                  type="text"
                  name="location"
                  placeholder="الموقع"
                  value={centerData.location}
                  onChange={handleChange}
                  required
                />
                <label>الاختصاص:</label>
                <select
                  name="type"
                  value={centerData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">اختر النوع</option>
                  <option value="auto_repair">مركز صيانة</option>
                  <option value="auto_parts_store">متجر قطع غيار</option>
                </select>

                {/* عرض الصورة مع امكانية تعديلها أو حذفها */}
                {!centerData.image ? (
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
                      <button
                        type="button"
                        onClick={removeImage}
                        className="deleteImageBtnc"
                      >
                        حذف
                      </button>
                      <img
                        src={centerData.image}
                        alt="preview"
                        className="previewImagec"
                      />
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
                تعديل البيانات
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

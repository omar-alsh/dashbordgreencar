import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "./AddCar.css";
import Swal from "sweetalert2";

export default function AddCar() {
  const navigate = useNavigate();
  // const [categories, setCategories] = useState([]);
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/api/categorys")
  //     .then((res) => setCategories(res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuelType: "gasoline",
    transmission: "automatic",
    color: "",
    engine: {
      capacity: "",
      horsepower: "",
      cylinders: ""
    },
    images: [],
    features: [],
    description: "",
    categorySlug: "",
    categoryType: "",
    status: "available"
  });

  const [featureInput, setFeatureInput] = useState("");

  // ⬇️ دالة رفع الصورة إلى Cloudinary
  const uploadImage = async (file, inputEl) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dsnygnwcv/image/upload",
        formData
      );

      const imageUrl = res.data.secure_url;

      setCar((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));

      // 🔥 هذا هو السطر المهم
      inputEl.value = "";

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

  // const uploadImage = async (file) => {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("upload_preset", "ml_default"); // ضع preset هنا

  //   try {
  //     const res = await axios.post(
  //       "https://api.cloudinary.com/v1_1/dsnygnwcv/image/upload",
  //       formData
  //     );
  //     const imageUrl = res.data.secure_url;
  //     setCar((prev) => ({ ...prev, images: [...prev.images, imageUrl] }));
  //     Swal.fire({
  //       icon: "success",
  //       title: "تم رفع الصورة بنجاح",
  //       confirmButtonText: "حسناً"
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     Swal.fire({
  //       icon: "error",
  //       title: "فشل رفع الصورة",
  //       text: "حدث خطأ أثناء رفع الصورة",
  //       confirmButtonText: "إغلاق"
  //     });
  //   }
  // };

  // const handleChange = (e) => {
  //   setCar({ ...car, [e.target.name]: e.target.value });
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "brand") {
      setCar((prev) => ({
        ...prev,
        brand: value,
        categorySlug: value // نسخ brand إلى categorySlug
      }));
    } else if (name === "model") {
      setCar((prev) => ({
        ...prev,
        model: value,
        categoryType: value // نسخ model إلى categoryType
      }));
    } else {
      setCar((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEngineChange = (e) => {
    setCar({
      ...car,
      engine: { ...car.engine, [e.target.name]: e.target.value }
    });
  };

  const addFeature = () => {
    if (featureInput.trim() !== "") {
      setCar({ ...car, features: [...car.features, featureInput] });
      setFeatureInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://backend-greencar.onrender.com/api/cars/add",
        car
      );
      Swal.fire({
        icon: "success",
        title: "تمت إضافة السيارة بنجاح",
        confirmButtonText: "موافق"
      });
      navigate("/DashbordGreenCar/all-cars"); // ارجع لصفحة المستخدمين

      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "حدث خطأ أثناء الإضافة",
        text: "يرجى المحاولة لاحقاً",
        confirmButtonText: "إغلاق"
      });
    }
  };

  const deleteImage = (index) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف الصورة بشكل نهائي",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء"
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedImages = car.images.filter((_, i) => i !== index);
        setCar({ ...car, images: updatedImages });

        Swal.fire({
          title: "تم الحذف",
          text: "تم حذف الصورة بنجاح",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const replaceImage = async (file, index) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dsnygnwcv/image/upload",
        formData
      );

      const newUrl = res.data.secure_url;

      const updatedImages = [...car.images];
      updatedImages[index] = newUrl;

      setCar({ ...car, images: updatedImages });

      Swal.fire({
        icon: "success",
        title: "تم استبدال الصورة بنجاح",
        confirmButtonText: "موافق"
      });
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "فشل استبدال الصورة",
        text: "يرجى المحاولة لاحقاً",
        confirmButtonText: "إغلاق"
      });
    }
  };

  return (
    <div className="addCarContainer">
      <h2>إضافة سيارة جديدة</h2>

      <form onSubmit={handleSubmit} className="carForm">
        {/* القسم الأول: معلومات أساسية */}
        <div className="section">
          <h3>معلومات السيارة</h3>
          <input name="brand" placeholder="الشركة" onChange={handleChange} />
          <input name="model" placeholder="الموديل" onChange={handleChange} />
          <input
            name="year"
            type="number"
            placeholder="سنة الصنع"
            onChange={handleChange}
          />
          <input
            name="price"
            type="number"
            placeholder="السعر"
            onChange={handleChange}
          />
          <input
            name="mileage"
            type="number"
            placeholder="ممشى السيارة"
            onChange={handleChange}
          />
          <input name="color" placeholder="اللون" onChange={handleChange} />
        </div>

        {/* القسم الثاني: المحرك */}
        <div className="section">
          <h3>المحرك</h3>
          <input
            name="capacity"
            type="number"
            placeholder="سعة المحرك"
            onChange={handleEngineChange}
          />
          <input
            name="horsepower"
            type="number"
            placeholder="الأحصنة"
            onChange={handleEngineChange}
          />
          <input
            name="cylinders"
            type="number"
            placeholder="عدد السلندر"
            onChange={handleEngineChange}
          />

          <select name="fuelType" onChange={handleChange}>
            <option value="gasoline">بنزين</option>
            <option value="diesel">ديزل</option>
            <option value="hybrid">هايبرد</option>
            <option value="electric">كهرباء</option>
          </select>
        </div>

        {/* القسم الثالث: ناقل الحركة */}
        <div className="section">
          <h3>ناقل الحركة</h3>
          <select name="transmission" onChange={handleChange}>
            <option value="automatic">أوتوماتيك</option>
            <option value="manual">عادي</option>
          </select>
        </div>

        {/* القسم الرابع: الصور */}
        <div className="section">
          <h3>الصور</h3>

          {/* ⬇️ اختيار صورة من الجهاز */}
          {/* <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadImage(e.target.files[0])}
          /> */}
          <label className="upload-btn">
            اختر صورة
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => uploadImage(e.target.files[0], e.target)}
            />
          </label>

          <div className="imagesPreview">
            {car.images.map((img, i) => (
              <div key={i} className="imageBox">
                <img src={img} alt="car" />

                {/* زر حذف */}
                <button
                  type="button"
                  className="deleteImageBtn"
                  onClick={() => deleteImage(i)}
                >
                  حذف
                </button>

                {/* زر تعديل */}
                <label className="editImageBtn">
                  تعديل
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => replaceImage(e.target.files[0], i)}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* القسم الخامس: الميزات */}
        <div className="section">
          <h3>الميزات</h3>
          <div className="featureInputBox">
            <input
              placeholder="أدخل ميزة"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
            />
            <button type="button" onClick={addFeature}>
              إضافة
            </button>
          </div>

          <ul className="featuresList">
            {car.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>

        {/* <div className="section">
          اختيار التصنيف حسب slug
          <select
            name="categorySlug"
            value={car.categorySlug}
            onChange={handleChange}
            required
          >
            <option value="">اختر التصنيف</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.slug}
              </option>
            ))}
          </select>
        </div> */}
        {/* القسم السادس: الوصف والحالة */}
        <div className="section">
          <h3>الوصف والحالة</h3>
          <textarea
            name="description"
            placeholder="الوصف"
            onChange={handleChange}
          ></textarea>

          <select name="status" onChange={handleChange}>
            <option value="available">متاحة</option>
            <option value="sold">مباعة</option>
          </select>
        </div>

        <button className="submitBtn" type="submit">
          إضافة السيارة
        </button>
      </form>
    </div>
  );
}

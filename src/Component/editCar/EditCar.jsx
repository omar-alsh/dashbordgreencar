import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./EditCar.css";
import Swal from "sweetalert2";

export default function EditCar() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [car, setCar] = useState(null);
  const [featureInput, setFeatureInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  // const [categories, setCategories] = useState([]);
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/api/categorys")
  //     .then((res) => setCategories(res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/cars/${id}`)
      .then((res) => setCar(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!car) return <h2>جاري تحميل البيانات...</h2>;

  // رفع صورة جديدة
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

  // const addFeature = () => {
  //   if (featureInput.trim() !== "") {
  //     setCar({ ...car, features: [...car.features, featureInput] });
  //     setFeatureInput("");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Car sent to backend:", car);
    try {
      await axios.put(`http://localhost:5000/api/cars/${id}`, car);

      Swal.fire({
        icon: "success",
        title: "تم تعديل السيارة بنجاح",
        confirmButtonText: "موافق"
      });
      navigate("/DashbordGreenCar/all-cars"); // ارجع لصفحة المستخدمين

      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "حدث خطأ أثناء التعديل",
        text: "يرجى المحاولة لاحقاً",
        confirmButtonText: "إغلاق"
      });
    }
  };

  const addFeature = () => {
    if (featureInput.trim() !== "") {
      setCar({ ...car, features: [...car.features, featureInput] });
      setFeatureInput("");
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
      <h2>تعديل السيارة</h2>

      <form onSubmit={handleSubmit} className="carForm">
        <div className="section">
          <h3>معلومات السيارة</h3>
          <p>:الشركة</p>
          <input name="brand" value={car.brand} onChange={handleChange} />
          <p>:الموديل</p>
          <input name="model" value={car.model} onChange={handleChange} />
          <p>:سنة الصنع</p>
          <input
            name="year"
            type="number"
            value={car.year}
            onChange={handleChange}
          />
          <p>:السعر</p>
          <input
            name="price"
            type="number"
            value={car.price}
            onChange={handleChange}
          />
          <p>:عداد السيارة</p>
          <input
            name="mileage"
            type="number"
            value={car.mileage}
            onChange={handleChange}
          />

          <p>:لون السيارة</p>
          <input name="color" value={car.color} onChange={handleChange} />
        </div>

        <div className="section">
          <h3>المحرك</h3>
          <p>:سعة المحرك</p>
          <input
            name="capacity"
            type="text"
            value={car.engine.capacity}
            onChange={handleEngineChange}
          />
          <p>:القدرة الحصانية</p>
          <input
            name="horsepower"
            type="number"
            value={car.engine.horsepower}
            onChange={handleEngineChange}
          />
          <p>:عدد سلندرات المحرك</p>
          <input
            name="cylinders"
            type="number"
            value={car.engine.cylinders}
            onChange={handleEngineChange}
          />
          <p>:نوع الوقود</p>
          <select name="fuelType" value={car.fuelType} onChange={handleChange}>
            <option value="gasoline">بنزين</option>
            <option value="diesel">ديزل</option>
            <option value="hybrid">هايبرد</option>
            <option value="electric">كهرباء</option>
          </select>

          <p>:ناقل الحركة</p>
          <select
            name="transmission"
            value={car.transmission}
            onChange={handleChange}
          >
            <option value="automatic">أوتوماتيك</option>
            <option value="manual">عادي</option>
          </select>
        </div>

        {/* <div className="section">
          <h3>الصور</h3>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadImage(e.target.files[0])}
          />

          <div className="imagesPreview">
            {car.images.map((img, i) => (
              <img key={i} src={img} alt="car" />
            ))}
          </div>
        </div> */}
        <div className="section">
          <h3>الصور</h3>

          {/* إضافة صورة جديدة */}
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

        <div className="section">
          <h3>الميزات</h3>
          {/* <div className="featureInputBox">
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
          </ul> */}
          <ul className="featuresList">
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

            {car.features.map((f, i) => (
              <li key={i}>
                {editingIndex === i ? (
                  <>
                    <input
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...car.features];
                        updated[i] = editingValue;
                        setCar({ ...car, features: updated });
                        setEditingIndex(null);
                      }}
                    >
                      حفظ
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingIndex(null)}
                      style={{ marginLeft: "5px" }}
                    >
                      إلغاء
                    </button>
                  </>
                ) : (
                  <>
                    {f}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingIndex(i);
                        setEditingValue(f);
                      }}
                      style={{ marginLeft: "10px" }}
                    >
                      تعديل
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
        {/* 
        <div className="section">
          اختيار التصنيف حسب slug
          <h3>تصنيف السيارة</h3>
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

        <div className="section">
          <h3>الوصف والحالة</h3>
          <p>:الوصف</p>
          <textarea
            name="description"
            placeholder="الوصف"
            onChange={handleChange}
            value={car.description}
          ></textarea>
          <p>:حالة السيارة</p>
          <select name="status" onChange={handleChange} value={car.status}>
            <option value="available">متاحة</option>
            <option value="sold">مباعة</option>
          </select>
        </div>

        <button className="submitBtn" type="submit">
          تعديل السيارة
        </button>
      </form>
    </div>
  );
}

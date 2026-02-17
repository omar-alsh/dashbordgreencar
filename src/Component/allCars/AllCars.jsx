import "./AllCars.css";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";

export default function AllCars() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/cars")
      .then((res) => setCars(res.data))
      .catch((err) => console.log(err));
  }, []);


const deleteCar = async (id) => {
  Swal.fire({
    title: "هل أنت متأكد؟",
    text: "سيتم حذف السيارة بشكل نهائي",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم، احذفها",
    cancelButtonText: "إلغاء",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/Delete/cars/${id}`);

        setCars((prev) => prev.filter((car) => car._id !== id));

        Swal.fire("تم الحذف!", "تم حذف السيارة بنجاح", "success");
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        Swal.fire("خطأ", "حدث خطأ أثناء الحذف", "error");
      }
    }
  });
};



  return (
    <div className="allCarsBox">
      <h2>جميع السيارات</h2>
      <div className="carsGrid">
        {cars.map((car) => (
          <div key={car._id} className="carCard">
            <div className="informationLeft">
              <h3>
                {car.brand} - {car.model}
              </h3>
              <img src={car.images[0]} width="150px"></img>
            </div>
            <div className="informationCenter1">
              <p>
                {car.categorySlug}-{car.categoryType}
              </p>
              <p>{car.year}:سنة الصنع</p>
              <p>{car.mileage}:عداد السيارة</p>
              <p>{car.fuelType}:نوع الوقود</p>
              <p>{car.transmission}:ناقل الحركة</p>
              <p>اللون :{car.color}</p>
              <p>{car.price}$ :السعر</p>
              <div className="engine">
                <h4>:مواصفات المحرك</h4>
                <div>{car.engine.capacity}:سعة المحرك</div>
                <div>{car.engine.horsepower}:القدرة الحصانية </div>
                <div>{car.engine.cylinders}:عدد السطوانات </div>
              </div>
            </div>
            <div className="informationCenter2">
              {/* <div className="features">
                <h4>:ميزات السيارة</h4>
                <p>{car.features.map((fu) => (
                  <ul dir="rtl" >
                    <li>{fu}</li>
                  </ul>
                ))}</p>
              </div> */}
              <div className="features">
                <h4>:ميزات السيارة</h4>
                <ul dir="rtl">
                  {car.features.map((fu, index) => (
                    <li key={index}>{fu}</li>
                  ))}
                </ul>
              </div>
              <div className="status">
                <h4>:حالة السيارة</h4>
                <p>{car.status}</p>
              </div>
            </div>
            <div className="informationRight">
              <div className="ButtonInformationRight">
                <Link
                  to={`/DashbordGreenCar/edit-car/${car._id}`}
                  className="buttonEdit"
                >
                  <FiEdit2 />
                </Link>

                <button
                  className="buttonDelete"
                  onClick={() => deleteCar(car._id)}
                >
                  <RiDeleteBin6Fill />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


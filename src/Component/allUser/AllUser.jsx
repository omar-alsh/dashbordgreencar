import "./AllUser.css";
import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import {useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function AllUser() {
  const [users, setUsers] = useState([]);
    const navigate = useNavigate();
  

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  const deleteUser = async (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف المستخدم بشكل نهائي",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذفه",
      cancelButtonText: "إلغاء",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/Delete/user/${id}`);

          setUsers((prev) => prev.filter((User) => User._id !== id));

          Swal.fire("تم الحذف!", "تم حذف المستخدم", "success");
          navigate("/DashbordGreenCar/all-user"); // ارجع لصفحة المستخدمين
          // eslint-disable-next-line no-unused-vars
        } catch (err) {
          Swal.fire("خطأ", "حدث خطأ أثناء الحذف", "error");
        }
      }
    });
  };

  return (
    <div className="Box">
      <div className="continer continerAllUser">
        <div className="UserGrid">
          {/* {users.map((users) => (
            <div className="userCard"></div>
          ))} */}
          {users.map((user) => (
            <div className="CardUser" key={user._id}>
              <div className="infoUser">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
              <div className="ButtonUser">
                <Link
                  className="buttonEdit"
                  to={`/DashbordGreenCar/edit-user/${user._id}`}
                >
                  <FiEdit2 />
                </Link>

                <button
                  className="buttonDelete"
                  onClick={() => deleteUser(user._id)}
                >
                  <RiDeleteBin6Fill />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

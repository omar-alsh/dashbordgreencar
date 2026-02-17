import "./Hero.css";
import { useEffect } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { IoCarSportSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import { GrBusinessService } from "react-icons/gr";


import NavBarDashBord from "../navBarDashBord/NavBarDashBord";
export default function Hero() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <div className="Box">
      <div className="continer continerHero">
        {/* <AddCar/> */}
        <NavBarDashBord />
        <div className="bodyDashBord">
          {/* Start SideBar */}
          <div className="sideBar">
            <div className="ButtonSideBar">
              <Link to="all-cars">
                <button>All Car</button>
              </Link>
              <Link to="add-car">
                <button>Add Car</button>
              </Link>
              <Link to="add-user">
                <button>Add User</button>
              </Link>
              <Link to="all-user">
                <button>All User</button>
              </Link>
              <Link to="all-category">
                <button>Category</button>
              </Link>
              <Link to="service-centers">
                <button>ServiceCenters</button>
              </Link>
            </div>
            {/* <div className="IconSidBar">
              <Link to="all-cars">
                <button >
                  <IoCarSportSharp />
                </button>
              </Link>
              <Link to="all-user">
                <button >
                  <FaUsers />
                </button>
              </Link>
              <Link to="add-car">
                <button className="buttonAddCar">
                  <MdAdd className="addCar"/>
                  <IoCarSportSharp />
                </button>
              </Link>
              <Link to="add-user">
                <button>
                  <IoPersonAddSharp />
                </button>
              </Link>
            </div> */}
            <div className="IconSidBar">
              <Link to="all-cars">
                <div className="icon-wrapper">
                  <button>
                    <IoCarSportSharp />
                  </button>
                  <span className="tooltip">كل السيارات</span>
                </div>
              </Link>

              <Link to="all-user">
                <div className="icon-wrapper">
                  <button>
                    <FaUsers />
                  </button>
                  <span className="tooltip">جميع المستخدمين</span>
                </div>
              </Link>

              <Link to="add-car">
                <div className="icon-wrapper">
                  <button className="buttonAddCar">
                    <MdAdd className="addCar" />
                    <IoCarSportSharp />
                  </button>
                  <span className="tooltip">إضافة سيارة</span>
                </div>
              </Link>

              <Link to="add-user">
                <div className="icon-wrapper">
                  <button>
                    <IoPersonAddSharp />
                  </button>
                  <span className="tooltip">إضافة مستخدم</span>
                </div>
              </Link>

              <Link to="all-category">
                <div className="icon-wrapper">
                  <button>
                    <BiSolidCategory />
                  </button>
                  <span className="tooltip">التصنيفات</span>
                </div>
              </Link>

              <Link to="service-centers">
                <div className="icon-wrapper">
                  <button>
                    <GrBusinessService />
                  </button>
                  <span className="tooltip">المتاجر</span>
                </div>
              </Link>
            </div>
          </div>
          {/* End SideBar */}
          <div className="continerBody">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}


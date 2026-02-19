import "./NavBarDashBord.css";
import { IoReorderThree } from "react-icons/io5";
import { GrClose } from "react-icons/gr";
import { useState } from "react";
import { Link } from "react-router-dom";
export default function NavBarDashBord() {
  const [showtags, setshowtags] = useState(false);
  const [animation, setAnimation] = useState("");
  function handeltags() {
    setshowtags(true);
    setAnimation("show");
  }

  function closeTags() {
    setAnimation("hide");
  }
  return (
    <div className="Box">
      <div className="continer continerNavBarDashBord">
        <div className="BoxNavBar">
          <div className="LogoNavBar">
            <img src="/green-car-logo.png"></img>
            <h2>DashBordGreenCar</h2>
            <div>
              <IoReorderThree className="BergarLine" onClick={handeltags} />
            </div>
          </div>
        </div>
      </div>
      {showtags && (
        <div
          className={`tagsTow ${
            animation === "show" ? "animateShow" : "animateHide"
          }`}
          onAnimationEnd={() => {
            if (animation === "hide") setshowtags(false);
          }}
        >
          <div className="divClosTags">
            <GrClose className="Closeicon" onClick={closeTags} />
          </div>
          <div className="">
            {/* Start SideBar */}
            <div className="sideBarNavBar">
              <div className="ButtonSideBarNavBar">
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
              </div>
            </div>
            {/* End SideBar */}
          </div>
        </div>
      )}
    </div>
  );
}

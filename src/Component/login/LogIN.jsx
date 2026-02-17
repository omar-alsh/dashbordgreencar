import "./LogIN.css";

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LogIN() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password
      });
      // حفظ التوكن
      localStorage.setItem("token", res.data.token);
      // الانتقال إلى صفحة الـ Hero
      navigate("/DashbordGreenCar");
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
    setLoading(false)
  };

  return (
    <div className="Box">
      <div className="continer continerLogIN">
        <div className="MainLogIN">
          <div className="LogoLogIN">
            <img src="../../../public/green-car-logo.png"></img>
          </div>

          <form onSubmit={handleLogin}>
            <div className="BoxMainForm">
              <div className="BoxForm">
                <div className="inputInfomation">
                  <div className="Name">
                    <label>UserName: </label>
                    <input type="text"></input>
                  </div>
                  <div className="email">
                    <label>Email: </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    ></input>
                  </div>
                  <div className="password">
                    <label>Passowrd: </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    ></input>
                  </div>
                </div>
              </div>
            </div>

            <div className="buttonLogIN">
              <button type="subimt">Entry</button>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        </div>
      </div>
      {loading && (
        <div className="loadingOverlay">
          {" "}
          <div className="spinner"></div>{" "}
        </div>
      )}
    </div>
  );
}

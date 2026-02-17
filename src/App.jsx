import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LogIN from "./Component/login/LogIN";
import Hero from "./Component/homeDashbord/Hero";
import AllCars from "./Component/allCars/AllCars";
import AddCar from "./Component/addCar/AddCar";
import AddUser from "./Component/addUser/AddUser";
import EditCar from "./Component/editCar/EditCar";
import AllUser from "./Component/allUser/AllUser";
import EditUser from "./Component/editUser/EditUser";
import AllCategory from "./Component/allCategory/AllCategory";
import ServiceCenters from "./Component/serviceCenters/ServiceCenters";
import EditServiceCentert from "./Component/editeServiceCentert/EditServiceCenter";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogIN />} /> {/* ← هذا هو الحل */}
          <Route path="/login" element={<LogIN />} />
          {/* Dashboard with nested routes */}
          <Route path="/DashbordGreenCar" element={<Hero />}>
            <Route index element={<AllCars />} />
            <Route path="all-cars" element={<AllCars />} />
            <Route path="add-car" element={<AddCar />} />
            <Route path="edit-car/:id" element={<EditCar />} />
            <Route path="add-user" element={<AddUser />} />
            <Route path="all-user" element={<AllUser />} />
            <Route path="edit-user/:id" element={<EditUser />} />
            <Route path="all-category" element={<AllCategory />} />
            <Route path="service-centers" element={<ServiceCenters />} />
            <Route
              path="edit-Service-Centert/:id"
              element={<EditServiceCentert />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

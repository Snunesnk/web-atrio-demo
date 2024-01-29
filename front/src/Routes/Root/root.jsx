import { Outlet } from "react-router-dom";
import Navbar from "../../Components/Navbar/navbar";
import Footer from "../../Components/Footer/footer";
import "./root.css";

const Root = () => {
  return (
    <div>
      <Navbar />
      <div className="route-container">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Root;

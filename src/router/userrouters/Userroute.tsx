import { Routes, Route } from "react-router-dom";
import Ulogin from "../../pages/User/Login/Ulogin";
import Udashboard from "../../pages/User/Dashboard/Udashboard";
import Ucheckout from "../../pages/User/Checkout/Ucheckout";
import UserNotfound from "../../components/Notfound/UserNotFound";
import Uregister from "../../pages/User/Register/uregister";

const Userroute = () => {
    return (
        <Routes>
            <Route path="/" element={<Ulogin />} />
            <Route path="login" element={<Ulogin />} />
            <Route path="register" element={<Uregister />} />
            <Route path="dashboard" element={<Udashboard />} >
                <Route path="checkout" element={<Ucheckout />} />
            </Route>      
            <Route path="*" element={<UserNotfound />} />      
        </Routes>
    );
}

export default Userroute;
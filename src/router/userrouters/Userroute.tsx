import { Routes, Route } from "react-router-dom";
import Ulogin from "@/pages/User/Login/Ulogin";
import Udashboard from "@/pages/User/Dashboard/Udashboard";
import Ucheckout from "@/pages/User/Checkout/Ucheckout";
import UserNotfound from "@/components/Notfound/UserNotFound";
import Uregister from "@/pages/User/Register/Uregister";
import Uforgotpassword from "@/pages/User/Forgotpass/Uforgotpass";
import Ureset from "@/pages/User/Reset/Ureset";
import Ucart from "@/pages/User/Cart/Ucart";
import Uproductlist from "@/pages/User/Products/Uproductlist";
import Uprofile from "@/pages/User/Profile/Uprofile";

const Userroute = () => {
    return (
        <Routes>
            <Route path="/" element={<Ulogin />} />
            <Route path="login" element={<Ulogin />} />
            <Route path="forgotpassword" element={<Uforgotpassword />} />
            <Route path="reset" element={<Ureset />} />
            <Route path="register" element={<Uregister />} />
            <Route path="dashboard" element={<Udashboard />} />
            <Route path="dashboard/cart" element={<Ucart />} />
            <Route path="dashboard/checkout" element={<Ucheckout />} />
            <Route path="dashboard/products" element={<Uproductlist />} />
            <Route path="dashboard/profile" element={<Uprofile />} />
            <Route path="*" element={<UserNotfound />} />
        </Routes>
    );
}

export default Userroute;
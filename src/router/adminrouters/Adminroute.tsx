import { Routes, Route } from "react-router-dom";
import React from 'react'
const Adashboard = React.lazy(() => import("../../pages/Admin/Dashboard/Adashboard"))
import Alogin from "../../pages/Admin/Login/Alogin";
import Aproduct from "../../pages/Admin/Productlist/Aproduct";
import Aregister from "../../pages/Admin/Register/Aregister";
import Sspanel from "../../pages/Admin/Panel/Adminpanel";
import Aorder from "../../pages/Admin/Orderlist/Aorder";
import Ausers from "../../pages/Admin/Userlist/Ausers";
import AdminNotfound from "../../components/Notfound/AdminNotfound";
import Profile from "../../pages/Admin/Profile/Profile";

const Adminroute = () => {
    return (
        <Routes>
            <Route path="/" element={<Alogin />} />
            <Route path="login" element={<Alogin />} />
            <Route path="register" element={<Aregister />} />
            <Route path="dashboard" element={<Adashboard />} >
                <Route path="sspanel" element={<Sspanel />} />
                <Route path="product" element={<Aproduct />} />
                <Route path="orderlist" element={<Aorder />} />
                <Route path="userlist" element={<Ausers />} />
                <Route path="myprofile" element={<Profile />} />
            </Route>            
            <Route path="*" element={<AdminNotfound />} />      
        </Routes>
    );
}

export default Adminroute;
import { Routes, Route } from "react-router-dom";
import Adashboard from "../../pages/admin/dashboard/Adashboard";
import Alogin from "../../pages/admin/login/Alogin";
import Aproduct from "../../pages/admin/productlist/Aproduct";
import Aregister from "../../pages/admin/register/Aregister";
import Sspanel from "../../pages/admin/sspanel/Sspanel";
import Notfound from "../../pages/notfound/Notfound";
import Aorder from "../../pages/admin/orderlist/Aorder";
import Ausers from "../../pages/admin/userlist/Ausers";

const Adminroute = () => {
    return (
        <Routes>            
            <Route path="admin" element={<Alogin />} />
            <Route path="admin/login" element={<Alogin />} />
            <Route path="admin/register" element={<Aregister />} />
            <Route path="admin/dashboard" element={<Adashboard />} >                        
                <Route path="sspanel" element={<Sspanel />} />            
                <Route path="product" element={<Aproduct />} />            
                <Route path="orderlist" element={<Aorder />} />            
                <Route path="userlist" element={<Ausers />} />            
            </Route>
            <Route path="*" element={<Notfound/>}></Route>
        </Routes>
    );
}

export default Adminroute;
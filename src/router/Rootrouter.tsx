import { BrowserRouter, Routes, Route } from "react-router-dom";
import Adminroute from "@/router/Adminrouters/Adminroute";
import Userroute from "@/router/Userrouters/Userroute";
import Ulogin from "@/pages/User/Login/Ulogin";

const Rootrouter = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Ulogin />} />
        <Route path="/user/*" element={<Userroute />} />
        <Route path="/admin/*" element={<Adminroute />} />        
      </Routes>
    </BrowserRouter>
  );
}

export default Rootrouter;
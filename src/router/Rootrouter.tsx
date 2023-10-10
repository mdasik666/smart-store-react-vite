import { BrowserRouter, Routes, Route } from "react-router-dom";
import Adminroute from "./Adminrouters/Adminroute";
import Userroute from "./Userrouters/Userroute";
import Ulogin from "../pages/User/Login/Ulogin";

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
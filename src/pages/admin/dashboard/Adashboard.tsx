import { Admindrawer } from "../../../components/Admindrawer/Admindrawer";
import { useEffect, useState } from "react";
import { adminLoginVerify } from "../../../services/Adminservice";
import { useNavigate } from "react-router-dom";

const Adashboard = () => {
    const nav = useNavigate()
    const [adminDate, setAdminDate] = useState("")

    useEffect(()=>{
        (async function(){
            const verify = await adminLoginVerify();                        
            if(verify.data.status === "Failed"){
                nav("/admin/login")
            }else{
                if(window.location.pathname.endsWith("dashboard") || window.location.pathname.endsWith("dashboard/")){
                    nav("/admin/dashboard/sspanel")
                }
                setAdminDate(verify.data.data)
            }
        })();        
    },[])

    return (
        <Admindrawer adminDate={adminDate}/>        
    )
}

export default Adashboard;
import { Admindrawer } from "../../../components/admindrawer/Admindrawer";
import { useEffect } from "react";
import { adminLoginVerify } from "../../../services/Adminservice";
import { useNavigate } from "react-router-dom";

const Adashboard = () => {
    const nav = useNavigate()

    useEffect(()=>{
        (async function(){
            const verify = await adminLoginVerify();            
            if(verify.data.status === "Failed"){
                nav("/admin/login")
            }else{
                if(window.location.pathname.endsWith("dashboard") || window.location.pathname.endsWith("dashboard/")){
                    nav("/admin/dashboard/sspanel")
                }
            }
        })();        
    },[])

    return (
        <Admindrawer/>        
    )
}

export default Adashboard;
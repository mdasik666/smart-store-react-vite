import { Stack, Typography } from "@mui/material"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminLoginVerify } from "../../services/Adminservice";

const UserNotfound = () => {
    var nav = useNavigate()
    useEffect(() => {
        // setTimeout(() => {
        //     (async function () {
        //         const verify = await adminLoginVerify();
        //         if (verify.data.status === "Failed") {
        //             nav("/user/login")
        //         } else {
        //             nav("/user/dashboard")
        //         }
        //     })();
        // }, 3000)
    }, [])

    return (
        <Stack width={"100%"} height={"100%"} justifyContent={"center"} alignItems={"center"}>
            <Typography variant={"h3"}>User Page 404 Not Found</Typography>
        </Stack>
    )
}

export default UserNotfound;
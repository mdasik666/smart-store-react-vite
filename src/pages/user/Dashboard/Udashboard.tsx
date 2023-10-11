import { useEffect } from 'react'
import { userLoginVerify } from '../../../services/Userservice';
import { useNavigate } from 'react-router-dom';

const Udashboard = () => {
  const nav = useNavigate()

  useEffect(() => {
    (async function () {
      const verify = await userLoginVerify();
      if (verify.data.status === "Failed") {
        nav("/user/login")
      } else {
        if (window.location.pathname.endsWith("dashboard") || window.location.pathname.endsWith("dashboard/")) {
          nav("/user/dashboard")
        }
      }
    })();
  }, [])

  return (
    <div>user Udashboard</div>
  )
}

export default Udashboard;
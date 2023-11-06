import { Link } from "react-router-dom"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"

export const MobileMenu = () => {
  const nav = useNavigate()
  
  const userSignOut = () => {
    Cookies.remove("usertoken")
    nav("/")
  }
  return (
    <>
      <Link to={"/user/dashboard/profile"} className="dropdown-item">Profile</Link>
      <Link to={"/user/dashboard/cart"} className="dropdown-item">Checkout</Link>
      <a className="dropdown-item" onClick={userSignOut}>Sign Out</a>
    </>
  )
}
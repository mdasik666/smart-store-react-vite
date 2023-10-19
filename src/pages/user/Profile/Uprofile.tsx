import { Helmet } from "react-helmet";

const Uprofile = () => {
    return (
        <>
            <Helmet>
                <link rel="icon" type="image/svg+xml" href="/vite.svg" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Profile</title>
                <link rel="stylesheet" type="text/css" href="../../src/pages/User/Cart/Cart.css" />
            </Helmet>
            <section id="wrapper">
                <header className="shadow ">
                    <div className="container">
                        <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-lg-between">
                            <div className="col-md-5">
                                <h1>
                                    <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                                        <span className="logo_ic"></span>
                                        <span className="logo_txt">SMART STORE</span>
                                    </a>
                                </h1>
                            </div>
                            <div className="mobiBar">
                                <button className="btn btn-primary">
                                    <i className="fa-regular fa-compass"></i> Explore
                                </button>
                                <button id="userProf" className="transBtn">
                                    <i className="fa-regular fa-user"></i>
                                    <span>Profile</span>
                                </button>
                                <button id="ordersMenu" className="transBtn">
                                    <i className="fa-regular fa-file-lines"></i>
                                    <span>Orders</span>
                                </button>
                                <button id="cartAdd" className="transBtn">
                                    <b>5</b>
                                    <i className="fa-solid fa-cart-shopping"></i>
                                    <span>Cart</span>
                                </button>
                                <button id="toggleMenu" className="transBtn">
                                    <i className="fa-solid fa-bars"></i>
                                </button>

                            </div>
                        </div>
                    </div>

                </header>

                <section id="userProfile">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <form className="file-upload">
                                    <div className="row mb-2 gx-5">

                                        <div className="col-xxl-8 mb-5 mb-xxl-0">
                                            <div className="bg-secondary-soft px-4 py-5 rounded">
                                                <div className="row g-3">
                                                    <h4 className="mb-4 mt-0">Contact detail</h4>

                                                    <div className="col-md-6">
                                                        <label className="form-label">First Name *</label>
                                                        <input type="text" className="form-control" placeholder=""
                                                            aria-label="First name" value="Scaralet" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Last Name *</label>
                                                        <input type="text" className="form-control" placeholder=""
                                                            aria-label="Last name" value="Doe" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Phone number *</label>
                                                        <input type="text" className="form-control" placeholder=""
                                                            aria-label="Phone number" value="(333) 000 555" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Mobile number *</label>
                                                        <input type="text" className="form-control" placeholder=""
                                                            aria-label="Phone number" value="+91 9852 8855 252" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="inputEmail4" className="form-label">Email *</label>
                                                        <input type="email" className="form-control" id="inputEmail4"
                                                            value="example@homerealty.com" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-4">
                                            <div className="bg-secondary-soft px-4 py-5 rounded">
                                                <div className="row g-3">
                                                    <h4 className="mb-4 mt-0">Upload your profile photo</h4>
                                                    <div className="text-center">
                                                        <div className="square position-relative display-2 mb-3">
                                                            <i className="fas fa-fw fa-user position-absolute top-50 start-50 translate-middle text-secondary"></i>
                                                        </div>
                                                        <input type="file" id="customFile" name="file" />
                                                        <label className="btn btn-success-soft btn-block" htmlFor="customFile">Upload</label>
                                                        <button type="button" className="btn btn-danger-soft">Remove</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="gap-3 d-md-flex justify-content-md-end text-center">
                                        <button type="button" className="btn btn-primary ">Update</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="copyrights">
                    <div className="container">
                        <div className="copywrap">
                            <p>&copy; 2023 <a href="https://www.pmgsuperstore.com">pmgsuperstore.com</a>. All rights reserved
                            </p>
                            <ul>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms of Use</a></li>
                            </ul>
                        </div>
                    </div>
                </section>
            </section>
        </>
    )
}

export default Uprofile;
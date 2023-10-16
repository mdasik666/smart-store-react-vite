import './Forgotpass.css'

const Uforgotpassword = () => {
    return (
        <section id="login">
            <div className="logWrapper">                
                <div className="login-wrap pt-5 pb-3">
                    <div className="img d-flex align-items-center justify-content-center"
                        style={{backgroundImage: 'url("images/logo.png")'}}></div>
                    <h1 className="text-left mb-0">Forgot Password</h1>
                    <form action="home.html" className="login-form">
                        <div className="Wrap_white">
                            <div className="form-group">
                                <div className="mb-3">
                                    <label htmlFor="forgotMail" className="form-label text-bold">Email</label>
                                    <input type="email" className="form-control" id="forgotMail" placeholder="Enter your Email"/>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="d-flex justify-content-center align-items-center mt-4 pt-2" id="btnsWrap">
                    <a href="r.html" className="btn btn-primary btn-lg">Submit</a>
                </div>
            </div>
        </section>
    )
}

export default Uforgotpassword;
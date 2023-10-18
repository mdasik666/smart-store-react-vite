import {Helmet} from "react-helmet";

const Ureset = () => {
    return (
      <>
      <Helmet>
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset</title>
        <link rel="stylesheet" type="text/css" href="../src/pages/User/Reset/Reset.css" />
      </Helmet>
        <section id="login">
            <div className="logWrapper">                
                <div className="login-wrap pt-5 pb-3">
                    <div className="img d-flex align-items-center justify-content-center"
                        style={{backgroundImage: 'url("images/logo.png")'}}></div>
                    <h1 className="text-left mb-0">Reset Password</h1>
                    <form action="home.html" className="login-form">
                        <div className="Wrap_white">
                            <div className="form-group">
                                <div className="mb-3">
                                    <label htmlFor="forgotMail" className="form-label text-bold">New Password</label>
                                    <input type="password" className="form-control" id="newPass" placeholder="***************"/>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="mb-3">
                                    <label htmlFor="forgotMail" className="form-label text-bold">Confirm New Password</label>
                                    <input type="password" className="form-control" id="newConPass" placeholder="***************"/>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="d-flex justify-content-center align-items-center mt-4 pt-2" id="btnsWrap">
                    <a href="index.html" className="btn btn-primary btn-lg">Reset Password</a>

                </div>

            </div>
        </section>
      </>
    )
}

export default Ureset;
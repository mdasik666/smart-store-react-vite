import { useEffect, useState, ChangeEvent } from 'react'
import { userAddOrDeleteCart, userAddOrDeleteWishList, userGetCategoryList, userLoginVerify } from '@/services/Userservice';
import { useNavigate } from 'react-router-dom';
import { userGetProducts } from '@/services/Userservice';
import { Helmet } from "react-helmet";
import Cookies from 'js-cookie';

interface IPropsProductList {
    _id: string,
    productName: String,
    productDescription: String,
    category: String,
    title: String,
    quantityAndType: Array<{ price: Number, quantity: String, type: String }>,
    minOrder: Number,
    image: String,
    adminId: String,
    wishlist?: boolean,
    cart?: boolean
}

interface IPropsUserData {
    _id: string,
    fullName: string,
    email: string
}

const Uproductlist = () => {
    const nav = useNavigate()

    const [productList, setProductList] = useState<IPropsProductList[]>([])
    const [productCategory, setProductCategory] = useState<{ categoryName: string }[]>([])
    const [isLoading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [categoryFilter, setCategoryFilter] = useState<string>("")
    const [categoryFilterByNameTrack, setCategoryFilterByNameTrack] = useState<string>("")
    const [categoryFilterByName, setCategoryFilterByName] = useState<string>("")
    const [categoryFilterByMultipleItem, setCategoryFilterByMultipleItem] = useState<Array<string>>([])

    const [userData, setUserData] = useState<IPropsUserData>({ _id: "", fullName: "", email: "" })

    const filterByNameChange = (e: string) => {
        if (e.length <= 0) {
            setCategoryFilterByName("")
        } else {
            setCategoryFilterByNameTrack(e)
        }
    }

    const filterByName = () => {
        setCategoryFilterByName(categoryFilterByNameTrack)
    }

    const setFilterbyMultipleItem = (val: string) => {
        setCategoryFilter("")
        if (categoryFilterByMultipleItem.includes(val)) {
            setCategoryFilterByMultipleItem((prev) => prev.filter(item => item !== val));
        } else {
            setCategoryFilterByMultipleItem((prev) => [...prev, val]);
        }
    }

    useEffect(() => {
        (async function () {
            if(Cookies.get("usertoken")){
                const verify = await userLoginVerify();
                if (verify.data.status === "Failed") {
                    nav("/user/login")
                } else {
                    const { _id, fullName, email } = verify.data.userData
                    setUserData({ _id, fullName, email })
                    getProductList(_id)
                    getCategoryList()
                }
            }else{
                nav("/user/login")
            }
        })();
    }, [])

    const getProductList = async (id: string) => {
        try {
            setLoading(true)
            const res = await userGetProducts(id);
            if (res.data.status === "Success") {
                setError("")
                var finalPL = res.data.producList
                setProductList(finalPL)
            } else {
                setError(res.data.message)
            }
            setLoading(false)
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    const getCategoryList = async () => {
        try {
            const prodCat = await userGetCategoryList();
            if (prodCat.data.status === "Success") {
                setProductCategory(prodCat.data.category)
            }
        } catch (error) {
        }
    }

    const addCartAndWishList = async (id: string, type: string) => {
        try {
            var res;
            if (type === "wishlist") {
                res = await userAddOrDeleteWishList(userData._id, id)
            } else {
                res = await userAddOrDeleteCart(userData._id, id)
            }
            if (res.data.status === "Success") {
                getProductList(userData._id)
            } else {
                alert(res.data.message)
            }
        } catch (error: any) {
            alert(error.message)
        }
    }


    return (
        <>
            <Helmet>
                <link rel="icon" type="image/svg+xml" href="/vite.svg" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Cart</title>
                <link rel="stylesheet" type="text/css" href="../../src/pages/User/Products/Productlist.css" />
            </Helmet>
            <section id="wrapper">
                <header className="shadow ">
                    <div className="container">
                        <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-lg-between">
                            <div className="col-md-2">
                                <h1>
                                    <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                                        <span className="logo_txt">SMART STORE</span>
                                    </a>
                                </h1>
                            </div>
                            <div className="col-md-8">
                                <div className="headerform">
                                    <div role="search">
                                        <div className="input-group">
                                            <div className="input-group-btn">
                                                <button type="button" className="btn btn-default" id="catDrop" data-toggle="dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <span id="srch-category">Category</span> <i className="fa fa-angle-down"></i>
                                                </button>
                                                <ul className="dropdown-menu" id="it-category" role="menu" aria-labelledby="catDrop">
                                                    <li key={0} className={'p-2 ' + (categoryFilter.length === 0 && 'bg-dark text-light')} onClick={() => setCategoryFilter("")}>{"All"}</li>
                                                    {
                                                        productCategory.length > 0 ?
                                                            productCategory.map((cat, i) => {
                                                                return (
                                                                    <li key={i + 1} className={'p-2 ' + (categoryFilter === cat?.categoryName && 'bg-dark text-light')} onClick={() => setCategoryFilter(cat?.categoryName)}>{cat?.categoryName}</li>
                                                                )
                                                            }) : <li>Loading...</li>
                                                    }
                                                </ul>
                                            </div>
                                            <input type="hidden" id="txt-category" />
                                            <input type="text" id="txt-search" className="form-control" onChange={(e: ChangeEvent<HTMLInputElement>) => filterByNameChange(e.target.value)} />
                                            <span className="input-group-btn">
                                                <button id="btn-search" type="submit" className="btn btn-primary" onClick={filterByName}>
                                                    <i className="fa fa-search"></i>
                                                    Search
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mobiBar">
                                <button className="btn btn-primary">
                                    <i className="fa-regular fa-compass"></i> Explore
                                </button>
                                <button id="userProf" className="transBtn" onClick={() => nav("/user/dashboard/profile")}>
                                    <i className="fa-regular fa-user"></i>
                                    <span>Profile</span>
                                </button>
                                <button id="ordersMenu" className="transBtn">
                                    <i className="fa-regular fa-file-lines"></i>
                                    <span>Orders</span>
                                </button>
                                <button id="cartAdd" className="transBtn" onClick={() => nav("/user/dashboard/cart")}>
                                    <b>5</b>
                                    <i className="fa-solid fa-cart-shopping"></i>
                                    <span>Cart</span>
                                </button>
                                <div className="dropdown show">
                                    <button id="toggleMenu" className="transBtn" data-toggle="dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="fa-solid fa-bars"></i>
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="optBar" role="menu">
                                        <a className="dropdown-item" href="#">Settings</a>
                                        <a className="dropdown-item" href="#">Signout</a>
                                        <a className="dropdown-item" href="#">Checkout</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="freqWrap">
                            <p>Frequently Searched for:</p>

                            <ul>
                                <li>Packed Items</li>
                                <li>Spices</li>
                                <li>Candy</li>
                                <li>Dry Fruits</li>
                            </ul>
                        </div>
                    </div>

                </header>

                <section id="plWrap">
                    <div className="container bootdey">
                        <div className="row">
                            <div className="col-md-3">
                                <section id="sideWrap" className="shadow">
                                    <section className="panel">
                                        <div className="panel-head">
                                            Categories
                                        </div>
                                        <div className="panel-body">
                                            <div className="form-group has-search catSearch">
                                                <input type="text" className="form-control" placeholder="Search" />
                                                <span className="fa fa-search"></span>
                                            </div>

                                            <ul className="list-group">
                                                <li className="list-group-item">
                                                    <input className="form-check-input me-1" disabled defaultChecked={categoryFilterByMultipleItem.length === 0 ? true : false} type="checkbox" aria-label="All" id="all" onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterbyMultipleItem("")} />
                                                    <label htmlFor="all">
                                                        <img src="../../src/asserts/images/all.png" alt="Allitems" />
                                                        All
                                                    </label>
                                                </li>
                                                {
                                                    productCategory.length > 0 ?
                                                        productCategory.map((cat, i) => {
                                                            return (
                                                                <li key={i} className="list-group-item">
                                                                    <input className="form-check-input me-1" defaultChecked={categoryFilterByNameTrack.includes(cat.categoryName)} type="checkbox" aria-label={cat.categoryName} id={cat.categoryName} onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterbyMultipleItem(cat.categoryName)} />
                                                                    <label htmlFor={cat.categoryName}>
                                                                        <img src={`../../src/asserts/images/${cat.categoryName.toLowerCase()}.png`} alt={cat.categoryName} />
                                                                        {cat.categoryName}
                                                                    </label>
                                                                </li>
                                                            )
                                                        }) : <li className="list-group-item">Loading...</li>
                                                }
                                            </ul>
                                        </div>
                                    </section>

                                    <section className="panel">
                                        <div className="panel-body">
                                            <h3>Min. order</h3>
                                            <select defaultValue="1" className="form-select" aria-label="Default select example">
                                                <option defaultValue="1">Max</option>
                                                <option value="1">One</option>
                                                <option value="2">Two</option>
                                                <option value="3">Three</option>
                                            </select>
                                        </div>
                                    </section>

                                    <section className="panel border-bottom-0">
                                        <div className="panel-body">
                                            <h3>Price Range</h3>
                                            <div className="priceRange">
                                                <div className="price-input">
                                                    <div className="field">
                                                        <span>Min</span>
                                                        <input type="number" className="input-min" defaultValue="700" />
                                                    </div>
                                                    <div className="separator">-</div>
                                                    <div className="field">
                                                        <input type="number" className="input-max" defaultValue="2300" />
                                                        <span>Max</span>
                                                    </div>
                                                </div>
                                                <div className="slider">
                                                    <div className="progress"></div>
                                                </div>
                                                <div className="range-input">
                                                    <input type="range" className="range-min" min="0" max="3000" defaultValue="700"
                                                        step="100" />
                                                    <input type="range" className="range-max" min="0" max="3000" defaultValue="2300"
                                                        step="100" />
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                    <div className="d-flex justify-content-around">
                                        <a href="register.html" className="btn btn-secondary">Reset</a>
                                        <button type="button" id="loginBrn" className="btn btn-primary">Apply</button>
                                    </div>
                                </section>
                            </div>
                            <div className="col-md-9">
                                <p>Showing <b>{productList.length}+ products</b> from global suppliers</p>
                                <div className="row product-list">
                                    {
                                        productList.length > 0 ?
                                            <>
                                                {
                                                    categoryFilterByMultipleItem.length > 0 ?
                                                        productList.filter((pc: any) => (categoryFilterByMultipleItem.includes(pc.category)))
                                                            .filter(pc => (pc.productName.indexOf(categoryFilterByName) > -1))
                                                            .map((prod, i) => {
                                                                return (
                                                                    <div key={i} className="col-md-3">
                                                                        <div className="product shadow">
                                                                            <div className="actionBtn">
                                                                                <button className="btn" onClick={() => addCartAndWishList(prod._id, "wishlist")}>
                                                                                    {
                                                                                        prod.wishlist ? <i className="fa-solid fa-heart"></i> : <i className="fa-regular fa-heart"></i>
                                                                                    }
                                                                                </button>
                                                                                <button className="btn" onClick={() => addCartAndWishList(prod._id, "cart")}>
                                                                                    {
                                                                                        prod.cart ? <i className="fa-solid fa-cart-shopping"></i> : <i className="fa-regular fa-cart-shopping"></i>
                                                                                    }
                                                                                </button>
                                                                            </div>
                                                                            <img src={prod.image?.toString()} alt={`Product ${i}`} />
                                                                            <span className="title">{prod.productName}</span>
                                                                            <span className="measure">{prod.productDescription}</span>
                                                                            <span className="price">₹ {prod.quantityAndType[0].price.toString()}</span>
                                                                            <span className="stock">Min. Order: {prod.minOrder.toString()} pieces</span>

                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        :
                                                        productList.filter(pc => (pc.category.indexOf(categoryFilter) > -1))
                                                            .filter(pc => (pc.productName.indexOf(categoryFilterByName) > -1))
                                                            .map((prod, i) => {
                                                                return (
                                                                    <div key={i} className="col-md-3">
                                                                        <div className="product shadow">
                                                                            <div className="actionBtn">
                                                                                <button className="btn" onClick={() => addCartAndWishList(prod._id, "wishlist")}>
                                                                                    {
                                                                                        prod.wishlist ? <i className="fa-solid fa-heart"></i> : <i className="fa-regular fa-heart"></i>
                                                                                    }
                                                                                </button>
                                                                                <button className="btn" onClick={() => addCartAndWishList(prod._id, "cart")}>
                                                                                    {
                                                                                        prod.cart ? <i className="fa-solid fa-cart-shopping"></i> : <i className="fa-regular fa-cart-shopping"></i>
                                                                                    }
                                                                                </button>
                                                                            </div>
                                                                            <img src={prod.image?.toString()} alt={`Product ${i}`} />
                                                                            <span className="title">{prod.productName}</span>
                                                                            <span className="measure">{prod.productDescription}</span>
                                                                            <span className="price">₹ {prod.quantityAndType[0].price.toString()}</span>
                                                                            <span className="stock">Min. Order: {prod.minOrder.toString()} pieces</span>

                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                }
                                            </>
                                            :
                                            isLoading ? <div>Loading...</div> : <div>Product not found</div>
                                    }
                                </div>

                                <div className="d-flex justify-content-between align-items-center b-pagination">
                                    <p className="page_left">
                                        <span id="noItems">1330</span> items in <span id="totalItems">130</span> Pages.
                                    </p>

                                    <div className="pagination">
                                        <button className="first">
                                            &nbsp;
                                        </button>
                                        <button className="prev">
                                            &nbsp;
                                            <span>Previous</span>
                                        </button>
                                        <div className="pager">
                                            <input type="text" id="number" defaultValue="1" />
                                            of <span id="totalPage">13</span>
                                        </div>
                                        <button className="next">
                                            <span>Next</span>&nbsp;
                                        </button>
                                        <button className="last">
                                            &nbsp;
                                        </button>
                                    </div>

                                </div>
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

export default Uproductlist;
import "./App.css"
import { useState,useEffect } from "react";

export default function App(){
    // states
    const [products,setProducts] = useState([]);
    const [category,setCategory] = useState([]);
    const [cartItems,setCartItems] = useState([]);
    const [cartCount,setCartCount] = useState(0);
    // urls
    const urlCategory = "https://fakestoreapi.com/products/categories";
    const urlProduct = "https://fakestoreapi.com/products/";
    const urlSelectedProduct = "https://fakestoreapi.com/products/category/";
    // functions
    function getCartCount(){
        setCartCount(cartItems.length);
    }
    // API Calls
    const loadCategory =async  (url)=>{
        try{
            const responce = await fetch(url);
            responce.json().then((data)=>{
                data.unshift("all")
                setCategory(data);
                
            })
        }catch(e){
            console.error("Check your internet connection "+e)
        }
    };

    const loadProduct =async  (url)=>{
        // Using fetch method
        try{
            const responce = await fetch(url);
            responce.json().then((data)=>{
                setProducts(data);
            })
        }catch(e){
            console.error("Check your internet connection "+e)
        }

    };

    // eventHandling
    function handleCategoryChange(event){
        ((event.target.value ==='all')?loadProduct(urlProduct):loadProduct(urlSelectedProduct+event.target.value))
        ;
    }

    function handleAddToCart(event){
        console.log(event.target.id)
        const add = async()=>(
            fetch(`http://fakestoreapi.com/products/${event.target.id}`)
        .then(responce=>responce.json())
        .then(data=>{
            cartItems.push(data);
            getCartCount();
        })
        )
        add()
    }

    function handleRemoveCartItems(event){
        const updatedCartItems = cartItems.filter(item => { return item.id != event.target.id});
        setCartItems(updatedCartItems);
        getCartCount();
        console.log(cartItems)
    }

    function handleHomeClick(){
        loadProduct(urlProduct);
    }

    useEffect(()=>{
        loadCategory(urlCategory);
        loadProduct(urlProduct);
    },[cartItems])

    return(
        <div className="container-fluid p-0 overflow-hidden">
            <header className="d-flex justify-content-between p-2 bg-dark text-light">
                <div><h2>Fakestore</h2></div>
                <div>
                <button onClick={handleHomeClick} className="btn btn-dark text-white me-4">Home</button>
                <button className="btn btn-dark text-white me-4">Electronics</button>
                <button className="btn btn-dark text-white me-4">Jewelry</button>
                <button className="btn btn-dark text-white me-4">Men's Fashion</button>
                <button className="btn btn-dark text-white me-4">Women's Fashion</button>

                </div>
                <div>
                    <button className="btn btn-dark"><span className="bi bi-search me-2"></span></button>
                    <button className="btn btn-dark"> <span className="bi bi-heart me-2"></span></button>
                    <button className="btn btn-dark"><span className="bi bi-person me-2"></span></button>
                    <button className="btn btn-dark position-relative"
                    data-bs-target="#showProducts"  
                    data-bs-toggle="modal">
                        <span className="bi bi-cart me-2"></span>
                        <span className="badge rounded-circle bg-danger position-absolute">
                            {cartCount}</span>
                </button>
                </div>
            </header>
            <section className="mt-1 row p-2">
            <div className="modal" id="showProducts">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h3>My cart items</h3>
                                    <button data-bs-dismiss="modal" className="btn-close"></button>
                                </div>
                                <div className="modal-body">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Visuals</th>
                                                <th>Title</th>
                                                <th>Price</th>
                                                <th>Remove</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                cartItems.map(item=>
                                                    <tr key={item.id}>
                                                        <td>
                                                            <img src={item.image} height={80} width={80} alt={item.title} />
                                                        </td>
                                                        <td>{item.title}</td>
                                                        <td>{item.price}</td>
                                                        <td>
                                                            <button id={item.id} onClick={handleRemoveCartItems} className="btn btn-link"><span id={item.id} className="bi bi-trash-fill"></span></button>
                                                        </td>
                                                    </tr>
                                                    )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <nav className="col-2 p-2">
                        <div>
                            <label className="form-label">Select a Category</label>
                            <select onChange={handleCategoryChange} className="form-select">
                                {
                                    category.map((cat)=>(
                                        <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </nav>
                    <main className="col-10 d-flex flex-wrap ">
                        {
                            products.map((items)=>(
                                <div key={items.id} className="card m-2 p-2">
                                    <div className="card-header">
                                        <img src={items.image} alt={items.title} title={items.title} height={200} width={200}/>
                                        <p>{items.title}</p>
                                    </div>
                                    <div className="card-body">
                                        <div className="text-start"><b>Price:</b> {items.price}</div>
                                        <div className="text-start"><b>Rating:</b> <span className="bi bi-star-fill"> </span> {items.rating.rate}</div>
                                    </div>
                                    <div className="card-footer">
                                        <button onClick={handleAddToCart} id={items.id} className="btn btn-primary w-100">Add to cart</button>
                                    </div>
                                </div>
                            ))
                        }
                    </main>
            </section>
        </div>
    )
} 

import logo from './logo.svg';
import './App.css';
import Header from './components/Header.js'
import Footer from './components/Footer.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home.js';
import CategoryProducts from './components/CategoryProducts.js'
import Body from './components/Body.js';
import Cart from './components/Cart.js';
import Services from './components/Services.js';
import Categories from './components/Categories.js';
import Profile from './components/Profile.js'
import { UserProvider } from './components/Context/UserContext';
import ProductDetail from './components/ProductDetail.js';
import CategoriesPage from './components/CategoriesPage.js';
import ProfileDetailsPage from './components/ProfileDetailsPage.js';
import AddressBook from './components/AddressBook.js';
import OrderPage from './components/OrderPage.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <div className='open-sans'>
      <ToastContainer />
          <Router>
          <UserProvider>

            <Routes>
              <Route path="/" element={<Body element={<Home />}/>} />
              <Route path="/services" element={<Body element={<Services/>}/>}/>
              <Route path="/categories" element={<Body element={<CategoriesPage/>}/>}/>
              <Route path="/category/:categoryId" element={<Body element={<CategoryProducts />}/>} />
              <Route path="/cart" element={<Cart/>}/>
              <Route path="/profile" element={<Body element={<Profile/>}/>}/>
              <Route path="/product/:productId" element={<Body element={<ProductDetail />} showFooter={false}/>} />
              <Route path="/profiledetails" element={<Body element={<ProfileDetailsPage />} showFooter={false}/>} />
              <Route path='/addressbook' element={<Body element={<AddressBook/>} showFooter={false}/>} />
              <Route path='/orders' element= { <Body element={<OrderPage/>} showFooter={false}/>} />
              {/* <Route path="/service/:id" element={} /> */}
            </Routes>
  
    </UserProvider>
    </Router>
    </div>


  );
}

export default App;

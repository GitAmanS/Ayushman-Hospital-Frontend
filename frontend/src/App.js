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
function App() {
  return (
    <div className='open-sans'>
          <UserProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Body element={<Home />}/>} />
              <Route path="/services" element={<Body element={<Services/>}/>}/>
              <Route path="/categories" element={<Body element={<Categories/>}/>}/>
              <Route path="/category/:categoryName" element={<Body element={<CategoryProducts />}/>} />
              <Route path="/cart" element={<Cart/>}/>
              <Route path="/profile" element={<Body element={<Profile/>}/>}/>
              {/* <Route path="/service/:id" element={} /> */}
            </Routes>
          </Router>
    </UserProvider>
    </div>


  );
}

export default App;

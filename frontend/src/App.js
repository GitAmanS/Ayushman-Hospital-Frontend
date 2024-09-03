import logo from './logo.svg';
import './App.css';
import Header from './components/Header.js'
import Services from './components/Services.js'
import Footer from './components/Footer.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ServiceDetail from './components/ServiceDetail.js';
function App() {
  return (
    <div className="App">
      <Header />
      <Router>
      <Routes>
        <Route path="/" element={<Services />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
      </Routes>
    </Router>
      <Footer/>
    </div>
  );
}

export default App;

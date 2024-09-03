import logo from './logo.svg';
import './App.css';
import Header from './components/Header.js'
import Services from './components/Services.js'
import Footer from './components/Footer.js'
function App() {
  return (
    <div className="App">
      <Header />
      <Services/>
      <Footer/>
    </div>
  );
}

export default App;

// App.js
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
// Pantalles
import HomeScreen from './screens/home/Home.jsx'
import PerfilScreen from './screens/perfil/Perfil.jsx'
import LoginSingup from './screens/login/LoginSingup.jsx'
import AdminDashboard from './screens/Admin/Dashboard.jsx'
import Header from './components/Header.jsx'
import Slider from './components/Slider.jsx'
import ProductionHous from './components/ProductionHous.jsx'

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <Slider />
        <ProductionHous />
      </div>
    </Router>
  );
};

export default App;
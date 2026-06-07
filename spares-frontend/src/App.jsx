import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Products from './pages/Products';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminPortal from './pages/AdminPortal';

function App() {
  return (
    <BrowserRouter>
      {/* 1. The Navigation Bar (This stays on screen all the time) */}
<nav style={{ padding: '20px 40px', backgroundColor: '#000', borderBottom: '2px solid #E35205', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '1px' }}>
      JJS AUTO
  </div>
  <ul style={{ display: 'flex', gap: '30px', listStyle: 'none', margin: 0, padding: 0 }}>
    <li><Link to="/" style={navLinkStyle}>Home</Link></li>
    <li><Link to="/products" style={navLinkStyle}>Products & Inventory</Link></li>
    <li><Link to="/services" style={navLinkStyle}>Services</Link></li>
    <li><Link to="/contact" style={navLinkStyle}>Contact Us</Link></li>
    <li><Link to="/login" style={navLinkStyle}>Business Portal</Link></li>
  </ul>
</nav>
      {/* 2. The Dynamic Content Area (This swaps out based on the URL) */}
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-portal" element={<AdminPortal />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

const navLinkStyle = { 
    color: '#fff', 
    textDecoration: 'none', 
    fontWeight: '500', 
    textTransform: 'uppercase', 
    fontSize: '0.9rem' 
};
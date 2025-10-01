import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminSidebar from './components/AdminSidebar';

import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Portfolio from './pages/Portfolio';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

import Dashboard from './pages/admin/Dashboard';
import ProductsAdmin from './pages/admin/ProductsAdmin';
import ProjectsAdmin from './pages/admin/ProjectsAdmin';
import GalleryAdmin from './pages/admin/GalleryAdmin';
import MessagesAdmin from './pages/admin/MessagesAdmin';
import CompanyProfileAdmin from './pages/admin/CompanyProfileAdmin';

const ProtectedRoute = ({ token, children }) => {
  if (!token) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

function App() {
  const location = useLocation();
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div>
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="/admin"
          element={<Dashboard token={token} setToken={setToken} />}
        />
        <Route
          path="/admin/company-profile"
          element={
            <ProtectedRoute token={token}>
              <AdminLayout>
                <CompanyProfileAdmin token={token} />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute token={token}>
              <AdminLayout>
                <ProductsAdmin token={token} />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute token={token}>
              <AdminLayout>
                <ProjectsAdmin token={token} />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <ProtectedRoute token={token}>
              <AdminLayout>
                <GalleryAdmin token={token} />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute token={token}>
              <AdminLayout>
                <MessagesAdmin token={token} />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">{children}</div>
    </div>
  );
};

export default App;

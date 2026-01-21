import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Inventory from "./components/Inventory";
import ForgotPassword from "./components/ForgotPassword";
import ProductDetail from "./pages/ProductDetail";
import UserManagement from "./pages/UserManagement";
import Register from "./components/Register";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/:sku" element={<ProductDetail />} />
        <Route path="/users" element={<UserManagement />} />
        
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  );
}

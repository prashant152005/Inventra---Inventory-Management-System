import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Inventory from "./components/Inventory";
import ProductDetail from "./pages/ProductDetail";
import UserManagement from "./pages/UserManagement";
import RegisterAdmin from "./pages/RegisterAdmin";





export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/:sku" element={<ProductDetail />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />

      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import "./index.css";
import AddMenu from "./pages/AddMenu";
import Navbar from "./components/Navbar";
import MenuAdmin from "./pages/MenuAdmin";
import EditMenu from "./pages/EditMenu";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import WishlistPage from "./pages/WishlistPage";

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/admin/addMenu" element={<AddMenu />} />
          <Route path="/admin/menu" element={<MenuAdmin />} />
          <Route path="/admin/menu/edit/:id" element={<EditMenu />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

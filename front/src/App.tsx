import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import "./index.css";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import WishlistPage from "./pages/WishlistPage";
import ServiceFeedback from "./pages/ServiceFeedback";

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/servicefeedback" element={<ServiceFeedback />} />

          {/* Login səhifəsi */}
          {/* <Route path="/admin" element={<LoginPage />} /> */}

          {/* Admin üçün qorunan route-lar */}
          {/* <Route path="/admin" element={<PrivateRoute />}>
            <Route path="addMenu" element={<AddMenu />} />
            <Route path="menu" element={<MenuAdmin />} />
            <Route path="waiter/add" element={<WaiterForm />} />
            <Route path="waiters" element={<WaitersTable />} />
            <Route path="menu/edit/:id" element={<EditMenu />} />
            <Route path="feedback" element={<FeedbackListPage />} />
            <Route path="feedback/:id" element={<FeedbackDetailPage />} />
          </Route> */}

          {/* 404 səhifəsi */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

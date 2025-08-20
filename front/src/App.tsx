import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
// import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
// import Home from "./pages/Dashboard/Home";
import PrivateRoute from "./components/routes/PrivateRoute";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { useContext } from "react";
import { useIdleLogout } from "./hooks/useIdleLogout";
import RestrictedRoute from "./components/routes/RestrictedRoute";
import { HelmetProvider } from "react-helmet-async";
import TitleUpdater from "./components/routes/TitleUpdater";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Menu from "./pages/Menu/Menu";
import WishlistPage from "./pages/Menu/WishlistPage";
import ProductDetail from "./pages/Menu/ProductDetail";
import ServiceFeedback from "./pages/Menu/ServiceFeedback";
import LoginPage from "./pages/Menu/SignInForm";
import Home from "./pages/Menu/Home";
import AddMenu from "./pages/Menu/AddMenu";
import MenuAdmin from "./pages/Menu/MenuAdmin";
import WaiterForm from "./pages/Menu/WaiterForm";
import WaitersTable from "./pages/Menu/WaitersTable";
import EditMenu from "./pages/Menu/EditMenu";
import FeedbackListPage from "./pages/Menu/FeedbackListPage";
import FeedbackDetailPage from "./pages/Menu/FeedbackDetailPage";
import PublicLayout from "./layout/PublicLayout";

// function RoleBasedRedirect() {
//   const user = localStorage.getItem("role"); // user rolu burada olmalıdır: user?.role
//   console.log(user);

//   if (user == "abuneci") {
//     return <Navigate to="/balance" replace />;
//   }

//   return <Navigate to="/dashboard" replace />;
// }

const AppRoutes = () => {
  const { token, setToken } = useContext(AuthContext);

  useIdleLogout(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    setToken(null);
  }, 10 * 60 * 1000);

  return (
    <>
      <Router>
        <TitleUpdater />
        <ScrollToTop />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          aria-label={"aa"}
          style={{ zIndex: "111111" }}
        />
        <Routes>
          {/* Dashboard Layout */}
          <Route
            element={
              <PrivateRoute token={token}>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route
              index
              path="/dashboard"
              element={
                <RestrictedRoute
                  blockedRoles={["abuneci"]}
                  redirectTo="/balance"
                >
                  <Home />
                </RestrictedRoute>
              }
            />
            <Route path="/admin/addMenu" element={<AddMenu />} />
            <Route path="/admin/menu" element={<MenuAdmin />} />
            <Route path="/admin/waiter/add" element={<WaiterForm />} />
            <Route path="/admin/waiters" element={<WaitersTable />} />
            <Route path="/admin/menu/edit/:id" element={<EditMenu />} />
            <Route path="/admin/feedback" element={<FeedbackListPage />} />
            <Route
              path="/admin/feedback/:id"
              element={<FeedbackDetailPage />}
            />
          </Route>
          {/* Auth Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/servicefeedback" element={<ServiceFeedback />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          

          {/* Login səhifəsi */}
          <Route path="/admin" element={<LoginPage />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;

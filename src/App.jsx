import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { HomeProvider } from './context/HomeContext.jsx';
import { BlockStaff, RequireCustomer, RequireStaff } from './components/RequireRole.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import StoreLayout from './layouts/StoreLayout.jsx';
import Account from './pages/Account.jsx';
import Addresses from './pages/Addresses.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import Cart from './pages/Cart.jsx';
import Category from './pages/Category.jsx';
import Checkout from './pages/Checkout.jsx';
import CmsPage from './pages/CmsPage.jsx';
import Contact from './pages/Contact.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Home from './pages/Home.jsx';
import Inbox from './pages/Inbox.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import OrderDetail from './pages/OrderDetail.jsx';
import Orders from './pages/Orders.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import Product from './pages/Product.jsx';
import Register from './pages/Register.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Returns from './pages/Returns.jsx';
import Sale from './pages/Sale.jsx';
import Search from './pages/Search.jsx';
import Shop from './pages/Shop.jsx';
import TicketDetail from './pages/TicketDetail.jsx';
import Tickets from './pages/Tickets.jsx';
import Wishlist from './pages/Wishlist.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminProducts from './pages/admin/Products.jsx';
import AdminCategories from './pages/admin/Categories.jsx';
import AdminInventory from './pages/admin/Inventory.jsx';
import AdminOrders from './pages/admin/Orders.jsx';
import AdminShipping from './pages/admin/Shipping.jsx';
import AdminBanners from './pages/admin/Banners.jsx';
import AdminCms from './pages/admin/Cms.jsx';
import AdminTestimonials from './pages/admin/Testimonials.jsx';
import AdminOffers from './pages/admin/Offers.jsx';
import AdminCustomers from './pages/admin/Customers.jsx';
import AdminReviews from './pages/admin/Reviews.jsx';
import AdminSupport from './pages/admin/Support.jsx';
import AdminReturns from './pages/admin/Returns.jsx';
import AdminReports from './pages/admin/Reports.jsx';
import AdminTemplates from './pages/admin/Templates.jsx';
import AdminAudit from './pages/admin/Audit.jsx';
import AdminSettings from './pages/admin/Settings.jsx';
import AdminStaff from './pages/admin/Staff.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <HomeProvider>
            <Routes>
              <Route
                element={
                  <RequireStaff>
                    <AdminLayout />
                  </RequireStaff>
                }
              >
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/inventory" element={<AdminInventory />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/shipping" element={<AdminShipping />} />
                <Route path="/admin/banners" element={<AdminBanners />} />
                <Route path="/admin/cms" element={<AdminCms />} />
                <Route path="/admin/testimonials" element={<AdminTestimonials />} />
                <Route path="/admin/offers" element={<AdminOffers />} />
                <Route path="/admin/customers" element={<AdminCustomers />} />
                <Route path="/admin/reviews" element={<AdminReviews />} />
                <Route path="/admin/support" element={<AdminSupport />} />
                <Route path="/admin/returns" element={<AdminReturns />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/templates" element={<AdminTemplates />} />
                <Route path="/admin/audit" element={<AdminAudit />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/staff" element={<AdminStaff />} />
              </Route>
              <Route element={<StoreLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Shop />} />
                <Route path="/c/:slug" element={<Category />} />
                <Route path="/product/:slug" element={<Product />} />
                <Route path="/sale" element={<Sale />} />
                <Route path="/search" element={<Search />} />
                <Route path="/contact" element={<Contact />} />
                <Route
                  path="/cart"
                  element={
                    <BlockStaff>
                      <Cart />
                    </BlockStaff>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <BlockStaff>
                      <Checkout />
                    </BlockStaff>
                  }
                />
                <Route path="/order-success/:id" element={<OrderSuccess />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                  path="/register"
                  element={
                    <BlockStaff>
                      <Register />
                    </BlockStaff>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <RequireCustomer>
                      <Account />
                    </RequireCustomer>
                  }
                />
                <Route
                  path="/account/orders"
                  element={
                    <RequireCustomer>
                      <Orders />
                    </RequireCustomer>
                  }
                />
                <Route
                  path="/account/orders/:id"
                  element={
                    <RequireCustomer>
                      <OrderDetail />
                    </RequireCustomer>
                  }
                />
                <Route
                  path="/account/wishlist"
                  element={
                    <RequireCustomer>
                      <Wishlist />
                    </RequireCustomer>
                  }
                />
                <Route
                  path="/account/addresses"
                  element={
                    <RequireCustomer>
                      <Addresses />
                    </RequireCustomer>
                  }
                />
                <Route
                  path="/account/tickets"
                  element={
                    <RequireCustomer>
                      <Tickets />
                    </RequireCustomer>
                  }
                />
                <Route
                  path="/account/tickets/:id"
                  element={
                    <RequireCustomer>
                      <TicketDetail />
                    </RequireCustomer>
                  }
                />
                <Route
                  path="/account/inbox"
                  element={
                    <RequireCustomer>
                      <Inbox />
                    </RequireCustomer>
                  }
                />
                <Route
                  path="/account/returns"
                  element={
                    <RequireCustomer>
                      <Returns />
                    </RequireCustomer>
                  }
                />
                <Route path="/pages/:slug" element={<CmsPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </HomeProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

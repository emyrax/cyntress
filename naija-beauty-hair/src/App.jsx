import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { AdminProvider } from './context/AdminContext'
import { useMarketingParams } from './hooks/useMarketingParams'
import AnnouncementBar from './components/layout/AnnouncementBar'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import AdminLayout from './components/admin/AdminLayout'

import Home from './pages/Home'
import Collection from './pages/Collection'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import GenericPage from './pages/GenericPage'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import About from './pages/About'
import HowToOrder from './pages/HowToOrder'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

import Dashboard from './pages/admin/Dashboard'
import ProductList from './pages/admin/products/ProductList'
import ProductForm from './pages/admin/products/ProductForm'
import PostList from './pages/admin/posts/PostList'
import PostForm from './pages/admin/posts/PostForm'
import BannerList from './pages/admin/banners/BannerList'
import BannerForm from './pages/admin/banners/BannerForm'
import OrderList from './pages/admin/orders/OrderList'
import SEOSettings from './pages/admin/seo/SEOSettings'
import PageEditor from './pages/admin/pages/PageEditor'

function PublicLayout({ children }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/collections/:slug" element={<PublicLayout><Collection /></PublicLayout>} />
      <Route path="/product/:handle" element={<PublicLayout><ProductDetail /></PublicLayout>} />
      <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
      <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
      <Route path="/order-confirmation/:orderId" element={<PublicLayout><OrderConfirmation /></PublicLayout>} />
      <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
      <Route path="/blog/category/:category" element={<PublicLayout><Blog /></PublicLayout>} />
      <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/how-to-order" element={<PublicLayout><HowToOrder /></PublicLayout>} />
      <Route path="/faqs" element={<PublicLayout><GenericPage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><GenericPage /></PublicLayout>} />
      <Route path="/shipment-policy" element={<PublicLayout><GenericPage /></PublicLayout>} />
      <Route path="/return-policy" element={<PublicLayout><GenericPage /></PublicLayout>} />
      <Route path="/privacy-policy" element={<PublicLayout><GenericPage /></PublicLayout>} />
      <Route path="/terms" element={<PublicLayout><GenericPage /></PublicLayout>} />
      <Route path="/ip-rights" element={<PublicLayout><GenericPage /></PublicLayout>} />
      <Route path="/share-rewards" element={<PublicLayout><GenericPage /></PublicLayout>} />

      <Route path="/admin" element={<AdminProvider><AdminLayout /></AdminProvider>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="posts" element={<PostList />} />
        <Route path="posts/new" element={<PostForm />} />
        <Route path="posts/:id/edit" element={<PostForm />} />
        <Route path="banners" element={<BannerList />} />
        <Route path="banners/new" element={<BannerForm />} />
        <Route path="banners/:id/edit" element={<BannerForm />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="seo" element={<SEOSettings />} />
        <Route path="pages" element={<PageEditor />} />
      </Route>

      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
    </Routes>
  )
}

export default function App() {
  useMarketingParams()

  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  )
}

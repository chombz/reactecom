//
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//public route
import AdminPrivateRoute from './AdminPrivateRoute';
import PublicRoute from './routes/PublicRoute'; // Corrected path
import FrontendLayout from './layouts/frontend/FrontEndLayout';

// Components for routes
import Login from './components/frontend/auth/login';
import Register from './components/frontend/auth/register';

import Page403 from './components/errors/Page403';
import Page404 from './components/errors/Page404';

import Swal from 'sweetalert2';
import axios from 'axios';

import Home from './components/frontend/Home';
import About from './components/frontend/About';
import Contact from './components/frontend/Contact';

import ViewCategories from './components/frontend/Collections/ViewCategories';
import ViewProducts from './components/frontend/Collections/ViewProduct';
import ProductDetail from './components/frontend/Collections/ProductDetail';

import Cart from './components/frontend/Cart';
import Checkout from './components/frontend/Checkout';
import Thankyou from './components/frontend/Thankyou';

// Styles

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


// Axios configuration
axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';


axios.defaults.withCredentials = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';//for the backroomz

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) =>
  {
    const token = localStorage.getItem('auth_token');
    if (token)
    {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) =>
  {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 and 403 errors globally
axios.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) =>
  {
    const { status, data, config } = error.response || {};

    if (status === 401)
    {
      // Let AdminPrivateRoute handle its own 401 for the initial user check.
      // This prevents the global handler from redirecting before the private route can.
      if (config && config.url.endsWith('/api/user'))
      {
        return Promise.reject(error); // Pass it on to the component's .catch()
      }

      // For all other 401s, it means the token is invalid or expired.
      // Log the user out and redirect to login.
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      Swal.fire({
        title: 'Unauthorized',
        text: data?.message || 'Your session has expired. Please log in again.',
        icon: 'warning',
        confirmButtonText: 'OK'
      }).then(() =>
      {
        window.location.href = '/login';
      });
    }

    return Promise.reject(error);
  }
);

function App()
{
  return (
    <div className="App">
      <Router>
        <Routes>

          {/* Protected Admin Route */}
          <Route path="/admin/*" element={<AdminPrivateRoute />} />

          {/* Public Frontend Routes */}
          <Route path="/" element={<FrontendLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />

            <Route path="collections" element={<ViewCategories />} />
            <Route path="collections/:slug" element={<ViewProducts />} />
            <Route path="collections/:category/:slug" element={<ProductDetail />} />

            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />

            {/* Thanks */}
            <Route path="thankyou" element={<Thankyou />} />


            {/* Routes for users who are NOT authenticated */}
            <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
          </Route>

          {/* Path to error page */}
          <Route path="/403" element={<Page403 />} />
          <Route path="/404" element={<Page404 />} />


        </Routes>
      </Router>
    </div>
  );
}

export default App;
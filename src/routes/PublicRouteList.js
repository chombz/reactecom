import Home from '../components/frontend/Home';
import About from '../components/frontend/About';
import Contact from '../components/frontend/Contact';

import Page403 from '../components/errors/Page403';
import Page404 from '../components/errors/Page404';

import Login from '../components/frontend/auth/login';
import Register from '../components/frontend/auth/register';

import ViewCategories from '../components/frontend/Collections/ViewCategories';
import ViewProducts from '../components/frontend/Collections/ViewProduct';
import ProductDetail from '../components/frontend/Collections/ProductDetail';
import Cart from '../components/frontend/Cart';
import Checkout from '../components/frontend/Checkout';
import Thankyou from '../components/frontend/Thankyou';

const PublicRouteList = [
    //Public Routes to the Main Frontend Pages
    { path: '/', exacts: true, name: 'Home', component: Home },
    { path: '/about', exacts: true, name: 'About', component: About },
    { path: '/contact', exacts: true, name: 'Contact', component: Contact },

    // Error Pages
    { path: '/403', exacts: true, name: 'Page403', component: Page403 },
    { path: '/404', exacts: true, name: 'Page404', component: Page404 },

    // Authentication Pages
    { path: '/login', exacts: true, name: 'Login', component: Login },
    { path: '/register', exacts: true, name: 'Register', component: Register },

    // Add more public routes as needed
    { path: '/collections', exacts: true, name: 'ViewCategories', component: ViewCategories },
    { path: '/collections/:slug', exacts: true, name: 'ViewProducts', component: ViewProducts },
    { path: '/collections/:category/:product', exacts: true, name: 'ProductDetail', component: ProductDetail },
    { path: '/cart', exacts: true, name: 'Cart', component: Cart },
    { path: '/checkout', exacts: true, name: 'Checkout', component: Checkout },
    { path: '/thankyou', exacts: true, name: 'Thankyou', component: Thankyou },
];

export default PublicRouteList;
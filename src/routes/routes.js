//Import Admin
import Dashboard from '../components/admin/Dashboard';
import Profile from '../components/admin/Profile';
import Orders from '../components/admin/Orders/Order';

// Import category
import Category from '../components/admin/category/Category';
import ViewCategory from '../components/admin/category/ViewCategory';
import EditCategory from '../components/admin/category/EditCategory';
// Import product
import AddProduct from '../components/admin/Product/AddProduct';
import EditProduct from '../components/admin/Product/EditProduct';
import ViewProduct from '../components/admin/Product/ViewProduct';

//Import Orders
import ViewOrder from '../components/admin/Orders/ViewOrder';

// Define routes for the admin panel

const routes = [
    // Paths are now relative to the parent "/admin" route.
    // The `exact` prop is no longer needed in React Router v6.
    { path: 'dashboard', name: 'Dashboard', component: Dashboard },
    { path: 'category', name: 'Category', component: Category },
    { path: 'view', name: 'ViewCategory', component: ViewCategory },
    { path: 'edit/:id', name: 'EditCategory', component: EditCategory },

    {/* Fallback route for undefined paths */ },
    { path: 'add-product', name: 'AddProduct', component: AddProduct },
    { path: 'edit-product/:id', name: 'EditProduct', component: EditProduct },
    { path: 'view-product', name: 'ViewProduct', component: ViewProduct },


    {/* Profile and Orders */ },
    { path: 'profile', name: 'Profile', component: Profile },
    { path: 'orders', name: 'Orders', component: Orders },
    { path: 'view-order/:id', name: 'ViewOrder', component: ViewOrder },


];

export default routes;
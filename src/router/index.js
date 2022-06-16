import { createRouter, createWebHistory } from "vue-router";
import { supabase } from '../supabase/init';
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Create from '../views/Create.vue';
import CreateDeal from '../views/CreateDeal';
import CreateContact from '../views/CreateContact.vue';
import Menu from '../views/Menu.vue';
import ViewWorkout from '../views/ViewWorkout.vue';
import ViewContact from '../views/ViewContact';
import ViewDeal from '../views/ViewDeal';
import Orders from '../views/Orders.vue';
import Deals from '../views/Deals.vue';
import Calendar from '../views/Calendar.vue';
import Wallet from '../views/Wallet.vue';
import Warehouse from '../views/Warehouse.vue';
import Contacts from '../views/Contacts.vue';
import AccountSettings from '../views/AccountSettings.vue';

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      title: 'Dashboard',
      auth: true,
      translation: 'Доска',
      type: 'View'
    }
  },
  {
    path: "/orders",
    name: "Orders",
    component: Orders,
    meta: {
      title: 'Orders',
      auth: true,
      translation: 'Все дела'
    }
  },
  {
    path: "/deals",
    name: "Deals",
    component: Deals,
    meta: {
      title: 'Deals',
      auth: true,
      translation: 'Все дела',
      type: 'View'
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: 'Login',
      auth: false,
    }
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: 'Register',
      auth: false,
    }
  },
  {
    path: "/create",
    name: "Create",
    component: Create,
    meta: {
      title: 'Create',
      auth: true,
      type: 'Create'
    }
  },
  {
    path: "/create-contact",
    name: "CreateContact",
    component: CreateContact,
    meta: {
      title: 'Create Contact',
      auth: true,
      translation: 'Новый контакт',
      type: 'Create'
    }
  },
  {
    path: "/create-deal",
    name: "CreateDeal",
    component: CreateDeal,
    meta: {
      title: 'Create Deal',
      auth: true,
      translation: 'Новое дело',
      type: 'Create'
    }
  },
  {
    path: "/",
    name: "Menu",
    component: Menu,
    meta: {
      title: 'Menu',
      auth: true,
      type: 'Menu'
    }
  },
  {
    path: "/calendar",
    name: "Calendar",
    component: Calendar,
    meta: {
      title: 'Calendar',
      auth: true,
      translation: 'Календарь',
      type: 'View'
    }
  },
  {
    path: "/wallet",
    name: "Wallet",
    component: Wallet,
    meta: {
      title: 'Wallet',
      auth: true,
      translation: 'Кошелек',
      type: 'View'
    }
  },
  {
    path: "/warehouse",
    name: "Warehouse",
    component: Warehouse,
    meta: {
      title: 'Warehouse',
      auth: true,
      translation: 'Склад',
      type: 'View'
    }
  },
  {
    path: "/contacts",
    name: "Contacts",
    component: Contacts,
    meta: {
      title: 'Contacts',
      auth: true,
      translation: 'Мои контакты',
      type: 'View'
    }
  },
  {
    path: "/settings",
    name: "AccountSettings",
    component: AccountSettings,
    meta: {
      title: 'AccountSettings',
      auth: true,
      translation: 'Настройки',
      type: 'View'
    }
  },
  {
    path: "/view-workout/:workoutId",
    name: "View-Workout",
    component: ViewWorkout,
    meta: {
      title: 'ViewWorkout',
      auth: true,
      type: 'CurrentView'
    }
  },
  {
    path: "/view-contact/:contactId",
    name: "View-Contact",
    component: ViewContact,
    meta: {
      title: 'View Contact',
      auth: true,
      type: 'CurrentView'
    }
  },
  {
    path: "/view-deal/:dealId",
    name: "View-Deal",
    component: ViewDeal,
    meta: {
      title: 'View Deal',
      auth: true,
      type: 'CurrentView'
    }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Change document titles
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | TheDeals`;
  next();
})

// Route guard for auth routes
router.beforeEach((to, from, next) => {
  const user = supabase.auth.user();
  if (to.matched.some((res) => res.meta.auth)) {
    if(user) {
      next();
      return;
    }
    next({ name: 'Login' });
    return;
  }
  next();
});

export default router;

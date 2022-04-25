import { createRouter, createWebHistory } from "vue-router";
import { supabase } from '../supabase/init';
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Create from '../views/Create.vue';
import Menu from '../views/Menu.vue';
import ViewWorkout from '../views/ViewWorkout.vue';
import Orders from '../views/Orders.vue';
import EventCalendar from '../views/EventCalendar.vue';
import Wallet from '../views/Wallet.vue';
import Warehouse from '../views/Warehouse.vue';

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      title: 'Dashboard',
      auth: true,
      translation: 'Доска'
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
    }
  },
  {
    path: "/",
    name: "Menu",
    component: Menu,
    meta: {
      title: 'Menu',
      auth: true,
    }
  },
  {
    path: "/calendar",
    name: "Calendar",
    component: EventCalendar,
    meta: {
      title: 'Event Calendar',
      auth: true,
      translation: 'Календарь событий'
    }
  },
  {
    path: "/wallet",
    name: "Wallet",
    component: Wallet,
    meta: {
      title: 'Wallet',
      auth: true,
      translation: 'Кошелек'
    }
  },
  {
    path: "/warehouse",
    name: "Warehouse",
    component: Warehouse,
    meta: {
      title: 'Warehouse',
      auth: true,
      translation: 'Склад'
    }
  },
  {
    path: "/view-workout/:workoutId",
    name: "View-Workout",
    component: ViewWorkout,
    meta: {
      title: 'ViewWorkout',
      auth: true,
    }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Change document titles
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | My Now`;
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

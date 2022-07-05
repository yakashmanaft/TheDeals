// import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { supabase } from '../supabase/init';

// import HomeView from '../views/HomeView.vue';
// import Calendar from '../views/Calendar.vue';

// Экраны логина и регистрации
import Login from '../views/auth/Login.vue';
import Register from '../views/auth/Register.vue';

const routes = [
  {
    path: '/',
    name: 'Calendar',
    component: () => import('../views/Calendar.vue'),
    meta: {
      title: 'Calendar',
      auth: true,
      translation: 'Календарь',
      type: 'View'
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login',
      auth: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: 'Register',
      auth: false
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Change document titles
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | TheDeals`;
  next();
});

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
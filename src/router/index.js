// import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { supabase } from '../supabase/init';

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
    path: '/deals',
    name: 'Deals',
    component: () => import('../views/Deals.vue'),
    meta: {
      title: 'Deals',
      auth: true,
      translation: 'Все дела',
      type: 'View'
    }
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: () => import('../views/Contacts.vue'),
    meta: {
      title: 'Contacts',
      auth: true,
      translation: 'Мои контакты',
      type: 'View'
    } 
  },
  {
    path: '/create-contact',
    name: 'ContactCreate',
    component: () => import('../views/create/ContactCreate.vue'),
    meta: {
      title: 'CreateContact',
      auth: true,
      translation: 'Новый контакт',
      type: 'Create'
    }
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
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/AccountSettings.vue'),
    meta: {
      title: 'Settings',
      auth: true,
      translation: 'Настройки',
      type: 'View'
    }
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: () => import('../views/FAQ.vue'),
    meta: {
      title: 'FAQ',
      auth: true,
      translation: 'Помощь',
      type: 'View'
    }
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
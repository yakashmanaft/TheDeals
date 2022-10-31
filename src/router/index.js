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
    path: '/wallet',
    name: "Wallet",
    component: () => import('../views/Wallet.vue'),
    meta: {
      title: 'Wallet',
      auth: true,
      translation: 'Кошелек',
      type: 'View'
    }
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
    path: '/view-deal/:dealId',
    name: 'View-Deal',
    component: () => import('../views/currentView/ViewDeal.vue'),
    meta: {
      title: 'View Deal',
      auth: true,
      type: 'CurrentView'
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
    path: '/view-contact/:contactId',
    name: 'View-Contact',
    component: () => import('../views/currentView/ViewContact.vue'),
    meta: {
      title: 'View Contact',
      auth: true,
      type: 'CurrentView'
    }
  },
  {
    path: '/recipes',
    name: 'Recipes',
    component: () => import('../views/Recipes.vue'),
    meta: {
      title: 'Recipes',
      auth: true,
      translation: 'Мои рецепты',
      type: 'View'
    }
  },
  {
    path: '/view-recipe/:recipeId',
    name: 'View-Recipe',
    component: () => import('../views/currentView/ViewRecipe.vue'),
    meta: {
      title: 'View Recipe',
      auth: true,
      type: 'CurrentView'
    }
  },
  {
    path: '/price-list',
    name: 'MyPrice',
    component: () => import('../views/MyPrice.vue'),
    meta: {
      title: 'MyPrice',
      auth: true,
      translation: 'Мой прайс-лист',
      type: 'View'
    }
  },
  {
    path: '/warehouse',
    name: 'Warehouse',
    component: () => import('../views/Warehouse.vue'),
    meta: {
      title: 'Warehouse',
      auth: true,
      translation: 'Мой склад',
      type: 'View'
    }
  },
  {
    path: '/view-warehouse/:itemId',
    name: 'View-warehouse-item',
    component: () => import('../views/currentView/ViewWarehouseItem.vue'),
    meta: {
      title: 'View Warehouse Item',
      auth: true,
      type: 'CurrentView'
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
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: {
      title: 'Profile',
      auth: true,
      translation: 'Профиль',
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
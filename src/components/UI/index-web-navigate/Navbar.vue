<template>
  <nav style="position: fixed; top: 0; width: 100%">
    <ul style="display: flex">
      <li v-for="(link, index) in navLinks" :key="index">
        <router-link :to="{ path: `${link.path}` }">
          {{ link.title }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "navbar",
  data() {
    return {
      navLinks: [
        {
          title: "Войти",
          path: "/",
        },
        {
          title: "Тарифы",
          path: "/rates",
        },
      ],
    };
  },
};
</script>

<style scoped>
    nav {
        padding: 0;
    }
    nav ul li {
        padding: 0 1rem;
    }
    @media (max-width: 620px) {
        nav ul {
            padding: 0;
        }
    }
</style>

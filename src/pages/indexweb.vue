<template>

    <nav style="display: flex; gap: 1rem; position: fixed; top: 0;">
        <div v-for="(link, index) in navLinks" :key="index">
            <router-link :to="{ path: `${link.path}`}" >

                {{ link.title }}
            </router-link>
        </div>
    </nav>

    <main class="wrapper">
        
        <Logo/>

    </main>

    <copyright/>
</template>
<script>
import Logo from '../views/auth/Logo.vue'

export default {
    name: 'index-web-page',
    components: {

        Logo
    },
    data() {
        return {
            navLinks: [
                {
                    title: 'Войти',
                    path: '/'
                },
                {
                    title: 'Тарифы',
                    path: '/rates'
                }
            ]
        }
    }
}
</script>
<style scoped>
.wrapper {
    max-width: 1600px;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;
}
@media (min-width: 620px) {
    .wrapper {
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }
    .wrapper div {
        width: 50%
    }
}
</style>
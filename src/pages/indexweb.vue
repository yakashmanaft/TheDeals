<template>
    <div class="wrapper">

        <navbar/>
    
        <main class="wrapper">
            
            <Logo/>
    
        </main>
    
        <copyright/>
    </div>
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

        }
    }
}
</script>
<style scoped>
.wrapper {
    max-width: 100px;
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
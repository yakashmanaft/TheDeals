<template>
    <footer 
        style="position: fixed; bottom: 0; width: 100%; margin-bottom: 2rem;"
    >
        <a href='https://t.me/+79617582573'>
            <!-- <a href='https://t.me/+79526406146'> -->

            @Sergey Anfalov, 2023
        </a>
    </footer>
</template>
<script>
export default {
    name: 'copyright'
}
</script>
<style scoped>
    footer a {
        font-size: 0.9rem;
    }
    @media (max-width: 768px) {
        footer {
            margin-bottom: 1rem!important;
        }
        footer a {
            font-size: 0.7rem;
        }
    }
</style>
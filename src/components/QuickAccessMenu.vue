<!-- Добавление нового заказа -->
<!-- Возможно меню быстрого доступа -->
<!-- А если data из БД === 0, скрывать данный компонент? У нас же при отсутствии данных есть элемента (картинка + кнопка создания, подумайте) -->
<template>
    <div class="fixed w-full bg-transparent h-1 z-20 bottom-0 flex items-end justify-end overflow-visible">
        <component 
            :is="type" :to="to" class="h-14 w-14 mr-5 mb-5 bg-dark flex items-center justify-center shadow-md rounded-full"
        >
            <img class="w-5" src="@/assets/images/common/icon-plus.svg" alt="">
        </component>
    </div>
</template>



<script>

    export default {
        name: "QuickAccessMenu",
        // в рамках Vue2, мигрировать данный код по стандарту Vue 3
        computed: {
            type () {
            if (this.to) {
                return 'router-link'
            }

            return 'button'
            }
        },
        props: {
            to : {
                required: false,
            },
            value: {
                type: String
            }
        }
    }
</script>

<style scoped>

</style>
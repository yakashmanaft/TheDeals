<template>
    <div class="v-select text-blue border-b border-dashed border-blue">
        <p 
            class="title" 
            @click="toggleSelect()"
        >
            {{ selected }}
        </p>
        <div 
            class="options flex flex-col items-center justify-center text-base text-dark-gray" 
            v-if="areOptionsVisible" 
            @click="hideOptionsMenu"
        >
            <div class="bg-white rounded-md py-2 pt-4 w-4/5">
                <p 
                    v-for="option in options" 
                    :key="option.name" 
                    @click.stop="$emit('select', option), toggleSelect()">
                    {{ option.title }}
                </p>
                <p @click="toggleSelect()">Отменить</p>
            </div>
        </div>
    </div>
</template>

<script>
    import { ref } from 'vue';
    // import { store } from '../store/index';

    export default {
        name: 'Search',
        props: {
            options: {
                type: Array,
                default() {
                    return []
                }
            },
            selected: {
                type: String,
                default: '',
            }
        },
        setup() {
            const areOptionsVisible = ref(false);

            // функция сокрытия селектов
            const toggleSelect = () => {
                areOptionsVisible.value = !areOptionsVisible.value
                // store.methods.backgroundFixed()
            }

            // Закрываем options меню по клику вне
            const hideOptionsMenu = (e) => {
                if(e.target.classList.contains('options')) {
                    toggleSelect()
                }
            }

            return {
                areOptionsVisible, toggleSelect, hideOptionsMenu
            }
        }
    }
</script>

<style scoped>
    .v-select {
        position: relative;
        /* width: 100%; */
        cursor: pointer;
    }
    /* Если не пригодится - удалить */
    .title {
        /* border: 1px solid #838383; */
    }
    .options {
        /* border: 1px solid #838383; */
        position: fixed;
        bottom: 0;
        height: 100vh;
        z-index: 30;
        right: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(2px);
    }
    /* Удалисть если не пригодится */
    /* .options p:hover {
        background: #000;
    } */
    .selectedClass {
        background: #f1f1f1;
    }
</style>
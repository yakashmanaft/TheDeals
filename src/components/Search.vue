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
            <input 
                type="text"
                placeholder="Поиск..."
                v-model="search"
            >
            <div class="bg-white rounded-md py-2 pt-4 w-4/5">
                <!-- <p 
                    v-for="option in options" 
                    :key="option.name" 
                    @click.stop="$emit('select', option), toggleSelect()">
                    {{ option.title }}
                </p> -->
                <p 
                    v-for="option in filteredOptions(options)" 
                    :key="option.name" 
                    @click.stop="$emit('select', option), toggleSelect()">
                    {{ option.title }}
                    
                </p>
                <!-- <p v-if="!arrayToFilter">Ничего не найдено</p> -->
            </div>
        </div>
    </div>
</template>

<script>
    import { ref } from 'vue';
    // import { sortAlphabetically } from '../helpers/sort';
    // import { searchFilter } from '../helpers/filter';
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
            // 
            const search = ref();

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

            //сортируем контакты по алфавиту
            // const sortedList = computed(() => {       
            // return sortAlphabetically(options)
            // });

            // функция поиска
            // const result = ref();
            const filteredOptions = (options) => {

                options.sort((a, b) => {
                    let fa = a.title.toLowerCase(), fb = b.title.toLowerCase();
                    if (fa < fb) {
                    return -1;
                    } 
                    if (fa > fb) {
                    return 1;
                    }
                    return 0;
                })

                return searchFilter(options, search.value)
            };
            // const searchFilter = (arrayToFilter, search) => {
            const searchFilter = (arrayToFilter, search) => {
                // console.log(search)
                console.log(arrayToFilter)
                console.log(search)
                // return arrayToFilter
                return arrayToFilter.filter((option) => {
                    // return result.value = option.title.match(search) 
                    if(search !== undefined){
                        return option.title.toLowerCase().indexOf(search.toLowerCase()) != -1
                    } else {
                        return arrayToFilter
                    }
                    
                })
            }

            return {
                search, areOptionsVisible, toggleSelect, hideOptionsMenu, filteredOptions
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
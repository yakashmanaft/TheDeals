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
                <!-- Header -->
                <div class="w-11/12 px-4 py-4 flex place-content-between items-center bg-white rounded-t-md border-b">
                    <div class="flex items-center">
                        <label for="search-input" class="flex items-center justify-center w-4 h-4">
                            <img class="w-full" src="@/assets/images/common/icon-search.svg" alt="">
                        </label>
                        <input 
                            id="search-input"
                            type="text"
                            placeholder="Поиск..."
                            v-model="search"
                            class="outline-none focus:outline-none ml-2"
                        >
                        
                    </div>
                    <div class="flex items-center justify-center w-4 h-4" @click="toggleSelect()">
                        <img src="@/assets/images/common/icon-close.svg" alt="" class="w-full">
                    </div>
                </div>
            <div class="w-11/12 h-4/5 bg-white rounded-b-md overflow-y-auto">
                <!-- Список -->
                <div class="px-4 pb-4 pt-2 w-11/12">
                    <!-- <p 
                        v-for="option in options" 
                        :key="option.name" 
                        @click.stop="$emit('select', option), toggleSelect()">
                        {{ option.title }}
                    </p> -->
                    <p 
                        v-for="option in filteredOptions(options)" 
                        :key="option.name" 
                        @click.stop="$emit('select', option), toggleSelect()"
                        class="mt-1"    
                    >
                        {{ option.title }}
                        
                    </p>
                    <!-- <p>Ничего не найдено</p> -->
                </div>

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

            // функция поиска сортировки по алфавиту
            const filteredOptions = (options) => {
                // Сортируем по алфавиту
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
            const searchFilter = (arrayToFilter, search) => {
                // console.log(arrayToFilter)
                // console.log(search)
                return arrayToFilter.filter((option) => {
                    // Удалить если не понадобится
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
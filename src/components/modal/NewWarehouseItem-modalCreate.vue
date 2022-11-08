<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="closeThisModal">Отменить</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Новый</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('createItem', itemData)">Готово</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding" forceOverscroll="false">
            <!-- ============================= Основные данные ===================================== -->
            {{ itemData }}

            <!-- Название предмета  -->
            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4>Название</h4>
                </ion-text>
                <!--  -->
                <ion-input
                    type="text"
                    v-model="itemName"
                    placeholder="Укажите название предмета"
                ></ion-input>
            </ion-item-group>

            <!-- Каталожный номер -->
            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4>Каталожный номер (Артикул)</h4>
                </ion-text>
                <!--  -->
                <ion-input
                    type="text"
                    v-model="catalogNumber"
                    placeholder="Укажите каталожный номер"
                ></ion-input>
            </ion-item-group>

            <!-- Кол-во -->
            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4>Кол-во</h4>
                </ion-text>
                <!--  -->
                <ion-grid class="ion-no-padding">
                    <ion-row class="ion-align-items-center">
                        <!-- Substract -->
                        <ion-icon :icon="removeCircleOutline" class="countQty_button" :color="itemData.subjectQty > 1 ? 'primary' : 'light'" @click="changeSubjectQty('sub')"></ion-icon>
                        <!-- Qty -->
                        <ion-text class="ion-margin-horizontal countQty_count" color="primary">{{ itemData.subjectQty }}</ion-text>
                        <!-- Add -->
                        <ion-icon :icon="addCircleOutline" class="countQty_button" color="primary" @click="changeSubjectQty('add')"></ion-icon>
                    </ion-row>
                </ion-grid>
            </ion-item-group>

            <!-- Категория предмета -->
            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4>Категории предмета</h4>
                </ion-text>
                <!--  -->
                <ion-grid class="ion-no-padding">
                    <!-- Добавленная категория -->
                    <ion-chip class="ion-no-margin ion-margin-top ion-margin-end" color="primary" style="position: relative; overflow: visible">Кузов
                        <!-- Кнопка удалить выбранную категорию у предмета -->
                        <ion-icon :icon="closeCircleOutline" style="position: absolute; right: -0.2rem; top: 0;" color="medium"></ion-icon>
                    </ion-chip>

                    <!-- Добавленная категория -->
                    <ion-chip class="ion-no-margin ion-margin-top ion-margin-end" color="primary" style="position: relative; overflow: visible">Электрика
                        <!-- Кнопка удалить выбранную категорию у предмета -->
                        <ion-icon :icon="closeCircleOutline" style="position: absolute; right: -0.2rem; top: 0;" color="medium"></ion-icon>
                    </ion-chip>

                    <!-- Добавленная категория -->
                    <ion-chip class="ion-no-margin ion-margin-top ion-margin-end" color="primary" style="position: relative; overflow: visible">Трансмиссия
                        <!-- Кнопка удалить выбранную категорию у предмета -->
                        <ion-icon :icon="closeCircleOutline" style="position: absolute; right: -0.2rem; top: 0;" color="medium"></ion-icon>
                    </ion-chip>

                    <!-- Добавленная категория -->
                    <ion-chip class="ion-no-margin ion-margin-top ion-margin-end" color="primary" style="position: relative; overflow: visible">Салон
                        <!-- Кнопка удалить выбранную категорию у предмета -->
                        <ion-icon :icon="closeCircleOutline" style="position: absolute; right: -0.2rem; top: 0;" color="medium"></ion-icon>
                    </ion-chip>

                    <!-- Добавленная категория -->
                    <ion-chip class="ion-no-margin ion-margin-top ion-margin-end" color="primary" style="position: relative; overflow: visible">Пластик
                        <!-- Кнопка удалить выбранную категорию у предмета -->
                        <ion-icon :icon="closeCircleOutline" style="position: absolute; right: -0.2rem; top: 0;" color="medium"></ion-icon>
                    </ion-chip>

                    <!-- Кнопка добавить категорию -->
                    <ion-chip class="ion-no-margin ion-margin-top ion-margin-end" color="primary" outline="true" @click.stop="searchWarehouseCategoriesMenu = true">Добавить</ion-chip>

                </ion-grid>
            </ion-item-group>

            <!-- Модалка по выбору / поиску категорий  -->
            <ion-modal :isOpen="searchWarehouseCategoriesMenu">
                <ion-searchbar
                    class="ion-text-left"
                    placeholder="Поиск..."
                    v-model="searchWarehouseCategories"
                    show-cancel-button="always"
                    cancelButtonText="Отменить"
                    @ionCancel="searchWarehouseCategoriesMenu = false"    
                ></ion-searchbar>
                <!--  -->
                <ion-content style="height: 90vh" class="ion-padding-horizontal">
                    <!-- Если есть данные -->

                    <!-- Если ничего подходящего нет или нет данных -->
                    <div v-if="searchWarehouseCategories.length <= 0" class="ion-margin-top">
                        <ion-grid class="ion-no-padding">
                            <ion-row class="ion-justify-content-between ion-align-items-center">
                                <ion-text color="medium">
                                    Ничего не найдено
                                </ion-text>
                                <ion-text color="primary" @click="addNewCategory">
                                    Добавить
                                </ion-text>
                            </ion-row>
                        </ion-grid>
                    </div>
                </ion-content>
            </ion-modal>
        </ion-content>
    </ion-modal>
</template>

<script>
import { defineComponent, ref, watch, watchEffect  } from "vue";
import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonInput, IonGrid, IonRow, IonIcon, IonChip } from "@ionic/vue";
import { removeCircleOutline, addCircleOutline, closeCircleOutline } from 'ionicons/icons'

    export default defineComponent({
        name: 'CreateItem',
        emites: ['closeModal'],
        props: {
            itemData: Object
        }, 
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonInput, IonGrid, IonRow, IonIcon, IonChip
        }, 
        setup (props, { emit }) {
            //
            const itemData = ref();
            const itemName = ref('')
            const catalogNumber = ref();
            //
            watch(itemName, () => {
                itemData.value.name = itemName.value
            })
            //
            watch(catalogNumber, () => {
                itemData.value.catalogNumber = catalogNumber.value
            })
            //
            const closeThisModal = () => {
                emit('closeModal', 
                    itemName.value = '',
                    catalogNumber.value = ''
                )
            }
            //
            // const countSubjectQtyButtonColor = ref('primary')
            const changeSubjectQty = (action) => {
                if(action === 'sub' && itemData.value.subjectQty > 1) {
                    itemData.value.subjectQty--
                } else if (action === 'add') {
                    itemData.value.subjectQty++
                }
            }
            //
            const searchWarehouseCategoriesMenu = ref(false)
            const searchWarehouseCategories = ref('')
            //
            const addNewCategory = () => {
                alert('NewWarehouseItem-modalCreate: функционал в разработке (addNewCategory)')
            }
            //
            watchEffect(() => {
                itemData.value = props.itemData
            }) 

            return {
                itemData, itemName, catalogNumber, closeThisModal, removeCircleOutline, addCircleOutline, changeSubjectQty, closeCircleOutline, searchWarehouseCategoriesMenu, searchWarehouseCategories, addNewCategory
            }
        }
    })
</script>

<style scoped>
    .countQty_button {
        font-size: 32px;
    }
    .countQty_count {
        font-size: 24px;
    }
</style>
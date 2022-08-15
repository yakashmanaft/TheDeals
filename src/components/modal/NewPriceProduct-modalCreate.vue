<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Отменить</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Новый</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('addPriceProduct', newProductData)">Добавить</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <!-- ============================= Основные данные ===================================== -->
            <ion-item-group>
                {{newProductData}}
                <!-- Заголовок -->
                <ion-text>
                    <h4>Продукт</h4>
                </ion-text>
                <!-- Показываем выбранный продукт -->
                <ion-grid class="ion-no-padding">
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <!-- Кнопка выбора предмета дела -->
                        <ion-button color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="searchProductMenu = true">
                            {{ showSelectedProduct(newProductData.value) }}
                        </ion-button>
                        <!-- Если уже указан предмет -->
                        <ion-thumbnail v-if="newProductData.value !== ''" class="thumbnail_deal-subject">
                            <!-- Если тип дела Продажа -->
                            <ion-img  :src="`../img/subjects/sale/${newProductData.value}.webp`"></ion-img>
                        </ion-thumbnail>
                        <!-- Если предмет не указан -->
                        <ion-thumbnail v-else class="thumbnail_deal-subject">
                            <ion-icon style="height: 100%; width: 100%;" color="medium" :icon="helpOutline"></ion-icon>
                        </ion-thumbnail>
                    </ion-row>
                </ion-grid>
                <!-- Модалка для выбора (Поиск продукта в прайс) -->
                <ion-modal :is-open="searchProductMenu">
                    <ion-searchbar class="ion-text-left" placeholder="Поиск..." v-model="searchSelectedProduct" show-cancel-button="always" cancelButtonText="Отменить" @ionCancel="searchProductMenu = false" >
                    </ion-searchbar>
                    <ion-content style="height: 90vh">
                        <ion-item v-for="product in searchedProduct" :key="product.id" @click="chooseProduct(product)">
                            {{ product.name }}
                        </ion-item>
                        <!-- Если ничего подходящего нет -->
                        <div v-if="searchedProduct.length <= 0">
                            <ion-item lines="none">
                                <ion-text color="medium">
                                    Ничего не найдено
                                </ion-text>
                            </ion-item>
                            <br>
                            <br>
                            <ion-item lines="none">
                                <ion-text class="ion-padding-horizontal">
                                    Если вы хотите добавить продукт, которого не нет в списке - напишите нам :) www...
                                </ion-text>
                            </ion-item>
                        </div>
                    </ion-content>
                </ion-modal>
            </ion-item-group>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, watchEffect, computed } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonThumbnail, IonImg, IonIcon, IonSearchbar, IonItem } from '@ionic/vue';
    import { helpOutline } from 'ionicons/icons';
    //
    import store from '../../store/index';
    //
    import { translateValue } from '@/helpers/translateValue';
    import { sortAlphabetically } from '../../helpers/sortDealSubject';
    import { searchDealSubjectFilter } from '../../helpers/filterDealSubject';
    //
    export default defineComponent({
        name: 'CreatePriceProduct',
        props: {
            newProductData: Object
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonThumbnail, IonImg, IonIcon, IonSearchbar, IonItem
        },
        setup(props, { emit }) {
            //
            const searchProductMenu = ref(false);
            const searchSelectedProduct = ref('');
            const newProductData = ref();
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами предмета ПРОДАЖИ
            const dealSaleSubjectArray = ref(store.state.dealSaleSubjectArray)

            //
            const showSelectedProduct = (selectedProduct) => {
                if(newProductData.value.value !== '') {
                    return translateValue(selectedProduct, dealSaleSubjectArray.value)
                } else {
                    return 'Не выбран'
                }
            }
            //
            const searchedProduct = computed(() => {
                const sortedDealSellSubjectArray = sortAlphabetically(dealSaleSubjectArray.value);
                return searchDealSubjectFilter(sortedDealSellSubjectArray, searchSelectedProduct.value)
            })
            //
            const chooseProduct = (product) => {
                // console.log(product)
                newProductData.value.value = product.value
                newProductData.value.name = product.name
                searchProductMenu.value = false;
            }
            //
            watchEffect(() => {
                newProductData.value = props.newProductData
            })

            return {
                helpOutline, dealSaleSubjectArray, showSelectedProduct, searchSelectedProduct, searchProductMenu, translateValue, searchedProduct, sortAlphabetically, searchDealSubjectFilter, chooseProduct
            }
        }
    })
</script>

<style scoped>
    .relative {
        position: relative;
    }
    .absolute {
        position: absolute;
    }
    .thumbnail_deal-subject {
        height: 64px;
        width: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--ion-color-light);
        border-radius: 50%;
        padding: 0.5rem;
    }
</style>
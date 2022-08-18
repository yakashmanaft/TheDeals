<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal', blockToShow)">Отменить</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Новый</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('addPriceProduct', newProductData)">Добавить</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            {{blockToShow}}
            {{newProductData}}
            <!-- ============================= Основные данные ===================================== -->
            <!-- Выбор что добавляем в прайс: атрибут или продукт -->
            <ion-item-group>
                <!-- Что добавляем -->
                <ion-text>
                    <h4 class="ion-no-margin">Что добавляем?</h4>
                </ion-text>
                <!-- Выбор -->
                <ion-chip>
                    <ion-label>
                        <Select :data="priceChipList" :placeholder="blockToShow" @date-updated="(selected) => blockToShow = selected.currentValue"/>
                    </ion-label>
                </ion-chip>
            </ion-item-group>
            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4 class="ion-no-margin">Продукт</h4>
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
            <!-- Выбор типа расчета и указание цены продукта -->
            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4>Стоимость</h4>
                </ion-text>
                <!--  -->
                <ion-grid class="ion-no-padding ion-margin-top">
                    <!-- Типа расчета цены -->
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <!-- тип расчета -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            Тип расчета
                        </ion-button>
                        <!-- Кнопка изменить тип расчета цены -->
                        <!-- Для products -->
                        <ion-button v-if="blockToShow === 'products'" color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            <Select
                                :data="priceEstimationType" 
                                placeholder="Не указан"
                                @date-updated="(selected) => newProductData.costEstimation = selected.currentValue"
                            />
                        </ion-button>
                        <!-- priceAttributeType -->
                        <!-- Для attributes -->
                        <ion-button v-if="blockToShow === 'attributes'" color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            <Select
                                :data="priceAttributeType" 
                                placeholder="Не указан"
                                @date-updated="(selected) => newProductData.rentType = selected.currentValue"
                            />
                        </ion-button>

                    </ion-row>
                    <!-- Цена -->
                    <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                        <!-- Цена -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            Цена ({{ currency }})
                        </ion-button>
                        <!-- Кнопка показа и изменения цены -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            <ion-input type="number" v-model="newProductData.price" placeholder="0.00" inputmode="decimal" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                        </ion-button>
                    </ion-row>
                </ion-grid>
            </ion-item-group>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, watchEffect, computed, watch } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonThumbnail, IonImg, IonIcon, IonSearchbar, IonItem, IonInput, IonChip, IonLabel } from '@ionic/vue';
    import { helpOutline } from 'ionicons/icons';
    //
    import store from '../../store/index';
    //
    import Select from '../Select.vue';
    //
    import { translateValue } from '@/helpers/translateValue';
    import { sortAlphabetically } from '../../helpers/sortDealSubject';
    import { searchDealSubjectFilter } from '../../helpers/filterDealSubject';
    //
    export default defineComponent({
        name: 'CreatePriceProduct',
        emits: ['blockToShowIsChanged', 'closeModal', 'addPriceProduct'],
        props: {
            newProductData: Object,
            blockToShow: String
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonThumbnail, IonImg, IonIcon, IonSearchbar, IonItem, Select, IonInput, IonChip, IonLabel
        },
        setup(props, { emit }) {
            // priceChipList
            const priceChipList = ref(store.state.priceChipList)
            //
            const blockToShow = ref();
            // Currency
            const currency = ref(store.state.systemCurrency.name);
            //
            const searchProductMenu = ref(false);
            const searchSelectedProduct = ref('');
            const newProductData = ref();
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами предмета ПРОДАЖИ
            const dealSaleSubjectArray = ref(store.state.dealSaleSubjectArray)
            // массив ПОЛЬЗОВТЕЛЯ с вариантами ДОП.АТРИБУТОВ к продукту
            const subjectAttributeArray = ref(store.state.additionalAttributesList)
            //
            const priceEstimationType = ref(store.state.priceEstimataionType)
            //
            const priceAttributeType = ref(store.state.priceAttributeType)
            //
            const showSelectedProduct = (selectedProduct) => {
                if(newProductData.value.value !== '') {
                    if(blockToShow.value === 'products') {
                        return translateValue(selectedProduct, dealSaleSubjectArray.value)
                    } else if (blockToShow.value === 'attributes') {
                        return translateValue(selectedProduct, subjectAttributeArray.value)
                    }
                } else {
                    return 'Не выбран'
                }
            }
            //
            const searchedProduct = computed(() => {
                if (blockToShow.value === 'products') {
                    const sortedDealSellSubjectArray = sortAlphabetically(dealSaleSubjectArray.value);
                    return searchDealSubjectFilter(sortedDealSellSubjectArray, searchSelectedProduct.value)
                } else if (blockToShow.value = 'attributes') {
                    const sortedDealSellSubjectArray = sortAlphabetically(subjectAttributeArray.value);
                    return searchDealSubjectFilter(sortedDealSellSubjectArray, searchSelectedProduct.value)
                }
            })
            //
            const chooseProduct = (product) => {
                newProductData.value.value = product.value
                newProductData.value.name = product.name
                searchProductMenu.value = false;
            }
            //
            watchEffect(() => {
                newProductData.value = props.newProductData
                blockToShow.value = props.blockToShow
            })
            //
            watch(blockToShow, () => {
                // console.log(blockToShow.value)
                emit('blockToShowIsChanged', blockToShow.value)
            })

            return {
                helpOutline, dealSaleSubjectArray, subjectAttributeArray, showSelectedProduct, searchSelectedProduct, searchProductMenu, translateValue, searchedProduct, sortAlphabetically, searchDealSubjectFilter, chooseProduct, priceEstimationType, priceAttributeType, currency, blockToShow, priceChipList
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
    .flex_nowrap {
        flex-wrap: nowrap;
    }
</style>
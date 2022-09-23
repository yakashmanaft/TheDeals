<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal', showBlockName)">Отменить</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Новый</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('addPriceProduct', newProductData)">Добавить</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            {{newProductData}}
            <!-- ============================= Основные данные ===================================== -->
            <!-- Выбор что добавляем в прайс: атрибут или продукт -->
            <ion-item-group>
                <!-- Что добавляем -->
                <ion-text>
                    <h4 class="ion-no-margin ion-margin-bottom">Что добавить в прайс</h4>
                </ion-text>
                <!-- Выбор -->
                <ion-chip color="primary" class="ion-no-margin ion-margin-bottom">
                    <ion-icon :icon="setIconByBlockToShow(showBlockName)"></ion-icon>
                    <ion-label>
                        <Select :data="priceChipList" :placeholder="translateValue(showBlockName, priceChipList)" @date-updated="(selected) => showBlockName = selected.currentValue"/>
                    </ion-label>
                </ion-chip>
            </ion-item-group>
            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4 class="ion-no-margin ion-margin-top">{{setNameByBlockToShow(showBlockName)}}</h4>
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
                        <ion-button v-if="showBlockName === 'products'" color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            <Select
                                :data="priceEstimationType" 
                                placeholder="Не указан"
                                @date-updated="(selected) => newProductData.costEstimation = selected.currentValue"
                            />
                        </ion-button>
                        <!-- priceAttributeType -->
                        <!-- Для attributes -->
                        <ion-button v-if="showBlockName === 'attributes'" color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            <Select
                                :data="priceAttributeType" 
                                placeholder="Не указан"
                                @date-updated="(selected) => rentType = selected.currentValue"
                            />
                        </ion-button>

                    </ion-row>
                    <!-- Цена 1 ед-->
                    <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                        <!-- Цена -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            Цена ({{ currency }})
                        </ion-button>
                        <!-- Кнопка показа и изменения цены -->
                        <!-- <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            <ion-input type="number" v-model="newProductData.price" :value="newProductData.price" placeholder="0" inputmode="decimal" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                        </ion-button> -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            <ion-input type="number" v-model="newProductPrice" :value="newProductData.price" placeholder="0" inputmode="decimal" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                        </ion-button>
                    </ion-row>
                    <!-- Количество -->
                    <ion-row v-if="blockToShow === 'attributes'" class="ion-justify-content-between ion-align-items-center flex_nowrap border-bottom ion-padding-bottom">
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            Количество, шт.
                        </ion-button>
                        <div>
                            <ion-grid class="ion-no-padding">
                                <ion-row class="ion-align-items-center">
                                    <!-- Subtract -->
                                    <ion-icon class="countQty_button" @click="changeQty('sub')" :color="countQtyButtonColor" :icon="removeCircleOutline"></ion-icon>
                                    <!-- Show data -->
                                    <ion-text class="ion-padding-horizontal countQty_count" color="primary">{{setProductQty(newProductData.qty)}}</ion-text>
                                    <!-- Add -->
                                    <ion-icon class="countQty_button" @click="changeQty('add')" color="primary" :icon="addCircleOutline"></ion-icon>
                                </ion-row>
                            </ion-grid>
                        </div>
                    </ion-row>
                    <!-- Сумма -->
                    <ion-row v-if="blockToShow === 'attributes'" class="ion-justify-content-between ion-align-items-center flex_nowrap ion-margin-top">
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            <!-- Сумма ({{ currency }}) -->
                        </ion-button>
                        <div>
                            <ion-button  color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                <ion-text style="font-size: 32px; color: black; font-weight: bold">{{newProductData.totalPrice}}</ion-text>
                            </ion-button>
                            <ion-text color="medium">{{currency}}</ion-text>
                        </div>
                    </ion-row>
                </ion-grid>
            </ion-item-group>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, watchEffect, computed, watch } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonThumbnail, IonImg, IonIcon, IonSearchbar, IonItem, IonInput, IonChip, IonLabel } from '@ionic/vue';
    import { helpOutline, removeCircleOutline, addCircleOutline } from 'ionicons/icons';
    //
    import store from '../../store/index';
    //
    import Select from '../Select.vue';
    //
    import { translateValue } from '@/helpers/translateValue';
    import { sortAlphabetically } from '../../helpers/sortDealSubject';
    import { searchDealSubjectFilter } from '../../helpers/filterDealSubject';
    import { setIconByBlockToShow } from '../../helpers/setIconBy';
    //
    export default defineComponent({
        name: 'CreatePriceProduct',
        emits: ['blockToShowIsChanged', 'closeModal', 'addPriceProduct', 'getNewProductQty', 'getNewProductPrice', 'getRentType'],
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
            const showBlockName = ref();
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
                    if(showBlockName.value === 'products') {
                        return translateValue(selectedProduct, dealSaleSubjectArray.value)
                    } else if (showBlockName.value === 'attributes') {
                        return translateValue(selectedProduct, subjectAttributeArray.value)
                    }
                } else {
                    return 'Не выбран'
                }
            }
            //
            const searchedProduct = computed(() => {
                if (showBlockName.value === 'products') {
                    const sortedDealSellSubjectArray = sortAlphabetically(dealSaleSubjectArray.value);
                    return searchDealSubjectFilter(sortedDealSellSubjectArray, searchSelectedProduct.value)
                } else if (showBlockName.value = 'attributes') {
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
                showBlockName.value = props.blockToShow
            })
            //
            watch(showBlockName, () => {
                // console.log(showBlockName.value)
                
                emit('blockToShowIsChanged', showBlockName.value)
            })
            //
            const setNameByBlockToShow = (blockToShow) => {
                if(blockToShow === 'products') {
                    return 'Продукт'
                } else if (blockToShow === 'attributes') {
                    return 'Атрибут к продукту'
                }
            }
            // функционал управления кнопками добавить / вычесть
            const countQtyButtonColor = ref('primary')
            const changeQty = (action) => {
                if(action === 'sub' && newProductData.value.qty > 1) {
                    // console.log(productQty.value)
                    newProductData.value.qty--
                } else if (action === 'add') {
                    newProductData.value.qty++
                } else if (newProductData.value.qty < 2) {
                    countQtyButtonColor.value = 'light'
                }
                // console.log(action)
            }
            //
            const newProductQty = ref();
            watch(newProductQty, (qty) => {
                emit('getNewProductQty', +qty)
                // раскрашиваем кнопки counter
                if(qty < 2) {
                    countQtyButtonColor.value = 'light'
                } else {
                    countQtyButtonColor.value = 'primary'
                }
            })
            const setProductQty = (qty) => {
                newProductQty.value = qty;
                return newProductQty.value
            }
            //
            const newProductPrice = ref()
            // console.log(newProductData.value.price)
            watch(newProductPrice, (price) => {
                // console.log(price)
                newProductPrice.value = price
                emit('getNewProductPrice', +price)
            })
            //
            const rentType = ref()
            watch(rentType, (type) => {
                //console.log(type)
                emit('getRentType', type)
            })

            return {
                helpOutline, dealSaleSubjectArray, subjectAttributeArray, showSelectedProduct, searchSelectedProduct, searchProductMenu, translateValue, searchedProduct, sortAlphabetically, searchDealSubjectFilter, chooseProduct, priceEstimationType, priceAttributeType, currency, showBlockName, priceChipList, setIconByBlockToShow, setNameByBlockToShow, changeQty, countQtyButtonColor, removeCircleOutline, addCircleOutline, setProductQty, newProductPrice, rentType
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
    .countQty_count {
        font-size: 24px;
    }
    .countQty_button {
        font-size: 32px;
    }
    .border-bottom {
        border-bottom: 1px solid var(--ion-color-light);
    }
</style>
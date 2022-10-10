<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Закрыть</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Просмотр</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding" forceOverscroll="false">
            {{productData}}
            <!-- Вариант типа выбранного блока -->
            <ion-item-group class="ion-margin-bottom">
                <ion-grid class="ion-no-padding">
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <ion-chip color="primary" class="ion-no-margin">
                            <ion-icon :icon="setIconByBlockToShow(blockToShow)"></ion-icon>
                            <ion-label>{{translateValue(blockToShow, priceChipList)}}</ion-label>
                        </ion-chip>
                        <!--  -->
                        <ion-button v-if="blockToShow === 'attributes' && productData.rentType === 'rent' && mode === 'sale'" color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                        <Select
                            :data="rentTypeInfo" 
                            :placeholder="translateValue(productData.isReturned, rentTypeInfo)"
                            @date-updated="(selected) => showIsReturned = selected.currentValue"
                        />
                        </ion-button>
                    </ion-row>
                </ion-grid>
            </ion-item-group>
            <!-- ============================= Добавленный продукт ===================================== -->
            <ion-item-group class="border-bottom ion-padding-bottom">
                <!-- Заголовок -->
                <ion-text>
                    <h4 class="ion-no-margin">{{setNameByBlockToShow(blockToShow)}}</h4>
                </ion-text>
                <!-- Показываем текущий продукт -->
                <ion-grid class="ion-no-padding">
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <!-- Название текущего продукта -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            {{ productData.name }}
                        </ion-button>
                        <!-- Иконка к текущему предмету -->
                        <ion-thumbnail v-if="productData.value !== ''" class="thumbnail_deal-subject">
                            <ion-img :src="`../img/subjects/sale/${productData.value}.webp`"></ion-img>
                        </ion-thumbnail>
                    </ion-row>
                </ion-grid>
            </ion-item-group>
            <!-- ================================ Тип расчета и цена для расчетов ========================================= -->
            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4>Стоимость</h4>
                </ion-text>
                <ion-grid class="ion-no-padding ion-margin-top">
                    <!-- Тип расчета цена -->
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <!-- Тип расчета -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            Тип расчета
                        </ion-button>
                        <!-- Кнопка изменить тип расчета -->
                        <!-- Для products -->
                        <ion-button v-if="blockToShow === 'products'" color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            <Select
                                :data="priceEstimationType" 
                                :placeholder="priceCalcType(productData.costEstimation)"
                                @date-updated="(selected) => productData.costEstimation = selected.currentValue"
                            />
                        </ion-button>
                        <!-- Для attributes -->
                        <ion-button v-if="blockToShow === 'attributes'" color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            <Select
                                :data="priceAttributeType" 
                                :placeholder="priceCalcType(productData.rentType)"
                                @date-updated="(selected) => rentType = selected.currentValue"
                            />
                        </ion-button>
                    </ion-row>
                    <!-- Цена на 1ед -->
                    <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                        <!-- Цена -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            Цена 1 ед. ({{ currency }})
                        </ion-button>
                        <!-- Кнопка показа и изменения цены -->
                        <!-- для products -->
                        <ion-button v-if="blockToShow === 'products'" color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            <ion-input type="number" v-model="productPrice" inputmode="decimal" :value="productData.price" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                        </ion-button>
                        <!-- для attributes -->
                        <ion-button v-if="blockToShow === 'attributes'" color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            <ion-input type="number" v-model="productPrice" inputmode="decimal" :value="productData.price" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
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
                                    <ion-text class="ion-padding-horizontal countQty_count" color="primary">{{ setProductQty(productData.qty) }}</ion-text>
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
                                <ion-text style="font-size: 32px; color: black; font-weight: bold">{{productData.totalPrice}}</ion-text>
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
    import { defineComponent, onMounted, ref, watch, watchEffect } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonThumbnail, IonImg, IonInput, IonChip, IonLabel, IonIcon } from '@ionic/vue';
    //
    import { removeCircleOutline, addCircleOutline } from 'ionicons/icons';
    //
    import Select from '../Select.vue';
    //
    import store from '../../store/index';
    //
    import { setIconByBlockToShow } from '../../helpers/setIconBy';
    import { translateValue } from '@/helpers/translateValue';
    //
    export default defineComponent({
        name: 'ViewPriceProduct',
        emits: ['getCostEstimation', 'getProductPrice', 'getProductQty', 'getRentType', 'closeModal', 'getIsReturned'],
        props: {
            productData: Object,
            blockToShow: String,
            mode: String,
            currentProductPrice: Number
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonThumbnail, IonImg, Select, IonInput, IonChip, IonLabel, IonIcon
        },
        setup(props, { emit }) {
            // priceChipList
            const priceChipList = ref(store.state.priceChipList)
            // Currency
            const currency = ref(store.state.systemCurrency.name);
            //
            const productData = ref({});
            const costEstimation = ref();
            const productPrice = ref();
            const productQty = ref();
            const productTotalPrice = ref();
            const rentType = ref();
            //
            const priceEstimationType = ref(store.state.priceEstimataionType)
            const priceAttributeType = ref(store.state.priceAttributeType)
            // Переводчик типа расчета цены
            const priceCalcType = (type) => {
                if (type === 'perKilogram') {
                    return 'Цена за 1кг.'
                } else if (type === 'perUnit') {
                    return 'Цена за 1шт.'
                } else if (type === 'per100gram') {
                    return 'Цена за 100г.'
                } else if (type === 'sale') {
                    return 'Продажа'
                } else if (type === 'rent') {
                    return 'Аренда'
                }
            }
            //
            watchEffect(() => {
                productData.value = props.productData;
                productPrice.value = props.currentProductPrice
            });
            // следим за изменениями значения costEstimation, price, rentType у текущего предмета в прайсе и emit наверх
            watch (costEstimation, (costEstimationType) => {
                emit('getCostEstimation', costEstimationType)
            })
            //
            watch(productPrice, (price) => {
                console.log(productPrice.value)
                emit('getProductPrice', +price)
            })
            //
            watch(productQty, (qty) => {
                // console.log(qty)
                emit('getProductQty', +qty)
                // раскрашиваем кнопки counter
                if(qty < 2) {
                    countQtyButtonColor.value = 'light'
                } else {
                    countQtyButtonColor.value = 'primary'
                }
            })
            watch(rentType, (type) => {
                // console.log(type)
                emit('getRentType', type)
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
                if(action === 'sub' && productQty.value > 1) {
                    // console.log(productQty.value)
                    productQty.value--
                } else if (action === 'add') {
                    productQty.value++
                }
            }
            // подтягиваем данные из props в управляющую переменную productQty
            const setProductQty = (qty) => {
                productQty.value = qty
                return productQty.value
            } 
            // данные по возвратной позиции для select
            const rentTypeInfo = ref(store.state.rentTypeInfo);
            //
            const showIsReturned = ref();
            //productData.isReturned
            watch(showIsReturned, (value) => {
                emit('getIsReturned', value)
            })
            
            return {
                productData, priceEstimationType, priceAttributeType, priceCalcType, costEstimation, rentType, currency, productPrice, productQty, productTotalPrice, setIconByBlockToShow, translateValue, priceChipList, setNameByBlockToShow, changeQty, setProductQty, removeCircleOutline, addCircleOutline, countQtyButtonColor, rentTypeInfo, showIsReturned
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
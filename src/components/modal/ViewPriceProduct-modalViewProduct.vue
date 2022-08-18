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
        <ion-content class="ion-padding">
            <!-- Вариант типа выбранного блока -->
            <ion-item-group class="ion-margin-bottom">
                <ion-chip color="primary" class="ion-no-margin ion-margin-bottom">
                    <ion-icon :icon="setIconByBlockToShow(blockToShow)"></ion-icon>
                    <ion-label>{{translateValue(blockToShow, priceChipList)}}</ion-label>
                </ion-chip>
            </ion-item-group>
            <!-- ============================= Добавленный продукт ===================================== -->
            <ion-item-group>
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
                                @date-updated="(selected) => costEstimation = selected.currentValue"
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
                    <!-- Стоимость -->
                    <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                        <!-- Цена -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            Цена ({{ currency }})
                        </ion-button>
                        <!-- Кнопка показа и изменения цены -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            <ion-input type="number" v-model="productPrice" inputmode="decimal" :value="productData.price" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                        </ion-button>
                    </ion-row>
                </ion-grid>
            </ion-item-group>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, watch, watchEffect } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonThumbnail, IonImg, IonInput, IonChip, IonLabel, IonIcon } from '@ionic/vue';
    //
    import {  } from 'ionicons/icons';
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
        emits: ['getCostEstimation', 'getProductPrice', 'getRentType', 'closeModal'],
        props: {
            productData: Object,
            blockToShow: String
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
            });
            // следим за изменениями значения costEstimation, price, rentType у текущего предмета в прайсе и emit наверх
            watch (costEstimation, (costEstimationType) => {
                emit('getCostEstimation', costEstimationType)
            })
            watch(productPrice, (price) => {
                // console.log(price)
                emit('getProductPrice', price)
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

            return {
                productData, priceEstimationType, priceAttributeType, priceCalcType, costEstimation, rentType, currency, productPrice, setIconByBlockToShow, translateValue, priceChipList, setNameByBlockToShow
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
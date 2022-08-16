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
            <!-- ============================= Добавленный продукт ===================================== -->
            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4 class="ion-no-margin">Продукт</h4>
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
                        <!-- Кнопка изменить тип расчета цены -->
                        <ion-button color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                <Select
                                    :data="priceEstimationType" 
                                    :placeholder="priceCalcType(productData.costEstimation)"
                                    @date-updated="(selected) => costEstimation = selected.currentValue"
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
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonThumbnail, IonImg, IonInput } from '@ionic/vue';
    //
    import Select from '../Select.vue';
    //
    import store from '../../store/index';
    //
    export default defineComponent({
        name: 'ViewPriceProduct',
        emits: ['getCostEstimation', 'getProductPrice', 'closeModal'],
        props: {
            productData: Object
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonThumbnail, IonImg, Select, IonInput
        },
        setup(props, { emit }) {
            // Currency
            const currency = ref(store.state.systemCurrency.name);
            //
            const productData = ref({});
            const costEstimation = ref();
            const productPrice = ref();
            //
            const priceEstimationType = ref(store.state.priceEstimataionType)
            // Переводчик типа расчета цены
            const priceCalcType = (type) => {
                if (type === 'perKilogram') {
                    return 'Цена за кг.'
                } else if (type === 'perUnit') {
                    return 'Цена за шт.'
                }
            }
            //
            watchEffect(() => {
                productData.value = props.productData;
            });
            // следим за изменениями значения costEstimation у текущего продукта в прайсе и emit наверх
            watch (costEstimation, (costEstimationType) => {
                emit('getCostEstimation', costEstimationType)
            })
            watch(productPrice, (price) => {
                console.log(price)
                emit('getProductPrice', price)
            })

            return {
                productData, priceEstimationType, priceCalcType, costEstimation, currency, productPrice
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
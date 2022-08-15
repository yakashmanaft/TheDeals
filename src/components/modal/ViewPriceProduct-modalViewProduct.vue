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
                {{productData}}
                <!-- Заголовок -->
                <ion-text>
                    <h4 class="ion-no-margin ion-margin-top">Продукт</h4>
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
                            Типа расчета
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
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <!-- Цена -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            Цена
                        </ion-button>
                        <!-- Кнопка показа и изменения цены -->
                        <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            <ion-text color="primary">
                                {{productData.price}} {{ currency }}
                            </ion-text>
                        </ion-button>
                    </ion-row>
                </ion-grid>
            </ion-item-group>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, watch, watchEffect } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonThumbnail, IonImg } from '@ionic/vue';
    //
    import Select from '../Select.vue';
    //
    import store from '../../store/index';
    //
    export default defineComponent({
        name: 'ViewPriceProduct',
        emits: ['getCostEstimation', 'closeModal'],
        props: {
            productData: Object
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonGrid, IonRow, IonThumbnail, IonImg, Select
        },
        setup(props, { emit }) {
            // Currency
            const currency = ref(store.state.systemCurrency.name);
            //
            const productData = ref({});
            const costEstimation = ref();
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

            return {
                productData, priceEstimationType, priceCalcType, costEstimation, currency
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
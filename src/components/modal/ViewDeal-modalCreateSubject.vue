<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Отменить</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Новый предмет</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('createSubject', subjectData)">Добавить</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            {{currentDealType}}
            {{subjectData}}
            <!-- Выбор предмета к делу -->
            <ion-item-group>
                <!-- заголовок -->
                <ion-text>
                    <h4>Предмет дела</h4>
                </ion-text>
                <!-- Показываем выбранный предмет по делу -->
                <!-- Это подходит и для ЗАКУПОК -->
                <ion-grid class="ion-no-padding">
                    <ion-row class="ion-justify-content-between ion-align-items-center">
                        <!-- Кнопка выбора предмета дела -->
                        <ion-button color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="searchSubjectMenu = true">
                            {{ showSelectedProduct(subjectData.selectedProduct) }}
                        </ion-button>
                        <!-- Если уже указан предмет -->
                        <ion-thumbnail v-if="subjectData.selectedProduct !== ''" class="thumbnail_deal-subject">
                            <ion-img :src="`../img/subjects/sale/${subjectData.selectedProduct}.webp`"></ion-img>
                        </ion-thumbnail>
                        <!-- Если предмет не указан -->
                        <ion-thumbnail v-else class="thumbnail_deal-subject">
                            <ion-icon style="height: 100%; width: 100%;" color="medium" :icon="helpOutline"></ion-icon>
                        </ion-thumbnail>
                    </ion-row>
                </ion-grid>
                <!-- модалка для выбора (Поиск предмета к делу) -->
                <ion-modal :isOpen="searchSubjectMenu">
                    <ion-searchbar class="ion-text-left" placeholder="Поиск..." v-model="searchSelectedProduct" show-cancel-button="always" cancelButtonText="Отменить" @ionCancel="searchSubjectMenu = false"></ion-searchbar>
                    <ion-content style="height: 90vh">
                        <ion-item v-for="subject in searchedSubject" :key="subject.id" @click="choose(subject)">
                            {{ subject.name }}
                        </ion-item>
                        <!-- Если ничего подхлдящего нет, создать свое надо -->
                        <ion-item lines="none" v-if="searchedSubject.length <= 0">
                            <ion-text>
                                Ничего не найдено
                            </ion-text>
                            <ion-text color="primary">
                                Вы можете создать новый предмет (В разработке)
                            </ion-text>
                        </ion-item>
                    </ion-content>
                </ion-modal>
            </ion-item-group>
            <!-- ================  Показываем в зависимости от выбранного типа дела ==============-->
            <!--  -->
            <ion-item-group v-if="currentDealType === 'sale'" class="ion-text-left">
                <!-- Это указываем рецепт предмета -->
                <p>Выберите рецепт предмета</p>
                <input type="text" v-model="subjectData.recipe">
            </ion-item-group>
            <!--  -->
            <ion-item-group v-if="currentDealType === 'buy'">
                Это добавление предмета для Закупа
                <input type="text" v-model="subjectData.selectedProduct"/>
                <textarea name="" id="" cols="30" rows="10" v-model="subjectData.productNote"></textarea>
            </ion-item-group>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, computed, watchEffect } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonImg, IonThumbnail, IonIcon, IonGrid, IonRow, IonSearchbar, IonItem } from '@ionic/vue';
    import { helpOutline } from 'ionicons/icons';
    //
    import SelectDealSubject from '../Select-DealSubject.vue';
    //
    import { searchFilter } from '../../helpers/filterDealSubject';
    //
    export default defineComponent({
        name: 'CreateDealSubject',
        emits: ['closeModal', 'createSubject'],
        props: {
            subjectData: Object,
            currentDealType: String
        },
        components: {
            IonModal,
            IonHeader,
            IonToolbar,
            IonButtons,
            IonButton,
            IonTitle,
            IonContent,
            IonItemGroup,
            IonText,
            SelectDealSubject,
            IonImg, 
            IonThumbnail,
            IonIcon, 
            IonGrid,
            IonRow,
            IonSearchbar,
            IonItem
        },
        setup(props, {emit}) {
            const dealSaleSubjectArray = ref([
                {
                    value: 'cake',
                    name: 'Торт',
                    costEstimation: 'perKilogram'
                },
                {
                    value: 'wedding-cake',
                    name: 'Свадебный торт',
                    costEstimation: 'perKilogram'
                },
                {
                    value: 'cupcake',
                    name: 'Капкейк',
                    costEstimation: 'perUnit'
                },
                {
                    value: 'meringue-roll',
                    name: 'Меренговый рулет',
                    costEstimation: 'perUnit'
                },
                {
                    value: 'brownies',
                    name: 'Брауни',
                    costEstimation: 'perUnit'
                },
                {
                    value: 'meringue',
                    name: 'Меренге (Безе)',
                    costEstimation: 'perUnit'
                },
                {
                    value: 'pavlova',
                    name: 'Павлова',
                    costEstimation: 'perUnit'
                },
                {
                    value: 'cake-pop',
                    name: 'Кейк-попсы',
                    costEstimation: 'perUnit'
                },
                {
                    value: 'cake-eskimos',
                    name: 'Эскимошки',
                    costEstimation: 'perUnit'
                }
            ])
            //
            const subjectData = ref();
            const currentDealType = ref();
            //
            const showSelectedProduct = (selectedProduct) => {
                if(subjectData.value.selectedProduct !== '') {
                    // Если currentDealType - Продажи
                    if(currentDealType.value = 'sale') {
                        return translatePlaceholder(selectedProduct, dealSaleSubjectArray.value)
                        // return selectedProduct
                    }
                    // Если currentDealType - Закупки
                    //
                } else {
                    return 'Не выбран'
                }
            }

            const searchSubjectMenu = ref(false);
            const searchSelectedProduct = ref('');

            
            // Переводчик placeholder
            // Еслит надо переиспользовать
            // А если будет слишком много данных? Мы же каждый раз их обходим циклом...
            const translatePlaceholder = (value, array) => {
                let currentName = ''
                array.forEach(item => {
                    if(item.value === value) {
                        currentName = item.name
                        return currentName
                    }
                })
                return currentName
            }


            watchEffect(() => {
                subjectData.value = props.subjectData;
                currentDealType.value = props.currentDealType

            })
            // 
            const searchedSubject = computed(() => {
                return searchFilter(dealSaleSubjectArray.value, searchSelectedProduct.value)
            }) 

            // Задаем из выбранному списка значение для selectedProduct
            const choose = (subject) => {
                subjectData.value.selectedProduct = subject.value
                searchSubjectMenu.value = false
                console.log(subject)
            }

            return {
                dealSaleSubjectArray, helpOutline, showSelectedProduct, searchSubjectMenu, searchSelectedProduct, currentDealType, translatePlaceholder, searchedSubject, choose
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
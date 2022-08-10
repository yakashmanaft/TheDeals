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
                            <!-- Если тип дела Продажа -->
                            <ion-img v-if="currentDealType === 'sale'" :src="`../img/subjects/sale/${subjectData.selectedProduct}.webp`"></ion-img>
                            <!-- Если тип дела Закупка -->
                            <ion-img v-if="currentDealType === 'buy'" :src="`../img/subjects/buy/${subjectData.selectedProduct}.webp`"></ion-img>
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
    import { sortAlphabetically } from '../../helpers/sortDealSubject'
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
            // массив с вариантами предмета ПРОДАЖИ
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
            // массив с вариантами предмета ЗАКУПКИ
            const dealBuySubjectArray = ref([
                {
                    value: 'sugar',
                    name: 'Сахар',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'cottage-cheese',
                    name: 'Сливочный творожный сыр',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'sugar-powder',
                    name: 'Сахарная пудра',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'nuts',
                    name: 'Орехи',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'egg',
                    name: 'Яйцо',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'flour',
                    name: 'Мука',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'cocoa',
                    name: 'Какао',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'corn-starch',
                    name: 'Кукурузный крахмал',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'salt',
                    name: 'Соль',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'vanilla',
                    name: 'Ваниль',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'sour-cream',
                    name: 'Сметана',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'banana',
                    name: 'Банан',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'baking-soda',
                    name: 'Пищевая сода',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'vanilla-extract',
                    name: 'Ванильный экстракт',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'cream',
                    name: 'Сливки',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'gouda-cheese',
                    name: 'Сыр гауда',
                    // costEstimation: 'perKilogram'
                },
                {
                    value: 'lemon-juice',
                    name: 'Сок лимона',
                    // costEstimation: 'perKilogram'
                },
            ])
            //
            const subjectData = ref();
            const currentDealType = ref();
            //
            const showSelectedProduct = (selectedProduct) => {
                if(subjectData.value.selectedProduct !== '') {
                    // Если currentDealType - Продажи
                    if(currentDealType.value === 'sale') {
                        return translatePlaceholder(selectedProduct, dealSaleSubjectArray.value)
                    }
                    // Если currentDealType - Закупки
                    else if (currentDealType.value === 'buy') {
                        return translatePlaceholder(selectedProduct, dealBuySubjectArray.value)
                    }
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
            // фильтр для поиска и сортировка по алфавиту списка при выборе предмета дела
            const searchedSubject = computed(() => {
                if(currentDealType.value === 'sale') {
                    const sortedDealSellSubjectArray = sortAlphabetically(dealSaleSubjectArray.value)
                    return searchFilter(sortedDealSellSubjectArray, searchSelectedProduct.value)
                } else if(currentDealType.value === 'buy') {
                    const sortedDealBuySubjectArray = sortAlphabetically(dealBuySubjectArray.value)
                    return searchFilter(sortedDealBuySubjectArray, searchSelectedProduct.value)
                }
            }) 

            // Задаем из выбранному списка значение для selectedProduct
            const choose = (subject) => {
                subjectData.value.selectedProduct = subject.value
                searchSubjectMenu.value = false
                console.log(subject)
            }

            return {
                dealSaleSubjectArray, dealBuySubjectArray, helpOutline, showSelectedProduct, searchSubjectMenu, searchSelectedProduct, currentDealType, translatePlaceholder, searchedSubject, choose
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
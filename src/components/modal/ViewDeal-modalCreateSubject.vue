<template>
    <ion-modal>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>
        <!--  -->
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal'); isAttributesMenuOpened = false">Отменить</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Новый предмет</ion-title>
                <ion-buttons slot="end">
                    <!-- <ion-button @click="$emit('createSubject', subjectData, isAttributesMenuOpened)">Готово</ion-button> -->
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <!--  -->
        <ion-content forceOverscroll="false" style="position: relative">
            {{currentDealType}}
            {{subjectData}}
            <!-- Выбор предмета к делу -->
            <ion-item-group class="ion-padding-horizontal">
                <!-- заголовок -->
                <ion-text>
                    <h4 class="ion-no-margin ion-margin-top">Предмет</h4>
                </ion-text>
                <!-- Показываем выбранный предмет по делу -->
                <ion-grid class="ion-no-padding border-bottom ion-padding-bottom">
                    <ion-row @click="searchSubjectMenu = true" class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap;">
                        <!-- Кнопка выбора предмета дела -->
                        <ion-text color="primary">{{ showSelectedProduct(subjectData.selectedProduct) }}</ion-text>
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
                            <ion-text>
                                {{ subject.name }} 
                                <ion-text color="medium">
                                    ({{ setCostEstimation(subject.costEstimation) }})
                                </ion-text>
                            </ion-text>
                            
                        </ion-item>
                        <!-- Если ничего подхлдящего нет, создать свое надо -->
                        <div v-if="searchedSubject.length <= 0">
                            <ion-item lines="none">
                                <ion-grid class="ion-no-padding">
                                    <ion-row class="ion-justify-content-between ion-align-items-center">
                                        <ion-text color="medium">
                                            Ничего не найдено
                                        </ion-text>
                                        <ion-text color="primary" @click="addNewSubjectToPrice">
                                                Добавить
                                        </ion-text>
                                    </ion-row>
                                </ion-grid>
                            </ion-item>
                        </div>
                    </ion-content>
                </ion-modal>
            </ion-item-group>

            <!-- ================  Показываем в зависимости от выбранного типа дела ==============-->

            <!-- Если ПРОДАЖА -->
            <div v-if="currentDealType === 'sale'">

                <!-- РЕЦЕПТ -->
                <ion-item-group  class="ion-text-left ion-padding-horizontal">
                    <!-- Подбираем рецепт к делу -->
                    <ion-text>
                        <h4>Рецепт</h4>
                    </ion-text>
                    <!-- Кнопка выбора рецепта к предмету -->
                    <ion-grid class="ion-no-padding border-bottom">
                        <ion-button color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="searchRecipeMenu = true">
                            {{ showSelectedRecipe(subjectData.recipe) }}
                        </ion-button>
                    </ion-grid>
                    <!-- Модалка для выбор (Выбор / поиск рецепта для предмета) -->
                    <ion-modal :isOpen="searchRecipeMenu" >
                        <ion-searchbar class="ion-text-left" placeholder="Поиск..." v-model="searchRecipe" show-cancel-button="always" cancelButtonText="Отменить" @ionCancel="searchRecipeMenu = false">
                        </ion-searchbar>
                        <ion-content style="height: 90vh; position: relative;">
                            <!-- Если не хотим указывать рецепт -->
                            <ion-item v-if="searchedRecipe.length > 0" @click="chooseRecipe(noRecipe)">Без рецепта</ion-item>
                            <!-- Выбираем из списка рецептов ПОЛЬЗОВАТЕЛЯ -->
                            <ion-item v-for="recipe in searchedRecipe" :key="recipe.id" @click="chooseRecipe(recipe)">
                                {{ recipe.name }}
                            </ion-item>
                            <!-- Если ничего подходящего нету -->
                            <!-- Создать свой или купить на маркете -->
                            <div v-if="searchedRecipe.length <= 0">
                                <ion-item lines="none">
                                    <ion-grid class="ion-no-padding">
                                        <ion-row class="ion-justify-content-between ion-align-items-center">
                                            <ion-text color="medium">
                                                Ничего не найдено
                                            </ion-text>
                                            <ion-text color="primary" @click="addNewRecipe">
                                                    Добавить
                                            </ion-text>
                                        </ion-row>
                                    </ion-grid>
                                </ion-item>
                                <!-- Если не хотим указывать рецепт -->
                                <!-- <ion-item lines="none" @click="chooseRecipe(noRecipe)">Без рецепта</ion-item> -->
                                <!--  -->
                                <div class="ion-padding-horizontal" style="display: flex; flex-direction: column; position: absolute; top: 40%;">
                                    <ion-text class="ion-text-center">Если вы хотите добавить рецепт, которого нет в вашей книге десертов</ion-text>
                                    <ion-button color="dark" class="ion-margin-top" @click="goToRecipesStore()">Купить в магазине</ion-button>
                                </div>
                            </div>
                        </ion-content>
                    </ion-modal>
                </ion-item-group>

                <!-- Модалка создания нового рецепта -->
                <CreateNewRecipe
                    :is-open="isModalCreateNewRecipeOpened" 
                    @closeModal="setOpen"   
                    @createRecipe="createNew"
                    :recipeData="recipeData"
                />

                <!-- ЦЕНА ПРЕДМЕТА -->
                <ion-item-group class="ion-margin-horizontal ion-padding-bottom border-bottom ion-margin-top">
                    <!-- Заголовок -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-text>
                                <h4 class="ion-no-margin">Стоимость</h4>
                            </ion-text>
                            <ion-text color="medium">
                                {{ subjectData.subjectPrice }} {{ systemCurrency.name }}
                            </ion-text>
                        </ion-row>
                    </ion-grid>
                    <!-- PER KILOGRAM -->
                    <ion-grid v-if="subjectData.costEstimation === 'perKilogram'" class="ion-no-padding">
                        <!-- Цена за 1 кг -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                1 кг. ({{ systemCurrency.name }})
                            </ion-button>
                            <!--  -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                <ion-input type="number" v-model="subjectPrice" inputmode="decimal" :value="subjectData.price" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                            </ion-button>
                        </ion-row>
                        <!-- Кол-во гостей -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Количество гостей, чел
                            </ion-button>
                            <!--  -->
                            <div>
                                <ion-grid class="ion-no-padding">
                                    <ion-row class="ion-align-items-center">
                                        <!-- Subtract -->
                                        <ion-icon class="countQty_button" @click="changePersonQty('sub')" :icon="removeCircleOutline" :color="countPersonQtyButtonColor"></ion-icon>
                                        <!-- Show data -->
                                        <ion-text class="ion-padding-horizontal countQty_count" color="primary">{{ subjectData.personQuantity }}</ion-text>
                                        <!-- Add -->
                                        <ion-icon class="countQty_button" @click="changePersonQty('add')" color="primary" :icon="addCircleOutline"></ion-icon>
                                    </ion-row>
                                </ion-grid>
                            </div>
                        </ion-row>
                        <!-- Вес одной порции -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Вес одной порции (гр.)
                            </ion-button>
                            <!--  -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                <ion-input type="number" v-model="gramPerPerson" inputmode="decimal" :value="subjectData.gramPerPerson" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                            </ion-button>
                        </ion-row>
                        <!-- Кол-во предмета -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Количество предмета, шт
                            </ion-button>
                            <!--  -->
                            <div>
                                <ion-grid class="ion-no-padding">
                                    <ion-row class="ion-align-items-center">
                                        <!-- Subtract -->
                                        <ion-icon class="countQty_button" @click="changeQty('sub')" :icon="removeCircleOutline" :color="countQtyButtonColor"></ion-icon>
                                        <!-- Show data -->
                                        <ion-text class="ion-padding-horizontal countQty_count" color="primary">{{ subjectData.productQuantity }}</ion-text>
                                        <!-- Add -->
                                        <ion-icon class="countQty_button" @click="changeQty('add')" color="primary" :icon="addCircleOutline"></ion-icon>
                                    </ion-row>
                                </ion-grid>
                            </div>
                        </ion-row>
                        <!-- Скидка -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Скидка,{{subjectData.subjectDiscount}} %
                            </ion-button>
                            <!-- Скидка на предмет: (%): {{ subjectData.subjectDiscount }} -->
                            <ion-range 
                                class="ion-no-padding ion-padding-horizontal ion-margin-start" 
                                :min="setDiscountRange('min')" 
                                :max="setDiscountRange('max')" 
                                v-model="subjectDiscount"
                                :value="subjectData.subjectDiscount" 
                                :pin="true" 
                                :ticks="true" 
                                :snaps="false">
                            </ion-range>
                        </ion-row>
                    </ion-grid>
                    <!-- PER 100 GRAM -->
                    <ion-grid v-if="subjectData.costEstimation === 'per100gram'" class="ion-no-padding">
                        <!-- Цена за 100 грамм -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Цена за 100 гр. ({{ systemCurrency.name }})
                            </ion-button>
                            <!--  -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                <ion-input type="number" v-model="subjectPrice" inputmode="decimal" :value="subjectData.price" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                            </ion-button>
                        </ion-row>
                        <!-- Количество раз по 100 грамм -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Количество, шт
                            </ion-button>
                            <!--  -->
                            <div>
                                <ion-grid class="ion-no-padding">
                                    <ion-row class="ion-align-items-center">
                                        <!-- Subtract -->
                                        <ion-icon class="countQty_button" @click="changeQty('sub')" :icon="removeCircleOutline" :color="countQtyButtonColor"></ion-icon>
                                        <!-- Show data -->
                                        <ion-text class="ion-padding-horizontal countQty_count" color="primary">{{ subjectData.productQuantity }}</ion-text>
                                        <!-- Add -->
                                        <ion-icon class="countQty_button" @click="changeQty('add')" color="primary" :icon="addCircleOutline"></ion-icon>
                                    </ion-row>
                                </ion-grid>
                            </div>
                        </ion-row>
                        <!-- Скидка -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Скидка, {{subjectData.subjectDiscount}}%
                            </ion-button>
                            <!-- Скидка на предмет: (%): {{ subjectData.subjectDiscount }} -->
                            <ion-range 
                                class="ion-no-padding ion-padding-horizontal ion-margin-start" 
                                :min="setDiscountRange('min')" 
                                :max="setDiscountRange('max')" 
                                v-model="subjectDiscount"
                                :value="subjectData.subjectDiscount" 
                                :pin="true" 
                                :ticks="true" 
                                :snaps="false">
                            </ion-range>
                        </ion-row>
                    </ion-grid>
                    <!-- PER UNIT -->
                    <ion-grid v-if="subjectData.costEstimation === 'perUnit'" class="ion-no-padding">
                        <!-- Цена за 1 шт -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                1 шт. ({{ systemCurrency.name }})
                            </ion-button>
                            <!--  -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                <ion-input type="number" v-model="subjectPrice" inputmode="decimal" :value="subjectData.price" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                            </ion-button>
                        </ion-row>
                        <!-- Кол-во предмета -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Количество предмета, шт
                            </ion-button>
                            <!--  -->
                            <div>
                                <ion-grid class="ion-no-padding">
                                    <ion-row class="ion-align-items-center">
                                        <!-- Subtract -->
                                        <ion-icon class="countQty_button" @click="changeQty('sub')" :icon="removeCircleOutline" :color="countQtyButtonColor"></ion-icon>
                                        <!-- Show data -->
                                        <ion-text class="ion-padding-horizontal countQty_count" color="primary">{{ subjectData.productQuantity }}</ion-text>
                                        <!-- Add -->
                                        <ion-icon class="countQty_button" @click="changeQty('add')" color="primary" :icon="addCircleOutline"></ion-icon>
                                    </ion-row>
                                </ion-grid>
                            </div>
                        </ion-row>
                        <!-- Скидка -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Скидка, {{subjectData.subjectDiscount}}%
                            </ion-button>
                            <!-- Скидка на предмет: (%): {{ subjectData.subjectDiscount }} -->
                            <ion-range 
                                class="ion-no-padding ion-padding-horizontal ion-margin-start" 
                                :min="setDiscountRange('min')" 
                                :max="setDiscountRange('max')" 
                                v-model="subjectDiscount"
                                :value="subjectData.subjectDiscount" 
                                :pin="true" 
                                :ticks="true" 
                                :snaps="false">
                            </ion-range>
                        </ion-row>
                    </ion-grid>
                </ion-item-group>

                <!-- АТРИБУТЫ -->
                <ion-item-group class="ion-margin-vertical">
                    <!-- Заголовок -->
                    <ion-text>
                        <ion-grid class="ion-no-padding">
                            <ion-row class="ion-align-items-center ion-justify-content-between ion-padding-horizontal">
                                <div>
                                    <h4 class="ion-no-margin">Атрибуты к предмету</h4>
                                    <ion-text color="medium" v-if="subjectData.additionalAttributes.length > 0">{{sumAttributesPriceFunc(subjectData.additionalAttributes)}} {{systemCurrency.name}}</ion-text>
                                </div>
                                <ion-toggle color="success" @ionChange="toggleAttributesMenu"></ion-toggle>
                            </ion-row>
                        </ion-grid>
                    </ion-text>
                    <!--  -->
                    <ion-grid class="ion-no-padding" v-if="isAttributesMenuOpened">
                        <ion-row class="ion-nowrap horizontal-scroll">
                            <!-- Карточки attribute -->
                            <ion-card @click.stop="openCurrentSubjectAttribute(index)" class="ion-padding ion-text-center card-center relative" v-for="(attribute, index) in subjectData.additionalAttributes" :key="attribute.id">
                                <!-- Кнопка удалить конкретный атрибут у предмета -->
                                <ion-icon class="icon_size icon_del absolute" :icon="closeCircleOutline" @click.stop="openDeleteAttributeModal(attribute)"></ion-icon>
                                <!-- attribute img-->
                                <ion-thumbnail class="relative">
                                    <ion-img style="height: 100%" :src="`../img/subjects/sale/${attribute.value}.webp`"></ion-img>
                                </ion-thumbnail>
                                <!--  -->
                                <ion-text class="absolute" style="bottom: -1rem;">х{{attribute.qty}}</ion-text>
                            </ion-card>
                            <!-- Открываем меню создания предмета к делу -->
                            <ion-card class="ion-padding card-center card-add" @click.stop="searchAttributeMenu = true">
                                <ion-icon :icon="addOutline" color="primary" class="icon_size"></ion-icon>
                            </ion-card>

                        </ion-row>
                    </ion-grid>
                    <!-- Всплывашка подтверждение удаления предмета заказа -->
                    <ion-action-sheet
                        :is-open="deleteAttribute"
                        header="Точно удалить?"
                        :buttons="deleteSubjectAttributeButtons"
                        @didDismiss="deleteAttribute = false"
                    >
                    </ion-action-sheet>
                </ion-item-group>

                <!-- ===================================================================== -->
                <!-- модалка просмотра уже добавленного атрибута -->
                <ViewPriceProduct
                    :isOpen="isViewSubjectAttributeOpened"
                    @closeModal="isViewSubjectAttributeOpened = false"
                    :productData="newAttribute"
                    :blockToShow="'attributes'"
                    @getRentType="setAttributeRentType"
                    @getProductPrice="setProductPrice"
                    @getProductQty="setProductQty"
                />

                <!-- Модалка по выбору / поиску атрибутов в прайсе пользователя -->
                <ion-modal :isOpen="searchAttributeMenu">
                    <ion-searchbar class="ion-text-left" placeholder="Поиск..." v-model="searchAdditionalAttributes" show-cancel-button="always" cancelButtonText="Отменить" @ionCancel="searchAttributeMenu = false"></ion-searchbar>
                    <!--  -->
                    <ion-content style="height: 90vh">
                        <ion-item v-for="attribute in searchedAdditionalAttributes" :key="attribute.id" @click="chooseAttribute(attribute)">
                            <ion-grid class="ion-no-padding">
                                <ion-row class="ion-justify-content-between ion-align-items-center">
                                    <ion-text color="primary">
                                        {{ attribute.name }}
                                    </ion-text>
                                    <div class="ion-margin-end">
                                        {{ attribute.totalPrice}} {{ systemCurrency.name }}
                                    </div>
                                </ion-row>
                            </ion-grid>
                        </ion-item>
                        <!-- Если ничего подхлдящего нет, создать свое надо -->
                        <div v-if="searchedAdditionalAttributes.length <= 0">
                            <ion-item lines="none">
                                <ion-grid class="ion-no-padding">
                                    <ion-row class="ion-justify-content-between ion-align-items-center">
                                        <ion-text color="medium">
                                            Ничего не найдено
                                        </ion-text>
                                        <ion-text color="primary" @click="addNewAttrToPrice">
                                            Добавить
                                        </ion-text>
                                    </ion-row>
                                </ion-grid>
                            </ion-item>
                        </div>
                    </ion-content>
                </ion-modal>

            </div>

            <!-- Если ЗАКУПКА -->
            <div v-if="currentDealType === 'buy'" >
                
                <!-- ЦЕНА ПРЕДМЕТА -->
                <ion-item-group class="ion-margin-horizontal ion-padding-bottom ion-margin-top">
                    <!-- Заголовок -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-text>
                                <h4 class="ion-no-margin">Стоимость</h4>
                            </ion-text>
                            <ion-text color="medium">
                                {{ subjectData.subjectPrice }} {{ systemCurrency.name }}
                            </ion-text>
                        </ion-row>
                    </ion-grid>
                    <!-- PER KILOGRAM -->
                    <ion-grid v-if="subjectData.costEstimation === 'perKilogram'" class="ion-no-padding">
                        <!-- Цена за 1 кг -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Цена за 1 кг. ({{ systemCurrency.name }})
                            </ion-button>
                            <!--  -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                <ion-input type="number" v-model="subjectPrice" inputmode="decimal" :value="subjectData.price" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                            </ion-button>
                        </ion-row>
                        <!-- Фактический вес -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Фактический вес (гр.)
                            </ion-button>
                            <!--  -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                <ion-input type="number" v-model="gramPerPerson" inputmode="decimal" :value="subjectData.gramPerPerson" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                            </ion-button>
                        </ion-row>

                    </ion-grid>
                    <!-- PER 100 GRAM -->
                    <ion-grid v-if="subjectData.costEstimation === 'per100gram'" class="ion-no-padding">
                        <!-- Цена за 100 грамм -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Цена за 100 гр. ({{ systemCurrency.name }})
                            </ion-button>
                            <!--  -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                <ion-input type="number" v-model="subjectPrice" inputmode="decimal" :value="subjectData.price" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                            </ion-button>
                        </ion-row>
                        <!-- Количество -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Количество, шт
                            </ion-button>
                            <!--  -->
                            <div>
                                <ion-grid class="ion-no-padding">
                                    <ion-row class="ion-align-items-center">
                                        <!-- Subtract -->
                                        <ion-icon class="countQty_button" @click="changeQty('sub')" :icon="removeCircleOutline" :color="countQtyButtonColor"></ion-icon>
                                        <!-- Show data -->
                                        <ion-text class="ion-padding-horizontal countQty_count" color="primary">{{ subjectData.productQuantity }}</ion-text>
                                        <!-- Add -->
                                        <ion-icon class="countQty_button" @click="changeQty('add')" color="primary" :icon="addCircleOutline"></ion-icon>
                                    </ion-row>
                                </ion-grid>
                            </div>
                        </ion-row>
                    </ion-grid>
                    <!-- PER UNIT -->
                    <ion-grid v-if="subjectData.costEstimation === 'perUnit'" class="ion-no-padding">
                        <!-- Цена за 1 шт -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                1 шт. ({{ systemCurrency.name }})
                            </ion-button>
                            <!--  -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                <ion-input type="number" v-model="subjectPrice" inputmode="decimal" :value="subjectData.price" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                            </ion-button>
                        </ion-row>
                        <!-- Кол-во предмета -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Количество предмета, шт
                            </ion-button>
                            <!--  -->
                            <div>
                                <ion-grid class="ion-no-padding">
                                    <ion-row class="ion-align-items-center">
                                        <!-- Subtract -->
                                        <ion-icon class="countQty_button" @click="changeQty('sub')" :icon="removeCircleOutline" :color="countQtyButtonColor"></ion-icon>
                                        <!-- Show data -->
                                        <ion-text class="ion-padding-horizontal countQty_count" color="primary">{{ subjectData.productQuantity }}</ion-text>
                                        <!-- Add -->
                                        <ion-icon class="countQty_button" @click="changeQty('add')" color="primary" :icon="addCircleOutline"></ion-icon>
                                    </ion-row>
                                </ion-grid>
                            </div>
                        </ion-row>
                    </ion-grid>


                </ion-item-group>
            </div>

            <!-- ЗАМЕТКИ -->
            <ion-item-group class="ion-margin-horizontal ion-margin-bottom border-top">
                <ion-text>
                    <h4>Заметки по предмету</h4>
                </ion-text>
                <ion-textarea class="ion-margin-bottom" autoGrow="true" autocapitalize="on" v-model="subjectData.productNote" placeholder="Написать..."></ion-textarea>
            </ion-item-group>

            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
        </ion-content>

        <!-- Плашка общей стомоимсти subject -->
        <ion-grid class="ion-padding border-top" style="position: absolute; bottom: 0; left: 0; width: 100%; background-color: #fff; z-index: 999999">
            <!--  -->
            <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                <div style="display: flex; flex-direction: column">
                    <ion-text color="medium">
                        Итого по предмету:
                    </ion-text>
                    <div style="font-size: 0.8rem" v-if="currentDealType === 'sale' && (subjectData.additionalAttributes.length !== 0 || subjectData.subjectDiscount > 0)" >
                        <ion-text>С учетом:</ion-text>
                        <ion-text v-if="subjectData.additionalAttributes.length !== 0" color="primary" style="text-decoration: underline;" >
                            допов
                        </ion-text>
                        <ion-text v-if="subjectData.subjectDiscount > 0" color="primary" style="text-decoration: underline;">
                            скидки
                        </ion-text>
                    </div>
                </div>
                <!--  -->
                <div>
                    <ion-button  color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                        <ion-text style="font-size: 32px; color: black; font-weight: bold">{{subjectData.totalSubjectPrice}}</ion-text>
                    </ion-button>
                    <ion-text color="medium">{{systemCurrency.name}}</ion-text>
                </div>
            </ion-row>
            <!-- Кнопка добавить subject к делу -->
            <ion-button expand="block" :color="setAddButtonColor()" @click="$emit('createSubject', subjectData, isAttributesMenuOpened)" class="ion-margin-top">
                Добавить к делу
            </ion-button>
        </ion-grid>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, onMounted, computed, watch, watchEffect } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonImg, IonThumbnail, IonIcon, IonGrid, IonRow, IonSearchbar, IonItem, IonTextarea, IonToggle, IonCard, IonLabel, IonActionSheet, IonInput, IonRange } from '@ionic/vue';
    import { helpOutline, addOutline, closeCircleOutline, removeCircleOutline, addCircleOutline } from 'ionicons/icons';
    //
    import ViewPriceProduct from '../modal/ViewPriceProduct-modalViewProduct.vue'
    import CreateNewRecipe from '../../components/modal/NewRecipe-modalCreate.vue'
    import Spinner from '../Spinner.vue'
    //
    import { searchDealSubjectFilter } from '../../helpers/filterDealSubject';
    import { searchUserRecipeFilter } from '../../helpers/filterUserRecipe';
    import { sortAlphabetically } from '../../helpers/sortDealSubject';
    import { translateValue } from '@/helpers/translateValue';
    //
    import store from '../../store/index';
    import { uid } from 'uid';
    import { supabase } from '../../supabase/init';
    import { useRouter } from 'vue-router';
    //
    export default defineComponent({
        name: 'CreateDealSubject',
        emits: ['closeModal', 'createSubject', 'getSubjectPrice', 'getGramPerPerson', 'getSubjectQty', 'getPersonQty', 'getSubjectDiscount'],
        props: {
            subjectData: Object,
            currentDealType: String,
            isAttributesMenuOpened: Boolean
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
            IonImg, 
            IonThumbnail,
            IonIcon, 
            IonGrid,
            IonRow,
            IonSearchbar,
            IonItem,
            IonTextarea,
            IonToggle,
            IonCard, 
            IonLabel,
            IonActionSheet,
            ViewPriceProduct,
            IonInput, 
            IonRange,
            CreateNewRecipe,
            Spinner
        },
        setup(props, {emit}) {
            //
            const spinner = ref(null);
            // Setup ref to router
            const router = useRouter();
            // Get user email
            store.methods.setUserEmail()
            const userEmail = ref(store.state.userEmail)
            //
            const currentSubjectAttribute = ref()
            // Валюта отображения
            const systemCurrency = ref(store.state.systemCurrency)
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами рецептов (Временно в сторе)
            const userRecipeArray = ref(store.state.userRecipeArray)
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами предмета ПРОДАЖИ
            const dealSaleSubjectArray = ref();
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами дополнительных атрибутов к предметам дела
            const dealAdditionalAttributesArray = ref();
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами предмета ЗАКУПКИ
            const dealBuySubjectArray = ref(store.state.dealBuySubjectArray)
            //
            const subjectData = ref();
            const currentDealType = ref();
            //
            const userSettings = ref(store.state.userSettings)
            //
            const searchedRecipe = ref([])
            //
            onMounted( async() => {
                await store.methods.getUserSettingsfromDB();
                userSettings.value = store.state.userSettings;
                //
                await store.methods.getUserRecipesFromBD();
                userRecipeArray.value = store.state.userRecipeArray;
                // console.log(userSettings.value[0].userPriceList)
                dealSaleSubjectArray.value = userSettings.value[0].userPriceList
                dealAdditionalAttributesArray.value = userSettings.value[0].userAdditionalAttributes
                //
                searchedRecipeFunc()
            })
            //
            const showSelectedProduct = (selectedProduct) => {
                if(subjectData.value.selectedProduct !== '') {
                    // Если currentDealType - Продажи
                    if(currentDealType.value === 'sale') {
                        return translateValue(selectedProduct, dealSaleSubjectArray.value)
                    }
                    // Если currentDealType - Закупки
                    else if (currentDealType.value === 'buy') {
                        return translateValue(selectedProduct, dealBuySubjectArray.value)
                    }
                    //
                } else {
                    return 'Не выбран'
                }
            }
            //
            const showSelectedRecipe = (selectedRecipe) => {
                if(subjectData.value.recipe !== '' && subjectData.value.recipe === 'Без рецепта') {
                    return 'Без рецепта'
                }else if(subjectData.value.recipe !== '' && subjectData.value.recipe !== 'Без рецепта') {
                    return translateValue(selectedRecipe, userRecipeArray.value)
                } else {
                    return 'Не выбрано'
                }
            }
            //  =================== Работы с предметами дела
            const searchSubjectMenu = ref(false);
            const searchSelectedProduct = ref('');
            // =================== Работы с рецептами
            const searchRecipeMenu = ref(false);
            const searchRecipe = ref('');
            // ==================== Работа с доп. атрибутами
            const isAttributesMenuOpened = ref(false);
            const toggleAttributesMenu = () => {
                isAttributesMenuOpened.value = !isAttributesMenuOpened.value;
                // при закрытии - затираем выбранные атрибуты
                subjectData.value.additionalAttributes = []
            }
            const searchAttributeMenu = ref(false)
            const searchAdditionalAttributes = ref('')
            //
            watchEffect(() => {
                subjectData.value = props.subjectData;
                currentDealType.value = props.currentDealType
                isAttributesMenuOpened.value = props.isAttributesMenuOpened
                currentSubjectAttribute.value = props.currentSubjectAttribute

            })
            // ПРЕДМЕТ ДЕЛА (фильтр для поиска и сортировка по алфавиту)
            const searchedSubject = computed(() => {
                if(currentDealType.value === 'sale') {
                    const sortedDealSellSubjectArray = sortAlphabetically(dealSaleSubjectArray.value);
                    return searchDealSubjectFilter(sortedDealSellSubjectArray, searchSelectedProduct.value);
                } else if(currentDealType.value === 'buy') {
                    const sortedDealBuySubjectArray = sortAlphabetically(dealBuySubjectArray.value.filter(item => item.costEstimation !== 'teaSpoon' && item.costEstimation !== 'pinch' && item.costEstimation !== 'stick'));
                    return searchDealSubjectFilter(sortedDealBuySubjectArray, searchSelectedProduct.value);
                }
            }) 
            // РЕЦЕПТ ПОЛЬЗОВАТЕЛЯ (фильтр для поиска и сортировки по алфавиту)
            // const searchedRecipe = computed(() => {
            //     const sortedUserRecipeArray = sortAlphabetically(userRecipeArray.value);
            //     return searchUserRecipeFilter(sortedUserRecipeArray, searchRecipe.value)
            // })
            const searchedRecipeFunc = () => {
                const sortedUserRecipeArray = sortAlphabetically(userRecipeArray.value);
                return searchedRecipe.value = searchUserRecipeFilter(sortedUserRecipeArray, searchRecipe.value)
            }
            // ПОЛЬЗОВАТЕЛЬСКИЕ ДОП АТРИБУТЫ К ПРОДУКТУ ПРОДАЖИ
            const searchedAdditionalAttributes = computed(() => {
                const sortedDealAdditionalAttributesArray = sortAlphabetically(dealAdditionalAttributesArray.value);
                // используем фнукцию фильтрации из предметов заказа
                return searchDealSubjectFilter(sortedDealAdditionalAttributesArray, searchAdditionalAttributes.value);
            })
            // Задаем из выбранному списка значение для selectedProduct
            const choose = (subject) => {
                subjectData.value.selectedProduct = subject.value;
                if (currentDealType.value === 'sale') {
                    subjectData.value.price = subject.price;
                    subjectPrice.value = subject.price;
                } else if(currentDealType.value === 'buy') {
                    subjectData.value.price = 0
                    subjectPrice.value = 0
                }
                subjectData.value.costEstimation = subject.costEstimation;
                //
                searchSubjectMenu.value = false
                //
                subjectQty.value = 1
                personQty.value = 1
                subjectData.value.productQuantity = 1
                subjectData.value.personQuantity = 1
                //
                if(currentDealType.value === 'sale') {
                    if(subjectData.value.costEstimation === 'perUnit') {
                        subjectData.value.subjectPrice = subjectData.value.productQuantity * subjectPrice.value;
                        sumAttributesPriceFunc(subjectData.value.additionalAttributes)
                    } else if (subjectData.value.costEstimation === 'perKilogram') {
                        subjectData.value.subjectPrice = (subjectData.value.price / 1000) * (subjectData.value.personQuantity * subjectData.value.gramPerPerson) * subjectData.value.productQuantity * ((100 - subjectData.value.subjectDiscount) / 100) 
                        sumAttributesPriceFunc(subjectData.value.additionalAttributes)
                    } else if (subjectData.value.costEstimation === 'per100gram') {
                        subjectData.value.subjectPrice = subjectData.value.productQuantity * subjectPrice.value;
                        sumAttributesPriceFunc(subjectData.value.additionalAttributes)
                    }
                } else if (currentDealType.value === 'buy') {
                    if (subjectData.value.costEstimation === 'perKilogram') {
                        subjectData.value.subjectPrice = subjectData.value.price / 1000 * subjectData.value.gramPerPerson;
                    } else if (subjectData.value.costEstimation === 'perUnit') {
                        subjectData.value.subjectPrice = subjectData.value.productQuantity * subjectPrice.value;
                    } else if (subjectData.value.costEstimation === 'per100gram') {
                        subjectData.value.subjectPrice = subjectData.value.productQuantity * subjectPrice.value;
                    }
                }
            }
            // Задаем из выбранного списка значение для recipe
            const chooseRecipe = (recipe) => {
                subjectData.value.recipe = recipe.value;
                searchRecipeMenu.value = false;
            }
            // Выбираем из списка объект для массива атрибутов
            const newAttribute = ref()
            const chooseAttribute = (attribute) => {
                isItemAlreadyHave.value = subjectData.value.additionalAttributes.find(item => item.value === attribute.value)
                if(isItemAlreadyHave.value !== undefined) {
                    alert('Modal Create Subject: атрибут уже добавлен к предмету')
                } else {
                    searchAttributeMenu.value = false;
                    newAttribute.value = {
                        uid: attribute.uid,
                        value: attribute.value,
                        name: attribute.name,
                        price: attribute.price,
                        qty: attribute.qty,
                        totalPrice: attribute.totalPrice,
                        rentType: attribute.rentType,
                        isReturned: attribute.isReturned
                    };
                    subjectData.value.additionalAttributes.push(newAttribute.value)
                    // 
                    // subjectData.value.totalSubjectPrice += +attribute.totalPrice
                    // emit('updateBD');
                }
            }
            // Заглушка под предмет продажи "БЕЗ РЕЦЕПТА"
            const noRecipe = ref({
                value: 'Без рецепта',
                name: 'Без рецепта'
            })
            // ======================================== Удаление конкретного атрибута у предмета ==========================================
            // Вызываем action sheet уведомление в качестве подтверждения
            const deleteAttribute = ref(false);
            // Храним айди предмета к удалению
            const attributeToDelete = ref();
            // Кнопка action sheet для подтверждения удаления
            const deleteSubjectAttributeButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteAttributeFunc(attributeToDelete.value)
                    },
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    },
                }
            ]
            //удаляем current attribute в предмете (обнолвений в БД здесь не производится)
            const openDeleteAttributeModal = (attribute) => {
                attributeToDelete.value = attribute;
                deleteAttribute.value = true
            }
            const deleteAttributeFunc = (attribute) => {
                subjectData.value.additionalAttributes = subjectData.value.additionalAttributes.filter(item => item.uid !== attribute.uid);
                // и вычитаем из общей стоимости
                subjectData.value.totalSubjectPrice -= +attribute.totalPrice
                // newAttribute.value = {}
            }

            // ======================================== Просмотр конкретного атрибута =====================================================
            // открываем view current attribute item
            const isViewSubjectAttributeOpened = ref(false);
            const openCurrentSubjectAttribute = (index) => {
                isViewSubjectAttributeOpened.value = true;
                // console.log(subjectData.value.additionalAttributes[index])
                currentSubjectAttribute.value = subjectData.value.additionalAttributes[index];
                // currentSubjectAttribute.value = attribute
                // console.log(currentSubjectAttribute.value)
            }
            // Проверяем добавлен ли уже атрибут к продукту
            const isItemAlreadyHave = ref();
            //
            const setAttributeRentType = (type) => {
                newAttribute.value.rentType = type
                // emit('updateBD')
            }
            //
            const setProductPrice = (price) => {
                newAttribute.value.price = price
                newAttribute.value.totalPrice = newAttribute.value.price * newAttribute.value.qty
            }
            //
            const setProductQty = (qty) => {
                newAttribute.value.qty = qty
                newAttribute.value.totalPrice = newAttribute.value.price * newAttribute.value.qty
            }
            // функция калькуляции общей стоимости предмета дела
            const calcTotalSubjectPrice = (sumAttrPrice) => {
                if(currentDealType.value === 'sale') {
                    subjectData.value.totalSubjectPrice = sumAttrPrice + subjectData.value.subjectPrice
                    // console.log('sale')
                } else if(currentDealType.value === 'buy') {
                    // console.log('buy')
                    subjectData.value.totalSubjectPrice = subjectData.value.subjectPrice
                }
            }
            // Считаем сумму всех атритов
            const sumAttributesPriceFunc = (array) => {
                if(currentDealType.value === 'sale') {
                    if(array.length > 0 ) {
                        // Выбираем из массива данных нужные значения
                        let attrPriceArray = array.map(item => item.totalPrice)
                        // Суммируем значения
                        const sumAttributesPriceValue = attrPriceArray.reduce( (accumulator, currentValue) => accumulator + currentValue)
                        calcTotalSubjectPrice(sumAttributesPriceValue);
                        return sumAttributesPriceValue
                    } else if (array.length === 0) {
                        let sumAttributesPriceValue = 0
                        calcTotalSubjectPrice(sumAttributesPriceValue);
                        return sumAttributesPriceValue
                    }
                } else if (currentDealType.value === 'buy') {
                    return
                }
            }
            // следим за изменениями price
            const subjectPrice = ref();
            watch(subjectPrice, (price) => {
                console.log(price)
                emit('getSubjectPrice', +price);
            })
            // следим за изменениями веса порций
            const gramPerPerson = ref();
            watch(gramPerPerson, (gram) => {
                console.log(gram)
                emit('getGramPerPerson', +gram)
            })
            // следим за изменением subject qty
            const subjectQty = ref();
            const countQtyButtonColor = ref('primary')
            watch(subjectQty, (qty) => {
                // console.log(qty)
                emit('getSubjectQty', +qty);
                if(qty < 2) {
                    countQtyButtonColor.value = 'light'
                } else {
                    countQtyButtonColor.value = 'primary'
                }
            })
            // следим за изменениями person qty
            const personQty = ref();
            const countPersonQtyButtonColor = ref('primary')
            watch(personQty, (qty) => {
                // console.log(personQty.value)
                emit('getPersonQty', +qty);
                if(qty < 2) {
                    countPersonQtyButtonColor.value = 'light'
                } else {
                    countPersonQtyButtonColor.value = 'primary'
                }
            })
            //
            watch(searchSelectedProduct, (SelectedProduct) => {
                console.log(SelectedProduct)
            })
            //
            watch(searchRecipe, () => {
                searchedRecipeFunc()
            })
            // функционал управления кнопками добавить / вычесть
            const changeQty = (action) => {
                // subjectQty.value = subjectData.value.productQuantity
                if(action === 'sub' && subjectQty.value > 1) {
                    subjectQty.value--
                } else if (action === 'add') {
                    subjectQty.value++
                } 
            }
            // функционал управления кнопка добавить убавить количество гостей на торт
            const changePersonQty = (action) => {
                // personQty.value = subjectData.value.personQuantity
                if(action === 'sub' && personQty.value > 1) {
                    personQty.value--
                } else if (action === 'add') {
                    personQty.value++
                } 
            }
            // Устанавливаем значение скидок
            const setDiscountRange = (name) => {
                const userDiscountRangeValue = store.state.userDiscountRangeValue
                if(name === 'min') {
                    const value = userDiscountRangeValue[0].value;
                    return value
                } else if(name === 'max') {
                    const value = userDiscountRangeValue[1].value;
                    return value
                }
            }
            // следим за изменениями Subject Discount
            const subjectDiscount = ref();
            watch(subjectDiscount, (discount) => {
                emit('getSubjectDiscount', +discount)
            })
            //
            const addNewAttrToPrice = () => {
                alert('ViewDeal-modalCreateSubject: функционал в разработке (addNewAttrToPrice)')
            }
            //
            const addNewRecipe = () => {
                // alert('ViewDeal-modalCreateSubject: функционал в разработке (addNewRecipe)')
                isModalCreateNewRecipeOpened.value = true;
            }
            //
            const addNewSubjectToPrice = () => {
                alert('ViewDeal-modalCreateSubject: функционал в разработке (addNewSubjectToPrice)')
            }
            //
            const setAddButtonColor = () => {
                if(currentDealType.value === 'sale') {
                    if(subjectData.value.selectedProduct && subjectData.value.recipe) {
                        return 'warning'
                    } else {
                        return 'light'
                    }
                } else if(currentDealType.value === 'buy') {
                    if (subjectData.value.costEstimation === 'perKilogram' && subjectData.value.gramPerPerson === 0){
                        return 'light'
                    } else if(subjectData.value.selectedProduct ) {
                        return 'warning'
                    } else {
                        return 'light'
                    }
                } 
            }
            //
            const goToRecipesStore = () => {
                alert('ViewDeal-modalCreateSubject: Магазин в разработке...')
            }
            // =======================================================================================
            // Work with Modal Create New Recipe
            const isModalCreateNewRecipeOpened = ref(false)
            // Изменяемый шаблон нового рецепты
            const recipeData = ref({
                uid: uid(),
                email: userEmail.value,
                value: '',
                name: ''
            })
            // При закрытии или открытии modal очищаем шаблон рецепта
            const setOpen = () => {
                isModalCreateNewRecipeOpened.value = !isModalCreateNewRecipeOpened.value;
                searchRecipe.value = ''
                recipeData.value = {
                    uid: uid(),
                    email: userEmail.value,
                    value: '',
                    name: ''
                }
                searchedRecipeFunc()
            }
            // Создаем новый рецепт
            const createNew = async (newRecipeData) => {
                // console.log(recipeData.value)
                // принимаем инфу по рецепту из modal
                recipeData.value = newRecipeData
                // spinner.value = true;
                // Если есть пустые строки
                // Использовать валидацию
                if(recipeData.value.name === '') {
                    alert('Recipes: Вы не указали название рецепта')
                } else {
                    try {
                        // Добавляем в БД инфу по новому контакту
                        const { error } = await supabase.from('userRecipes').insert([recipeData.value])
                        if(error) throw error;
                        // обновляем массив в store
                        await store.methods.getUserRecipesFromBD();
                        recipeData.value = store.state.userRecipeArray;
                        userRecipeArray.value = store.state.userRecipeArray;
                        // ищем созданное новый рецепт в массиве всех рецептов в store (по uid)
                        // const newRecipe = recipeData.value.find(el => el.uid === recipeData.value.uid)
                        // закрываем modal
                        // isModalCreateNewRecipeOpened.value = false
                        // переходим на страницу созданного рецепта
                        // router.push()
                        console.log(recipeData.value)
                        // searchedRecipeFunc()
                    } catch (error) {
                        alert(`Error: ${error.message}`)
                    }
                    // Сбрасываем заполненные данные и закрываем модалку
                    setOpen()
                }
            }

            //
            const setCostEstimation = (costEstimation) => {
                if(costEstimation === 'perKilogram') {
                    return 'закуп в кг. / г.'
                } else if (costEstimation === 'perUnit') {
                    return 'закуп в шт.'
                } else if(costEstimation === 'per100gram') {
                    return 'закуп в упаковках по 100г'
                }
            }

            return {
                dealSaleSubjectArray, dealBuySubjectArray, helpOutline, addOutline, showSelectedProduct, searchSubjectMenu, searchSelectedProduct, currentDealType, translateValue, searchedSubject, choose, searchRecipeMenu, searchRecipe, userRecipeArray, chooseRecipe, showSelectedRecipe, searchedRecipe, noRecipe, searchAttributeMenu, searchAdditionalAttributes, dealAdditionalAttributesArray, searchedAdditionalAttributes, chooseAttribute, closeCircleOutline, isAttributesMenuOpened, toggleAttributesMenu, openDeleteAttributeModal, deleteAttribute, attributeToDelete, deleteSubjectAttributeButtons, systemCurrency, currentSubjectAttribute, isViewSubjectAttributeOpened, openCurrentSubjectAttribute, isItemAlreadyHave, setAttributeRentType, sumAttributesPriceFunc, newAttribute, setProductQty, calcTotalSubjectPrice, setProductPrice, subjectPrice, subjectQty, removeCircleOutline, addCircleOutline, countQtyButtonColor, changeQty, changePersonQty, countPersonQtyButtonColor, gramPerPerson, setDiscountRange, subjectDiscount, addNewAttrToPrice, addNewRecipe, addNewSubjectToPrice, setAddButtonColor, goToRecipesStore, isModalCreateNewRecipeOpened, recipeData, setOpen, userEmail,createNew, spinner, router, searchedRecipeFunc, setCostEstimation
            }
        }
    })
</script>

<style scoped>  
    /* ion-modal {
        opacity: 0.95;
    }   */
    .horizontal-scroll {
        overflow: scroll;
        --overflow: scroll;
        white-space: nowrap;
    }
    ::-webkit-scrollbar, *::-webkit-scrollbar {
        display: none;
        overflow: hidden;
    }
    ion-card {
        overflow: visible;
    }
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
    .card-center {
        display: flex; 
        flex-direction: column; 
        justify-content: center; 
        align-items: center; 
        min-width: 64px; 
        max-width: 64px;
        padding: 0.5rem;
        background-color: var(--ion-color-light);
        box-shadow: none;
        border-radius: 50%;
    }
    .card-add {
        min-height: 64px;
    }
    .icon_size {
        font-size: 25px;
    }
    .icon_del {
        top: -0.4rem;
        left: -0.4rem;
        z-index: 20;
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
    .border-top {
        border-top: 1px solid var(--ion-color-light);
    }
/*  */

    ion-range::part(pin) {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        background: #ffafcc;
        color: #fff;

        border-radius: 50%;
        /* transform: scale(1.01); */

        top: -20px;

        min-width: 28px;
        height: 28px;
        transition: transform 120ms ease, background 120ms ease; 
    } 

    /* ion-range::part(pin)::before {
        content: none;
    } */

    ion-range::part(bar) {
        background: #a2d2ff;
    }

    ion-range::part(bar-active) {
        background: #bde0fe;
    }

</style>
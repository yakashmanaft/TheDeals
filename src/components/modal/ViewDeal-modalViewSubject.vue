<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>

                <ion-title class="ion-text-center">Просмотр</ion-title>
                <ion-buttons slot="start">
                    <!-- <ion-button>Готово</ion-button> -->
                    <ion-button @click="$emit('closeModal')">Закрыть</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        
        <!--  -->
        <ion-content forceOverscroll="false" style="position: relative;">
            <!-- {{currentDealType}} -->
            <!-- {{subjectData}} -->
            <!-- ================ Добавленный продукт ======================== -->

            <!-- Если ПРОДУКТ (продажа, закуп) -->
            <ion-item-group v-if="subjectData.selectedProduct" class="ion-padding-horizontal">
                <!-- Заголовок -->
                <ion-text>
                    <h4 class="ion-no-margin ion-margin-top">Продукт</h4>
                </ion-text>
                <!-- Показываем текущий продукт -->
                <ion-grid class="ion-no-padding border-bottom ion-padding-bottom">
                    <ion-row class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap;">
                        <!-- Название текущего продукта -->
                        <ion-text color="medium">{{ translateProductValue(subjectData.selectedProduct) }}</ion-text>
                        <!-- Иконка к текущему продукту -->
                        <ion-thumbnail v-if="subjectData.selectedProduct !== '' && currentDealType === 'sale'" class="thumbnail_deal-subject">
                            <ion-img :src="`../img/subjects/sale/${subjectData.selectedProduct}.webp`"></ion-img>
                        </ion-thumbnail>
                        <ion-thumbnail v-if="subjectData.selectedProduct !== '' && currentDealType === 'buy'" class="thumbnail_deal-subject">
                            <ion-img :src="`../img/subjects/buy/${subjectData.selectedProduct}.webp`"></ion-img>
                        </ion-thumbnail>
                    </ion-row>
                </ion-grid>
            </ion-item-group>

            <!-- ================  Показываем в зависимости от выбранного типа дела ==============-->
            <!-- Если ПРОДАЖА -->
            <div v-if="currentDealType === 'sale' && subjectData.additionalAttributes">

                <!-- РЕЦЕПТ -->
                <ion-item-group class="ion-padding-horizontal">
                    <!-- Подбираем рецепт к делу -->
                    <ion-text>
                        <h4 class="ion-no-margin ion-margin-top">Рецепт</h4>
                    </ion-text>
                    <!-- Показ и кнопка изменения рецепта к предмету -->
                    <ion-grid class="ion-no-padding border-bottom">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">{{ showSelectedRecipe(subjectData.recipe) }}</ion-button>
                            <ion-button color="primary" size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="searchRecipeMenu = true">
                                Изменить
                            </ion-button>
                        </ion-row>
                    </ion-grid>
                    <!-- Модалка для выбор (Выбор / поиск рецепта для предмета) -->
                    <ion-modal :isOpen="searchRecipeMenu">
                        <ion-searchbar class="ion-text-left" placeholder="Поиск..." v-model="searchRecipe" show-cancel-button="always" cancelButtonText="Отменить" @ionCancel="searchRecipeMenu = false">
                        </ion-searchbar>
                        <ion-content style="height: 90vh">
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
                                        </ion-row>
                                    </ion-grid>
                                </ion-item>
                                <!--  -->
                                <div class="ion-padding-horizontal" style="display: flex; flex-direction: column; position: absolute; top: 40%; width: 100%">
                                    <ion-text class="ion-text-center">Купить или создать в <ion-text color="primary" @click.stop="goToMyRecipes()">Моих рецептах</ion-text></ion-text>
                                    <ion-button color="dark" class="ion-margin-top" @click="goToRecipesStore()">Купить в магазине</ion-button>
                                </div>
                            </div>
                        </ion-content>
                    </ion-modal>
                </ion-item-group>

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
                        <!-- Кол-во гостей, кто накинется на торт -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Кол-во гостей, чел
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
                        <!-- Цена одной порции -->
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
                    <!-- PER 100 GRAM -->
                    <ion-grid v-if="subjectData.costEstimation === 'per100gram'" class="ion-no-padding">
                        <!-- Цена за 100 грамм -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Цена за 100 гр. ({{ systemCurrency.name }})
                            </ion-button>
                            <!--  -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                <!-- subjectPrice -->
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
                    <!-- PER UNIT -->
                    <ion-grid v-if="subjectData.costEstimation === 'perUnit'" class="ion-no-padding">
                        <!-- Цена за 1 шт -->
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                1 шт. ({{ systemCurrency.name }})
                            </ion-button>
                            <!--  -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                <!-- subjectPrice -->
                                <ion-input type="number" v-model="subjectPrice" inputmode="decimal" :value="subjectData.price" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                            </ion-button>
                        </ion-row>
                        <!-- Кол-во предмета -->
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
                </ion-item-group>

                <!-- АТРИБУТЫ -->
                <ion-item-group class="ion-margin-top">
                    <!-- Заголовок -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-text>
                                <h4 class="ion-no-margin ion-padding-horizontal">Атрибуты (допы)</h4>
                            </ion-text>
                            <ion-text class="ion-margin-end" color="medium" v-if="subjectData.additionalAttributes.length > 0">{{sumAttributesPriceFunc(subjectData.additionalAttributes)}} {{systemCurrency.name}}</ion-text>
                        </ion-row>
                    </ion-grid>
                    <!--  -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-nowrap horizontal-scroll">
                            <!-- Карточки attribute -->
                            <ion-card @click.stop="openCurrentSubjectAttribute(index, attribute)" class="ion-padding ion-text-center card-center relative" v-for="(attribute, index) in subjectData.additionalAttributes" :key="attribute.id">
                                <!-- Кнопка удалить конкретный атрибут у предмета -->
                                <ion-icon class="icon_size icon_del absolute" :icon="closeCircleOutline" @click.stop="openDeleteAttributeModal(attribute)"></ion-icon>
                                <!-- attribute img-->
                                <ion-thumbnail class="relative">
                                    <ion-img style="height: 100%" :src="`../img/subjects/sale/${attribute.value}.webp`"></ion-img>
                                </ion-thumbnail>
                                <!--  -->
                                <ion-text class="absolute" style="bottom: -1rem;">х{{attribute.qty}}</ion-text>
                                <!-- is attribute returned or not -->
                                <div 
                                    v-if="attribute.rentType === 'rent'"
                                    class="absolute mark-atribute"
                                >
                                    <ion-icon style="font-size: 1.1rem;" :icon="setMarkerCurrentAttrColor(attribute) ? checkmark : sync" :color="setMarkerCurrentAttrColor(attribute) ? 'success' : 'warning'"></ion-icon>
                                </div>
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

                <!-- модалка просмотра уже добавленного атрибута -->
                <ViewPriceProduct 
                    :isOpen="isViewSubjectAttributeOpened"
                    @closeModal="isViewSubjectAttributeOpened = false"
                    :productData="currentSubjectAttribute"
                    :blockToShow="'attributes'"
                    :currentProductPrice="attributePrice"
                    @getRentType="setAttributeRentType"
                    @getProductPrice="setProductPrice"
                    @getProductQty="setProductQty"
                    @getIsReturned="setIsReturned"
                    :mode="'sale'"
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

                <!--  -->
            </div>
            
            <!-- Если ЗАКУП -->
            <div v-if="currentDealType === 'buy'">
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
                        <!-- Кол-во предмета -->
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

            <!-- ===================================== Заметки показываем ======================================== -->
            <!-- product note -->
            <ion-item-group class="ion-margin-horizontal ion-margin-bottom border-top">
                <ion-text>
                    <h4 class="ion-no-margin ion-margin-top">Заметки по предмету</h4>
                </ion-text>
                <ion-textarea class="ion-margin-bottom" autocapitalize="on" v-model="subjectData.productNote" :placeholder="setProductNotePlaceholder(subjectData.productNote)"></ion-textarea>
            </ion-item-group>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
        </ion-content>

        <!-- ============================ СТОИМОСТЬ ПРЕДМЕТА ПОКАЗЫВАЕМ ========================== -->
        <ion-grid class="ion-padding border-top" style="position: absolute; bottom: 0; left: 0; width: 100%; background-color: #fff; z-index: 999999">
            <!--  -->
            <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                <div style="display: flex; flex-direction: column">
                    <ion-text color="medium">
                        Итого по предмету
                    </ion-text>
                    <div style="font-size: 0.8rem" v-if="currentDealType === 'sale' && (subjectData.additionalAttributes.length !== 0 || subjectData.subjectDiscount > 0)">
                        <ion-text>С учетом:</ion-text>
                        <ion-text v-if="subjectData.additionalAttributes.length !== 0" color="primary" style="text-decoration: underline;" >
                            допов
                        </ion-text>
                        <ion-text v-if="subjectData.subjectDiscount > 0" color="primary" style="text-decoration: underline;">
                            скидок
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
        </ion-grid>
    </ion-modal>
</template>

<script>
    import { defineComponent, computed, ref, watchEffect, onMounted, watch } from 'vue';
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonSearchbar, IonItem, IonGrid, IonRow, IonThumbnail, IonImg, IonToggle, IonCard, IonIcon, IonActionSheet, IonTextarea, IonInput, IonRange } from '@ionic/vue';
    //
    import { addOutline, closeCircleOutline, removeCircleOutline, addCircleOutline, sync, checkmark } from 'ionicons/icons';
    //
    import { searchDealSubjectFilter } from '../../helpers/filterDealSubject';
    import { searchUserRecipeFilter } from '../../helpers/filterUserRecipe';
    import { sortAlphabetically } from '../../helpers/sortDealSubject';
    import { translateValue, translateRecipeID } from '@/helpers/translateValue';
    import { setMarkerCurrentAttrColor } from '../../helpers/setMarkerColor';
    //
    import store from '../../store/index';
    import { uid } from 'uid';
    import { supabase } from '../../supabase/init';
    import { useRouter } from 'vue-router';
    //
    import ViewPriceProduct from '../modal/ViewPriceProduct-modalViewProduct.vue'
    //
    export default defineComponent({
        name: 'ViewDealSubject',
        emits: ['closeModal', 'updateBD', 'getSubjectPrice', 'getGramPerPerson', 'getSumAttributesPriceValue', 'getSubjectQty', 'getPersonQty', 'getSubjectDiscount'],
        props: {
            subjectData: Object,
            currentDealType: String,
            countQtyButtonColor: String,
            countPersonQtyButtonColor: String,
            currentSubjectPrice: Number,
            personGram: Number
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonSearchbar, IonItem, IonGrid, IonRow, IonThumbnail, IonImg, IonToggle, IonCard, IonIcon, IonActionSheet, ViewPriceProduct, IonTextarea, IonInput, IonRange
        },
        setup(props, { emit }) {
            //
            const router = useRouter();
            // Get user email
            store.methods.setUserEmail()
            const userEmail = ref(store.state.userEmail)
            // Валюта отображения
            const systemCurrency = ref(store.state.systemCurrency)
            //
            const subjectData = ref();
            const currentDealType = ref();
            // Массив с СИСТЕМНЫМ списком предметов для продажи
            const dealSaleSubjectArray = ref(store.state.dealSaleSubjectArray)
            // Массив с СИСТЕМНЫМ списком предметов для закупа
            const dealBuySubjectArray = ref(store.state.dealBuySubjectArray)
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами дополнительных атрибутов к предметам дела
            const dealAdditionalAttributesArray = ref();
            //
            const userSettings = ref(store.state.userSettings)
            //
            const searchedRecipe = ref([])
            //
            onMounted( async() => {
                // if(userSettings.value[0].userAdditionalAttributes) {
                //     await store.methods.getUserSettingsfromDB();
                //     userSettings.value = store.state.userSettings
                //     dealAdditionalAttributesArray.value = userSettings.value[0].userAdditionalAttributes
                // }
                await store.methods.getUserSettingsfromDB();
                userSettings.value = store.state.userSettings
                dealAdditionalAttributesArray.value = userSettings.value[0].userAdditionalAttributes
                //
                await store.methods.getUserRecipesFromBD();
                userRecipeArray.value = store.state.userRecipeArray;
                //
                searchedRecipeFunc()
            })
            //
            const searchRecipeMenu = ref(false);
            const searchRecipe = ref('');
            const searchAttributeMenu = ref(false)
            const searchAdditionalAttributes = ref('')
            // массив ПОЛЬЗОВАТЕЛЯ с вариантами рецептов (Временно в сторе)
            const userRecipeArray = ref(store.state.userRecipeArray)
            // РЕЦЕПТ ПОЛЬЗОВАТЕЛЯ (фильтр для поиска и сортировки по алфавиту)
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
            // Задаем из выбранного списка значение для recipe
            const chooseRecipe = (recipe) => {
                if(recipe.uid === undefined) {
                    subjectData.value.recipe = '111' //Тип без рецепта id
                } else {
                    subjectData.value.recipe = recipe.uid;
                }
                searchRecipeMenu.value = false;
                emit('updateBD');
            }
            // Выбираем из списка объект для массива атрибутов
            const newAttribute = ref()
            const chooseAttribute = (attribute) => {
                isItemAlreadyHave.value = subjectData.value.additionalAttributes.find(item => item.value === attribute.value)
                if(isItemAlreadyHave.value !== undefined) {
                    alert('Modal View Subject: атрибут уже добавлен к предмету')
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
                    emit('updateBD');
                }
            }
            // Заглушка под предмет продажи "БЕЗ РЕЦЕПТА"
            const noRecipe = ref({
                value: 'Без рецепта',
                name: 'Без рецепта'
            })
            // ======================== Удаление конкретного атрибута у предмета ========================
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
                emit('updateBD');
            }

            const showSelectedRecipe = (recipeID) => {
                return translateRecipeID(recipeID, userRecipeArray.value)
            }
            // ================ Работа с атрибутами предмета
            const currentSubjectAttribute = ref()
            const attributePrice = ref()
            // открываем view current attribute item
            const isViewSubjectAttributeOpened = ref(false);
            const openCurrentSubjectAttribute = (index, attribute) => {
                isViewSubjectAttributeOpened.value = true;
                //
                currentSubjectAttribute.value = subjectData.value.additionalAttributes[index];
                attributePrice.value = attribute.price
            }
            // ============================ Проверяем добавлен ли уже атрибут к продукту
            const isItemAlreadyHave = ref();
            //
            // const countQtyButtonColor = ref();
            //
            // const countPersonQtyButtonColor = ref();
            //
            const translateProductValue = (selected) => {
                if (subjectData.value.selectedProduct !== '') {
                    // Если currentDealType - Продажи
                    if(currentDealType.value === 'sale') {
                        return translateValue(selected, dealSaleSubjectArray.value)
                    }
                    // Если currentDealType - Закупки
                    if (currentDealType.value === 'buy') {
                        return translateValue(selected, dealBuySubjectArray.value)
                    }
                } else if (!subjectData.value.selectedProduct) {
                    console.log(selected)
                } else {
                    return
                }
            }
            //
            const setAttributeRentType = (type) => {
                currentSubjectAttribute.value.rentType = type
                emit('updateBD');
            }
            //
            const setProductPrice = (price) => {
                currentSubjectAttribute.value.price = price
                currentSubjectAttribute.value.totalPrice = currentSubjectAttribute.value.price * currentSubjectAttribute.value.qty
                emit('updateBD');
            }
            //
            const setIsReturned = (isReturned) => {
                console.log(isReturned)
                if(isReturned === 'true') {
                    // console.log(true)
                    currentSubjectAttribute.value.isReturned = true
                } else if (isReturned === 'false') {
                    // console.log(false)
                    currentSubjectAttribute.value.isReturned = false
                } 
                // currentSubjectAttribute.value.isReturned = isReturned
                emit('updateBD');
            }
            //
            const setProductQty = (qty) => {
                // console.log(qty)
                currentSubjectAttribute.value.qty = qty
                currentSubjectAttribute.value.totalPrice = currentSubjectAttribute.value.price * currentSubjectAttribute.value.qty
                emit('updateBD');
            }
            //Считаем сумма всех атрибутов
            const sumAttributesPriceValue = ref();
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
            watch(sumAttributesPriceValue, () => {
                emit('getSumAttributesPriceValue', sumAttributesPriceValue.value)
            })
            // ========= показываем, меняем и обноавляем в БД запись по заметке к предмету дела
            const productNote = ref();
            watch(productNote, () => {
                // console.log(productNote.value)
                emit('updateBD');
            })
            //
            const setProductNotePlaceholder = (note) => {
                if (note === '') {
                    return 'Напишите что-нибудь'
                } else {
                    productNote.value = note
                    return note
                }
            }
            // функция калькуляции общей стоимости предмета дела (с учетом атрибутов (допов))
            const calcTotalSubjectPrice = (sumAttrPrice) => {
                if(currentDealType.value === 'sale') {
                    subjectData.value.totalSubjectPrice = sumAttrPrice + subjectData.value.subjectPrice
                    // console.log('sale')
                } else if(currentDealType.value === 'buy') {
                    // console.log('buy')
                    subjectData.value.totalSubjectPrice = subjectData.value.subjectPrice
                }
            }
            // следим за изменениями price
            const subjectPrice = ref()
            // subjectQty.value = subjectData.value.productQuantity
            // subjectPrice.value = subjectData.value.price
            watch(subjectPrice, (price) => {
                subjectPrice.value = price
                // console.log(subjectPrice.value)
                emit('getSubjectPrice', +price);
            })
            // следим за изменениями gramPerPerson
            const gramPerPerson = ref();
            watch(gramPerPerson, (gram) => {
                gramPerPerson.value = gram
                // console.log(gramPerPerson.value)
                emit('getGramPerPerson', +gram)
            })
            // следим за изменениями qty
            const subjectQty = ref();
            // const countQtyButtonColor = ref();
            watch(subjectQty, (qty) => {
                console.log(subjectQty.value)
                emit('getSubjectQty', +qty);
            })
            // следим за изменениями personQty
            const personQty = ref();
            watch(personQty, (qty) => {
                emit('getPersonQty', +qty)
            })
            //
            watch(searchRecipe, () => {
                searchedRecipeFunc()
            })
            // функционал управления кнопками добавить / вычесть
            // const countQtyButtonColor = ref('')
            const changeQty = (action) => {
                subjectQty.value = subjectData.value.productQuantity
                if(action === 'sub' && subjectQty.value > 1) {
                    subjectQty.value--
                } else if (action === 'add') {
                    subjectQty.value++
                } 
            }
            // функционал управления кнопка добавить убавить количество гостей на торт
            const changePersonQty = (action) => {
                personQty.value = subjectData.value.personQuantity
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
            // Следим за изменениями
            // getSubjectDiscount
            const subjectDiscount = ref();
            watch(subjectDiscount, (discount) => {
                emit('getSubjectDiscount', +discount)
            })
            //
            const goToRecipesStore = () => {
                // alert('ViewDeal-modalViewSubject: Магазин в разработке...')
                searchRecipeMenu.value = false
                emit('closeModal')
                router.push({ path: '/recipes-store' })
            }
            //
            const goToMyRecipes = () => {
                searchRecipeMenu.value = false
                emit('closeModal')
                router.push({ path: '/recipes' })
            }
            // =======================================================================================
            const isModalCreateNewRecipeOpened = ref(false)
            // При закрытии или открытии modal очищаем шаблон рецепта
            const setOpen = () => {
                isModalCreateNewRecipeOpened.value = !isModalCreateNewRecipeOpened.value;
                searchRecipe.value = ''
                searchedRecipeFunc()
            }
            //
            const addNewAttrToPrice = () => {
                alert('ViewDeal-modalViewSubject: функционал в разработке (addNewAttrToPrice)')
            }
            //
            const addNewRecipe = () => {
                // alert('ViewDeal-modalCreateSubject: функционал в разработке (addNewRecipe)')
                isModalCreateNewRecipeOpened.value = true;
            }
            //
            watchEffect(() => {
                subjectData.value = props.subjectData;
                currentDealType.value = props.currentDealType;
                // countQtyButtonColor.value = props.countQtyButtonColor
                subjectPrice.value = props.currentSubjectPrice
                gramPerPerson.value = props.personGram
            })


            return {
                systemCurrency, userSettings, subjectData, currentDealType, searchRecipeMenu, searchRecipe, chooseRecipe, noRecipe, searchedRecipe, userRecipeArray, showSelectedRecipe, translateProductValue, dealSaleSubjectArray, dealBuySubjectArray, addOutline, closeCircleOutline, deleteAttribute, attributeToDelete, deleteSubjectAttributeButtons, openDeleteAttributeModal, deleteAttributeFunc, isViewSubjectAttributeOpened, openCurrentSubjectAttribute, currentSubjectAttribute, isItemAlreadyHave, searchAttributeMenu, searchAdditionalAttributes, searchedAdditionalAttributes, dealAdditionalAttributesArray, chooseAttribute, setAttributeRentType, setProductPrice, setProductQty, sumAttributesPriceFunc, productNote, setProductNotePlaceholder, calcTotalSubjectPrice, subjectPrice, newAttribute, sumAttributesPriceValue, subjectQty, removeCircleOutline, addCircleOutline, changeQty, changePersonQty, gramPerPerson, setDiscountRange, subjectDiscount, setIsReturned, addNewAttrToPrice, sync, checkmark, setMarkerCurrentAttrColor, addNewRecipe, isModalCreateNewRecipeOpened, setOpen, goToRecipesStore, searchedRecipeFunc, attributePrice, router, goToMyRecipes
            }
        }
    })
</script>

<style scoped>
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

    ion-range::part(bar) {
        background: #a2d2ff;
    }

    ion-range::part(bar-active) {
        background: #bde0fe;
    }

    .mark-atribute {
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        right: 0;
        width: 1.3rem;
        height: 1.3rem;
        /* background-color: var(--ion-color-light); */
        border-radius: 100%
    }
</style>
<template :key="componentKey">
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- page header -->
        <ViewHeader 
            style="background-color: white;"
        />

        <!-- page-content -->
        <ion-content
            :scroll-events="true"
            class="ion-page ion-margin-top" 
            id="main"
            type="push" 
            forceOverscroll="false"
        >
            <br>
            <br>
            <!-- page-content -->
            <!-- No data -->
            <div>
                <!-- Если !data -->
                <!-- Data is not available -->
            </div>

            <!-- Data -->
            <div class="ion-text-left">

                <!-- Название рецепта -->
                <ion-item-group class="ion-padding-horizontal">
                    <!-- Заголовок -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <!--  -->
                            <h4>Название</h4>
                            <!-- -->
                            <ion-text v-if="!editRecipeName" color="primary" @click.stop="toggleEditRecipeName()">Изменить</ion-text>
                            <!--  -->
                            <ion-text v-else color="primary" @click.stop="toggleEditRecipeName()">Готово</ion-text>
                        </ion-row>
                    </ion-grid>
                    <!--  -->
                    <ion-item class="ion-no-padding" lines="none">
                        <ion-text v-if="!editRecipeName" color="medium">{{ currentRecipe.name }}</ion-text>
                        <ion-input v-else placeholder="Укажите название рецепта" v-model="recipeName" autocapitalize="on" maxlength="40"></ion-input>
                    </ion-item>
                </ion-item-group>

                <!-- Автор рецепта -->
                <ion-item-group class="ion-padding-horizontal" v-if="amIAnAuthorFunc(userEmail, currentRecipe.recipeAuthorEmail) === false">
                    <!-- Заголовок -->
                    <h4>Автор рецепта</h4>
                    <!--  -->
                    <ion-text color="medium">
                        {{ currentRecipe.recipeAuthorEmail }}
                    </ion-text>
                </ion-item-group>

                <!-- Категории рецепта -->
                <ion-item-group class="ion-padding-horizontal">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Категории</h4>
                    </ion-text>
                    <!--  -->
                    <ion-grid class="ion-no-padding">
                        <!-- Категория -->
                        <ion-chip v-for="(category, index) in currentRecipe.categories" :key="index" class="ion-no-margin ion-margin-vertical ion-margin-end" color="primary" style="position: relative; overflow: visible">
                            {{ category }}
                            <!-- Кнопка удалить выбранную категорию у рецепта -->
                            <ion-icon :icon="closeCircleOutline" style="position: absolute; right: -0.2rem; top: 0;" color="medium" @click.stop="openDeleteCategoryModal(category)"></ion-icon>
                        </ion-chip>

                        <!-- Кнопка добавления категории -->
                        <ion-chip v-if="currentRecipe.categories.length < 3" class="ion-no-margin ion-margin-vertical ion-margin-end" color="primary" outline="true" @click.stop="searchRecipesCategoriesMenu = true">
                            Добавить
                        </ion-chip>
                    </ion-grid>

                    <!-- Всплывашка подтверждение удаления категории предмета -->
                    <ion-action-sheet
                    :isOpen="deleteCategory"
                    header="Удалить категорию"
                    :buttons="deleteCategoryButtons"
                    @didDismiss="deleteCategory = false"
                    ></ion-action-sheet>
                </ion-item-group>

                <!-- Свайпер с фотками -->
                <!-- Если ЕСТЬ фото -->
                <swiper 
                    v-if="slides.length !== 0"
                    :modules="modules"
                    :pagination="true" 
                    :slides-per-view="1" 
                    :space-between="0"
                    :loop="false"
                    >
                    <swiper-slide
                        v-for="(slideContent, index) in slides"
                        :key="index"
                        :virtualIndex="index"
                        :style="setStyleProperties(index)"
                        style="position: relative"
                    >
                        {{slideContent}}
                        <div class="ion-margin-end ion-margin-top" style="position: absolute; top: 0; right: 0; background-color: rgba(255, 255, 255, 0.8); padding: 10px; display: flex; justify-content: center; align-items: center; border-radius: 100%;" @click.stop="deleteCurrentImg(index)">
                            <ion-icon 
                                slot="icon-only" 
                                :icon="trash"
                                color="danger"
                            ></ion-icon>
                        </div>
                    </swiper-slide>
                    <!-- Добавить фото -->
                    <swiper-slide v-if="slides.length < 3">
                        <div 
                            class="ion-no-padding ion-padding-horizontal"
                            style="height: 300px; width: 100%; background-color: var(--ion-color-system); color: white; display: flex; align-items: center; flex-direction: column; justify-content: center;"
                            @click.stop="addImageToSlide()"
                        >   
                            <ion-icon style="font-size: 36px;" :icon="cameraOutline"></ion-icon>
                            <ion-text class="ion-margin-top">Добавить фото</ion-text>
                        </div>
                    </swiper-slide>
                </swiper>
                <!-- Если НЕТ фото -->
                <div 
                    v-else
                    class="ion-no-padding ion-padding-horizontal"
                    style="height: 300px; width: 100%; background-color: var(--ion-color-system); color: white; display: flex; align-items: center; flex-direction: column; justify-content: center;"
                    @click.stop="addImageToSlide()"
                >   
                    <ion-icon style="font-size: 36px;" :icon="cameraOutline"></ion-icon>
                    <ion-text class="ion-margin-top">Добавить фото</ion-text>
                </div>

                <!-- Описание рецепта -->
                <ion-item-group class="ion-margin-top ion-padding-horizontal">
                    <!-- Заголовок -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <h4 class="ion-no-margin">Описание</h4>
                            <!--  -->
                            <ion-text v-if="!editRecipeDescription" color="primary" @click.stop="toggleEditRecipeDescription()">Изменить</ion-text>
                            <!--  -->
                            <ion-text v-else color="primary" @click.stop="toggleEditRecipeDescription()">Готово</ion-text>
                        </ion-row>
                    </ion-grid>

                    <!-- Контент -->
                    <div class="ion-margin-top">
                        <ion-text v-if="!editRecipeDescription" color="medium">{{ currentRecipe.recipeDescription }}</ion-text>
                        
                        <ion-textarea
                            v-else
                            class="ion-no-padding ion-margin-top" 
                            placeholder="Укажите описание"
                            autoGrow="true" 
                            autocapitalize="on"
                            v-model="recipeDescription"
                        ></ion-textarea>
                    </div>

                    <!--style="border-bottom: 1px solid var(--ion-color-light); padding-bottom: 0.8rem;"  -->
                </ion-item-group>

                <!-- Индикатор достатка ингредиентов на складе -->
                <!-- Иданный индикатор имеется только у ViewRecipe -->
                <ion-item-group class="ion-padding-horizontal ion-margin-top">
                    <!-- ДОСТАТОЧНО ингредиентов -->
                    <!-- <ion-chip color="success" class="ion-no-margin">
                        <ion-label>
                            Все ингредиенты в наличии
                        </ion-label>
                        <ion-icon :icon="checkmark"></ion-icon>
                    </ion-chip> -->

                    <!-- =============================== НЕДОСТАТОЧНО ингредиентов ============================= -->
                    <!-- Кнопка просмотра -->
                    <ion-grid>
                        <ion-row class="ion-justify-content-center">
                            <ion-chip v-if="notEnough" color="danger" class="ion-no-margin" @click="showPaucityIngredients">
                                <ion-label>
                                    Недостаточно ингредиентов
                                </ion-label>
                                <ion-icon :icon="alertOutline"></ion-icon>
                            </ion-chip>
                        </ion-row>
                    </ion-grid>

                    <!-- Модалка просмотра недостающих ингредиентов -->
                    <ion-modal :isOpen="isNotEnoughModalOpened">
                        <!--  -->
                        <ion-header translucent="true">
                            <ion-toolbar>
                                <ion-buttons slot="start">
                                    <ion-button @click="isNotEnoughModalOpened = false, itemsOutOfStock = [], itemsWhereIsNotEnoughIngredients = []">Закрыть</ion-button>
                                </ion-buttons>
                            </ion-toolbar>
                        </ion-header>

                        <!--  -->
                        <ion-content forceOverscroll="false" class="ion-margin-top ion-padding-bottom">

                            <div v-if="itemsWhereIsNotEnoughIngredients.length !== 0" class="ion-margin-vertical">

                                <!--  -->
                                <ion-item-group class="ion-padding-horizontal">
                                    <ion-text>
                                        <h4>Не хватает следующих ингредиентов:</h4>
                                    </ion-text>
                                </ion-item-group>
    
                                <!--  -->
                                <ion-item-group class="ion-padding-horizontal">
                                    <ion-text>Это есть на складе, но недостаточно</ion-text>
                                    (кол-во: {{ itemsWhereIsNotEnoughIngredients.length }})
                                    <div v-for="(item, index) in itemsWhereIsNotEnoughIngredients" :key="index">
                                        П/п: {{ index + 1 }} <br>
                                        Ингредиент: {{ item.name }} <br>
                                        Мера: {{ item.estimationType }} <br>
                                        Требуемое количество: {{  item.needQty  }} <br>
                                        Количество на складе: {{ item.warehouseQty }} <br>
                                    </div>
                                </ion-item-group>
                            </div>

                            <div v-if="itemsOutOfStock.length !== 0" class="ion-margin-vertical">

                                <!--  -->
                                <ion-item-group class="ion-padding-horizontal">
                                    <ion-text>Этого нет на складе</ion-text>
                                    (кол-во: {{ itemsOutOfStock.length }})
                                    <div v-for="(item, index) in itemsOutOfStock" :key="index">
                                        П/п: {{ index + 1 }} <br>
                                        Ингредиент: {{ item.name }} <br>
                                        Мера: {{ item.estimationType }} <br>
                                        Требуемое количество: {{ item.needQty }} <br>
                                        Количество на складе: {{ item.warehouseQty }}
                                    </div>
                                </ion-item-group>
                            </div>

                            <br>
                            <br>
                            <br>
                        </ion-content>
                    </ion-modal>

                </ion-item-group>
                
                <!-- СОСТАВ -->
                <ion-item-group class="ion-padding-horizontal">
                    <!-- Заголовок -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center ion-margin-vertical">
                            <!--  -->
                            <h4 class="ion-no-margin">Состав</h4>
                            <!--  -->
                            <ion-text v-if="!editComposition" @click.stop="editComposition = true" color="primary">Изменить</ion-text>
                            <!--  -->
                            <ion-text v-else @click.stop="editCompositionFunc()" color="primary">Готово</ion-text>
                        </ion-row>
                    </ion-grid> 

                    <!--  -->
                    <div>
                        <!-- 
                            Чайная ложка – 5 мл это примерно 5 грамм
                            Десертная ложка — 10 мл жидкости — 10 грамм
                            Столовая ложка — 15 мл жидкости — 15 грамм
                            Щепотка – 2-4 грамма
                        -->
                        <!-- Элементы состава -->
                        <div v-for="(element, n) in currentRecipe.composition" :key="n" >
    
                            <!-- Названия элемента состава -->
                            <ion-item class="ion-no-padding">
                                <ion-icon v-if="editComposition" :icon="closeCircleOutline" style="margin-right: 0.4rem; min-width: 17px;" color="danger" @click.stop="openDeleteCompositionItemMenu(n)"></ion-icon>
                                <ion-text color="primary" @click.stop="expendList(`ri + ${n}`)">
                                    {{(n + 1)}}. {{element.name}}
                                </ion-text>
                            </ion-item>
    
                            <!-- Ингредиенты элемента -->
                            <div :id="`ri + ${n}`" style="display: none">
                                <!-- перебор массива ингредиентов -->
                                <div v-for="(ingredient, idx) in element.ingredients" :key="idx" class="ion-no-padding" style="margin-top: 1rem;">
                                    <!-- в режиме редактирования -->
                                    <ion-item-sliding v-if="editComposition">
                                        <ion-item lines="none" style="--inner-padding-end: none">
                                            <ion-grid class="ion-no-padding">
                                                <ion-row class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap;">
                                                    <!--  -->
                                                    <div style="display: flex; flex-direction: column;">

                                                        <!--  -->
                                                        <ion-text>{{ ingredient.name }}
                                                            <span @click.prevent.stop="openActionSheetCurrentCostEstimationMenu(ingredient)" style="border-bottom: 1px dashed var(--ion-color-primary); color: var(--ion-color-primary); white-space: nowrap;">
                                                                {{setIngredientEstimation(ingredient.costEstimation)}}
                                                            </span>
                                                        </ion-text>
                                                        <!--  -->
                                                        <div style="display: flex; align-items: center; margin-top: 0.5rem;">
                                                            <ion-text color="medium" class="ion-margin-end" style="font-size: 1rem;">Укажите кол-во:</ion-text>
                                                            <ion-input style="font-size: 1.3rem; font-weight: bold;" v-model="ingredient.value" class="ion-no-padding" color="primary" inputmode="decimal" @ionChange="setCurrentIngredientValue(ingredient.value, idx, n)"></ion-input>
                                                        </div>

                                                    </div>
                                                    <!--  -->
                                                    <ion-thumbnail class="thumbnail_deal-subject" style="background-color: var(--ion-color-light);">
                                                        <ion-img :src="setImgSrc(ingredient.name)"></ion-img>
                                                    </ion-thumbnail>
                                                </ion-row>
                                            </ion-grid>
                                        </ion-item>
                                        <ion-item-options side="end">
                                            <ion-item-option class="ion-margin-start" color="danger" @click.stop="deleteCompisitionItemIngredientMenu(idx, n)">
                                                <ion-icon slot="icon-only" :icon="trash"></ion-icon>
                                            </ion-item-option>
                                        </ion-item-options>
                                    </ion-item-sliding>
                                    <!-- без режима редактирования -->
                                    <ion-grid v-else class="ion-no-padding">
                                        <ion-row class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap;" :class="{isNotEnoughIbgredients: ingredient.value > userWarehouseIngredientsQty(ingredient)}">
                                            <div style="display: flex; flex-direction: column;" class="ion-padding-start">
                                                <ion-text>{{ingredient.name}}</ion-text>
                                                <ion-text class="warehouse-item_qty" style="margin-top: 0.5rem">
                                                    <span>{{ingredient.value}} </span> / ~{{ userWarehouseIngredientsQty(ingredient) }} {{setMeasure(ingredient.costEstimation)}}
                                                </ion-text>
                                            </div>
                                            <ion-thumbnail class="thumbnail_deal-subject">
                                                <ion-img :src="setImgSrc(ingredient.name)"></ion-img>
                                            </ion-thumbnail>
                                        </ion-row>
                                    </ion-grid>
                                </div>

                                <!-- кнопка добавления нового ингредеиента к определенному элементу состава -->
                                <div v-if="editComposition" class="ion-margin-vertical" @click.stop="addCompositionItemIngredient(n)">
                                    <ion-text color="primary" class="ion-margin-start button-add-ingredient">Добавить ингредиент</ion-text>
                                </div>
                            </div>

                        </div>

                        <!-- Кнопка ДОБАВИТЬ Элемент к составу -->
                        <ion-grid class="ion-no-padding" v-if="editComposition">
                            <ion-row>
                                <ion-chip class="ion-no-margin ion-margin-top" color="primary" outline="true" @click.stop="addCompositionItem()">Добавить</ion-chip>
                            </ion-row>
                        </ion-grid>
                    </div>

                    <!-- всплывашка подтверждения удаления composition item -->
                    <ion-action-sheet
                        :isOpen="deleteCompositionItem"
                        header="Удалить позицию из состава"
                        :buttons="deleteCopmositionItemButtons"
                        @didDismiss="deleteCompositionItem = false"
                    ></ion-action-sheet>

                    <!-- всплывашка подтверждение удаления current ingredient в composition item -->
                    <ion-action-sheet
                        :isOpen="deleteCompisitionItemIngredient"
                        header="Удалить ингредиент из состава?"
                        :buttons="compositionItemIngredientButtons"
                        @didDismiss="deleteCompisitionItemIngredient = false"
                    ></ion-action-sheet>
                </ion-item-group>

                <!-- ПРОЦЕСС -->
                <ion-item-group class="ion-padding-vertical">
                    <!-- Заголовок -->
                    <ion-grid class="ion-no-padding ion-margin-horizontal">
                        <ion-row class="ion-justify-content-between ion-align-items-center ion-margin-vertical">
                            <h4 class="ion-no-margin">Процесс приготовления</h4>
                            <!--  -->
                            <ion-text v-if="!editRecipeProcess" color="primary" @click.stop="editRecipeProcess = true">Изменить</ion-text>
                            <!--  -->
                            <ion-text v-else @click.stop="editRecipeProcessFunc()" color="primary">Готово</ion-text>
                        </ion-row>
                    </ion-grid>

                    <!-- Контент -->
                    <ion-list>
                        <ion-reorder-group :disabled="!editRecipeProcess" @ionItemReorder="handleReorderProcess($event)">
                            <div v-for="(step, index) in steps" :key="index" style="display: flex; border-bottom: 1px solid var(--ion-color-light)" class="ion-margin-horizontal">
                                <!-- Кнопка удалить current step -->
                                <ion-icon v-if="editRecipeProcess" :icon="closeCircleOutline" color="danger" @click.stop="openDeleteStepsMenu(index)" style="margin: auto 0; font-size: 24px"></ion-icon>
                                <!-- В режиме редактирования -->
                                <ion-textarea v-if="editRecipeProcess" v-model="step.text" auto-grow="true" class="ion-margin-start" placeholder="Опишите действие" autocapitalize="on" rows="1" @ionBlur="checkEmptyStrings(step)"></ion-textarea>
                                <!-- Без режима редактирования -->
                                <ion-text v-else class="ion-margin-vertical" color="medium">{{ index + 1 }}. {{step.text}}</ion-text>
                                <!-- ползунок реордера -->
                                <ion-reorder slot="end" style="margin: auto 0;"></ion-reorder>
                            </div>
                        </ion-reorder-group>
                    </ion-list>

                    <!-- Кпнока ДОБАВИТЬ ШАГ -->
                    <ion-grid class="ion-padding-horizontal" v-if="editRecipeProcess">
                        <ion-row>
                            <ion-chip class="ion-no-margin ion-margin-top" outline="true" color="primary" @click.stop="addProcessStep()">Добавить</ion-chip>
                        </ion-row>
                    </ion-grid>

                    <!-- Всплывашка подтверждение удаления шаг в процессе -->
                    <ion-action-sheet
                        :isOpen="deleteProcessStep"
                        header="Удалить шаг из процесса"
                        :buttons="deleteProcessStepButtons"
                        @didDismiss="deleteProcessStep = false"
                    ></ion-action-sheet>
                </ion-item-group>
                
                <!-- СБОРКА -->
                <ion-item-group class="ion-padding-top">
                    <!-- Заголовок -->
                    <ion-grid class="ion-no-padding ion-margin-horizontal">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <div>
                                <h4 class="ion-no-margin">Сборка</h4>
                                <ion-text color="medium">Осуществляем по порядку</ion-text>
                            </div>
                            <!--  -->
                            <ion-text v-if="reorderIsDisabled" @click.stop="toggleReorder()" color="primary">Изменить</ion-text>
                            <!--  -->
                            <ion-text v-else @click.stop="toggleReorder()" color="primary">Готово</ion-text>
                        </ion-row>
                    </ion-grid>
                    
                    <!-- Контент -->
                    <ion-list class="ion-margin-top">
                        <ion-reorder-group :disabled="reorderIsDisabled" @ionItemReorder="handleReorder($event)">
                            <ion-item v-for="(item, index) in currentRecipe.assembling" :key="index">
                                <ion-label>
                                    <ion-grid class="ion-no-padding">
                                        <ion-row class="ion-align-items-center" style="flex-wrap: nowrap;">
                                            <!-- Кнопка удалить current item -->
                                            <ion-icon v-if="!reorderIsDisabled" :icon="closeCircleOutline" color="danger" style="margin-right: 0.4rem; min-width: 17px;" @click.stop="openDeleteAssemblingItemMenu(index)"></ion-icon>
                                            <!-- current item -->
                                            <ion-text>{{ index + 1 }}. {{ item }}</ion-text>
                                        </ion-row>
                                    </ion-grid>
                                </ion-label>
                                <ion-reorder slot="end"></ion-reorder>
                            </ion-item>
                        </ion-reorder-group>
                    </ion-list>

                    <!-- Кнопка добавить элементв в сборку -->
                    <ion-grid class="ion-no-padding" v-if="!reorderIsDisabled">
                        <ion-row>
                            <ion-chip class="ion-margin" outline="true" color="primary" @click.stop="addAssemblingElement()">Добавить</ion-chip>
                        </ion-row>
                    </ion-grid>

                    <!-- Всплывашка подтверждение удаления item в сборке -->
                    <ion-action-sheet
                        :isOpen="deleteAssemblingItem"
                        header="Удалить элемент сборки"
                        :buttons="deleteAssemblingItemButtons"
                        @didDismiss="deleteAssemblingItem = false"
                    ></ion-action-sheet>
                </ion-item-group>

                <!-- Модалка добавления item + ingredients к составу -->
                <ion-modal :isOpen="addCompositionItemModalOpened">
                    <!--  -->
                    <ion-header translucent="true">
                        <ion-toolbar>
                            <ion-buttons slot="start">
                                <ion-button @click.stop="closeCompositionItemModal()">Отменить</ion-button> 
                            </ion-buttons>
                            <ion-title>Добавить к составу</ion-title>
                            <ion-buttons slot="end"></ion-buttons>
                        </ion-toolbar>
                    </ion-header>
                    <!--  -->
                    <ion-content forceOverscroll="false" class="ion-margin-top ion-padding-bottom">
                        {{newCompositionItem}}
                        <ion-item-group class="ion-padding-horizontal">
                            <!--  -->
                            <ion-text>
                                <h4>Название</h4>
                            </ion-text>
                            <!--  -->
                            <ion-input placeholder="Укажите название" v-model="newCompositionItem.name" maxlength="40" autocapitalize="on"></ion-input>
                        </ion-item-group>
                        <!--  -->
                        <ion-item-group>
                            <!--  -->
                            <ion-text>
                                <h4 class="ion-margin-horizontal">Ингредиенты</h4>
                            </ion-text>
                            <!--  -->
                            <div v-if="newCompositionItem.ingredients && newCompositionItem.ingredients.length !== 0" v-for="(ingredient, index) in newCompositionItem.ingredients" :key="index" style="margin-top: 1rem;">
                                <ion-item-sliding>
                                    <!-- ингредиент -->
                                    <ion-item lines="none">
                                        <ion-grid class="ion-no-padding border-bottom">
                                            <ion-row class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap;">
                                                <div style="display: flex; flex-direction: column;">
                                                    <ion-text>{{ingredient.name}} <span @click.prevent.stop="openActionSheetCostEstimationMenu(ingredient)" style="border-bottom: 1px dashed var(--ion-color-primary); color: var(--ion-color-primary); white-space: nowrap">{{setIngredientEstimation(ingredient.costEstimation)}}</span></ion-text>
                                                    <!--  -->
                                                    <div style="display: flex; align-items: center; margin-top: 0.7rem;">
                                                        <ion-text color="medium" class="ion-margin-end" style="font-size: 1rem;">Укажите кол-во:</ion-text>
                                                        <ion-input v-model="ingredient.value" type="number" style="font-size: 1.3rem; font-weight: bold;" class="ion-no-padding" color="primary" inputmode="decimal" @ionChange="setIngredientValue(ingredient.value, index)"></ion-input>
                                                    </div>
                                                </div>
                                                <ion-thumbnail class="thumbnail_deal-subject" style="background-color: var(--ion-color-light);">
                                                    <ion-img :src="setIngredientImg(ingredient.name)"></ion-img>
                                                </ion-thumbnail>
                                            </ion-row>
                                        </ion-grid>
                                    </ion-item>
                                    <!-- Кнопка удалить -->
                                    <ion-item-options side="end">
                                        <ion-item-option class="ion-margin-start" color="danger" @click.stop="deleteNewCompositionItemIngredientMenu(index)">
                                            <ion-icon slot="icon-only" :icon="trash"></ion-icon>
                                        </ion-item-option>
                                    </ion-item-options>
                                </ion-item-sliding>
                            </div>
                            <!-- <div v-else class="ion-padding-horizontal">
                                <ion-text color="medium">Нет ингредиентов</ion-text>
                            </div> -->
                            <!--  -->
                            <div class="ion-margin-top ion-padding-horizontal" @click.stop="addIngredientToCompositionItem()">
                                <ion-text color="primary" class="button-add-ingredient">Добавить ингредиент</ion-text>
                            </div>
                        </ion-item-group>
                        <!--  -->
                        <div style="position: fixed; bottom: 0; left: 0; width: 100%; background-color: #fff; z-index: 999999" class="ion-padding">
                            <ion-button @click.stop="addNewCompositionItem(newCompositionItem)" :color="addButtonIsDisabled() ? 'light' : 'primary'" expand="block">Добавить к составу</ion-button>
                        </div>
                        <!--  -->
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                    </ion-content>
                </ion-modal>

                <!-- Модалка добавления ингредиентов к current compistion item -->
                <ion-modal :isOpen="addIngredientToCurrentCompositionItemModalOpened">
                    <!--  -->
                    <ion-header translucent="true">
                        <ion-toolbar>
                            <ion-buttons slot="start">
                                <ion-button @click.stop="closeAddIngredientToCurrentCompositionItemModal()">Отменить</ion-button>
                            </ion-buttons>
                            <ion-title>Новый ингредиент</ion-title>
                            <ion-buttons slot="end"></ion-buttons>
                        </ion-toolbar>
                    </ion-header>
                    <!--  -->
                    <ion-content forceOverscroll="false" class="ion-margin-top ion-padding-bottom">
                        <!-- {{ currentCompositionItem }} -->
                        <br>
                        <ion-item-group class="ion-padding-horizontal">
                            <ion-text color="medium">Для элемента:</ion-text>
                            <ion-text>
                                <h4 style="border-bottom: 1px solid var(--ion-color-light)" class="ion-no-margin ion-padding-vertical">{{ currentCompositionItem.name }}</h4>
                            </ion-text>
                        </ion-item-group>
                        <!--  -->
                        <ion-item-group class="ion-padding-horizontal ion-margin-top">
                            <!--  -->
                            <ion-text 
                                v-if="currentCompositionItemNewIngredient.name === ''"
                                color="primary"
                                style="border-bottom: 1px dashed var(--ion-color-primary)"
                                @click.stop="newIngredientCurrentCompositionModalOpened = true"
                            >Выберите ингредиент</ion-text>
                            <!--  -->
                            <div v-else>
                                <!--  -->
                                <ion-item style="--inner-padding-end: none; --inner-padding-bottom: 1rem">
                                    <ion-grid class="ion-no-padding">
                                        <ion-row @click.stop="newIngredientCurrentCompositionModalOpened = true" class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap;">
                                            <!--  -->
                                            <ion-text color="primary">{{ currentCompositionItemNewIngredient.name }}</ion-text>
                                            <!--  -->
                                            <ion-thumbnail class="thumbnail_deal-subject" style="background-color: var(--ion-color-light); margin-left: 1rem;">
                                                <ion-img :src="setImgSrc(currentCompositionItemNewIngredient.name)"></ion-img>
                                            </ion-thumbnail>
                                        </ion-row>
                                    </ion-grid>
                                </ion-item>
                                <!--  -->
                                <ion-item class="ion-margin-top" lines="none" v-if="currentCompositionItemNewIngredient.costEstimation === ''">
                                    <ion-text 
                                        color="primary"
                                        style="border-bottom: 1px dashed var(--ion-color-primary)"  
                                        @click.stop="actionSheetCurrentCompositionItemNewIngredient = true"  
                                    >Укажите меру измерения</ion-text>
                                </ion-item>
                                <!--  -->
                                <div v-else>
                                    <ion-item class="ion-margin-top">
                                        <ion-grid class="ion-no-padding">
                                            <ion-row class="ion-justify-content-between ion-align-items-center">
                                                <ion-text @click.stop="actionSheetCurrentCompositionItemNewIngredient = true" color="primary">Мера измерения</ion-text>
                                                <ion-text>{{setMeasure(currentCompositionItemNewIngredient.costEstimation)}}</ion-text>
                                            </ion-row>
                                        </ion-grid>
                                    </ion-item>
                                    <!--  -->
                                    <ion-item class="ion-margin-top">
                                        <ion-grid class="ion-no-padding">
                                            <ion-row class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap;">
                                                <ion-text color="medium">Количество</ion-text>
                                                <ion-input v-model="currentCompositionItemNewIngredient.value" style="font-size: 1.3rem; font-weight: bold;" color="primary"  class="ion-text-end" inputmode="decimal" @ionChange="setNewIngredientValue(currentCompositionItemNewIngredient.value)"></ion-input>
                                            </ion-row>
                                        </ion-grid>
                                    </ion-item>
                                </div>
                            </div>
                        </ion-item-group>
                        <!--  -->
                        <div style="position: fixed; bottom: 0; left: 0; width: 100%; background-color: #fff; z-index: 999999" class="ion-padding">
                            <ion-button @click.stop="addCompositionItemIngredientFunc()" :color="addNewIngredientButtonIsDisabled() ? 'light' : 'primary'" expand="block">Добавить к составу</ion-button>
                        </div>
                        <!--  -->
                        <br>
                        <br>
                        <br>
                        <br>
                        {{ currentCompositionItemNewIngredient }}
                        <br>
                        <br>
                        <br>
                    </ion-content>
                </ion-modal>

                <!-- Всплывашка подтверждение удаления ингредиента у нового элемента composition -->
                <ion-action-sheet
                    :is-open="deleteNewCompositionItemIngredient"
                    header="Вы точно хотите удалить ингредиент?"
                    @didDismiss="deleteNewCompositionItemIngredient = false"
                    :buttons="deleteNewCompositionItemIngredientButtons"
                ></ion-action-sheet>

                <!-- Модалка по выбору / поиску предмета (ингредиента) к CURRENT composition item-->
                <SearchDealBuySubject
                    :isOpen="newIngredientCurrentCompositionModalOpened"
                    @closeModal="newIngredientCurrentCompositionModalOpened = false"
                    :properties="'isIngredient'"
                    @addItem="addIngredientToCurrentCompositionItem"
                />

                <!-- Модалка по выбору / поиску предмета (ингредиента) к NEW composition item-->
                <SearchDealBuySubject
                    :isOpen="ingredientForNewCompositionModalOpened"
                    @closeModal="ingredientForNewCompositionModalOpened = false"
                    :properties="'isIngredient'"
                    @addItem="addIngredientToCompositionItemFunc"
                />

                <!-- Модалка добавления item к сборке -->
                <ion-modal :isOpen="addAssemblingElementModalOpened">
                    <!--  -->
                    <ion-header translucent="true">
                        <ion-toolbar>
                            <ion-buttons slot="start">
                                <ion-button @click="addAssemblingElementModalOpened = false">Отменить</ion-button>
                            </ion-buttons>
                            <ion-title>Добавить к сборке</ion-title>
                            <ion-buttons slot="end"></ion-buttons>
                        </ion-toolbar>
                    </ion-header>
                    <!--  -->
                    <ion-content forceOverscroll="false" class="ion-margin-top" style="position: relative">
                        <!--  -->
                        <div v-if="currentRecipe.composition === null || currentRecipe.composition.length === 0" style="position: absolute; top: 40%; width: 100%; margin: 0 auto" class="ion-text-center">
                            <ion-text>Сначала добавьте элементы к составу</ion-text><br/>
                            <ion-button expand="block" fill="clear" @click.stop="fromAssemblingToComposition">Добавить</ion-button>
                        </div>
                        <!--  -->
                        <ion-item v-else v-for="(item, index) in currentRecipe.composition" :key="index" @click.stop="addToAssembling(item.name)">
                            {{item.name}}
                        </ion-item>
                    </ion-content>
                </ion-modal>

                <!-- Вкл / Выкл на продажу в магазин рецептов -->
                <ion-item-group class="ion-padding-vertical ion-padding-horizontal">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Продажа рецепта</h4>
                    </ion-text>
                    <!--  -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-text color="medium">
                                Выставлен на продажу
                            </ion-text>
                            <ion-toggle color="success" @click.stop="toggleRecipeToStore"></ion-toggle>
                        </ion-row>
                    </ion-grid>
                </ion-item-group>

                <!-- Модалка выбора категори -->
                <ion-modal :isOpen="searchRecipesCategoriesMenu">

                    <!-- Поиск -->
                    <ion-searchbar
                    class="ion-text-left"
                    placeholder="Поиск..."
                    v-model="searchRecipesCategories"
                    show-cancel-button="always"
                    cancelButtonText="Отменить"
                    @ionCancel="searchRecipesCategoriesMenu = false"
                    ></ion-searchbar>

                    <!-- Контент -->
                    <ion-content style="height: 90vh">
                    <!-- Если есть данные -->
                    <ion-item v-for="(category) in searchedRecipesCategories" :key="category.id" @click="choosenCategory(category)">
                        <ion-grid class="ion-no-padding">
                            <ion-row class="ion-justify-content-between ion-align-items-center">
                                <ion-text>{{ category }}</ion-text>
                            </ion-row>
                        </ion-grid>
                    </ion-item>
                    
                    <!-- Если ничего подходящего нет или нет данных -->
                    <div v-if="searchedRecipesCategories.length <= 0" class="ion-margin-top ion-margin-horizontal">
                    <!-- <div v-if="searchedRecipesCategories.length <= 0" class="ion-margin-top ion-margin-horizontal"> -->
                        <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-text color="medium">Ничего не найдено</ion-text>
                        </ion-row>
                        </ion-grid>
                    </div>
                    
                    </ion-content>
                </ion-modal>

                <!-- Кнопка удалить РЕЦЕПТ -->
                <ion-grid>
                    <ion-row class="ion-justify-content-center">
                        <ion-button fill="clear" color="danger" @click="openDeleteMenu">Удалить рецепт</ion-button>
                    </ion-row>
                </ion-grid>

                <!-- Всплывашка подтверждение удаления рецепта -->
                <ion-action-sheet
                    :is-open="isOpenRef"
                    header="Вы точно хотите удалить рецепт?"
                    @didDismiss="isOpenRef = false"
                    :buttons="deleteCurrentRecipeButtons"
                ></ion-action-sheet>

                <!-- Всплывашка изменения cost estimation у конкретного ингредиента в составе-->
                <!-- для нового элемента состава -->
                <ion-action-sheet
                    :isOpen="actionSheetIngredientCostEstimation"
                    header="Сменить меру измерения"
                    :buttons="ingredientChangeCostEstimationButtons"
                    @didDismiss="actionSheetIngredientCostEstimation = false"
                ></ion-action-sheet>
                <!-- для current элемента состава -->
                <ion-action-sheet
                    :isOpen="actionSheetCurrentIngredientCostEstimation"
                    header="Сменить меру измерения"
                    :buttons="currentIngredientChangeCostEstimationButtons"
                    @didDismiss="actionSheetCurrentIngredientCostEstimation = false"
                ></ion-action-sheet>
                <!-- для current composition item -->
                <ion-action-sheet
                    :isOpen="actionSheetCurrentCompositionItemNewIngredient"
                    header="Мера измерения"
                    :buttons="actionSheetCurrentCompositionItemNewIngredientButtons"
                    @didDismiss="actionSheetCurrentCompositionItemNewIngredient = false"
                > 
                </ion-action-sheet>
                <br>
                {{currentRecipe}}
            </div>

        </ion-content>
    </div>
</template>

<script>
    import { defineComponent, ref, watch, onMounted, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { supabase } from '../../supabase/init';
    import store from '../../store/index';
    //
    import { IonContent, IonItemGroup, IonButton, IonActionSheet, IonGrid, IonRow, IonToggle, IonInput, IonText, IonItem, IonChip, IonIcon, IonTextarea, IonLabel, IonThumbnail, IonImg, IonModal, IonSearchbar, IonList, IonReorderGroup, IonReorder, IonItemSliding, IonItemOptions, IonItemOption, IonHeader, IonToolbar, IonButtons, IonTitle } from '@ionic/vue';
    import { closeCircleOutline, checkmark, alertOutline, trash, cameraOutline } from 'ionicons/icons'
    //
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Virtual, Pagination } from 'swiper';
    import 'swiper/css';
    import 'swiper/css/pagination';
    import '@ionic/vue/css/ionic-swiper.css';
    //
    import Spinner from '../../components/Spinner.vue';
    import ViewHeader from '../../components/headers/HeaderViewCurrent.vue';
    import SearchDealBuySubject from '../../components/modal/SearchDealBuySubject.vue'
    //
    import { searchWarehouseCategoryFilter } from '../../helpers/filterWarehouseCategories';
    import { sortAlphabeticallyWarhouseItem } from "../../helpers/sortDealSubject";
    // import { sortAlphabetically } from '../../helpers/sortDealSubject';
    // import { searchWarehouseItemFilter } from '../../helpers/filterUserWarehouseItems';

    export default defineComponent({
        name: 'View-recipe',
        components: {
            ViewHeader, Spinner,
            //
            IonContent, IonItemGroup, IonButton, IonActionSheet, IonGrid, IonRow, IonToggle, IonInput, IonText, IonItem, IonChip, IonIcon, IonTextarea, IonLabel, IonThumbnail, IonImg, IonModal, IonSearchbar, IonList, IonReorderGroup, IonReorder, IonItemSliding, IonItemOptions, IonItemOption, IonHeader, IonToolbar, IonButtons, IonTitle,
            //
            Swiper, SwiperSlide, SearchDealBuySubject
        },
        setup() {
            //
            const route = useRoute();
            const router = useRouter();
            // Get current info of route
            const currentId = route.params.recipeId;
            const info = route.params;
            // console.log(info.recipeId)
            const currentRecipe = ref(JSON.parse(info.recipe))
            // Массив пользователя с вариантам категорий для рецептов
            const userRecipesCategories = ref()
            // Массив предметов на складе пользваотеля
            const userWarehouseItemsArray = ref()
            //
            const spinner = ref(null);
            //
            const isOpenRef = ref(false)
            //
            // userWarehouseItemsArray.value = store.state.userWarehouseArray
            onMounted( async () => {
                userRecipesCategories.value = store.state.recipesCategoriesArray
                await store.methods.getUserWarehouseItemsFromDB()
                userWarehouseItemsArray.value = store.state.userWarehouseArray
                userWarehouseItemsArray.value.forEach(item => nameWarehouseItems.value.push(item.name))
            })
            //
            const openDeleteMenu = () => {
                isOpenRef.value = true
            }
            const deleteCurrentRecipeButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteCurrentRecipe()
                    }
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                }
            ] 
            const deleteCurrentRecipe = async () => {
                // console.log(currentId)
                try {
                    const { error } = await supabase.from('userRecipes').delete().eq('id', currentId)
                    if(error) throw error
                    //router.push({ name: 'Recipes' })
                    router.go(-1)
                    alert('Wiew Recipe: Рецепт удален из книги')
                } catch (error) {
                    // Удалить если не понадобится
                    // alert(`Error: ${error.message}`)
                }
            }
            // Проверка является ли пользватель автором рецепта
            const userEmail = ref(store.state.userEmail)
            const amIAnAuthorFunc = (userEmail, recipeAuthorEmail) => {
                if(userEmail === recipeAuthorEmail) {
                    return true
                } else {
                    return false
                }
            }
            //
            const recipeName = ref(currentRecipe.value.name)
            const editRecipeName = ref(false)
            const toggleEditRecipeName = async () => {
                if(!editRecipeName.value) {
                    editRecipeName.value = true;

                } else if(editRecipeName.value){
                    if(recipeName.value === '') {
                        alert('ViewRecipe: Название обязательно!')
                    } else {
                        // console.log(recipeName.value)
                        currentRecipe.value.name = recipeName.value
                        currentRecipe.value.value = recipeName.value
                        // 
                        spinner.value = true;
                        try {
                            // Вынести в store?
                            // console.log(`Deal ${currentId} is updated`);
                            //
                            const {error} = await supabase.from('userRecipes').update({
                                name: currentRecipe.value.name,
                                value: currentRecipe.value.value
                            }).eq('id', info.recipeId);
                            if(error) throw error;
                            spinner.value = false;
                            // Дело успешно обновлено
                            editRecipeName.value = false;
                        } catch (error) {
                            // alert(`Error: ${error.message}`)
                        }
                    }
                }
            }
            // 
            const recipeDescription = ref(currentRecipe.value.recipeDescription)
            const editRecipeDescription = ref(false)
            const toggleEditRecipeDescription = async () => {
                if(!editRecipeDescription.value) {
                    editRecipeDescription.value = true

                } else if (editRecipeDescription.value) {
                    if(recipeDescription.value === '') {
                        alert('ViewRecipe: Описание рецепта не может быть пустым')
                    } else {
                        currentRecipe.value.recipeDescription = recipeDescription.value
                        spinner.value = true;
                        try {
                            // Вынести в store?
                            // console.log(`Deal ${currentId} is updated`);
                            //
                            const {error} = await supabase.from('userRecipes').update({
                                recipeDescription: currentRecipe.value.recipeDescription
                            }).eq('id', info.recipeId);
                            if(error) throw error;
                            spinner.value = false;
                            // Дело успешно обновлено
                            editRecipeDescription.value = false
                        } catch (error) {
                            // alert(`Error: ${error.message}`)
                        }
                    }
                }
            }
            //
            const steps = ref(currentRecipe.value.process)
            //
            // ============================ Удаление категории у предмета ===============================================
            // Вызываем action sheet уведомление в качестве подтверждения
            const deleteCategory = ref(false);
            // Храним категорию предмета к удалению
            const categoryToDelete = ref();
            //удаляем current category в предмете (обнолвений в БД здесь не производится)
            const openDeleteCategoryModal = (category) => {
                if(currentRecipe.value.categories.length === 1) {
                    alert('ViewRecipe: должна быть указана хотя бы одна категория')
                } else {
                    categoryToDelete.value = category;
                    deleteCategory.value = true
                }
            }
            const deleteCategoruFunc = async (category) => {
                currentRecipe.value.categories = currentRecipe.value.categories.filter(item => item !== category)
                // 
                spinner.value = true;
                try {
                    const {error} = await supabase.from('userRecipes').update({
                        categories: currentRecipe.value.categories
                    }).eq('id', info.recipeId);
                    if(error) throw error;
                    spinner.value = false;
                    // Рецепт успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
            }
            //
            const deleteCategoryButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteCategoruFunc(categoryToDelete.value)
                    }
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                }
            ]

            //
            const expendList = (el) => {
                let item = document.getElementById(el)
                if(item) {
                    item.style.display == 'none' ? item.style.display = 'block' : item.style.display = 'none'
                }
                // console.log(document.getElementById(el))
            }
            //
            const setImgSrc = (recipeName) => {
                let dealBuySubjectArray = store.state.dealBuySubjectArray
                let ingredientValue;
                dealBuySubjectArray.filter(item => {
                    if(item.name === recipeName ) {
                        ingredientValue = item.value
                    }
                })
                // console.log(ingredientValue) 
                return `../img/subjects/buy/${ingredientValue}.webp`
            }
            //
            const setIngredientImg = (recipeName) => {
                let dealBuySubjectArray = store.state.dealBuySubjectArray
                let ingredientValue;
                dealBuySubjectArray.filter(item => {
                    if(item.name === recipeName) {
                        ingredientValue = item.value
                    }
                })
                return `../img/subjects/buy/${ingredientValue}.webp`
            }

            //
            const searchRecipesCategoriesMenu = ref(false);
            const searchRecipesCategories = ref('');
            // ПОЛЬЗОВАТЕЛЬСКИЕ КАТЕГОРИИ
            const searchedRecipesCategories = computed(() => {
                const sortedRecipesCategoriesArray = sortAlphabeticallyWarhouseItem(userRecipesCategories.value)
                return searchWarehouseCategoryFilter(sortedRecipesCategoriesArray, searchRecipesCategories.value)
            })
            // Проверяем добавлена уже категория к предмету или нет
            const isCategoryAlreadyAdded = ref();
            // Переменная для категории к добавлению
            const newCategory = ref()
            const choosenCategory = async (category) => {
            isCategoryAlreadyAdded.value = currentRecipe.value.categories.find(item => item === category)
                if(isCategoryAlreadyAdded.value !== undefined) {
                    alert('NewRecipe-modalCreate: категория уже добавлена к рецепту')
                } else if (currentRecipe.value.categories.length >= 3) {
                    alert('NewRecipe-modalCreate: Вы добавили максимально количество категорий')
                } else {
                    searchRecipesCategories.value = ''
                    searchRecipesCategoriesMenu.value = false
                    newCategory.value = category
                    console.log(newCategory.value)
                    currentRecipe.value.categories.push(newCategory.value)
                }
                // 
                spinner.value = true;
                try {
                    const {error} = await supabase.from('userRecipes').update({
                        categories: currentRecipe.value.categories
                    }).eq('id', info.recipeId);
                    if(error) throw error;
                    spinner.value = false;
                    // Рецепт успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
            }

            //
            const setMeasure = (costEstimation) => {
                if(costEstimation === 'perKilogram') {
                    return 'гр.'
                } else if(costEstimation === 'perUnit') {
                    return 'шт.'
                } else if(costEstimation === 'teaSpoon') {
                    return 'ч.л.'
                } else if (costEstimation === 'pinch') {
                    return 'щепотки'
                } else if (costEstimation === 'stick') {
                    return 'палочки'
                }
            }

            // Должны браться из БД
            //'slide 1', 'slide 2', 'slide 3'
            const slides = ref(['slide', 'slide', 'slide'])
            // Стили для слайдера
            const setStyleProperties = (index) => {
                return `height: 300px; background-color: #${index}${index}${index}; color: white`
            }

            //
            const addProcessStep = () => {
                if(currentRecipe.value.process === null) {
                    currentRecipe.value.process = []
                    currentRecipe.value.process.push({
                        text: ''
                    })
                    steps.value = currentRecipe.value.process
                } else {
                    currentRecipe.value.process.push({
                        text: ''
                    })
                }
            }

            //
            const addAssemblingElementModalOpened = ref(false)
            const addAssemblingElement = () => {
                addAssemblingElementModalOpened.value = true;
            }
            const addToAssembling = async (itemName) => {
                if(currentRecipe.value.assembling === null) {
                    currentRecipe.value.assembling = []
                    currentRecipe.value.assembling.push(itemName)
                } else {
                    currentRecipe.value.assembling.push(itemName)
                }
                spinner.value = true;
                try {
                    const {error} = await supabase.from('userRecipes').update({
                        assembling: currentRecipe.value.assembling
                    }).eq('id', info.recipeId);
                    if(error) throw error;
                    spinner.value = false;
                    // Рецепт успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
                addAssemblingElementModalOpened.value = false;
            }

            //
            const reorderIsDisabled = ref(true);
            const toggleReorder = () => {
                reorderIsDisabled.value = !reorderIsDisabled.value
            }
            const handleReorder = async (event) => {
                // console.log('Dragged from index', event.detail.from, 'to', event.detail.to);
                currentRecipe.value.assembling = event.detail.complete(currentRecipe.value.assembling);
                //
                spinner.value = true;
                try {
                    const {error} = await supabase.from('userRecipes').update({
                        assembling: currentRecipe.value.assembling
                    }).eq('id', info.recipeId);
                    if(error) throw error;
                    spinner.value = false;
                    // Рецепт успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
            }

            // ============================== УДАЛЕНИЕ ЭЛЕМЕНТА В СПИСКЕ СБОРКИ ==================================
            // Вызываем action sheet уведомление в качестве подтверждения
            const deleteAssemblingItem = ref(false);
            // Храним элементы сборки рецепта к удалению
            const assemblingItemToDeleteIndex = ref();
            //Открываем меню подтверждения удаления
            const openDeleteAssemblingItemMenu = (index) => {
                assemblingItemToDeleteIndex.value = index;
                deleteAssemblingItem.value = true;
            }
            // функционал кнопок в меню подветрждения удаления элементы сборки
            const deleteAssemblingItemButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteAssemblingItemFunc(assemblingItemToDeleteIndex.value)
                    }
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                }
            ]            
            // функция удаления элемента
            const deleteAssemblingItemFunc = async (index) => {
                if(index > -1) {
                    currentRecipe.value.assembling.splice(index, 1)
                    //
                    spinner.value = true;
                    try {
                        const {error} = await supabase.from('userRecipes').update({
                            assembling: currentRecipe.value.assembling
                        }).eq('id', info.recipeId);
                        if(error) throw error;
                        spinner.value = false;
                        // Рецепт успешно обновлено
                    } catch (error) {
                        // alert(`Error: ${error.message}`)
                    }
                }
            }

            // =============================== УДАЛЕНИЯ ШАГА В СПИСКЕ ПРОЦЕССА ПРИГОТОВЛЕНИЯ ==========================
            // Вызываем action sheet уведомление в качестве подтверждения
            const deleteProcessStep = ref(false);
            // Храним step из списка шагов процесса приготовления к удалению
            const processStepToDeleteIndex = ref();
            const openDeleteStepsMenu = (index) => {
                if(currentRecipe.value.process.length === 1) {
                    alert('ViewRecipe: Нельзя удалить. Должен быть указан хотя бы один шаг')
                } else {
                    processStepToDeleteIndex.value = index;
                    deleteProcessStep.value = true;
                }
            }
            // кнопки в меню подтверждения удаления шага из процесса
            const deleteProcessStepButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteProcessStepFunc(processStepToDeleteIndex.value)
                    }
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                }
            ]
            //
            const deleteProcessStepFunc = async (index) => {
                if(index > -1) {
                    currentRecipe.value.process.splice(index, 1)
                    //
                    spinner.value = true;
                    try {
                        const {error} = await supabase.from('userRecipes').update({
                            process: currentRecipe.value.process
                        }).eq('id', info.recipeId);
                        if(error) throw error;
                        spinner.value = false;
                        // Рецепт успешно обновлено
                    } catch (error) {
                        // alert(`Error: ${error.message}`)
                    }
                }
            }

            //
            const editRecipeProcess = ref(false)
            const editRecipeProcessFunc = () => {
                let emptyString = []
                steps.value.forEach(item => {
                    if(item.text === '') {
                        emptyString.push(item.text)
                    }
                })
                if(emptyString.includes('')) {
                    alert('View Recipe: Шаг процесса не может быть пустым')
                } else {
                    editRecipeProcess.value = !editRecipeProcess.value
                    updateProcess()
                }
            }
            //
            const handleReorderProcess = async (event) => {
                steps.value = event.detail.complete(steps.value);
                //
                spinner.value = true;
                try {
                    const {error} = await supabase.from('userRecipes').update({
                        process: currentRecipe.value.process
                    }).eq('id', info.recipeId);
                    if(error) throw error;
                    spinner.value = false;
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
            }

            // ============================================= РАБОТА С NEW ЭЛЕМЕНТОМ СОСТАВА =====================================
            const addCompositionItemModalOpened = ref(false);
            const newCompositionItem = ref({})
            const addCompositionItem = () => {
                addCompositionItemModalOpened.value = true
                newCompositionItem.value = {
                    name: '',
                    ingredients: [
                        // {
                        //     name: "Сливочное масло",
                        //     costEstimation: "perKilogram",
                        //     value: 100
                        // },
                    ]
                }
            }
            //
            const addButtonIsDisabled = () => {
                let isValueZero = []
                let isNoCostEstimation = []
                newCompositionItem.value.ingredients.forEach(item => isValueZero.push(item.value))
                newCompositionItem.value.ingredients.forEach(item => isNoCostEstimation.push(item.costEstimation))
                if(newCompositionItem.value.name === '') {
                    return true
                } else if (isNoCostEstimation.includes('')) {
                    return true
                } else if (newCompositionItem.value.ingredients && newCompositionItem.value.ingredients.length === 0 ) {
                    return true
                } else if (isValueZero.includes(0) || isValueZero.includes("0")) {
                    return true
                } else {
                    return false
                }
            }
            //
            const addNewIngredientButtonIsDisabled = () => {
                if(currentCompositionItemNewIngredient.value.name === '') {
                    return true
                } else if (currentCompositionItemNewIngredient.value.costEstimation === '') {
                    return true
                } else if (currentCompositionItemNewIngredient.value.value === 0) {
                    return true
                } else {
                    return false
                }
            }
            //
            const ingredientForNewCompositionModalOpened = ref(false)
            // Открываем модалку создания NEW composition item
            const addIngredientToCompositionItem = () => {
                ingredientForNewCompositionModalOpened.value = true;
            }
            // Проверяем добавлена ли ингредиент к NEW composition item, если НЕТ - пушим к массиву ингредиентов у NEW composition item
            const isIngredientAlreadyAdded = ref()
            const addIngredientToCompositionItemFunc = (ingredientData) => {
                isIngredientAlreadyAdded.value = newCompositionItem.value.ingredients.find(item => item.name ===  ingredientData.name)
                if(isIngredientAlreadyAdded.value !== undefined) {
                    alert('ViewRecipe: ингредиент уже добавлен')
                } else {
                    ingredientForNewCompositionModalOpened.value = false;
                    newCompositionItem.value.ingredients.push({
                        name: ingredientData.name,
                        costEstimation: '',
                        value: 0
                    })
                }
            }
            //
            const setIngredientValue = (ingredientValue, index) => {
                console.log(+ingredientValue)
                newCompositionItem.value.ingredients[index].value = ingredientValue
            }
            //
            const setNewIngredientValue = (ingredientValue) => {
                console.log(+ingredientValue)
                currentCompositionItemNewIngredient.value.value = ingredientValue
            }
            //
            const setCurrentIngredientValue = (ingredientValue, idx, n) => {
                console.log(+ingredientValue)
                currentRecipe.value.composition[n].ingredients[idx].value = ingredientValue
                updateComposition()
            }
            //
            const addNewCompositionItem = async (item) => {
                if(newCompositionItem.value.name === '') {
                    alert('ViewRecipe: Надо указать название элемента состава')
                } else if (newCompositionItem.value.ingredients.length === 0) {
                    alert('ViewRecipe: Надо добавить хотя бы один ингредиент')
                } else {
                    let costEstimations = []
                    let qty = []
                    item.ingredients.forEach(item => {
                        costEstimations.push(item.costEstimation);
                        qty.push(item.value)
                    })
                    if(costEstimations.includes('')) {
                        alert('ViewRecipe: в одном из ингредиентов не указан тип измерения')
                    } else if (qty.includes(0)) {
                        alert('ViewRecipe: в одном из ингредиентов не указан необходимый для рецепта вес или кол-во')
                    } else {
                        if(currentRecipe.value.composition === null) {
                            currentRecipe.value.composition = []
                            currentRecipe.value.composition.push(item)
                        } else {
                            currentRecipe.value.composition.push(item)
                        }
                        addCompositionItemModalOpened.value = false
                        await updateComposition()
                    }
                }
                // Если не понадобится - удалить
                // newCompositionItem.value = {}
            }
            //
            const addCompositionItemIngredientFunc = () => {
                if(currentCompositionItemNewIngredient.value.name === '') {
                    alert('ViewRecipe: Надо выбрать ингредиент')
                } else if (currentCompositionItemNewIngredient.value.costEstimation === '') {
                    alert('ViewRecipe: Надо указать меру измерения')
                } else if (currentCompositionItemNewIngredient.value.value === 0) {
                    alert('ViewRecipe: Надо указать вес или кол-во')
                } else {
                    currentCompositionItem.value.ingredients.push(currentCompositionItemNewIngredient.value)
                    addIngredientToCurrentCompositionItemModalOpened.value = false;
                    // Удалить, если не понадобится
                    currentCompositionItemNewIngredient.value = {
                        name: '',
                        costEstimation: '',
                        value: 0
                    }
                    updateComposition();
                }
            }
            //
            const closeCompositionItemModal = () => {
                addCompositionItemModalOpened.value = false;
                newCompositionItem.value = {
                    name: '',
                    ingredients: []
                }
            }
            // ============================== удаляем ингредиент у нового элементы composition =======================
            // переменная для action sheet
            const deleteNewCompositionItemIngredient = ref(false)
            // Храним ингредиент в новом composition item к удалению
            const deleteNewCompositionItemIngredientIndex = ref();
            //
            const deleteNewCompositionItemIngredientMenu = (index) => {
                // console.log(index)
                deleteNewCompositionItemIngredientIndex.value = index;
                deleteNewCompositionItemIngredient.value = true;
            }
            // 
            const deleteNewCompositionItemIngredientButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteNewCompositionItemIngredientFunc(deleteNewCompositionItemIngredientIndex.value)
                    }
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                }
            ]
            //
            const deleteNewCompositionItemIngredientFunc = (index) => {
                if(index > -1) {
                    newCompositionItem.value.ingredients.splice(index, 1)
                }
            }
            // режим редактирования
            const editComposition = ref(false);
            const editCompositionFunc = () => {
                if(editComposition.value) {
                    let boolsArray = [];
                    if(currentRecipe.value.composition !== null) {
                        currentRecipe.value.composition.forEach(composition => {
                            if(composition.ingredients.length === 0) {
                                boolsArray.push('true')
                            } else {
                                boolsArray.push('false')
                            }
                        })
                        if(boolsArray.includes('true')) {
                            alert('ViewRecipe: в элементе состава должен быть указан хотя бы один ингредиент!')
                            editComposition.value = true
                        } else {
                            editComposition.value = false
                        }
                    } else {
                        editComposition.value = false
                    }
                } 
            }

            // ===== удаляем элемент состава ======
            // переменная для action sheet
            const deleteCompositionItem = ref(false);
            // Храним item из списка состава к удалению
            const compositionItemToDeleteIndex = ref();
            //
            const openDeleteCompositionItemMenu = (index) => {
                if(currentRecipe.value.composition.length === 1) {
                    alert('ViewRecipe: Нельзя удалить. Должен быть хотя бы один элемент в составе')
                } else {
                    compositionItemToDeleteIndex.value = index;
                    deleteCompositionItem.value = true;
                }
            }
            //
            const deleteCopmositionItemButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteCompositionItemFunc(compositionItemToDeleteIndex.value)
                    }
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                }
            ]
            //
            const deleteCompositionItemFunc = async (index) => {
                if(index > -1){
                    currentRecipe.value.composition.splice(index, 1)
                    //
                    spinner.value = true;
                    try {
                        const {error} = await supabase.from('userRecipes').update({
                            composition: currentRecipe.value.composition
                        }).eq('id', info.recipeId);
                        if(error) throw error;
                        spinner.value = false;
                        // Рецепт успешно обновлено
                    } catch (error) {
                        // alert(`Error: ${error.message}`)
                    }
                }
            }
            // Вызываем action sheet удаления current ingredient в composition item
            const deleteCompisitionItemIngredient = ref(false);
            const compositionItemIndex = ref();
            const compositionItemIngredientIndex = ref();
            const deleteCompisitionItemIngredientMenu = (idx, n) => {
                deleteCompisitionItemIngredient.value = true;
                compositionItemIndex.value = n;
                compositionItemIngredientIndex.value = idx
            }
            const compositionItemIngredientButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        deleteCompisitionItemIngredientFunc(compositionItemIngredientIndex.value, compositionItemIndex.value)
                    }
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                }
            ]
            const deleteCompisitionItemIngredientFunc = async (compositionItemIngredientIndex, compositionItemIndex) => {
                if(compositionItemIngredientIndex > -1 && compositionItemIndex > -1) {
                    currentRecipe.value.composition[compositionItemIndex].ingredients.splice(compositionItemIngredientIndex, 1)
                    //
                    spinner.value = true;
                    try {
                        const {error} = await supabase.from('userRecipes').update({
                            composition: currentRecipe.value.composition
                        }).eq('id', info.recipeId);
                        if(error) throw error;
                        spinner.value = false;
                        // Рецепт успешно обновлено
                    } catch (error) {
                        // alert(`Error: ${error.message}`)
                    }
                }
            }
            // Вызываем action sheet меню выбора меры измерения ингредиента
            // для нового элемента состава
            const actionSheetIngredientCostEstimation = ref(false);
            const ingredientWhereChangeEstimation = ref();
            const openActionSheetCostEstimationMenu = (ingredient) => {
                actionSheetIngredientCostEstimation.value = true;
                ingredientWhereChangeEstimation.value = ingredient;
            }
            const ingredientChangeCostEstimationButtons = [
                {
                    text: 'Граммы',
                    handler: () => {
                        ingredientWhereChangeEstimation.value.costEstimation = 'perKilogram'
                    }
                },
                {
                    text: 'Штуки',
                    handler: () => {
                        ingredientWhereChangeEstimation.value.costEstimation = 'perUnit'
                    }
                },
                {
                    text: 'Чайные ложки',
                    handler: () => {
                        ingredientWhereChangeEstimation.value.costEstimation = 'teaSpoon'
                    }
                },
                {
                    text: 'Щепотки',
                    handler: () => {
                        ingredientWhereChangeEstimation.value.costEstimation = 'pinch'
                    }
                },
                {
                    text: 'Палочки',
                    handler: () => {
                        ingredientWhereChangeEstimation.value.costEstimation = 'stick'
                    }
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                }
            ]
            //
            // для current элемента состава
            const actionSheetCurrentIngredientCostEstimation = ref(false)
            const currentIngredientWhereChangeEstimation = ref();
            const openActionSheetCurrentCostEstimationMenu = (ingredient) => {
                actionSheetCurrentIngredientCostEstimation.value = true;
                currentIngredientWhereChangeEstimation.value = ingredient
            }
            const currentIngredientChangeCostEstimationButtons = [
                {
                    text: 'Граммы',
                    handler: () => {
                        currentIngredientWhereChangeEstimation.value.costEstimation = 'perKilogram';
                        updateComposition();
                    }
                },
                {
                    text: 'Штуки',
                    handler: () => {
                        currentIngredientWhereChangeEstimation.value.costEstimation = 'perUnit';
                        updateComposition();
                    }
                },
                {
                    text: 'Чайные ложки',
                    handler: () => {
                        currentIngredientWhereChangeEstimation.value.costEstimation = 'teaSpoon';
                        updateComposition();
                    }
                },
                {
                    text: 'Щепотки',
                    handler: () => {
                        currentIngredientWhereChangeEstimation.value.costEstimation = 'pinch';
                        updateComposition();
                    }
                },
                {
                    text: 'Палочки',
                    handler: () => {
                        currentIngredientWhereChangeEstimation.value.costEstimation = 'stick';
                        updateComposition();
                    }
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                }
            ]

            //
            const setIngredientEstimation = (ingredientCostEstimation) => {
                if(ingredientCostEstimation !== '') {
                    if(ingredientCostEstimation === 'perKilogram') {
                        return '(гр.)'
                    } else if (ingredientCostEstimation === 'perUnit') {
                        return '(шт.)'
                    } else if (ingredientCostEstimation === 'teaSpoon') {
                        return '(ч.л.)'
                    } else if (ingredientCostEstimation === 'pinch') { 
                        return '(щепотки)'
                    } else if (ingredientCostEstimation === 'stick') {
                        return '(палочки)'
                    } else {
                        return ingredientCostEstimation
                    }
                } else {
                    return '(Не указано)'
                }
            }

            // ============================================= РАБОТА С CURRENT ЭЛЕМЕНТОМ СОСТАВА =====================================
            const addIngredientToCurrentCompositionItemModalOpened = ref(false)
            const currentCompositionItem = ref()
            const currentCompositionItemNewIngredient = ref({
                name: '',
                costEstimation: '',
                value: 0
            })
            const addCompositionItemIngredient = (n) => {
                currentCompositionItem.value = currentRecipe.value.composition[n]
                addIngredientToCurrentCompositionItemModalOpened.value = true
            }
            const newIngredientCurrentCompositionModalOpened = ref(false)
            const isIngredientAlreadyAddedToCurrentCompositionItem = ref()
            const addIngredientToCurrentCompositionItem = (ingredientData) => {
                isIngredientAlreadyAddedToCurrentCompositionItem.value = currentCompositionItem.value.ingredients.find(item => item.name === ingredientData.name)
                if(isIngredientAlreadyAddedToCurrentCompositionItem.value !== undefined) {
                    alert('ViewRecipe: ингредиент уже добавлен')
                } else {
                    currentCompositionItemNewIngredient.value.name = ingredientData.name 
                    newIngredientCurrentCompositionModalOpened.value = false;
                }
            }
            const actionSheetCurrentCompositionItemNewIngredient  = ref(false)
            const actionSheetCurrentCompositionItemNewIngredientButtons = [
                {
                    text: 'Граммы',
                    handler: () => {
                        currentCompositionItemNewIngredient.value.costEstimation = 'perKilogram';
                    }
                },
                {
                    text: 'Штуки',
                    handler: () => {
                        currentCompositionItemNewIngredient.value.costEstimation = 'perUnit';
                    }
                },
                {
                    text: 'Чайные ложки',
                    handler: () => {
                        currentCompositionItemNewIngredient.value.costEstimation = 'teaSpoon';
                    }
                },
                {
                    text: 'Щепотки',
                    handler: () => {
                        currentCompositionItemNewIngredient.value.costEstimation = 'pinch';
                    }
                },
                {
                    text: 'Палочки',
                    handler: () => {
                        currentCompositionItemNewIngredient.value.costEstimation = 'stick';
                    }
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    }
                }
            ]
            const closeAddIngredientToCurrentCompositionItemModal = () => {
                addIngredientToCurrentCompositionItemModalOpened.value = false
                currentCompositionItemNewIngredient.value = {
                    name: '',
                    costEstimation: '',
                    value: 0
                }
            }

            // =========================================== РАБОТА С БД =============================================
            const updateComposition = async () => {
                spinner.value = true;
                try {
                    const {error} = await supabase.from('userRecipes').update({
                        composition: currentRecipe.value.composition
                    }).eq('id', info.recipeId);
                    if(error) throw error;
                    spinner.value = false;
                    // Рецепт успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
            }
            //
            const updateProcess = async () => {
                spinner.value = true;
                try {
                    const {error} = await supabase.from('userRecipes').update({
                        process: currentRecipe.value.process
                    }).eq('id', info.recipeId);
                    if(error) throw error;
                    spinner.value = false;
                    // Рецепт успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
                // let emptyString = []
                // steps.value.forEach(item => {
                //     if(item.text === '') {
                //         emptyString.push(item.text)
                //     }
                // })
                // if(emptyString.includes('')) {
                //     alert('View Recipe: Шаг процесса не может быть пустым')
                // } else {
                //     editRecipeProcess.value = !editRecipeProcess.value
                // }
            }
            // 
            const checkEmptyStrings = (step) => {
                if(step.text === '') {
                    alert('View Recipe: Шаг процесса не может быть пустым')
                }else {
                    updateProcess()
                }
            }
            //
            const fromAssemblingToComposition = () => {
                addAssemblingElementModalOpened.value = false;
                addCompositionItem()
            }
            //
            const toggleRecipeToStore = () => {
                alert('ViewRecipe: в разработке...')
            }
            //
            const addImageToSlide = () => {
                slides.value.push('slide')
                alert('ViewRecipe: Добавление фото рецептов в разработке...')
            }
            //
            const deleteCurrentImg = (index) => {
                if(index > -1) {
                    slides.value.splice(index, 1)
                }
                alert(`ViewRecipe: (${index}) Удаление в разработке...`)
            }
            //
            const isNotEnoughModalOpened = ref()
            const showPaucityIngredients = () => {
                isNotEnoughModalOpened.value = true
                // alert('ViewRecipe: в процессе разработки...')
                itemsWhereIsNotEnoughIngredients.value = []
                itemsOutOfStock.value = []
            }

            // ==================================== Работа с количеством доступных для рецепта ингредиентов на складе =========================================
            const nameWarehouseItems = ref([]) // массив названий предметов на складе
            const itemsWhereIsNotEnoughIngredients = ref([]) // Массив предметов на складе, которые требуются для рецкепта, но не хватает количества
            const itemsOutOfStock = ref([]) // Массив предметов, которых нет на складе, но требуется для рецепта

            // Функция переводчик мер измерения
            const calcQtyPerEstimationType = (currentItem, ingredient) => {
                    // Чайная ложка – 5 мл это примерно 5 грамм
                    // Десертная ложка — 10 мл жидкости — 10 грамм
                    // Столовая ложка — 15 мл жидкости — 15 грамм
                    // Щепотка – 2-4 грамма (pinch)
                    // ср.вес банана с кожурой 200 грамм
                    // ср.вес банана без кожуры 120 грамм
                    // ср.вес кожуры банана 80 грамм
                // НА СКЛАДЕ ГРАММЫ
                if(currentItem.estimationType === 'perKilogram') {

                    // ДЛЯ БАНАНОВ
                    if(ingredient.name === 'Банан') {
                        // Количество грамм на складе делим на ср.вес банана с кожурой 200 грамм
                        return (currentItem.subjectQty / 200).toFixed(2)
                    }
                    // РЕЦЕПТ В ЧАЙНЫХ ЛОЖКАХ // Чайная ложка – 5 мл это примерно 5 грамм
                    else if (ingredient.costEstimation === 'teaSpoon') {
                        return (currentItem.subjectQty / 5).toFixed(2)
                    }
                    // РЕЦЕПТ В ЩЕПОТКАХ (pinch) // Щепотка – 2-4 грамма (pinch)
                    else if (ingredient.costEstimation === 'pinch') {
                        return (currentItem.subjectQty / 4).toFixed(2)
                    }
                    // ДЛЯ ВСЕГО ОСТАЛЬНОГО 
                    else {
                        return (currentItem.subjectQty).toFixed(2)
                    }

                }
                // НА СКЛАДЕ ШТУКИ
                else if (currentItem.estimationType === 'perUnit') {
                    // РЕЦЕПТ В ПАЛОЧКАХ (stick)
                    if(ingredient.costEstimation === 'stick') {
                        return (currentItem.subjectQty).toFixed(2)
                    } 
                    // ДЛЯ ВСЕГО ОСТАЛЬНОГО 
                    else {
                        return (currentItem.subjectQty).toFixed(2)
                    }
                }
                // 
                else {
                    return (currentItem.subjectQty).toFixed(2)
                }
            }

            // Счиитаем количество на складе
            const userWarehouseIngredientsQty = (ingredient) => {
                let qty = 0;
                let currentItems = [];

                // Фильтруем массив со всеми предметами на складе, выдаем только те, которые требуются для рецепта
                if(userWarehouseItemsArray.value) {
                    currentItems = userWarehouseItemsArray.value.filter(item => item.name === ingredient.name)
                }
                
                // Если на складе ЕСТЬ
                if (currentItems.length !== 0) {
                    qty = calcQtyPerEstimationType(currentItems[0], ingredient)
                    // если НЕ хватает на складе
                    if(qty < ingredient.value) {
                        notEnough.value = true
                        // console.log(`${ingredient.name}: на складе ${qty} ${currentItems[0].estimationType}. Надо: ${ingredient.value} ${ingredient.costEstimation}. Не хватает: ${(ingredient.value - qty).toFixed(2)}`)
                        // addToNotEnoughList(itemsWhereIsNotEnoughIngredients.value, qty, 'notEnough', ingredient)
                        addToNotEnoughList('notEnough', qty, ingredient)
                    } 
                    // если хватает на складе
                    else {
                        // console.log(`${ingredient.name}: на складе ${qty} ${currentItems[0].estimationType}. Надо: ${ingredient.value} ${ingredient.costEstimation}`)
                    }

                }
                // Если не нашли среди складского остатка нужную позицию по ингредиенту
                else if(currentItems.length === 0 && nameWarehouseItems.value.some(el => el !== ingredient.name)) {
                    notEnough.value = true
                    addToNotEnoughList('outOfStock', 0, ingredient)
                    // console.log(`${ingredient.name}: на складе НЕТ. Надо: ${ingredient.value} ${ingredient.costEstimation}`)
                    // addToNotEnoughList(itemsOutOfStock.value, qty, 'outOfStock', ingredient)
                } 
                return qty
            }

            // 
            const notEnough = ref(false)
            // 
            const addToNotEnoughList = (type, qty, ingredient) => {
                if(type === 'outOfStock') {
                    itemsOutOfStock.value.push({
                        name: ingredient.name,
                        estimationType: ingredient.costEstimation,
                        needQty: +ingredient.value,
                        warehouseQty: +qty
                    })

                } else if (type === 'notEnough') {
                    itemsWhereIsNotEnoughIngredients.value.push({
                        name: ingredient.name,
                        estimationType: ingredient.costEstimation,
                        needQty: +ingredient.value,
                        warehouseQty: +qty
                    })
                }


                //     itemsWhereIsNotEnoughIngredients.value.push({
                //         name: ingredient.name,
                //         estimationType: ingredient.costEstimation,
                //         needQty: +ingredient.value, 
                //         warehouseQty: +qty,
                //     })

                //     itemsOutOfStock.value.push({
                //         name: ingredient.name,
                //         estimationType: ingredient.costEstimation,
                //         needQty: +ingredient.value, 
                //         warehouseQty: 0,
                //     })
            }


            return {
                route, router, spinner, currentRecipe, currentId, info, openDeleteMenu, isOpenRef, deleteCurrentRecipeButtons, deleteCurrentRecipe, recipeName, closeCircleOutline, openDeleteCategoryModal, deleteCategory, categoryToDelete, deleteCategoryButtons, recipeDescription, expendList, checkmark, alertOutline, setImgSrc, searchRecipesCategoriesMenu, searchRecipesCategories, userRecipesCategories, searchedRecipesCategories, isCategoryAlreadyAdded, choosenCategory, setMeasure, slides, setStyleProperties, steps, addProcessStep, addAssemblingElement, handleReorder, deleteAssemblingItem, assemblingItemToDeleteIndex, openDeleteAssemblingItemMenu, deleteAssemblingItemButtons, deleteAssemblingItemFunc, reorderIsDisabled, toggleReorder, editRecipeProcess, editRecipeProcessFunc, handleReorderProcess, deleteProcessStep, processStepToDeleteIndex, openDeleteStepsMenu, deleteProcessStepButtons, deleteProcessStepFunc, addCompositionItem, editComposition, editCompositionFunc, openDeleteCompositionItemMenu, deleteCompositionItem, compositionItemToDeleteIndex, deleteCopmositionItemButtons, deleteCompositionItemFunc, addCompositionItemIngredient, trash, updateComposition, addAssemblingElementModalOpened, addToAssembling, updateProcess, addCompositionItemModalOpened, newCompositionItem, addNewCompositionItem, addButtonIsDisabled, closeCompositionItemModal, addIngredientToCompositionItem, ingredientForNewCompositionModalOpened, addIngredientToCompositionItemFunc, setIngredientImg, isIngredientAlreadyAdded, deleteNewCompositionItemIngredient, deleteNewCompositionItemIngredientIndex, deleteNewCompositionItemIngredientMenu, deleteNewCompositionItemIngredientFunc, deleteNewCompositionItemIngredientButtons, openActionSheetCostEstimationMenu, actionSheetIngredientCostEstimation, ingredientWhereChangeEstimation, ingredientChangeCostEstimationButtons, setIngredientEstimation, deleteCompisitionItemIngredientMenu, deleteCompisitionItemIngredient, compositionItemIngredientIndex, compositionItemIndex, compositionItemIngredientButtons, deleteCompisitionItemIngredientFunc, setIngredientValue, setCurrentIngredientValue, actionSheetCurrentIngredientCostEstimation, currentIngredientWhereChangeEstimation, openActionSheetCurrentCostEstimationMenu, currentIngredientChangeCostEstimationButtons, addIngredientToCurrentCompositionItemModalOpened, currentCompositionItem, currentCompositionItemNewIngredient, addNewIngredientButtonIsDisabled, addCompositionItemIngredientFunc, newIngredientCurrentCompositionModalOpened, addIngredientToCurrentCompositionItem, actionSheetCurrentCompositionItemNewIngredient, actionSheetCurrentCompositionItemNewIngredientButtons, setNewIngredientValue, closeAddIngredientToCurrentCompositionItemModal, toggleRecipeToStore, fromAssemblingToComposition, cameraOutline, addImageToSlide, deleteCurrentImg, modules: [Virtual, Pagination], checkEmptyStrings, editRecipeDescription, toggleEditRecipeDescription, editRecipeName, toggleEditRecipeName, amIAnAuthorFunc, userEmail, showPaucityIngredients, userWarehouseItemsArray, userWarehouseIngredientsQty, itemsWhereIsNotEnoughIngredients, itemsOutOfStock, nameWarehouseItems, addToNotEnoughList, calcQtyPerEstimationType, notEnough, isNotEnoughModalOpened
            }
        }
    })
</script>

<style scoped>
    .thumbnail_deal-subject {
        height: 64px;
        min-width: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        padding: 0.5rem;
        background-color: var(--ion-color-light);
    }
    .button-add-ingredient {
        border-bottom: 1px dashed var(--ion-color-primary);
    }
    .searchbar {
        position: fixed;
        z-index: 99999;
        top: 2.5rem;
    }
    ion-searchbar {
        background-color: white;
    }
    .border-bottom {
        border-bottom: 1px solid var(--ion-color-light);
        padding-bottom: 1rem;
    }
    .isNotEnoughIbgredients {
        border: 1px solid var(--ion-color-danger);
        border-radius: 1rem;
    }

    .isNotEnoughIbgredients .thumbnail_deal-subject {
        background-color: transparent;
    }
    .warehouse-item_qty {
        color: var(--ion-color-success)
    }
    .isNotEnoughIbgredients .warehouse-item_qty {
        color: var(--ion-color-danger);
    }
</style>
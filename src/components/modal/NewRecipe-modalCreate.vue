<template>
  <ion-modal>

    <!--  -->
    <ion-header translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="closeThisModal">Отменить</ion-button>
        </ion-buttons>
        <ion-title class="ion-text-center">Новый</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('createRecipe', recipeData)"
            >Создать</ion-button
          >
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!--  -->
    <ion-content class="ion-padding-vertical" forceOverscroll="false">
      <!-- ============================= Основные данные ===================================== -->

      <!-- Название рецепта -->
      <ion-item-group class="ion-padding-horizontal">
        <!-- Заголовок -->
        <ion-text>
          <h4>Название</h4>
        </ion-text>

        <!--  -->
        <ion-item counter="true" class="ion-no-padding">
          <ion-input
            v-model="recipeName"
            placeholder="Укажите название рецепта"
            autocapitalize="on"
            maxlength="40"
          ></ion-input>
        </ion-item>
      </ion-item-group>

      <!-- Категории рецепта -->
      <ion-item-group class="ion-padding-horizontal">
        <!-- Заголовок -->
        <ion-text >
          <h4>Категории</h4>
        </ion-text>

        <!--  -->
        <ion-grid class="ion-no-padding">

          <!-- Добавленная категория -->
          <ion-chip v-for="(category, index) in recipeData.categories" :key="index" class="ion-no-margin ion-margin-vertical ion-margin-end" color="primary" style="position: relative; overflow: visible">
            {{ category }}
            <!-- Кнопка удалить выбранную категорию у рецепта -->
            <ion-icon :icon="closeCircleOutline" style="position: absolute; right: -0.2rem; top: 0;" color="medium" @click.stop="openDeleteCategoryModal(category)"></ion-icon>
          </ion-chip>

          <!-- Кнопка добавления категории -->
          <ion-chip v-if="recipeData.categories.length < 3" class="ion-no-margin ion-margin-vertical ion-margin-end" color="primary" outline="true" @click.stop="searchRecipesCategoriesMenu = true">
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

      <!-- Модалка по выбору / поиску категорий  -->
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
            <ion-grid class="ion-no-padding">
              <ion-row class="ion-justify-content-between ion-align-items-center">
                <ion-text color="medium">Ничего не найдено</ion-text>
              </ion-row>
            </ion-grid>
          </div>
        </ion-content>
      </ion-modal>

      <!-- Свайпер с фотками -->
      <!-- Если ЕСТЬ фото -->
      <swiper
        v-if="recipeData.images.length !== 0"
        :modules="modules" 
        :pagination="true"
        :slides-per-view="1" 
        :space-between="0"
        :loop="false"
      >
        <swiper-slide
          v-for="(slideContent, index) in recipeData.images"
          :key="index"
          :virtualIndex="index"
          :style="setStyleProperties(index)"
          style="position: relative"
        >
          {{ slideContent }}
          <div class="ion-margin-end ion-margin-top" style="position: absolute; top: 0; right: 0; background-color: rgba(255, 255, 255, 0.8); padding: 10px; display: flex; justify-content: center; align-items: center; border-radius: 100%;" @click.stop="deleteCurrentImg(index)">
            <ion-icon 
                slot="icon-only" 
                :icon="trash"
                color="danger"
            ></ion-icon>
          </div>
        </swiper-slide>
        <!-- Добавить фото -->
        <swiper-slide v-if="recipeData.images.length < 3">
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
      <div 
          v-else
          class="ion-no-padding ion-padding-horizontal"
          style="height: 300px; width: 100%; background-color: var(--ion-color-system); color: white; display: flex; align-items: center; flex-direction: column; justify-content: center;"
          @click.stop="addImageToSlide()"
      >   
          <ion-icon style="font-size: 36px;" :icon="cameraOutline"></ion-icon>
          <ion-text class="ion-margin-top">Добавить фото</ion-text>
      </div>

      <!-- ОПИСАНИЕ РЕЦЕПТА -->
      <ion-item-group class="ion-margin-bottom ion-padding-horizontal">
        <!-- Заголовок -->
        <ion-text>
          <h4>Описание</h4>
        </ion-text>

        <!--  -->
        <ion-textarea 
          placeholder="Заполните описание рецепта" 
          class="ion-no-padding ion-margin-top" 
          autoGrow="true" 
          autocapitalize="on"
          v-model="recipeDescription"
        ></ion-textarea>
      </ion-item-group>

      <!-- СОСТАВ -->
      <ion-item-group class="ion-padding-horizontal">
        <!-- Заголовок -->
        <ion-text>
          <h4 class="ion-no-margin">Состав</h4>
        </ion-text>
        <!-- 
            Чайная ложка – 5 мл это примерно 5 грамм
            Десертная ложка — 10 мл жидкости — 10 грамм
            Столовая ложка — 15 мл жидкости — 15 грамм
            Щепотка – 2-4 грамма
        -->
        <!-- список элементов состава -->
        <div v-if="recipeData.composition.length !== 0" v-for="(element, n) in recipeData.composition" :key="n">

          <!-- Названия элемента состава -->
          <ion-item class="ion-no-padding">
            <ion-icon :icon="closeCircleOutline" style="margin-right: 0.4rem; min-width: 17px;" color="danger" @click.stop="openDeleteCompositionItemMenu(n)"></ion-icon>
            <ion-text color="primary" @click.stop="expendList(`ri + ${n}`)">
              {{(n + 1)}}. {{element.name}}
            </ion-text>
          </ion-item>

          <!-- Ингредиенты элемента -->
          <div :id="`ri + ${n}`" style="display: none">
            <!-- перебор массива ингредиентов -->
            <div v-for="(ingredient, idx) in element.ingredients" :key="idx" style="margin-top: 1rem;">

                <!--  -->
                <ion-item-sliding>
                    <ion-item lines="none" style="--inner-padding-end: none">
                        <ion-grid class="ion-no-padding">
                            <ion-row class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap;">
                                <!--  -->
                                <div style="display: flex; flex-direction: column;">
                                    <!--  -->
                                    <ion-text>
                                        {{ ingredient.name }}
                                        <span @click.prevent.stop="openActionSheetCurrentCostEstimationMenu(ingredient)" style="border-bottom: 1px dashed var(--ion-color-primary); color: var(--ion-color-primary); white-space: nowrap;">{{ setIngredientEstimation(ingredient.costEstimation) }}</span>
                                    </ion-text>
                                    <!--  -->
                                    <div style="display: flex; align-items: center; margin-top: 0.5rem;">
                                        <ion-text color="medium" class="ion-margin-end" style="font-size: 1rem;">Кол-во</ion-text>
                                        <ion-input v-model="ingredient.value"></ion-input>
                                    </div>
                                </div>
                                <!--  -->
                                <ion-thumbnail class="thumbnail_deal-subject" style="background-color: var(--ion-color-light);">
                                    <ion-img :src="setImgSrc(ingredient.name)"></ion-img>
                                </ion-thumbnail>
                            </ion-row>
                        </ion-grid>
                    </ion-item>
                    <!--  -->
                    <ion-item-options side="end">
                        <ion-item-option class="ion-margin-start" color="danger" @click.stop="deleteCompisitionItemIngredientMenu(idx, n)">
                            <ion-icon slot="icon-only" :icon="trash"></ion-icon>
                        </ion-item-option>
                    </ion-item-options>
                </ion-item-sliding>
            </div>

            <!-- кнопка добавления нового ингредеиента к определенному элементу состава -->
            <div class="ion-margin-vertical" @click.stop="addCompositionItemIngredient(n)">
                <ion-text color="primary" class="ion-margin-start button-add-ingredient">Добавить ингредиент</ion-text>
            </div>
          </div>
        </div>

        <!-- Кнопка добавления элемента -->
        <ion-grid class="ion-no-padding">
          <ion-row>
            <ion-chip class="ion-no-margin ion-margin-vertical" color="primary" outline="true" @click.stop="addCompositionItem()">Добавить</ion-chip>
          </ion-row>
        </ion-grid>

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

        <!-- Процесс -->
        <ion-item-group class="ion-padding">
            <!-- Заголовок -->
            <ion-text>
            <h4 class="ion-no-margin">Процесс</h4>
            </ion-text>

            <!-- Контент -->
            <ion-list>
                <ion-reorder-group :disabled="false" @ionItemReorder="handleReorderProcess($event)">
                    <div v-for="(step, index) in recipeData.process" :key="index" style="display: flex; border-bottom: 1px solid var(--ion-color-light)">
                        <!-- Кнопка удалить current step -->
                        <ion-icon :icon="closeCircleOutline" color="danger" style="margin: auto 0; font-size: 24px" @click.stop="openDeleteStepsMenu(index)"></ion-icon>
                        <!--  -->
                        <ion-textarea v-model="step.text" auto-grow="true" class="ion-margin-start" placeholder="Опишите действие" autocapitalize="on" rows="1"></ion-textarea>

                        <!-- ползунок реордера -->
                        <ion-reorder slot="end" style="margin: auto 0;"></ion-reorder>
                    </div>
                </ion-reorder-group>
            </ion-list>

            <!-- Кнопка добавить шаг -->
            <ion-grid class="ion-no-padding">
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

        <!-- Сборка -->
        <ion-item-group class="ion-padding-horizontal ion-padding-top">
            <!-- Заголовок -->
            <ion-text>
                <h4 class="ion-no-margin">Сборка</h4>
                <ion-text color="medium">Осуществляем по порядку</ion-text>
            </ion-text>

            <!-- Контент -->
            <ion-list class="ion-margin-top">
                <ion-reorder-group :disabled="false" @ionItemReorder="handleReorderAssembling($event)">
                    <ion-item v-for="(item, index) in recipeData.assembling" :key="index" class="margin-bottom ion-no-padding" style="--inner-padding-end: none">
                        <!--  -->
                        <ion-label>
                            <ion-grid class="ion-no-padding">
                                <ion-row class="ion-align-items-center" style="flex-warp: nowrap;">
                                    <!-- Кнопка удалить current item -->
                                    <ion-icon :icon="closeCircleOutline" color="danger" style="margin-right: 0.4rem; min-width: 17px;" @click.stop="openDeleteAssemblingItemMenu(index)"></ion-icon>
                                    <!-- current item -->
                                    <ion-text>{{ index + 1 }}. {{ item }}</ion-text>
                                </ion-row>
                            </ion-grid>
                        </ion-label>
                        <!--  -->
                        <ion-reorder slot="end"></ion-reorder>
                    </ion-item>
                </ion-reorder-group>
            </ion-list>

            <!-- Кнопка добавить элементв в сборку -->
            <ion-grid class="ion-no-padding">
                <ion-row>
                    <ion-chip class="ion-no-margin" outline="true" color="primary" @click.stop="addAssemblingElement()">Добавить</ion-chip>
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

        <!-- Вкл / Выкл на продажу в магазин рецептов -->
        <ion-item-group class="ion-padding-horizontal ion-padding-top">
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
            {{ newCompositionItem }}
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
                        <ion-row class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap">
                        <!--  -->
                        <div style="display: flex; flex-direction: column">
                            <!-- name -->
                            <ion-text>
                            {{ ingredient.name }}
                            <span
                                @click.prevent.stop="openActionSheetCostEstimationMenu(ingredient)"
                                style="border-bottom: 1px dashed var(--ion-color-primary); color: var(--ion-color-primary); white-space: nowrap"
                            >
                                {{ setIngredientEstimation(ingredient.costEstimation) }}
                            </span>
                            </ion-text>
                            <!-- qty -->
                            <div style="display: flex; align-items: center; margin-top: 0.5rem;">
                            <!--  -->
                            <ion-text color="medium" class="ion-margin-end" style="font-size: 1rem;">
                                Укажите кол-во:
                            </ion-text>
                            <!--  -->
                            <ion-input v-model="ingredient.value" type="number" style="font-size: 1.3rem; font-weight: bold;" class="ion-no-padding" color="primary" inputmode="decimal"></ion-input>
                            </div>
                        </div>
                        <!--  -->
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
                
                <!-- Кнопка Добавить ингредиент-->
                <div class="ion-margin-top ion-padding-horizontal" @click.stop="addIngredientToCompositionItem()">
                    <ion-text color="primary" class="button-add-ingredient">Добавить ингредиент</ion-text>
                </div>
            </ion-item-group>

            <!-- Кнопка Добавить к составу -->
            <div style="position: fixed; bottom: 0; left: 0; width: 100%; background-color: #fff; z-index: 999999;" class="ion-padding">
                <ion-button @click.stop="addNewCompositionItem(newCompositionItem)" :color="addButtonIsDisabled() ? 'light' : 'primary'" expand="block">Добавить к составу</ion-button>
            </div>
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
                                <ion-row
                                    @click.stop="newIngredientCurrentCompositionModalOpened = true"
                                    class="ion-justify-content-between ion-align-items-center" 
                                    style="flex-wrap: nowrap;"
                                >
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
                            <!--  -->
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
                                        <ion-input v-model="currentCompositionItemNewIngredient.value" style="font-size: 1.3rem; font-weight: bold;" color="primary"  class="ion-text-end" inputmode="decimal"></ion-input>
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

        <!-- Модалка по выбору / поиску предмета (ингредиента) к NEW composition item-->
        <SearchDealBuySubject
        :isOpen="ingredientForNewCompositionModalOpened"
        @closeModal="ingredientForNewCompositionModalOpened = false"
        :properties="'isIngredient'"
        @addItem="addIngredientToCompositionItemFunc"
        />
        <!-- Модалка по выбору / поиску предмета (ингредиента) к CURRENT composition item-->
        <SearchDealBuySubject
            :isOpen="newIngredientCurrentCompositionModalOpened"
            @closeModal="newIngredientCurrentCompositionModalOpened = false"
            :properties="'isIngredient'"
            @addItem="addIngredientToCurrentCompositionItem"
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
                <div v-if="recipeData.composition === null || recipeData.composition.length === 0" style="position: absolute; top: 40%; width: 100%; margin: 0 auto;" class="ion-text-center">
                    <ion-text>Сначала добавьте элементы к составу</ion-text>
                    <ion-button expand="block" fill="clear" @click.stop="fromAssemblingToComposition">Добавить</ion-button>
                </div>
                <!--  -->
                <ion-item v-else v-for="(item, index) in recipeData.composition" :key="index" @click.stop="addToAssembling(item.name)">
                    {{ item.name }}
                </ion-item>
            </ion-content>
        </ion-modal>

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

      <!--  -->
      <br>
      <br>
      {{ recipeData }}
      <br>
      <br>
      <br>
    </ion-content>
  </ion-modal>
</template>

<script>
import { defineComponent, ref, watch, watchEffect, computed, onMounted } from "vue";
import {
  IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonInput, IonLabel, IonGrid, IonChip, IonSearchbar, IonItem, IonRow, IonIcon, IonActionSheet, IonTextarea, IonItemSliding, IonItemOptions, IonItemOption, IonThumbnail, IonImg, IonList, IonReorderGroup, IonReorder, IonToggle
} from "@ionic/vue";
import { closeCircleOutline, cameraOutline, trash } from 'ionicons/icons'
//
import store from '../../store/index';
//
import { searchWarehouseCategoryFilter } from '../../helpers/filterWarehouseCategories';
import { sortAlphabeticallyWarhouseItem } from "../../helpers/sortDealSubject";
//    
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Virtual, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import '@ionic/vue/css/ionic-swiper.css';
//
import SearchDealBuySubject from '../../components/modal/SearchDealBuySubject.vue';
//

export default defineComponent({
  name: "CreateRecipe",
  emits: ['closeModal', 'createRecipe'],
  props: {
    recipeData: Object,
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
    IonInput,
    IonLabel,
    IonGrid,
    IonChip,
    IonSearchbar,
    IonItem,
    IonRow,
    IonIcon,
    IonActionSheet,
    IonTextarea,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonThumbnail,
    IonImg,
    IonList,
    IonReorderGroup,
    IonReorder,
    IonToggle,
    //
    Swiper, SwiperSlide,
    //
    SearchDealBuySubject
  },
  setup(props, { emit }) {
    //
    const recipeData = ref();
    const recipeName = ref("");
    const recipeValue = ref("");
    const recipeDescription = ref("")
    // Массив пользователя с вариантам категорий для рецептов
    const userRecipesCategories = ref()
    const userSettings = ref(store.state.userSettings)
    //
    onMounted(async () => {
      await store.methods.getUserSettingsfromDB();
      userSettings.value = store.state.userSettings;
      //
      // userRecipesCategories.value = userSettings.value[0].userRecipesCategories
      userRecipesCategories.value = store.state.recipesCategoriesArray
    })
    //
    watch(recipeName, () => {
      // console.log(recipeName.value)
        recipeData.value.name = recipeName;
        recipeData.value.value = recipeName;
    });
    //
    watch(recipeDescription, () => {
      recipeData.value.recipeDescription = recipeDescription;
    })
    //
    const closeThisModal = () => {
      emit('closeModal', 
        recipeName.value = '',
        recipeValue.value = '',
        recipeDescription.value = ''
      )
    }
    //
    const searchRecipesCategoriesMenu = ref(false)
    const searchRecipesCategories = ref('')
    // ПОЛЬЗОВАТЕЛЬСКИЕ КАТЕГОРИИ
    const searchedRecipesCategories = computed(() => {
      const sortedRecipesCategoriesArray = sortAlphabeticallyWarhouseItem(userRecipesCategories.value)
      return searchWarehouseCategoryFilter(sortedRecipesCategoriesArray, searchRecipesCategories.value)
    })
    // Проверяем добавлена уже категория к предмету или нет
    const isCategoryAlreadyAdded = ref();
    // Переменная для категории к добавлению
    const newCategory = ref()
    const choosenCategory = (category) => {
      isCategoryAlreadyAdded.value = recipeData.value.categories.find(item => item === category)
      if(isCategoryAlreadyAdded.value !== undefined) {
        alert('NewRecipe-modalCreate: категория уже добавлена к рецепту')
      } else if (recipeData.value.categories.length >= 3) {
        alert('NewRecipe-modalCreate: Вы добавили максимально количество категорий')
      } else {
        searchRecipesCategories.value = ''
        searchRecipesCategoriesMenu.value = false
        newCategory.value = category
        console.log(newCategory.value)
        recipeData.value.categories.push(newCategory.value)
      }
    }
    // ============================ Удаление категории у предмета ===============================================
    // Вызываем action sheet уведомление в качестве подтверждения
    const deleteCategory = ref(false);
    // Храним категорию предмета к удалению
    const categoryToDelete = ref();
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
    //удаляем current category в предмете (обнолвений в БД здесь не производится)
    const openDeleteCategoryModal = (category) => {
        categoryToDelete.value = category;
        deleteCategory.value = true
    }
    const deleteCategoruFunc = (category) => {
      recipeData.value.categories = recipeData.value.categories.filter(item => item !== category)
    }
    //
    const slides = ref([])
    // Стили для слайдера
    const setStyleProperties = (index) => {
        return `height: 300px; background-color: #${index}${index}${index}; color: white`
    }
    const addImageToSlide = () => {
      props.recipeData.images.push('slide')
    }
    const deleteCurrentImg = (index) => {
      if(index > -1) {
        props.recipeData.images.splice(index, 1)
      }
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
    // ======================= РАБОТА С NEW ЭЛЕМЕНТОВ СОСТАВА
    const addCompositionItemModalOpened = ref(false);
    const newCompositionItem = ref({})
    const addCompositionItem = () => {
      addCompositionItemModalOpened.value = true
      newCompositionItem.value = {
        name: '',
        ingredients: [
          // пример, удаляем потом
          // {
          //     name: "Сливочное масло",
          //     costEstimation: "perKilogram",
          //     value: 100
          // },
          // {
          //     name: "Сыр",
          //     costEstimation: "perKilogram",
          //     value: 170
          // },
        ]
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
      isIngredientAlreadyAdded.value = newCompositionItem.value.ingredients.find(item => item.name === ingredientData.name)
      if(isIngredientAlreadyAdded.value !== undefined) {
        alert('NewRecipe-modalCreate: ингредиент уже добавлен')
      } else {
        ingredientForNewCompositionModalOpened.value = false
        newCompositionItem.value.ingredients.push({
          name: ingredientData.name,
          costEstimation: '',
          value: 0
        })
      }
    }
    //
    // const setIngredientValue = (ingredientValue, index) => {
    //   console.log(+ingredientValue)
    //   newCompositionItem.value.ingredients[index].value = ingredientValue
    // }
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
            }
        },
        {
            text: 'Штуки',
            handler: () => {
                currentIngredientWhereChangeEstimation.value.costEstimation = 'perUnit';
            }
        },
        {
            text: 'Чайные ложки',
            handler: () => {
                currentIngredientWhereChangeEstimation.value.costEstimation = 'teaSpoon';
            }
        },
        {
            text: 'Щепотки',
            handler: () => {
                currentIngredientWhereChangeEstimation.value.costEstimation = 'pinch';
            }
        },
        {
            text: 'Палочки',
            handler: () => {
                currentIngredientWhereChangeEstimation.value.costEstimation = 'stick';
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
        currentCompositionItem.value = recipeData.value.composition[n]
        addIngredientToCurrentCompositionItemModalOpened.value = true
    }
    //
    const newIngredientCurrentCompositionModalOpened = ref(false)
    const isIngredientAlreadyAddedToCurrentCompositionItem = ref()
    const addIngredientToCurrentCompositionItem = (ingredientData) => {
        isIngredientAlreadyAddedToCurrentCompositionItem.value = currentCompositionItem.value.ingredients.find(item => item.name === ingredientData.name)
        if(isIngredientAlreadyAddedToCurrentCompositionItem.value !== undefined) {
            alert('NewRecipe-modalCreate: ингредиент уже добавлен')
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
    //
    const closeAddIngredientToCurrentCompositionItemModal = () => {
        addIngredientToCurrentCompositionItemModalOpened.value = false
        currentCompositionItemNewIngredient.value = {
            name: '',
            costEstimation: '',
            value: 0
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
    //
    const addCompositionItemIngredientFunc = () => {
        if(currentCompositionItemNewIngredient.value.name === '') {
            alert('NewRecipe-modalCreate: Надо выбрать ингредиент')
        } else if (currentCompositionItemNewIngredient.value.costEstimation === '') {
            alert('NewRecipe-modalCreate: Надо указать меру измерения')
        } else if (currentCompositionItemNewIngredient.value.value === 0) {
            alert('NewRecipe-modalCreate: Надо указать вес или кол-во')
        } else {
            currentCompositionItem.value.ingredients.push(currentCompositionItemNewIngredient.value)
            addIngredientToCurrentCompositionItemModalOpened.value = false;
            // Удалить, если не понадобится
            currentCompositionItemNewIngredient.value = {
                name: '',
                costEstimation: '',
                value: 0
            }
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
    //
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
    //
    const deleteCompisitionItemIngredientFunc = (compositionItemIngredientIndex, compositionItemIndex) => {
        if(compositionItemIngredientIndex > -1 && compositionItemIndex > -1) {
            recipeData.value.composition[compositionItemIndex].ingredients.splice(compositionItemIngredientIndex, 1)
        }
    }
    // Добавляем элемент к составу
    const addNewCompositionItem = (item) => {
        if(newCompositionItem.value.name === '') {
            alert('NewRecipe-modalCreate: Надо указать название элемента состава')
        } else if (newCompositionItem.value.ingredients.length === 0) {
            alert('NewRecipe-modalCreate: Надо добавить хотя бы один ингредиент')
        } else {
            let costEstimations = []
            let qty = []
            item.ingredients.forEach(item => {
                costEstimations.push(item.costEstimation)
                qty.push(item.value)
            })
            if(costEstimations.includes('')) {
                alert('NewRecipe-modalCreate: в одном из ингредиентов не указан тип измерения')
            } else if (qty.includes(0)) {
                alert('NewRecipe-modalCreate: в одном из ингредиентов не указан необходимый для рецепта вес или кол-во')
            } else {
                recipeData.value.composition.push(item)
                addCompositionItemModalOpened.value = false
            }
        }
    }
    // Раскрашиваем кнопку по типу isDisabled
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
    const closeCompositionItemModal = () => {
        addCompositionItemModalOpened.value = false;
        newCompositionItem.value = {
            name: '',
            ingredients: []
        }
    }

    // ================ удаляем элемент состава ============
    // переменная для action sheet
    const deleteCompositionItem = ref(false);
    // Храним item из списка состава к удалению
    const compositionItemToDeleteIndex = ref();
    //
    const openDeleteCompositionItemMenu = (index) => {
      compositionItemToDeleteIndex.value = index;
      deleteCompositionItem.value = true;
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
    const deleteCompositionItemFunc = (index) => {
      if(index > -1) {
        props.recipeData.composition.splice(index, 1)
      }
    }
    // ================= разворачиваем конкретный элемент состава ======================
    const expendList = (el) => {
      let item = document.getElementById(el)
      if(item) {
          item.style.display == 'none' ? item.style.display = 'block' : item.style.display = 'none'
      }
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
    // =============================== РАБОТА С ШАГАМИ В СПИСКЕ ПРОЦЕССА ПРИГОТОВЛЕНИЯ ==========================
    const handleReorderProcess = (event) => {
        recipeData.value.process = event.detail.complete(recipeData.value.process);
    }
    const addProcessStep = () => {
        recipeData.value.process.push({
            text: ''
        })
    }
    // Вызываем action sheet уведомление в качестве подтверждения
    const deleteProcessStep = ref(false);
    // Храним step из списка шагов процесса приготовления к удалению
    const processStepToDeleteIndex = ref();
    const openDeleteStepsMenu = (index) => {
        processStepToDeleteIndex.value = index;
        deleteProcessStep.value = true;
    }
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
    const deleteProcessStepFunc = (index) => {
        if(index > -1) {
            recipeData.value.process.splice(index, 1)
        }
    }
    // =============================== РАБОТА CО СБОРКОЙ РЕЦЕПТА ==========================
    //
    const addAssemblingElementModalOpened = ref(false)
    const addAssemblingElement = () => {
        addAssemblingElementModalOpened.value = true;
    }
    const handleReorderAssembling = (event) => {
        recipeData.value.assembling = event.detail.complete(recipeData.value.assembling);
    }
    const fromAssemblingToComposition = () => {
        addAssemblingElementModalOpened.value = false;
        addCompositionItem()
    } 
    const addToAssembling = (itemName) => {
        recipeData.value.assembling.push(itemName)
        addAssemblingElementModalOpened.value = false;
    }
    // Удаляем элемент сборки
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
    const deleteAssemblingItemFunc = (index) => {
        if(index > -1) {
            recipeData.value.assembling.splice(index, 1)
        }
    }

    // =============================== РАБОТА C ВЫСТАВЛЕНИЕМ РЕЦЕПТА НА ПРОДАЖУ ==========================
    const toggleRecipeToStore = () => {
        alert('ViewRecipe: в разработке...')
    }

    //
    watchEffect(() => {
      recipeData.value = props.recipeData;
    });

    return {
      recipeData, recipeName, recipeDescription, recipeValue, closeThisModal, searchRecipesCategoriesMenu, searchRecipesCategories, searchedRecipesCategories, userRecipesCategories, userSettings, isCategoryAlreadyAdded, newCategory, choosenCategory, closeCircleOutline, deleteCategory, deleteCategoryButtons, openDeleteCategoryModal, deleteCategoruFunc, slides, setStyleProperties, addImageToSlide, cameraOutline, trash, deleteCurrentImg, modules: [Virtual, Pagination], addCompositionItem, newCompositionItem, addCompositionItemModalOpened, closeCompositionItemModal, openDeleteCompositionItemMenu, deleteCompositionItem, deleteCompositionItemFunc, compositionItemToDeleteIndex, deleteCopmositionItemButtons, expendList, addIngredientToCompositionItem, ingredientForNewCompositionModalOpened, isIngredientAlreadyAdded, addIngredientToCompositionItemFunc, setIngredientImg, openActionSheetCostEstimationMenu, setIngredientEstimation, actionSheetIngredientCostEstimation, ingredientWhereChangeEstimation, ingredientChangeCostEstimationButtons, deleteNewCompositionItemIngredientMenu, deleteNewCompositionItemIngredient, deleteNewCompositionItemIngredientIndex, deleteNewCompositionItemIngredientButtons, deleteNewCompositionItemIngredientFunc, addNewCompositionItem, addButtonIsDisabled, setImgSrc, openActionSheetCurrentCostEstimationMenu, actionSheetCurrentIngredientCostEstimation, currentIngredientWhereChangeEstimation, currentIngredientChangeCostEstimationButtons, deleteCompisitionItemIngredientMenu, deleteCompisitionItemIngredient, compositionItemIndex, compositionItemIngredientIndex, compositionItemIngredientButtons, deleteCompisitionItemIngredientFunc, addCompositionItemIngredient, addIngredientToCurrentCompositionItemModalOpened, currentCompositionItem, currentCompositionItemNewIngredient, closeAddIngredientToCurrentCompositionItemModal, newIngredientCurrentCompositionModalOpened, isIngredientAlreadyAddedToCurrentCompositionItem, addIngredientToCurrentCompositionItem, actionSheetCurrentCompositionItemNewIngredient, actionSheetCurrentCompositionItemNewIngredientButtons, setMeasure, addCompositionItemIngredientFunc, addNewIngredientButtonIsDisabled, handleReorderProcess, addProcessStep, deleteProcessStep, openDeleteStepsMenu, processStepToDeleteIndex, deleteProcessStepButtons, handleReorderAssembling, addAssemblingElement, addAssemblingElementModalOpened, fromAssemblingToComposition, addToAssembling, deleteAssemblingItem, openDeleteAssemblingItemMenu, assemblingItemToDeleteIndex, deleteAssemblingItemButtons, deleteAssemblingItemFunc, toggleRecipeToStore
    };
  },
});
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
  }
  .button-add-ingredient {
      border-bottom: 1px dashed var(--ion-color-primary);
  }
  .border-bottom {
        border-bottom: 1px solid var(--ion-color-light);
        padding-bottom: 1rem;
    }
    .margin-bottom:last-child{
        margin-bottom: 20px;
    }
</style>

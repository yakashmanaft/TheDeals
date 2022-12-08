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
            >Готово</ion-button
          >
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!--  -->
    <ion-content class="ion-padding" forceOverscroll="false">
      <!-- ============================= Основные данные ===================================== -->

      <!-- Название рецепта -->
      <ion-item-group>
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
      <ion-item-group>
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

      <!-- Описание рецепта -->
      <ion-item-group class="ion-margin-bottom">
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

      <!--  -->
      <ion-item-group>
        123
      </ion-item-group>

      <!--  -->
      {{ recipeData }}
    </ion-content>
  </ion-modal>
</template>

<script>
import { defineComponent, ref, watch, watchEffect, computed, onMounted } from "vue";
import {
  IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonInput, IonLabel, IonGrid, IonChip, IonSearchbar, IonItem, IonRow, IonIcon, IonActionSheet, IonTextarea 
} from "@ionic/vue";
import { closeCircleOutline } from 'ionicons/icons'
//
import store from '../../store/index';
//
import { searchWarehouseCategoryFilter } from '../../helpers/filterWarehouseCategories';
import { sortAlphabeticallyWarhouseItem } from "../../helpers/sortDealSubject";

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
    IonTextarea 
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
    watchEffect(() => {
      recipeData.value = props.recipeData;
    });

    return {
      recipeData, recipeName, recipeDescription, recipeValue, closeThisModal, searchRecipesCategoriesMenu, searchRecipesCategories, searchedRecipesCategories, userRecipesCategories, userSettings, isCategoryAlreadyAdded, newCategory, choosenCategory, closeCircleOutline, deleteCategory, deleteCategoryButtons, openDeleteCategoryModal, deleteCategoruFunc
    };
  },
});
</script>

<style scoped></style>

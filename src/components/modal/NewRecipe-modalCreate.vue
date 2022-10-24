<template>
  <ion-modal>
    <ion-header translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="$emit('closeModal')">Отменить</ion-button>
        </ion-buttons>
        <ion-title class="ion-text-center">Новый</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('createRecipe', recipeData)"
            >Готово</ion-button
          >
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" forceOverscroll="false">
      <!-- ============================= Основные данные ===================================== -->
      <ion-item-group>
        <!-- Заголовок -->
        <ion-text>
          <h4>В разработке...</h4>
        </ion-text>
      </ion-item-group>
      {{ recipeData }}
      <!--  -->
      <ion-item-group>
        <!-- <ion-label>Default input</ion-label> -->
        <ion-input
          type="text"
          v-model="recipeName"
          placeholder="Укажите название рецепта"
        ></ion-input>
      </ion-item-group>
    </ion-content>
  </ion-modal>
</template>

<script>
import { defineComponent, ref, watch, watchEffect } from "vue";
import {
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
} from "@ionic/vue";

export default defineComponent({
  name: "CreateRecipe",
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
  },
  setup(props, { emit }) {
    //
    const recipeData = ref();
    const recipeName = ref("");
    const recipeValue = ref("");
    //
    watch(recipeName, () => {
      // console.log(recipeName.value)
        recipeData.value.name = recipeName;
        recipeData.value.value = recipeName
    });
    //
    watchEffect(() => {
      recipeData.value = props.recipeData;
    });

    return {
      recipeData,
      recipeName,
      recipeValue
    };
  },
});
</script>

<style scoped></style>

<template>
  <ion-modal>
    <!-- Поиск -->
    <ion-searchbar
      v-model="searchItem"
      placeholder="Поиск..."
      show-cancel-button="always"
      cancelButtonText="Отменить"
      @ionCancel="$emit('closeModal')"
    ></ion-searchbar>
    <!-- Вывод списка -->
    <ion-content forceOverscroll="false" class="ion-margin-top">

      <!--  -->
      <ion-item
        v-if="itemsList().length > 0"
        v-for="(item, idx) in itemsList()"
        :key="idx"
        class="ion-no-padding"
        style="margin-top: 1rem; padding: 0 1rem;"
        @click.stop="$emit('addItem', item)"
      >
        <ion-grid class="ion-no-padding ion-margin-bottom">
          <ion-row class="ion-justify-content-between ion-align-items-center" style="flex-wrap: nowrap;">
            <ion-text class="ion-padding-start">{{  item.name  }}</ion-text>
            <ion-thumbnail class="thumbnail_deal-subject" style="background-color: var(--ion-color-light);">
                <ion-img :src="`../img/subjects/buy/${item.value}.webp`"></ion-img>
            </ion-thumbnail>
          </ion-row>
        </ion-grid>
      </ion-item>

      <!--  -->
      <ion-item v-else lines="none">
          <ion-text color="medium">Ничего не найдено</ion-text>
      </ion-item>

      <!--  -->
      <br>
      <br>
      <br>
      <br>
      <br>
    </ion-content>
  </ion-modal>
</template>

<script>
  import { defineComponent, ref, watchEffect } from "vue";
  //
  import { IonModal, IonSearchbar, IonContent, IonItem, IonText, IonGrid, IonRow, IonThumbnail, IonImg } from "@ionic/vue"
  //
  import store from '../../store/index';
  //
  import { sortAlphabetically } from '../../helpers/sortDealSubject';
  import { searchWarehouseItemFilter } from '../../helpers/filterUserWarehouseItems';

  export default defineComponent({
    name: 'SearchDealBuySubject',
    emits: ['closeModal', 'addItem'],
    props: {
      properties: String
    },
    components: {
      IonModal, IonSearchbar, IonContent, IonItem, IonText, IonGrid, IonRow, IonThumbnail, IonImg
    },
    setup(props, {emit}) {
      const searchItem = ref('');
      const itemProperties = ref(props.properties);
      console.log(itemProperties.value)
      //
      const itemsList = () => {
        let itemsArray = store.state.dealBuySubjectArray.filter(item => {
          return item[itemProperties.value] === true
        })
        let uniqItemsArray = Object.values(itemsArray.reduce((acc,cur)=>Object.assign(acc,{[cur.name]:cur}),{}))
        if(searchItem.value === '') {
          return sortAlphabetically(uniqItemsArray)
        } else if (searchItem.value !== '') {
          return searchWarehouseItemFilter(uniqItemsArray, searchItem.value)
        } else {
          return []
        }
      }
      //
      watchEffect(() => {
        itemProperties.value = props.properties;
      })

      return {
        searchItem, itemsList
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
  }
</style>
<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-title>Настройки</ion-title>
                <ion-buttons slot="start">
                    <ion-button @click="$emit('closeModal')">Закрыть</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content
            :scroll-events="true"
            class="ion-page ion-margin-top" 
            id="main"
            type="push"
            forceOverscroll="false"
        >
            <br>
            <br>
            <div class="ion-margin-horizontal">
                <ion-text>
                    <h3>
                        Мои категории
                    </h3>
                </ion-text>
                <!-- {{myCategories}} -->
                <!-- <ion-text color="medium">Подключите складские категории к вашему аккаунту.</ion-text> -->
                <ion-text color="medium">Чтобы не потерять предметы, у которых были указаны отключенные категории - также показываем их в поиске.</ion-text>
                <br>
            </div>

            <div v-for="(category, index) in warehouseCategoriesArray" :key="index" class="ion-margin-horizontal">
                <ion-grid class="ion-no-padding ion-margin-top">
                    <ion-row v-if="category === 'Без категории'" class="ion-justify-content-between ion-align-items-center">
                        <div>
                            <ion-text>{{category}}</ion-text> <ion-text color="medium">(По умолчанию)</ion-text>
                        </div>
                        <ion-toggle color="success" checked="true" disabled="true" @ionChange="doSomething(category, index)"></ion-toggle>
                    </ion-row>

                    <ion-row v-else class="ion-justify-content-between ion-align-items-center">
                        <ion-text>{{category}}</ion-text>
                        <ion-toggle color="success" :checked="isChecked(category)" @ionChange="doSomething(category, index)"></ion-toggle>
                    </ion-row>
                </ion-grid>
            </div>

        </ion-content>

    </ion-modal>
</template>

<script>
    import { defineComponent, ref, onMounted , watchEffect } from 'vue'
    //
    import { IonModal, IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonText, IonToggle, IonGrid, IonRow } from '@ionic/vue'
    //
    import store from '../../store/index';

    export default defineComponent({
      name: 'WarehouseSettings',
      props: {
        itemsSystemCategories: Array,
        // userItemsCategories: Array
      },
      components: {
        IonModal, IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonText, IonToggle, IonGrid, IonRow
      }, 
      setup(props, { emit }) {
        //
        const myCategories = ref([])
        const warehouseCategoriesArray = ref([])
        //
        onMounted(() => {
            myCategories.value = store.state.userSettings[0].userWarehouseCategories
        })
        //
        const isChecked = (category) => {
            if(myCategories.value.includes(category)) {
                // console.log(true)
                return true
            } else {
                // console.log(false)
                return false
            }
        }
        //
        const doSomething = async (category, index) => {
            console.log(category)
            console.log(index)
            if(myCategories.value.includes(category)) {
                myCategories.value.splice(category, 1)
                emit('update', myCategories.value)
            } else {
                myCategories.value.push(category)
                emit('update', myCategories.value)
            }

        }
        //
        watchEffect(() => {
            // myItems.value = props.userItemsCategories
            warehouseCategoriesArray.value = props.itemsSystemCategories
        })

        return {
            warehouseCategoriesArray, myCategories, isChecked, doSomething
        }
      }
    })
</script>

<style scoped>

</style>
<template>
    <ion-modal>
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="closeThisModal">Отменить</ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Новый</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="$emit('createItem', itemData)">Готово</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding" forceOverscroll="false">
            <!-- ============================= Основные данные ===================================== -->
            {{ itemData }}
            <!-- Название предмета  -->
            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4>Название</h4>
                </ion-text>
                <!--  -->
                <ion-input
                    type="text"
                    v-model="itemName"
                    placeholder="Укажите название предмета"
                ></ion-input>
            </ion-item-group>
            <!-- Каталожный номер -->
            <ion-item-group>
                <!-- Заголовок -->
                <ion-text>
                    <h4>Каталожный номер</h4>
                </ion-text>
                <!--  -->
                <ion-input
                    type="text"
                    v-model="catalogNumber"
                    placeholder="Укажите каталожный номер"
                ></ion-input>
            </ion-item-group>
        </ion-content>
    </ion-modal>
</template>

<script>
import { defineComponent, ref, watch, watchEffect  } from "vue";
import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonInput } from "@ionic/vue";

    export default defineComponent({
        name: 'CreateItem',
        emites: ['closeModal'],
        props: {
            itemData: Object
        }, 
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText, IonInput
        }, 
        setup (props, { emit }) {
            //
            const itemData = ref();
            const itemName = ref('')
            const catalogNumber = ref();
            //
            watch(itemName, () => {
                itemData.value.name = itemName.value
            })
            //
            watch(catalogNumber, () => {
                itemData.value.catalogNumber = catalogNumber.value
            })
            //
            const closeThisModal = () => {
                emit('closeModal', 
                    itemName.value = '',
                    catalogNumber.value = ''
                )
            }
            //
            watchEffect(() => {
                itemData.value = props.itemData
            }) 

            return {
                itemData, itemName, catalogNumber, closeThisModal
            }
        }
    })
</script>

<style scoped>

</style>
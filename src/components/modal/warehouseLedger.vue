<template>
    <ion-modal>
        <!--  -->
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click.stop="$emit('closeModal')">Закрыть</ion-button>
                </ion-buttons>
                <ion-title>Журнал</ion-title>
                <ion-buttons slot="end"></ion-buttons>
            </ion-toolbar>
        </ion-header>
        <!--  -->
        <ion-content forceOverscroll="false">

            <!-- no data -->
            <div v-if="myData.length === 0" class="no-data ion-padding-horizontal">
                <ion-text>Пока пусто</ion-text>
            </div>

            <!-- data -->
            <div v-if="myData.length !== 0">
                {{ myData }}
            </div>

            <br>
            <br>
            <br>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, onMounted } from 'vue';
    import store from '../../store/index';
    //
    import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText } from '@ionic/vue';

    export default defineComponent({
        name: 'WarehouseLedger',
        emit: [],
        props: {
            
        },
        components: {
            IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonText
        },
        setup(props, {emit}) {
            //
            const myData = ref([])

            onMounted(async () => {
                await store.methods.getUserWarehouseLedger();
                myData.value = store.state.userLedgerWarehouseArray
            })

            return {
                myData
            }
        }
    })
</script>

<style scoped>
    .no-data {
        height: 80vh; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center;
    }
</style>
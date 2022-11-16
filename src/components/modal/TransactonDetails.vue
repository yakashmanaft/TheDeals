<template>
    <ion-modal :initial-breakpoint="0.6">
        <ion-header translucent="true">
            <ion-toolbar>
                <ion-title>Детали</ion-title>
                <ion-buttons slot="end">
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
            <br>
            {{currentTransaction}}

            <div @click="goToDeal(currentTransaction.dealID)">
                Перейти к делу
            </div>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, onMounted, computed, watchEffect } from 'vue'; 
    import { useRouter } from 'vue-router';
    //
    import { IonModal, IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonButton } from '@ionic/vue';
    //
    import store from '../../store/index';

    export default defineComponent({
        name: 'TransactionDetails',
        props: {
            transaction: Object
        },
        components: {
            IonModal, IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonButton
        },
        setup(props, { emit }) {
            // Setup ref to router
            const router = useRouter();
            //
            const currentTransaction = ref()
            const myDeals = ref([])
            //
            onMounted(async ( ) => {
                await store.methods.getMyDealsFromBD();
                myDeals.value = store.state.myDealsArray;
            })

            //
            const goToDeal = (dealID) => {
                const currentDeal = myDeals.value.filter(item => item.id === +dealID)
                emit('closeModal')
                router.push({
                    name: 'View-Deal', params: {
                        dealId: +dealID,
                        deal: JSON.stringify(currentDeal[0])
                    }
                })
            }

            watchEffect(() => {
                currentTransaction.value = props.transaction
            })

            return {
                currentTransaction, myDeals, goToDeal, router
            }
        }
    })
</script>

<style scoped>

</style>
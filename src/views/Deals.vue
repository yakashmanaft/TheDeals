<template>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- Navigation Menu -->
        <navigation-menu/>

        <!-- page header -->
        <Header :title="pageTitle" />

        <!-- Кнопка перехода к созданию нового дела -->
        <create-button @click="setOpen"/>

        <!-- popup создания нового дела -->
        <CreateNewDeal
            :isOpen="isOpen"
            @closeModal="setOpen"
            @createDeal="createNew"
            :dealData="dealData"
        />

        <ion-content 
            :scroll-events="true"
            class="ion-page ion-margin-top" 
            id="main"
            type="push" 
        >
            <br>
            <br>
            <br>
            <!-- page content -->
            <!-- No data -->
            <div v-if="(!dataLoaded || myDeals.length === 0) && !spinner" class="ion-padding-horizontal">
                <ion-img style="height: 30vh;" src="img/common/deals-sticker.webp" alt="нет дел"></ion-img>
                <ion-text color="primary"><h2>У вас еще нет дел...</h2></ion-text>
                <ion-text>Самое время начать заниматься деятельностью. <br>И создать первое дело!</ion-text>
            </div>
            <!-- Data -->
            <div v-if="dataLoaded && myDeals.length !== 0">

                <!-- Статусы дел -->
                <div class="horizontal-scroll">
                    <ion-chip>
                        <ion-label color="primary">Secondary Label</ion-label>
                    </ion-chip>
                    <ion-chip>
                        <ion-label color="primary">Secondary Label</ion-label>
                    </ion-chip>
                    <ion-chip color="primary" outline="true" @click="doSomethind">
                        <ion-label color="primary">Secondary Label</ion-label>
                    </ion-chip>
                    <ion-chip>
                        <ion-label color="primary">Secondary Label</ion-label>
                    </ion-chip>
                    <ion-chip>
                        <ion-label color="primary">Secondary Label</ion-label>
                    </ion-chip>
                    <ion-chip>
                        <ion-label color="primary">Secondary Label</ion-label>
                    </ion-chip>
                </div>

                <!-- Карточки дел -->
                <router-link 
                    v-for="deal in myDeals" 
                    :key="deal.id"
                    :to="{ name: 'View-Deal', params: { 
                            dealId: deal.id,
                            dealUid: deal.uid,
                            deal: JSON.stringify(deal)
                        }}"
                >
                    <ion-card>

                        {{deal}}
                    </ion-card>
                </router-link>


            </div>
        </ion-content>
</template>

<script>

    import NavigationMenu from '@/components/NavigationMenu.vue';
    import Header from '@/components/headers/Header.vue'
    import Spinner from '@/components/Spinner.vue';
    import CreateButton from '@/components/CreateButton.vue';
    import CreateNewDeal from '@/components/modal/CreateNewDeal.vue';
    import { 
        IonContent, 
        IonHeader, 
        IonItem, 
        IonImg,
        IonList, 
        IonMenu, 
        IonMenuToggle,
        IonButton,
        IonTitle, 
        IonToolbar,
        IonIcon,
        IonText,
        IonChip,
        IonLabel,
        IonItemOption,
        IonItemOptions,
        IonItemSliding,
        IonVirtualScroll,
        IonCard
    } from '@ionic/vue';
    import { defineComponent, ref, computed, onMounted } from 'vue';
    import store from '../store/index';
    import { supabase } from '../supabase/init';
    import { useRouter } from 'vue-router';
    import { uid } from 'uid';
  


    export default defineComponent({
        name: 'Deals',
        components: {
            Header,
            Spinner,
            CreateButton,
            CreateNewDeal,
            IonContent, 
            IonHeader, 
            IonItem, 
            IonImg,
            IonList, 
            IonMenu, 
            IonMenuToggle,
            IonButton,
            IonTitle, 
            IonToolbar,
            IonIcon,
            IonText,
            NavigationMenu,
            IonChip,
            IonLabel,
            IonItemOption,
            IonItemOptions,
            IonItemSliding,
            IonVirtualScroll,
            IonCard
        },
        setup() {
            // Get user from store
            const user = computed(() => store.state.user);
            // Setup ref to router
            const router = useRouter();
            // Get user email
            store.methods.setUserEmail()
            const userEmail = ref(store.state.userEmail)
            console.log(userEmail.value)
            // Get page title
            const pageTitle = router.currentRoute._value.meta.translation;

            // 
            const spinner = ref(null);
            const dataLoaded = ref(null);
            const myDeals = ref([]);

            // Подтягиваем список дел из store
            spinner.value = true;
            onMounted( async() => {
                await store.methods.getMyDealsFromBD();
                myDeals.value = store.state.myDealsArray;
                spinner.value = false
                dataLoaded.value = true;
            })
            
            // =======================================
            // Work with Modal Create New Deal
            const isOpen = ref(false)
            // Изменяемый шаблон нового дела
            const dealData = ref({
                uid: uid(),
                email: userEmail.value,
            })

            // При закрытии или открытии modal очищаем шаблон дела
            const setOpen = () => {
                isOpen.value = !isOpen.value;
                dealData.value = {
                    uid: uid(),
                    email: userEmail.value,
                }
            }

            // Создаем новую сделку
            const createNew = async (newDealData) => {
                console.log(newDealData)
            }

            //
            const doSomethind = () => {
                console.log(123)
            }

            return {
                user, router, pageTitle, userEmail, createNew, myDeals, spinner, dataLoaded, isOpen, dealData, setOpen, doSomethind
            }
        }
    })
</script>

<style scoped>
    ion-img {
        height: 50vh;
    }

    ::-webkit-scrollbar, *::-webkit-scrollbar {
        display: none;
        overflow: hidden;
    }

    .horizontal-scroll {
        overflow: scroll;
        --overflow: scroll;
        white-space: nowrap;
    }
</style>
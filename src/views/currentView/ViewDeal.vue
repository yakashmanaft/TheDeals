<template :key="componentKey">
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- page header -->
        <ViewHeader />

        <!-- page-content -->
        <ion-content
            :scroll-events="true"
            class="ion-page ion-margin-top" 
            id="main"
            type="push" 
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
            <div>
                <!-- ============================== Статус дела ========================================== -->
                <ion-item-group>
                    <ion-grid class="ion-margin-top" style="padding-top: 0!important">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-chip :color="setChipColor(dealStatus)">
                                <Select
                                    :data="dealStatusList" 
                                    :placeholder="translatePlaceholder(currentDeal.dealStatus, dealStatusList)"
                                    @date-updated="(selected) => {dealStatus = selected.currentValue;}"
                                />
                            </ion-chip>
                            <ion-text></ion-text>
                        </ion-row>
                    </ion-grid>
                </ion-item-group>

                <!-- ============================== Контакт по делу ====================================== -->
                <ion-item-group class="ion-text-left ion-padding-horizontal">
                    <!-- Заголовок -->
                    <ion-text >
                        <h4>Контакт</h4>
                    </ion-text>
                    <!-- Показываем контакт по делу -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <!-- <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin" >{{dealContact}}</ion-button> -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin" >{{dealContact}}</ion-button>
                            <ion-button size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="searchContactMenu = true">Изменить</ion-button>
                        </ion-row>
                    </ion-grid>
                    <!-- модалка для выбора (ПОИСК КОНТАКТА) контакта по делу -->
                    <!-- Может быть вынести в отдельны компонент? -->
                    <ion-modal :isOpen="searchContactMenu" >
                        <ion-searchbar class="ion-text-left" placeholder="Поиск..." v-model="searchDealContact" show-cancel-button="always" cancelButtonText="Отменить" @ionCancel="searchContactMenu = false"></ion-searchbar>
                        <ion-content style="height: 90vh">
                            <ion-item v-for="contact in searchedContacts" :key="contact.id" @click="choose(contact)">
                                <ion-grid>
                                    <ion-row>
                                        <ion-text>{{contact.contactInfo.name}} {{contact.contactInfo.surname}}</ion-text>
                                    </ion-row>
                                    <ion-row>
                                        <ion-text style="font-size: 1rem;" color="medium">{{contact.contactInfo.company}}</ion-text>
                                    </ion-row>
                                </ion-grid>
                            </ion-item>
                            <!-- Если поиском в списке контактов ничего не найдено -->
                            <ion-item lines="none" v-if="searchedContacts.length <= 0">
                                <ion-text color="medium">Ничего не найдено</ion-text>
                            </ion-item>
                        </ion-content>
                    </ion-modal>
                </ion-item-group>
                <!-- Дата и время исполнения -->
                <ion-item-group class="ion-text-left ion-padding-horizontal">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Дата и время исполнения</h4>
                    </ion-text>
                </ion-item-group>
                <br>
                {{currentDeal}}
                <br>
                <!-- Кнопка удалить контакта -->
                <!-- Не показываем в режиме edit -->
                <ion-button @click="setOpen(true)" fill="clear" color="danger">Удалить дело</ion-button>
                <!-- Всплывашка подтверждение -->
                <ion-action-sheet
                    :is-open="isOpenRef"
                    header="Точно удалить?"
                    :buttons="buttons"
                    @didDismiss="setOpen(false)"
                >
                </ion-action-sheet>
            </div>
        </ion-content>

    </div>
</template>

<script>
    import { onMounted, defineComponent, ref, computed, watch } from 'vue';
    import { supabase } from '../../supabase/init';
    import { useRoute, useRouter } from 'vue-router';
    import store from '../../store/index';
    import { uid } from 'uid';
    import { IonContent, IonButton, IonActionSheet, IonItemGroup, IonText, IonGrid, IonRow, IonModal, IonItem, IonSearchbar, IonChip } from '@ionic/vue';
    import {  } from 'ionicons/icons';
    //
    import { searchFilter } from '../../helpers/filterMyContacts'; 
    //
    import Spinner from '../../components/Spinner.vue';
    import ViewHeader from '../../components/headers/HeaderViewCurrent.vue';
    import Select from '@/components/Select.vue';
    //
    export default defineComponent({
        name: 'View-deal',
        components: {
            Spinner,
            ViewHeader,
            IonContent,
            IonButton,
            IonActionSheet,
            IonItemGroup,
            IonText,
            IonGrid,
            IonRow,
            IonModal,
            IonItem,
            IonSearchbar,
            Select,
            IonChip
        }, 
        setup() {
            const route = useRoute();
            const router = useRouter();
            // Get current info of route
            const currentId = route.params.dealId;
            const info = route.params;
            const currentDeal = ref(JSON.parse(info.deal))
            // Храним на случай нажатия Отмены при редактировании контакта
            // const tempData = JSON.parse(info.deal)
            //
            const spinner = ref(null);
            // Edit contact info
            // const edit = ref(null)
            // const editMode = () => {
            //     edit.value = !edit.value;
            // }
            // Cancel editMode & cancel all changes
            // const cancelEdit = () => {
            //     edit.value = !edit.value;
            //     // note.value = !note.value;
            //     currentDeal.value = tempData
            //     reloadData()
            // }
            // Статусы дел
            const dealStatusList = ref(store.state.dealStatusList)
            //
            const myContacts = ref([])
            myContacts.value = store.state.myContactsArray; 
            const searchDealContact = ref('');
            const searchedContacts = computed(() => {
                return searchFilter(myContacts.value, searchDealContact.value)
            })
            //
            const showNameByID = (contactID) => {
                const result = myContacts.value.filter(contact => contact.id === +contactID)
                if(result.length !== 0) {
                    const nameByID = (result[0].contactInfo.surname + ' ' + result[0].contactInfo.name).toString().replace(/"/g, "")
                    return nameByID;
                } else if (result.length === 0) {
                    const nameByID = 'Неизвестный'
                    return nameByID;
                }
            }
            // храним значение contactID
            const dealContactID = ref();
            dealContactID.value = currentDeal.value.contactID
            const dealContact = ref(showNameByID(dealContactID.value));
            // храним значение dealStatus
            const dealStatus = ref(currentDeal.value.dealStatus);
            // следим за изменениями значения dealStatus у текущего дела и обновляем его в БД
            watch (dealStatus, () => {
                update()
            })
            // выдергиваем из массива нужный контакт
            const searchContactMenu = ref(false)
            const choose = (contact) => {
                dealContact.value = `${contact.contactInfo.name} ${contact.contactInfo.surname}`
                dealContactID.value = contact.id
                searchContactMenu.value = false
                update()
            }
            // Обновляем данные из БД
            // вынести в store?
            // const reloadData = async () => {
            //     try {
            //         const { data: myDeals, error } = await supabase.from('deals').select('*').eq('id', currentId);
            //         currentDeal.value = myDeals[0];
            //         if (error) throw error;
            //     } catch (error) {
            //         alert(`Error: ${error.message}`)
            //     }
            // }     
            // Переводчик placeholder
            // Еслит надо переиспользовать
            // А если будет слишком много данных? Мы же каждый раз их обходим циклом...
            const translatePlaceholder = (value, array) => {
                let currentName = ''
                array.forEach(item => {
                    if(item.value === value) {
                        currentName = item.name
                        return currentName
                    }
                })
                return currentName
            }
            // update current deal
            const update = async () => {
                try {
                    spinner.value = true;
                    // Вынести в store?
                    console.log(`Deal ${currentId} is updated`);
                    //
                    const {error} = await supabase.from('deals').update({
                        contactID: dealContactID.value,
                        dealStatus: dealStatus.value
                    }).eq('id', currentId);
                    if(error) throw error;
                    // Дело успешно обновлено
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
                // edit.value = !edit.value;
                spinner.value = false;
            }
            // delete current deal function
            const deleteDeal = async () => {
                try {
                    const { error } = await supabase.from('deals').delete().eq('id',currentId);
                    if(error) throw error;
                    router.push({ name: 'Deals' })
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
            }
            // меню подтверждения удаления current contact
            const isOpenRef = ref(false);
            const setOpen = (boolean) => isOpenRef.value = boolean;
            const buttons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        console.log('Delete clicked')
                        deleteDeal()
                    },
                },
                {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked')
                    },
                }
            ]
            // Задаем цвет chip
            const setChipColor = (status) => {
                if (status === 'deal-in-debt') {
                    return 'danger'
                }
                if (status === 'deal-complete') {
                    return 'success'
                }
                if(status === 'deal-cancelled') {
                    return 'warning'
                }
                return 'primary'
            }

            return {
                spinner, currentId, info, currentDeal, dealContactID, isOpenRef, setOpen, buttons, deleteDeal, dealContact, choose, searchContactMenu, searchDealContact, searchedContacts, myContacts, dealStatusList, dealStatus, translatePlaceholder, setChipColor
            }
        }
    })
</script>

<style scoped>
</style>
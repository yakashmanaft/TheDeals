<template :key="componentKey">
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- page header -->
        <ViewContactHeader :edit="edit" :editMode="editMode" :update="update" :cancelEdit="cancelEdit"/>

        <!-- page content -->
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
            <div>
                <!-- Если !data -->
            </div>
    
            <!-- Data -->
            <div>
                <!-- Avatar -->
                <ion-avatar>
                    <ion-text color="light">
                        {{checkInitials()}}
                    </ion-text>
                </ion-avatar>
                <ion-item-group>
                    <!-- Surname -->
                    <ion-item v-if="edit" class="ion-margin-top">
                        <ion-label position="stacked">Изменить фамилию</ion-label>
                        <ion-input color="medium" v-model="currentContact.contactInfo.surname" type="text" placeholder="Фамилия"></ion-input>
                    </ion-item>
                    <ion-text v-else color="primary">
                        <h1 class="ion-no-margin ion-margin-top">{{ currentContact.contactInfo.surname }}</h1>
                    </ion-text>
                    <!-- Name -->
                    <ion-item v-if="edit">
                        <ion-label position="stacked">Изменить имя</ion-label>
                        <ion-input color="medium" v-model="currentContact.contactInfo.name" type="text" placeholder="Имя"></ion-input>
                    </ion-item>
                    <ion-text v-else color="medium">
                        <h3 class="ion-no-margin">{{ currentContact.contactInfo.name }}</h3>
                    </ion-text>
                    <!-- Company -->
                    <ion-item v-if="edit">
                        <ion-label position="stacked">Изменить наименование организации</ion-label>
                        <ion-input color="medium" v-model="currentContact.contactInfo.company" type="text" placeholder="Организация"></ion-input>
                    </ion-item>
                    <ion-text v-else color="medium">
                        <p class="ion-margin-top">{{ currentContact.contactInfo.company }}</p>
                    </ion-text>
                    <!-- Phones -->

                </ion-item-group>
                <br>
                {{ currentContact }}
                <br>
                <br>
                <ion-item v-for="(phone, index) in currentContact.phoneNumbers" :key="index">
                    {{phone.type}}
                </ion-item>
                <ion-button @click="deleteContact">Delete contact</ion-button>
            </div>
        </ion-content>
    </div>
</template>

<script>
    import ViewContactHeader from '../../components/headers/HeaderViewCurrent.vue';
    import { onMounted, defineComponent, ref } from 'vue';
    import { supabase } from '../../supabase/init';
    import { useRoute, useRouter } from 'vue-router';
    import store from '../../store/index';
    import { uid } from 'uid';
    import Spinner from '../../components/Spinner.vue'
    import { IonContent, IonHeader, IonButton, IonToolbar, IonButtons, IonBackButton, IonRow, IonAvatar, IonText, IonItem, IonLabel, IonInput, IonItemGroup } from '@ionic/vue';
    

    export default defineComponent({
        name: 'view-contact',
        components: {
            ViewContactHeader, IonContent, IonHeader, IonButton, IonToolbar, IonButtons, IonBackButton, IonRow, IonAvatar, IonText, IonItem, IonLabel, IonInput, Spinner, IonItemGroup
        },
        setup() {
            const route = useRoute();
            const router = useRouter();
            // Берем имя роута для заголовка
            const pageTitle = router.currentRoute._value.meta.translation;  

            // Get current info of route
            const currentId = route.params.contactId;
            const info = route.params;
            const currentContact = ref(JSON.parse(info.contact))
            // Храним на случай нажатия Отмены при редактировании контакта
            const tempData = JSON.parse(info.contact)
            //
            const spinner = ref(null);

            // Edit contact info
            const edit = ref(null)
            const editMode = () => {
                edit.value = !edit.value;
            }

            // Cancel editMode & cancel all changes
            const cancelEdit = () => {
                edit.value = !edit.value;
                // note.value = !note.value;
                currentContact.value = tempData
                reloadData()
            }
            
            // Обновляем данные из БД
            const reloadData = async () => {
                // вынести в store?
                try {
                    const { data: myContacts, error } = await supabase.from('myContacts').select('*').eq('id', currentId);
                    currentContact.value = myContacts[0];
                    if (error) throw error;
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
            }         
            
            // Проверка, если при редактировании делаем строку пустой
            const checkInitials = () => {
                if(currentContact.value.contactInfo.surname.length === 0 || currentContact.value.contactInfo.name.length === 0) {
                    return;
                } 
                    const initials = `${currentContact.value.contactInfo.surname[0].toUpperCase()}${currentContact.value.contactInfo.name[0].toUpperCase()}` 
                    return initials;
            }

            // update current contact function
            // вынести в store
            const update = async () => {
                try { 
                    spinner.value = true;
                    // Вынести в store?
                    const { error } = await supabase.from('myContacts').update({
                        contactInfo: currentContact.value.contactInfo

                    }).eq('id', currentId)
                    if(error) throw error;
                    // Контакт успешно обновлен
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
                edit.value = !edit.value;
                spinner.value = false;
            }

            // delete current contact function
            // вынести в store
            const deleteContact = async () => {
                try {
                    const { error } = await supabase.from('myContacts').delete().eq('id', currentId);
                    if (error) throw error;
                    router.push({ name: 'Contacts' })
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
            }


            return {
                pageTitle, currentId, info, currentContact, checkInitials, edit, editMode, cancelEdit, update, spinner, deleteContact
            }
        }
    })
</script>

<style scoped>
    ion-avatar {
        background-color: var(--ion-color-medium);
        width: 7rem;
        height: 7rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        margin-top: 10px;
    }

    ion-avatar > ion-text {
        font-size: 3rem;
    }
</style>

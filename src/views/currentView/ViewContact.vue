<template>
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
                    <!-- Если фото не загружали -->
                    <ion-text color="light">
                        {{ currentContact.contactInfo.surname[0].toUpperCase() }}{{ currentContact.contactInfo.name[0].toUpperCase() }}
                    </ion-text>
                </ion-avatar>
    
                <!-- Surname -->
                <ion-item v-if="edit" class="ion-margin-top">
                    <ion-label position="stacked">Изменить фамилию</ion-label>
                    <ion-input v-model="currentContact.contactInfo.surname" type="text" placeholder="Фамилия"></ion-input>
                </ion-item>
                <ion-text v-else color="primary">
                    <h1>{{ currentContact.contactInfo.surname }}</h1>
                </ion-text>
                <!-- Name -->
                <ion-item v-if="edit">
                    <ion-label position="stacked">Изменить имя</ion-label>
                    <ion-input v-model="currentContact.contactInfo.name" type="text" placeholder="Имя"></ion-input>
                </ion-item>
                <ion-text v-else color="medium">
                    <h3 class="ion-no-margin">{{ currentContact.contactInfo.name }}</h3>
                </ion-text>
                <br>
                {{ currentContact }}

            </div>
        </ion-content>
    </div>
</template>

<script>
    import ViewContactHeader from '../../components/headers/ViewContactHeader.vue';
    import { defineComponent, ref } from 'vue';
    import { supabase } from '../../supabase/init';
    import { useRoute, useRouter } from 'vue-router';
    import store from '../../store/index';
    import { uid } from 'uid';
    import Spinner from '../../components/Spinner.vue'
    import { IonContent, IonHeader, IonButton, IonToolbar, IonButtons, IonBackButton, IonRow, IonAvatar, IonText, IonItem, IonLabel, IonInput } from '@ionic/vue';

    export default defineComponent({
        name: 'view-contact',
        components: {
            ViewContactHeader, IonContent, IonHeader, IonButton, IonToolbar, IonButtons, IonBackButton, IonRow, IonAvatar, IonText, IonItem, IonLabel, IonInput, Spinner
        },
        setup() {
            const route = useRoute();
            const router = useRouter();
            // Берем имя роута для заголовка
            const pageTitle = router.currentRoute._value.meta.translation;  

            // Get current info of route
            const currentId = route.params.contactId;
            const info = route.params;
            const currentContact = JSON.parse(info.contact)

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
                //   getData();
            }
            


            // update contact function
            const update = async () => {
                
                try { 
                    spinner.value = true;
                    const { error } = await supabase.from('myContacts').update({
                        contactInfo: currentContact.contactInfo
    
                    }).eq('id', currentId)
                    if(error) throw error;
                    // Контакт успешно обновлен
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
                edit.value = !edit.value;
                spinner.value = false;
            }

            return {
                pageTitle, currentId, info, currentContact, edit, editMode, cancelEdit, update, spinner
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
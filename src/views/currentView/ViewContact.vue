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
                <!-- =================== Avatar ======================== -->
                <ion-avatar>
                    <ion-text color="light">
                        {{checkInitials()}}
                    </ion-text>
                </ion-avatar>

                <!-- ============ Surname & Name $ Company ============= -->
                <ion-item-group>
                    <!-- Surname -->
                    <ion-item v-if="edit" class="ion-margin-top ion-padding-start">
                        <ion-label position="stacked">Изменить фамилию</ion-label>
                        <ion-input color="medium" v-model="currentContact.contactInfo.surname" type="text" placeholder="Фамилия"></ion-input>
                    </ion-item>
                    <ion-text v-else color="primary">
                        <h1 class="ion-no-margin ion-margin-top">{{ currentContact.contactInfo.surname }}</h1>
                    </ion-text>
                    <!-- Name -->
                    <ion-item v-if="edit" class="ion-padding-start">
                        <ion-label position="stacked">Изменить имя</ion-label>
                        <ion-input color="medium" v-model="currentContact.contactInfo.name" type="text" placeholder="Имя"></ion-input>
                    </ion-item>
                    <ion-text v-else color="medium">
                        <h3 class="ion-no-margin">{{ currentContact.contactInfo.name }}</h3>
                    </ion-text>
                    <!-- Company -->
                    <ion-item v-if="edit" class="ion-padding-start">
                        <ion-label position="stacked">Изменить наименование организации</ion-label>
                        <ion-input color="medium" v-model="currentContact.contactInfo.company" type="text" placeholder="Организация"></ion-input>
                    </ion-item>
                    <ion-text v-else color="medium">
                        <p class="ion-margin-top">{{ currentContact.contactInfo.company }}</p>
                    </ion-text>
                </ion-item-group>

                <!-- ===================== Phones ====================== -->
                <ion-item-group>
                    <!-- Заголовок -->
                    <ion-item v-if="edit" lines="none">
                        <ion-text >
                            <h4 class="ion-no-margin ion-margin-top">Телефоны</h4>
                        </ion-text>
                    </ion-item>
                    <!-- Если ни одного телефона не добавлено -->
                    <ion-item v-if="!currentContact.phoneNumbers.length" lines="none">
                        <ion-grid class="ion-no-padding">
                            <ion-row class="ion-justify-content-between">
                                <ion-text>Нет телефонов для связи</ion-text>
                                <!-- Если включен режим редактирования -->
                                <ion-text v-if="edit" @click="addPhoneNumber" color="primary">Добавить</ion-text> 
                            </ion-row>
                        </ion-grid>
                    </ion-item>
                    <!-- Если телефоны уже есть (добавлен шаблон или имелись в БД)  -->
                    <ion-item-group v-for="(number, index) in currentContact.phoneNumbers" :key="index" class="ion-padding-start ion-padding-end">
                        <!-- Показываем в режиме edit -->
                        <div v-if="edit" class="current-phone-content">
                            <!-- sequence number &  delete current phone btn-->
                            <ion-grid class="ion-no-padding">
                                <ion-row class="ion-padding-start ion-justify-content-between ion-align-items-center">
                                    <!-- sequence number -->
                                    <ion-text position="stacked">Телефон #{{index + 1}}</ion-text>
                                    <!-- delete current phone btn -->
                                    <ion-button fill="clear" class="btn-delete-phone" @click="deletePhoneNumber(number.id)">
                                        <ion-icon :icon="closeOutline" color="danger" slot="end"></ion-icon>
                                    </ion-button>
                                </ion-row>
                            </ion-grid>
                            <!-- Phone number -->
                            <ion-item >
                                <ion-input inputmode="tel" placeholder="Укажите номер телефона" v-model="number.phone"></ion-input>
                            </ion-item>
                            <!-- Type of number -->
                            <ion-item>
                                <ion-label position="stacked">
                                    Тип номера телефона
                                </ion-label>
                                <Select :data="phoneEmailTypes" :placeholder="setSelectPlaceholderValue(number.type.currentValue)" @date-updated="(selected) => number.type = selected"/>
                            </ion-item>
                            <!-- link to messengers -->
                            <ion-item lines="none">
                                    <ion-label position="stacked">
                                        Привязка к мессенджерам
                                    </ion-label>
                                    <ion-grid class="ion-no-margin ion-no-padding">
                                        <ion-row class="margin-top ion-justify-content-between ion-align-items-center" v-for="(messenger, index) in number.messengers" :key="index">
                                            <ion-text class="ion-padding-end">
                                                {{messenger.name}}
                                            </ion-text>
                                            <ion-toggle class="ion-padding-end" color="success" v-model="messenger.status"></ion-toggle>
                                        </ion-row>
                                    </ion-grid>
                            </ion-item>
                        </div>
                        <!-- Показываем в режиме просмотра -->
                        <!-- Рассмотреть в дальнейшем возможность добавлять заготовленные тексты к "написать в мессенджер контакту" -->
                        <div v-else>
                            <!-- вызов по телефону -->
                            <a :href="`tel:${number.phone}`">
                                <ion-icon :icon="callOutline"></ion-icon>
                                <div>
                                    <ion-text color="medium">{{ checkEmptyPhoneEmailType(number.type.currentValue) }}</ion-text>
                                    <ion-text>{{ number.phone }}</ion-text>
                                </div>
                            </a>
                            <!-- Вызов на мессенджеры -->
                            <div>
                                <!-- Ссылка на чат в вайбер %2B-->
                                <!-- Подумать как можно оптимизировать -->
                                <a v-if="number.messengers[0].name === 'viber' && number.messengers[0].status === true" :href="`viber://${checkMobile()}${cutPhoneNumber(number.phone)}`">
                                    <ion-icon :icon="logoWhatsapp" color="viber"></ion-icon>
                                </a>
                                <!-- Ссылка на чат в whatsApp -->
                                <a v-if="number.messengers[1].name === 'whatsup' && number.messengers[1].status === true" :href="`https://wa.me/7${cutPhoneNumber(number.phone)}`">
                                    <ion-icon :icon="logoWhatsapp" color="whatsapp"></ion-icon>
                                </a>
                            </div>
                        </div>
                    </ion-item-group>
                    <!-- Button to add new phone to current contact -->
                    <ion-row class="ion-justify-content-end ion-padding-end">
                        <ion-text color="primary" v-if="edit && currentContact.phoneNumbers.length" @click="addPhoneNumber">Добавить еще</ion-text>
                    </ion-row>
                </ion-item-group>

                <!-- ===================== Emails ====================== -->
                <ion-item-group>
                    <!-- Заголовок -->
                    <ion-item v-if="edit" lines="none">
                        <ion-text >
                            <h4 class="ion-no-margin ion-margin-top">Электронная почта</h4>
                        </ion-text>
                    </ion-item>
                    <!-- Если ни одного email не добавлено -->
                    <ion-item v-if="!currentContact.emails.length" lines="none">
                        <ion-grid class="ion-no-padding">
                            <ion-row class="ion-justify-content-between">
                                <ion-text>Нет электронной почты</ion-text>
                                <!-- Если включен режим редактирования -->
                                <ion-text v-if="edit" @click="addEmail" color="primary">Добавить</ion-text> 
                            </ion-row>
                        </ion-grid>
                    </ion-item>
                    <!-- Если emails уже есть (добавлен шаблон или имелись в БД)  -->
                    <ion-item-group v-for="(email, index) in currentContact.emails" :key="index" class="ion-padding-start ion-padding-end">
                        <!-- Показываем в режиме edit -->
                        <div v-if="edit" class="current-phone-content">
                            <!-- sequence number &  delete current email btn-->
                            <ion-grid class="ion-no-padding">
                                <ion-row class="ion-padding-start ion-justify-content-between ion-align-items-center">
                                    <!-- sequence number -->
                                    <ion-text position="stacked">Адрес почты #{{index + 1}}</ion-text>
                                    <!-- delete current phone btn -->
                                    <ion-button fill="clear" class="btn-delete-phone" @click="deleteEmail(email.id)">
                                        <ion-icon :icon="closeOutline" color="danger" slot="end"></ion-icon>
                                    </ion-button>
                                </ion-row>
                            </ion-grid>
                            <!-- Email-->
                            <ion-item >
                                <ion-input inputmode="email" placeholder="Укажите адрес почты" v-model="email.email"></ion-input>
                            </ion-item>
                            <!-- Type of email -->
                            <ion-item>
                                <ion-label position="stacked">
                                    Тип электронной почты
                                </ion-label>
                                <Select :data="phoneEmailTypes" :placeholder="setSelectPlaceholderValue(email.type.currentValue)" @date-updated="(selected) => email.type = selected"/>
                            </ion-item>
                        </div>
                        <!-- Показываем в режиме просмотра -->
                        <div v-else>
                            <a :href="`mailto:${email.email}`" target="_blank">
                                <ion-icon :icon="mailOutline"></ion-icon>
                                <div>
                                    <ion-text color="medium">{{ checkEmptyPhoneEmailType(email.type.currentValue) }}</ion-text>
                                    <ion-text>{{ email.email }}</ion-text>
                                </div>
                            </a>
                        </div>
                    </ion-item-group>
                    <!-- Button to add new email to current contact -->
                    <ion-row class="ion-justify-content-end ion-padding-end">
                        <ion-text color="primary" v-if="edit && currentContact.emails.length" @click="addEmail">Добавить еще</ion-text>
                    </ion-row>
                </ion-item-group>

                <!-- ===================== Socials ===================== -->
                <ion-item-group>
                    <!-- Заголовок -->
                    <ion-item v-if="edit" lines="none">
                        <ion-text >
                            <h4 class="ion-no-margin ion-margin-top">Социальные сети</h4>
                        </ion-text>
                    </ion-item>
                    <!-- Если ни одной соц сети не добавлено -->
                    <ion-item v-if="!currentContact.socialNetworks.length" lines="none">
                        <ion-grid class="ion-no-padding">
                            <ion-row class="ion-justify-content-between">
                                <ion-text>Нет социальных сетей</ion-text>
                                <!-- Если включен режим редактирования -->
                                <ion-text v-if="edit" @click="addSocial" color="primary">Добавить</ion-text> 
                            </ion-row>
                        </ion-grid>
                    </ion-item>
                    <!-- Если Соцсети уже есть (добавлен шаблон или имелись в БД)  -->
                    <ion-item-group v-for="(social, index) in currentContact.socialNetworks" :key="index" class="ion-padding-start ion-padding-end">
                        <!-- Показываем в режиме edit -->
                        <div v-if="edit" class="current-phone-content">
                            <!-- sequence number &  delete current social btn-->
                            <ion-grid class="ion-no-padding">
                                <ion-row class="ion-padding-start ion-justify-content-between ion-align-items-center">
                                    <!-- sequence number -->
                                    <ion-text position="stacked">Соцсеть #{{index + 1}}</ion-text>
                                    <!-- delete current phone btn -->
                                    <ion-button fill="clear" class="btn-delete-phone" @click="deleteSocial(social.id)">
                                        <ion-icon :icon="closeOutline" color="danger" slot="end"></ion-icon>
                                    </ion-button>
                                </ion-row>
                            </ion-grid>
                            <!-- Social link -->
                            <ion-item >
                                <ion-input inputmode="email" placeholder="Вставьте ссылку на аккаунт" v-model="social.link"></ion-input>
                            </ion-item>
                            <!-- Social name -->
                            <ion-item>
                                <ion-label position="stacked">
                                    Название социальной сети
                                </ion-label>
                                <Select :data="myContactSocialNetworksType" :placeholder="setSelectPlaceholderValue(social.name.currentValue)" @date-updated="(selected) => social.name = selected"/>
                            </ion-item>
                        </div>
                        <!-- Показываем в режиме просмотра -->
                        <!-- Как можно динамики добавить? -->
                        <div v-else>
                            <a :href="`${social.link}`" target="_blank">
                                <ion-icon v-if="social.name.currentValue === 'Telegram'" :icon="paperPlaneOutline"></ion-icon>
                                <ion-icon v-if="social.name.currentValue === 'Instagram'" :icon="logoInstagram"></ion-icon>
                                <ion-icon v-if="social.name.currentValue === 'Vkontakte'" :icon="logoVk"></ion-icon>
                                <!-- <ion-icon v-if="social.name.currentValue === 'Odnoklassniki'" :icon="paperPlaneOutline"></ion-icon> -->
                                <!-- <ion-icon v-if="social.name.currentValue === 'Twitter'" :icon="paperPlaneOutline"></ion-icon> -->
                            </a>
                        </div>
                    </ion-item-group>
                    <!-- Button to add new email to current contact -->
                    <ion-row class="ion-justify-content-end ion-padding-end">
                        <ion-text color="primary" v-if="edit && currentContact.socialNetworks.length" @click="addSocial">Добавить еще</ion-text>
                    </ion-row>
                    <!-- На заметку -->
                    <!-- Если нет имени, но есть логин в инсте или другой сети... ставить вместо фамилии ) -->
                    <!-- <a href="https://www.messenger.com/t/jack.malbon.3">Facebook Messenger</a> -->
                    <!-- <a href="skype:LOGIN?chat">Отправить сообщение в Skype</a> -->
                    <!-- <a href="skype:LOGIN?voicemail">Отправить голосовое сообщение в Skype</a> -->
                    <!-- <a href="skype:LOGIN?call">Позвонить пользователю Skype</a> -->
                    <!-- <a href="skype:LOGIN?add">Добавить в список контактов Skype</a> -->
                </ion-item-group>

                <br>
                {{ currentContact }}
                <br>
                <br>
                <!-- Кнопка удалить контакта -->
                <!-- Не показываем в режиме edit -->
                <ion-button v-if="!edit" @click="setOpen(true)">Delete contact</ion-button>
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
    import ViewContactHeader from '../../components/headers/HeaderViewCurrent.vue';
    import { onMounted, defineComponent, ref } from 'vue';
    import { supabase } from '../../supabase/init';
    import { useRoute, useRouter } from 'vue-router';
    import store from '../../store/index';
    import { uid } from 'uid';
    import Spinner from '../../components/Spinner.vue';
    import Select from '../../components/Select.vue';
    import { IonContent, IonHeader, IonButton, IonToolbar, IonButtons, IonBackButton, IonRow, IonAvatar, IonText, IonItem, IonLabel, IonInput, IonItemGroup, IonGrid, IonIcon, IonToggle, IonActionSheet } from '@ionic/vue';
    import { callOutline, logoWhatsapp, closeOutline, mailOutline, paperPlaneOutline, logoInstagram, logoVk } from 'ionicons/icons';
    

    export default defineComponent({
        name: 'view-contact',
        components: {
            ViewContactHeader, IonContent, IonHeader, IonButton, IonToolbar, IonButtons, IonBackButton, IonRow, IonAvatar, IonText, IonItem, IonLabel, IonInput, Spinner, IonItemGroup, IonGrid, IonIcon, IonToggle, Select, IonActionSheet
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
            // храним массив со списком типов телефона (личный, рабочий и т.д.)
            const phoneEmailTypes = ref(store.state.myContactPhoneEmailTypes)
            const myContactSocialNetworksType = ref(store.state.myContactSocialNetworksType)

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
            // вынести в store?
            const reloadData = async () => {
                try {
                    const { data: myContacts, error } = await supabase.from('myContacts').select('*').eq('id', currentId);
                    currentContact.value = myContacts[0];
                    if (error) throw error;
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
            }         
            
            // Если в режиме edit, имя || фамилия стали пустой строкой - обходим ошибку в отображении Avatar
            const checkInitials = () => {
                if(currentContact.value.contactInfo.surname.length === 0 || currentContact.value.contactInfo.name.length === 0) {
                    return;
                } 
                    const initials = `${currentContact.value.contactInfo.surname[0].toUpperCase()}${currentContact.value.contactInfo.name[0].toUpperCase()}` 
                    return initials;
            }

            // проверка, если  в типе телефона будет пустая строка
            const checkEmptyPhoneEmailType = (typeValue) => {
                if(typeValue === undefined) {
                    return 'Тип не указан'
                } else {
                    return typeValue
                }
            }

            // update current contact function
            // вынести в store
            const update = async () => {
                try { 
                    spinner.value = true;
                    // Вынести в store?
                    const { error } = await supabase.from('myContacts').update({
                        contactInfo: currentContact.value.contactInfo,
                        phoneNumbers: currentContact.value.phoneNumbers,
                        emails: currentContact.value.emails,
                        socialNetworks: currentContact.value.socialNetworks,
                    }).eq('id', currentId)
                    if(error) throw error;
                    // Контакт успешно обновлен
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
                edit.value = !edit.value;
                spinner.value = false;
            }

            // В режиме редактирования, добавляем телефону к контакту
            const addPhoneNumber = () => {
                currentContact.value.phoneNumbers.push({
                    id: uid(),
                    type: '',
                    phone: '',
                    messengers: [
                    {
                        id: uid(),
                        name: 'viber',
                        status: false
                    },
                    {
                        id: uid(),
                        name: 'whatsup',
                        status: false
                    }
                    ]
                })
            }
            // В режиме редактирования, добавляем email к контакту
            const addEmail = () => {
                currentContact.value.emails.push({
                    id: uid(),
                    type: '',
                    email: ''
                })
            }
            // В режиме редактирования, добавляем social к контакту
            const addSocial = () => {
                currentContact.value.socialNetworks.push({
                    id: uid(),
                    name: '',
                    link: ''
                })
            }

            //Check mobile or not (for viber)
            // вынести в отдельный файл
            const checkMobile = () => {
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    const peace = 'add?number=7';
                    return peace
                    } else {
                    const peace = 'chat?number=7';
                    return peace
                }
            }

            // Cut Phone Number for massengers
            // вынести в отдельный файл
            const cutPhoneNumber = (phoneNumber) => {
                // const updatedPhoneNumber = phoneNumber.toString().substr(phoneNumber.length, 10)
                if(phoneNumber.startsWith("+")) {
                    const updatedPhoneNumber = phoneNumber.slice(2)
                    // console.log('начинается с +7' + updatedPhoneNumber)
                    return updatedPhoneNumber;
                } else if (phoneNumber.startsWith("8")) {
                    const updatedPhoneNumber = phoneNumber.slice(1)
                    // console.log('начинается с 8' + updatedPhoneNumber)
                    return updatedPhoneNumber;
                } else {
                    console.log('неверный формат номера телефона')
                }
            }

            // Delete Phone Number of Current Contact
            // вынести в store
            const deletePhoneNumber = (id) => {
                currentContact.value.phoneNumbers = currentContact.value.phoneNumbers.filter(number => number.id !== id);
                return;
            }
            // Delete email of Current Contact
            // вынести в store
            const deleteEmail = (id) => {
                currentContact.value.emails = currentContact.value.emails.filter(number => number.id !== id);
                return;
            }
            // Delete social of Current Contact
            // вынести в store
            const deleteSocial = (id) => {
                currentContact.value.socialNetworks = currentContact.value.socialNetworks.filter(social => social.id !== id);
                return;
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

            // Если placeholder у select (тип phone || email) изначально пустая строка
            const setSelectPlaceholderValue = (currentValue) => {
                if(currentValue === undefined) {
                    currentValue = 'Не указано';
                    return currentValue;
                } else {
                    return currentValue
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
                        deleteContact()
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


            return {
                pageTitle, currentId, info, currentContact, checkInitials, edit, editMode, cancelEdit, update, spinner, deleteContact, addPhoneNumber, callOutline, checkMobile, logoWhatsapp, cutPhoneNumber, phoneEmailTypes, deletePhoneNumber, closeOutline, setSelectPlaceholderValue, isOpenRef, setOpen, buttons, checkEmptyPhoneEmailType, addEmail, deleteEmail, mailOutline, addSocial, deleteSocial, myContactSocialNetworksType, paperPlaneOutline, logoInstagram, logoVk
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

    .ion-color-viber {
        --ion-color-base: var(--ion-color-viber);
        --ion-color-base-rgb: var(--ion-color-viber-rgb);
        --ion-color-contrast: var(--ion-color-viber-contrast);
        --ion-color-contrast-rgb: var(--ion-color-viber-contrast-rgb);
        --ion-color-shade: var(--ion-color-viber-shade);
        --ion-color-tint: var(--ion-color-viber-tint);
    }

    .ion-color-whatsapp {
        --ion-color-base: var(--ion-color-whatsapp);
        --ion-color-base-rgb: var(--ion-color-whatsapp-rgb);
        --ion-color-contrast: var(--ion-color-whatsapp-contrast);
        --ion-color-contrast-rgb: var(--ion-color-whatsapp-contrast-rgb);
        --ion-color-shade: var(--ion-color-whatsapp-shade);
        --ion-color-tint: var(--ion-color-whatsapp-tint);
    }


    .current-phone-content {
        border-left: 1px solid var(--ion-color-medium);
        margin: 10px 0;
        padding-bottom: 10px;
        border-radius: 10px;
    }

    .margin-top {
        margin-top: 10px;
    }
</style>

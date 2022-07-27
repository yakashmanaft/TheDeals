<template :key="componentKey">
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- page header -->
        <ViewHeader :edit="edit" :editMode="editMode" :update="update" :cancelEdit="cancelEdit"/>

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
                <!-- Data is not available -->
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
                        <ion-input autocapitalize="on" color="medium" v-model="currentContact.contactInfo.surname" type="text" placeholder="Фамилия"></ion-input>
                    </ion-item>
                    <ion-text v-else color="primary">
                        <h1 class="ion-no-margin ion-margin-top">{{ currentContact.contactInfo.surname }}</h1>
                    </ion-text>
                    <!-- Name -->
                    <ion-item v-if="edit" class="ion-padding-start">
                        <ion-label position="stacked">Изменить имя</ion-label>
                        <ion-input autocapitalize="on" color="medium" v-model="currentContact.contactInfo.name" type="text" placeholder="Имя"></ion-input>
                    </ion-item>
                    <ion-text v-else color="medium">
                        <h3 class="ion-no-margin">{{ currentContact.contactInfo.name }}</h3>
                    </ion-text>
                    <!-- Company -->
                    <ion-item v-if="edit" class="ion-padding-start">
                        <ion-label position="stacked">Изменить наименование организации</ion-label>
                        <ion-input autocapitalize="on" color="medium" v-model="currentContact.contactInfo.company" type="text" placeholder="Организация"></ion-input>
                    </ion-item>
                    <ion-text v-else color="medium">
                        <p class="ion-margin-top">{{ currentContact.contactInfo.company }}</p>
                        <br>
                    </ion-text>
                </ion-item-group>

                <!-- ===================== Phones ====================== -->
                <ion-item-group>
                    <!-- Заголовок -->
                    <ion-item v-if="edit" lines="none">
                        <ion-text>
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
                    <ion-item-group v-for="(number, index) in currentContact.phoneNumbers" :key="index" class="ion-margin-horizontal">
                        <!-- Показываем в режиме edit -->
                        <div v-if="edit" class="current-content">
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
                        <div v-else class="flex ion-justify-content-between ion-align-items-center ion-margin-vertical">
                            <!-- вызов по телефону -->
                            <a :href="`tel:${number.phone}`" class="flex ion-align-items-center">
                                <ion-icon :icon="callOutline" class="ion-margin-end"></ion-icon>
                                <div class="flex flex-col ion-align-items-start">
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
                                <a v-if="number.messengers[1].name === 'whatsup' && number.messengers[1].status === true" :href="`https://wa.me/7${cutPhoneNumber(number.phone)}`" class="ion-margin-start">
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
                    <ion-item-group v-for="(email, index) in currentContact.emails" :key="index">
                        <!-- Показываем в режиме edit -->
                        <div v-if="edit" class="current-content ion-margin-horizontal">
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
                        <ion-item v-else lines="none" class="ion-no-padding">
                            <a :href="`mailto:${email.email}`" target="_blank">
                                <ion-grid class="ion-no-padding ion-margin-start">
                                    <ion-row class="ion-justify-content-between ion-align-items-center">
                                        <ion-icon class="ion-margin-end" :icon="mailOutline"></ion-icon>
                                        <div class="flex flex-col">
                                            <ion-text color="medium">{{ checkEmptyPhoneEmailType(email.type.currentValue) }}</ion-text>
                                            <ion-text>{{ email.email }}</ion-text>
                                        </div>
                                    </ion-row>
                                </ion-grid>
                            </a>
                        </ion-item>
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
                    <ion-item-group v-for="(social, index) in currentContact.socialNetworks" :key="index" class="ion-margin-horizontal">
                    <!-- Показываем в режиме edit -->
                        <div v-if="edit" class="current-content">
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
                    </ion-item-group>
                    <!-- Показываем в режиме просмотра -->
                    <!-- Как можно динамики добавить? -->
                    <ion-item v-if="!edit && currentContact.socialNetworks.length" lines="none">
                        <a v-for="(social, index) in currentContact.socialNetworks" :key="index" :href="`${social.link}`" target="_blank" class="ion-margin-top ion-margin-end">
                                <ion-icon v-if="social.name.currentValue === 'Telegram'" :icon="paperPlaneOutline"></ion-icon>
                                <ion-icon v-if="social.name.currentValue === 'Instagram'" :icon="logoInstagram"></ion-icon>
                                <ion-icon v-if="social.name.currentValue === 'Vkontakte'" :icon="logoVk"></ion-icon>
                                <!-- <ion-icon v-if="social.name.currentValue === 'Odnoklassniki'" :icon="paperPlaneOutline"></ion-icon> -->
                                <!-- <ion-icon v-if="social.name.currentValue === 'Twitter'" :icon="paperPlaneOutline"></ion-icon> -->
                        </a>
                    </ion-item>
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


                <!-- ======================= Events ==================== -->
                <ion-item-group>
                    <!-- Заголовок -->
                    <ion-item v-if="edit" lines="none">
                        <ion-text >
                            <h4 class="ion-no-margin ion-margin-top">События</h4>
                        </ion-text>
                    </ion-item>
                    <!-- Если ни одного event не добавлено -->
                    <ion-item v-if="!currentContact.contactEvents.length" lines="none">
                        <ion-grid class="ion-no-padding">
                            <ion-row class="ion-justify-content-between">
                                <ion-text>Нет событий</ion-text>
                                <!-- Если включен режим редактирования -->
                                <ion-text v-if="edit" @click="addContactEvent" color="primary">Добавить</ion-text> 
                            </ion-row>
                        </ion-grid>
                    </ion-item>
                    <!-- Если event уже есть (добавлен шаблон или имелись в БД)  -->
                    <ion-item-group v-for="(event, index) in currentContact.contactEvents" :key="index">
                        <!-- Показываем в режиме edit -->
                        <div v-if="edit" class="current-content margin-horizontal-16">
                            <!-- sequence number &  delete current email btn-->
                            <ion-grid class="ion-no-padding">
                                <ion-row class="ion-padding-start ion-justify-content-between ion-align-items-center">
                                    <!-- sequence number -->
                                    <ion-text position="stacked">Событие #{{index + 1}}</ion-text>
                                    <!-- delete current phone btn -->
                                    <ion-button fill="clear" class="btn-delete-phone" @click="deleteContactEvent(event.id)">
                                        <ion-icon :icon="closeOutline" color="danger" slot="end"></ion-icon>
                                    </ion-button>
                                </ion-row>
                            </ion-grid>
                            <!-- event title -->
                            <ion-item>
                                <ion-input autocapitalize="on" inputmode="text" placeholder="Название события" v-model="event.title"></ion-input>
                            </ion-item>
                            <!-- date of event -->
                            <ion-item>
                                <ion-label position="stacked">
                                    Укажите дату события
                                </ion-label>
                                <!-- Кнопка активации компонента, она же показывает выбранное -->
                                <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="openModalCalendar(event)">{{datepicker(event.date)}}</ion-button>
                                <!-- Компонент выбора даты -->
                                <ModalCalendar 
                                    :isOpen="event.show === true" 
                                    @date-updated="(pickedDate) => event.date = pickedDate.currentValue"
                                    @closeModal="closeModalCalendar(event)"
                                    @didDismiss="event.show = false"
                                    :date="event.date"
                                />
                            </ion-item>
                        </div>
                        <!-- Показываем в режиме просмотра -->
                        <ion-item v-else lines="none" class="ion-margin-top">
                            <ion-grid class="ion-no-padding">
                                <ion-row class="ion-justify-content-between ion-align-items-center">
                                    <ion-text class="flex flex-col">
                                        <ion-text color="medium" class="ion-text-start">{{ event.title }}</ion-text>
                                        <ion-text color="primary" class="ion-text-start">{{ checkHasDate(event.date) }}</ion-text>
                                    </ion-text>
                                    <ion-text class="ion-padding-end" color="medium">{{calcDaysUntilDate(event.date)}}</ion-text>
                                </ion-row>
                            </ion-grid>
                        </ion-item>
                    </ion-item-group>
                    <!-- Button to add new event to current contact -->
                    <ion-row class="ion-justify-content-end ion-padding-end">
                        <ion-text color="primary" v-if="edit && currentContact.contactEvents.length" @click="addContactEvent">Добавить еще</ion-text>
                    </ion-row>
                </ion-item-group>

                <!-- ======================= Note ====================== -->
                <ion-item-group>
                    <!-- В режиме редактирования -->
                    <div v-if="edit">
                        <!-- Заголовок -->
                        <ion-item lines="none">
                            <ion-text>
                                <h4 class="ion-no-margin ion-margin-top">Заметки</h4>
                            </ion-text>
                        </ion-item>
                        <!-- Показываем текст заметки -->
                        <ion-item lines="none">
                            <ion-textarea color="medium" v-model="currentContact.contactInfo.note" inputmode="text" placeholder="Впишите текст заметки" autocapitalize="on" auto-grow="true"></ion-textarea>
                        </ion-item>
                    </div>
                    <!-- В режиме просмотра -->
                    <ion-item v-else lines="none" class="ion-no-padding">
                        <ion-item v-if="currentContact.contactInfo.note === '' || currentContact.contactInfo.note === null" lines="none">
                            Нет заметок
                        </ion-item>
                        <ion-item v-else lines="none" class="ion-margin-top">
                            <div class="flex flex-col ">
                                <ion-text color="medium">Заметки</ion-text>
                                <ion-text color="primary">{{currentContact.contactInfo.note}}</ion-text>
                            </div>
                        </ion-item>
                    </ion-item>
                </ion-item-group>

                <br>
                <!-- Кнопка удалить контакта -->
                <!-- Не показываем в режиме edit -->
                <ion-button v-if="!edit" @click="setOpen(true)" fill="clear" color="danger">Удалить контакт</ion-button>
                <!-- Всплывашка подтверждение -->
                <ion-action-sheet
                    :is-open="isOpenRef"
                    header="Точно удалить?"
                    :buttons="buttons"
                    @didDismiss="setOpen(false)"
                >
                </ion-action-sheet>
                <br>
                <br>
                <br>
            </div>
        </ion-content>
    </div>
</template>

<script>
    import ViewHeader from '../../components/headers/HeaderViewCurrent.vue';
    import { onMounted, defineComponent, ref } from 'vue';
    import { supabase } from '../../supabase/init';
    import { useRoute, useRouter } from 'vue-router';
    import store from '../../store/index';
    import { uid } from 'uid';
    import Spinner from '../../components/Spinner.vue';
    import Select from '../../components/Select.vue';
    import { IonContent, IonHeader, IonButton, IonToolbar, IonButtons, IonBackButton, IonRow, IonAvatar, IonText, IonItem, IonLabel, IonInput, IonItemGroup, IonGrid, IonIcon, IonToggle, IonActionSheet, IonTextarea } from '@ionic/vue';
    import { callOutline, logoWhatsapp, closeOutline, mailOutline, paperPlaneOutline, logoInstagram, logoVk } from 'ionicons/icons';
    import ModalCalendar from '../../components/modal/NewContact-modalCalendar.vue';    
    import { format, parseISO } from 'date-fns';
    import { ru } from 'date-fns/locale'
    

    export default defineComponent({
        name: 'view-contact',
        components: {
            ViewHeader, IonContent, IonHeader, IonButton, IonToolbar, IonButtons, IonBackButton, IonRow, IonAvatar, IonText, IonItem, IonLabel, IonInput, Spinner, IonItemGroup, IonGrid, IonIcon, IonToggle, Select, IonActionSheet, ModalCalendar, IonTextarea
        },
        setup() {
            const route = useRoute();
            const router = useRouter();
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

            // проверка, если  в типе телефона| имейла будет пустая строка
            const checkEmptyPhoneEmailType = (typeValue) => {
                if(typeValue === undefined) {
                    return 'Тип не указан'
                } else {
                    return typeValue
                }
            }
            // проверка, если дату в contact event забыли указать
            const checkHasDate = (value) => {
                if(value === undefined) {
                    return 'Дата не указана'
                } else {
                    const formattedString = format(parseISO(value), 'd MMMM', { locale: ru });
                    return formattedString
                }
            }
            // считаем количество дней до даты
            const calcDaysUntilDate = (eventDate) => {
                if(eventDate === undefined) {
                    return
                } else {
                    const now = new Date();
                    const date = new Date(eventDate);

                    date.setFullYear(now.getFullYear());
                    if(now > date) {
                        date.setFullYear(now.getFullYear() + 1);
                    }
                    // А если високосный год?
                    const result = Math.floor((date - now) / (864e5) + 1)
                    // условия показа доп. фраз
                    if (result === 0 || result === 365) {
                        return 'Сегодня'
                    } else if (result === 1) {
                        return 'Завтра'
                    }else if (result % 100 === 11 || result % 100 === 12 || result % 100 === 13 || result % 100 === 14) {
                        return result + ' дней';
                    } else if (result % 10 === 2 || result % 10 === 3 || result % 10 === 4) {
                        return 'Через ' + result + ' дня';
                    } else {
                        return 'Через ' + result + ' дней'
                    }
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
                        contactEvents: currentContact.value.contactEvents,
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
            const addContactEvent = () => {
                currentContact.value.contactEvents.push({
                    id: uid(),
                    title: '',
                    date: '',
                    show: ''
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

            // Управление модалкой календаря
            const openModalCalendar = (event) => {
                event.show = !event.show;
            }
            const closeModalCalendar = (event) => {
                event.show = !event.show;
            }
            // выбираем дату
            // вывести в отдельный файл (вместе с функцией из CreateNewContact)
            const datepicker = (eventDate) => {
                if(eventDate === undefined) {
                    return 'Выберите дату'
                }
                const data = eventDate
                const formattedString = format(parseISO(data), 'd MMMM', { locale: ru });
                return formattedString
            }

            // Delete Phone Number of Current Contact
            // вынести в store и объединить что ли в одну
            const deletePhoneNumber = (id) => {
                currentContact.value.phoneNumbers = currentContact.value.phoneNumbers.filter(number => number.id !== id);
                return;
            }
            // Delete email of Current Contact
            // вынести в store и объединить что ли в одну
            const deleteEmail = (id) => {
                currentContact.value.emails = currentContact.value.emails.filter(number => number.id !== id);
                return;
            }
            // Delete social of Current Contact
            // вынести в store и объединить что ли в одну
            const deleteSocial = (id) => {
                currentContact.value.socialNetworks = currentContact.value.socialNetworks.filter(social => social.id !== id);
                return;
            }
            // Delete event of Current Contact
            // вынести в store и объединить что ли в одну
            const deleteContactEvent = (id) => {
                currentContact.value.contactEvents = currentContact.value.contactEvents.filter(event => event.id !== id);
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
                currentId, info, currentContact, checkInitials, edit, editMode, cancelEdit, update, spinner, deleteContact, addPhoneNumber, callOutline, checkMobile, logoWhatsapp, cutPhoneNumber, phoneEmailTypes, deletePhoneNumber, closeOutline, setSelectPlaceholderValue, isOpenRef, setOpen, buttons, checkEmptyPhoneEmailType, addEmail, deleteEmail, mailOutline, addSocial, deleteSocial, myContactSocialNetworksType, paperPlaneOutline, logoInstagram, logoVk, addContactEvent, deleteContactEvent, datepicker, checkHasDate, calcDaysUntilDate, openModalCalendar, closeModalCalendar
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


    .current-content {
        border-left: 1px solid var(--ion-color-medium);
        margin-top: 16px;
        margin-bottom: 16px;
        padding-bottom: 10px;
        border-radius: 10px;
    }

    ion-icon {
        font-size: 25px;
    }

    .margin-top {
        margin-top: 10px;
    }

    .flex {
        display: flex;
    }

    .flex-col {
        flex-direction: column;
    }

    .margin-horizontal-16 {
        margin-left: 16px;
        margin-right: 16px;
    }

    .norma {
        display: flex!important;
        justify-content: space-between!important;
    }
</style>

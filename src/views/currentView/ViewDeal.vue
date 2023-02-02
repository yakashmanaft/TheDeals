<template :key="componentKey">
    <div>
        <!-- Спиннер как имитация загрузки -->
        <Spinner v-if="spinner"/>

        <!-- page header -->
        <ViewHeader 
            @openDeleteMenu="setOpen(true)"
        />

        <!-- view deal subject -->
        <ViewDealSubject 
            :isOpen="isViewDealSubjectOpened"
            @closeModal="isViewDealSubjectOpened = false;"
            :subjectData="currentDealSubject"
            :currentDealType="currentDeal.dealType"
            :currentSubjectPrice="currentPriceSubject"
            :personGram="personPortionGram"
            @updateBD="updateBD"
            @getSubjectPrice="setSubjectPrice"
            @getGramPerPerson="setGramPerPerson"
            @getSumAttributesPriceValue="setSumAttributesPriceValue"
            @getSubjectQty="setSubjectQty"
            @getPersonQty="setPersonQty"
            :countQtyButtonColor="countQtyButtonColor"
            :countPersonQtyButtonColor="countPersonQtyButtonColor"
            @getSubjectDiscount="setSubjectDiscount"
        />

        <!-- add subject to deal -->
        <CreateDealSubject
            :isOpen="isCreateNewSubjectOpened"
            @closeModal="closeCreateSubjectModal"
            :subjectData="currentSubject"
            :currentDealType="currentDeal.dealType"
            @createSubject="addNewSubject"
            @getSubjectPrice="setNewSubjectPrice"
            @getGramPerPerson="setNewGramPerPerson"
            @getSubjectQty="setNewSubjectQty"
            @getPersonQty="setNewPersonQty"
            @getSubjectDiscount="setNewSubjectDiscount"
        />

        <!-- Модалка добавления нового адреса в доставку -->
        <AddDeliveryAddressMenu
            :isOpen="isAddDeliveryAddressMenuOpened"
            :addressesArray="currentDeal.shipping.shippingAddress"
            :currentAddressIndex="currentDeliveryAddressIndex"
            :dealStatus="currentDeal.dealStatus"
            @closeModal="isAddDeliveryAddressMenuOpened = false"
        />

        <!-- page-content -->
        <ion-content
            :scroll-events="true"
            class="ion-page ion-margin-top" 
            id="main"
            type="push" 
            forceOverscroll="false"
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
                <!-- currentSubject: {{currentSubject}}
                currentDealSubject: {{currentDealSubject}} -->
                <!-- Тип дела -->
                <!-- ============================== Статус и тип дела ========================================== -->
                <ion-item-group>
                    <ion-grid class="ion-margin-top" style="padding-top: 0!important">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <!-- Статус дела -->
                            <ion-chip :color="setChipColor(dealStatus)">
                                <!-- Кнопка вызова меню статус -->
                                <div @click="openActionSheetDealStatusMenu()">
                                    {{translateValue(currentDeal.dealStatus, dealStatusList)}}
                                </div>
                                <!-- Всплывашка изменения статуса -->
                                <ion-action-sheet
                                    :is-open="actionSheetDealStatus"
                                    header="Сменить статус дела"
                                    :buttons="changeDealStatusMenuButtons"
                                    @didDismiss="actionSheetDealStatus = false"
                                >
                                </ion-action-sheet>
                            </ion-chip>
                            <!-- Тип дела -->
                            <ion-chip :color="setColorByDealType(currentDeal.dealType)" outline="true">
                                <ion-icon :icon="setIconByDealType(currentDeal.dealType)"></ion-icon>
                                <ion-label>
                                    {{setDealType(currentDeal.dealType)}}
                                </ion-label>
                            </ion-chip>
                        </ion-row>
                    </ion-grid>
                </ion-item-group>

                <!-- =================================== Важность дела ====================================== -->
                <ion-item-group class="ion-text-left ion-padding-horizontal">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Важность дела</h4>
                    </ion-text>
                    <!--  -->
                    <StarRaiting
                        :value="dealImportance"
                        @getRatingValue="setRatingValue"
                        :dealStatus="dealStatus"
                    />
                </ion-item-group>

                <!-- ============================== Контакт по делу ====================================== -->
                <ion-item-group class="ion-text-left ion-padding-horizontal">
                    <!-- Заголовок -->
                    <ion-text >
                        <h4>Контакт</h4>
                    </ion-text>
                    <!-- Показываем контакт по делу -->
                    <ion-grid class="ion-no-padding border-bottom">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-text color="primary" style="border-bottom: 1px dashed var(--ion-color-primary)" @click.stop="goToContact(dealContactID)">{{dealContact}}</ion-text>
                            <ion-button size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click.stop="openSearchContactMenu()">Изменить</ion-button>
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

                <!-- =========================== Дата и время исполнения ================================= -->
                <ion-item-group class="ion-text-left ion-padding-horizontal">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Дата и время исполнения</h4>
                    </ion-text>
                    <!-- Блок показа / редактирования даты и времени исполнения -->
                    <ion-grid class="ion-no-padding border-bottom">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <!-- Текущая дата и время исполнения -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">{{ datepicker(currentDeal.executionDate) }}</ion-button>
                            <!-- Кнопка активации компонента, она же показывает выбранное -->
                            <ion-button size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="openModalCalendar()">Изменить</ion-button>
                        </ion-row>
                    </ion-grid>
                    <!--  --> 
                    <ModalCalendar 
                        :is-open="isCalendarOpened" 
                        @date-updated="(pickedDate) => executionDate = pickedDate.currentValue"
                        @closeModal="closeModalCalendar(executionDate)"
                        @updateDate="updateExecutionDate()"
                        @didDismiss="isCalendarOpened = false"
                        :date="currentDeal.executionDate"
                    />
                </ion-item-group>

                <!-- =========================== Предмет дела ============================================ -->
                <ion-item-group class="ion-text-left">
                    <!-- Заголовок -->
                    <ion-text>
                        <ion-grid class="ion-no-padding">
                            <ion-row class="ion-align-items-center ion-margin-top ion-justify-content-between ion-padding-horizontal">
                                <h4 class="ion-no-margin">Предмет дела</h4>
                                <ion-text color="medium">Всего {{ currentDeal.dealsList.length }}</ion-text>
                            </ion-row>
                        </ion-grid>
                    </ion-text>
                    <!--  -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-nowrap horizontal-scroll">
                            <!-- Карточки предметов заказа -->
                            <ion-card @click.stop="openCurrentDealSubject(index, item)" class="ion-padding ion-text-center card-center relative" v-for="(item, index) in currentDeal.dealsList" :key="item.id">
                                <!-- Кнопка удалить конкретный предмет дела -->
                                <ion-icon @click.stop="openDeleteSubjectModal(item.id)" class="icon_size icon_del absolute" :icon="closeCircleOutline"></ion-icon>
                                <!-- item -->
                                <ion-thumbnail v-if="item.selectedProduct !== ''" style="height: 64px; width: 64px; margin: 0 auto">
                                    <!-- Если тип дела Продажа -->
                                    <div v-if="currentDeal.dealType === 'sale'">
                                        <ion-img  style="height: 100%" :src="`../img/subjects/sale/${item.selectedProduct}.webp`"></ion-img>
                                    </div>
                                    <!-- Если тип дела Закупка -->
                                    <div v-if="currentDeal.dealType === 'buy'">
                                        <ion-img  style="height: 100%" :src="`../img/subjects/buy/${item.selectedProduct}.webp`"></ion-img>
                                    </div>
                                    <!-- mark where subject has attribute -->
                                    <div 
                                        v-if="checkRentAttr(item, currentDeal.dealType)" 
                                        class="absolute mark-atribute"
                                    >
                                        <ion-icon size="large" :color="setMarkerAttrColor(item) ? 'success' : 'warning'" :icon="shapes"></ion-icon>
                                    </div>
                                </ion-thumbnail>
                                <!--  -->
                                <!-- <ion-thumbnail v-if="item.selectedProduct === ''" class="empty-deal-list_thumbnail">
                                    <ion-icon class="empty-deal-list_icon" :icon="helpOutline"></ion-icon>
                                </ion-thumbnail> -->
                                <ion-label style="font-size: 12px">
                                    x{{item.productQuantity}}
                                </ion-label>
                                <ion-text v-if="currentDeal.dealType === 'sale'" style="white-space: normal">{{ showSelectedRecipe(item.recipe, item.tempRecipeName) }}</ion-text>
                            </ion-card>
                            <!-- Добавить еще предмет к заказу -->
                            <ion-card class="ion-padding card-center card-add" @click="openCreateSubjectModal()">
                                <ion-icon :icon="addCircleOutline" color="primary" class="icon_size"></ion-icon>
                                <ion-text class="ion-text-center ion-margin-top" color="primary">
                                    Добавить
                                </ion-text>    
                            </ion-card>
                        </ion-row>
                    </ion-grid>
                </ion-item-group>
                <!-- Всплывашка подтверждение удаления предмета заказа -->
                <ion-action-sheet
                    :is-open="deleteSubject"
                    header="Вы хотите удалить предмет заказа?"
                    :buttons="deleteDealSubjectButtons"
                    @didDismiss="deleteSubject = false"
                >
                </ion-action-sheet>

                <!-- ========================== Доставка ================================================= -->
                <!-- SALE -->
                <ion-item-group class="ion-text-left ion-padding-horizontal" v-if="currentDeal.dealType === 'sale'">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4 class="ion-no-margin" >Доставка</h4>
                    </ion-text>

                    <!-- Тип доставки -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">Тип доставки</ion-button>
                            <!--  -->
                            <ion-chip :color="setChipColor(currentDeal.shipping.typeOfShipping)">
                                <Select
                                    :data="shippingTypeList" 
                                    :dealStatus="dealStatus"
                                    :placeholder="translateShippingType(currentDeal.shipping.typeOfShipping)"
                                    @date-updated="(selected) => dealShippingType = selected.currentValue"
                                />
                            </ion-chip>
                        </ion-row>
                    </ion-grid>

                    <!-- Стоимость доставки -->
                    <!-- Вариант с доставкой -->
                    <ion-grid v-if="currentDeal.shipping.typeOfShipping === 'shipping-delivery'" class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <!-- Заголовок -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Стоимость доставки ({{ currency }})
                            </ion-button>
                            <!-- Ценник -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                <ion-input type="number" :disabled="(currentDeal.dealStatus === 'deal-complete' || currentDeal.dealStatus === 'deal-in-delivery') ? true : false"  v-model="shippingPrice" :value="currentDeal.shipping.shippingPrice" placeholder="0" inputmode="decimal" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                            </ion-button>
                        </ion-row>
                    </ion-grid>
                    <!-- Вариант при самовывозе (input нельзя менять, установлен disabled на input) -->
                    <ion-grid v-if="currentDeal.shipping.typeOfShipping === 'shipping-pickup'" class="ion-no-padding border-bottom">
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <!-- Заголовок -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Стоимость доставки ({{ currency }})
                            </ion-button>
                            <!-- Ценник -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            <ion-input type="number" :disabled="(currentDeal.dealStatus === 'deal-complete' || currentDeal.dealStatus === 'deal-in-delivery' || currentDeal.shipping.typeOfShipping === 'shipping-pickup') ? true : false" v-model="shippingPrice" :value="currentDeal.shipping.shippingPrice" placeholder="0" inputmode="decimal" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                        </ion-button>

                        </ion-row>
                    </ion-grid>

                    <!-- Адрес доставки -->
                    <ion-grid v-if="currentDeal.shipping.typeOfShipping === 'shipping-delivery'" class="ion-no-padding border-bottom">
                        <!-- header -->
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <!-- Заголовок -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Адрес доставки
                            </ion-button>
                            <!-- Кнопка изменить адрес -->
                            <!-- <ion-button v-if="editShippingAddress === false" size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="toggleEditShippingAddress">Изменить</ion-button>
                            <ion-button v-if="editShippingAddress === true" size="medium" fill="clear" class="ion-no-padding ion-no-margin" @click="toggleEditShippingAddress">Готово</ion-button> -->
                        </ion-row>
                        <!--content -->
                        <!-- <ion-row class="ion-margin-bottom">
                            <ion-text v-if="editShippingAddress === false">{{setShippingAddresPlaceholder(currentDeal.shipping.shippingAddress)}}</ion-text>
                            <ion-textarea v-if="editShippingAddress === true" class="ion-margin-bottom" autocapitalize="on" v-model="shippingAddress" placeholder="Укажите адрес"></ion-textarea>
                        </ion-row> -->
                        <ion-row v-if="currentDeal.shipping.shippingAddress && currentDeal.shipping.shippingAddress.length > 0">
                            <div 
                                v-for="(address, index) in currentDeal.shipping.shippingAddress" 
                                :key="index" 
                                class="ion-margin-bottom delivery-address-block"
                                @click.prevent.stop="showCurrentDeliveryAddressInfo(index)"
                                >

                                <!-- Адрес -->
                                <ion-text color="primary">г. {{ address.city }}, {{ address.street }}, д. {{ address.building }} <span v-if="address.flat">- {{ address.flat }}</span></ion-text>

                                <!-- Кнопка -->
                                <div class="delivery-address-block_btn">
                                    <ion-icon style="font-size: 1.4rem;" color="danger" :icon="closeCircleOutline" @click.prevent.stop="openDeleteDeliveryAddressModal(index)"></ion-icon>
                                </div>
                            </div>
                        </ion-row>

                        <!-- Кнопка добавить адрес -->
                        <ion-chip v-if="currentDeal.dealStatus !== 'deal-complete' && currentDeal.dealStatus !== 'deal-in-delivery'" class="ion-no-margin ion-margin-bottom" color="primary" @click="addDeliveryAddressMenu">Добавить адрес</ion-chip>
                    </ion-grid>
                </ion-item-group> 

                <!-- Всплывашка подтверждение удаления предмета заказа -->
                <ion-action-sheet
                    :is-open="deleteDeliveryAddressOpened"
                    header="Вы хотите удалить адрес доставки?"
                    :buttons="deleteDeliveryAddressButtons"
                    @didDismiss="deleteDeliveryAddressOpened = false"
                >
                </ion-action-sheet>
                
                <!-- BUY -->
                <ion-item-group class="ion-text-left ion-padding-horizontal" v-if="currentDeal.dealType === 'buy'">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4 class="ion-no-margin" >Доставка</h4>
                    </ion-text>
                    <!-- Тип доставки -->
                    <ion-grid class="ion-no-padding">
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">Тип доставки</ion-button>
                            <!--  -->
                            <ion-chip :color="setChipColor(currentDeal.shipping.typeOfShipping)">
                                <Select
                                    :data="shippingTypeList" 
                                    :dealStatus="dealStatus"
                                    :placeholder="translateShippingType(currentDeal.shipping.typeOfShipping)"
                                    @date-updated="(selected) => dealShippingType = selected.currentValue"
                                />
                            </ion-chip>
                        </ion-row>
                    </ion-grid>
                    <!-- Стоимость доставки -->
                    <!-- Вариант с доставкой -->
                    <ion-grid v-if="currentDeal.shipping.typeOfShipping === 'shipping-delivery'" class="ion-no-padding border-bottom">
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <!-- Заголовок -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Стоимость доставки ({{ currency }})
                            </ion-button>
                            <!-- Ценник -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                <ion-input type="number" :disabled="(currentDeal.dealStatus === 'deal-complete' || currentDeal.dealStatus === 'deal-in-delivery') ? true : false" v-model="shippingPrice" :value="currentDeal.shipping.shippingPrice" placeholder="0" inputmode="decimal" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                            </ion-button>
                        </ion-row>
                    </ion-grid>
                    <!-- Вариант при самовывозе (disabled отключен) -->
                    <ion-grid v-if="currentDeal.shipping.typeOfShipping === 'shipping-pickup'" class="ion-no-padding border-bottom">
                        <ion-row class="ion-justify-content-between ion-align-items-center flex_nowrap">
                            <!-- Заголовок -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                                Стоимость доставки ({{ currency }})
                            </ion-button>
                            <!-- Ценник -->
                            <ion-button color="medium" size="medium" fill="clear" class="ion-no-padding ion-no-margin">
                            <ion-input type="number" :disabled="(currentDeal.dealStatus === 'deal-complete' || currentDeal.dealStatus === 'deal-in-delivery' || currentDeal.shipping.typeOfShipping === 'shipping-pickup') ? true : false" v-model="shippingPrice" :value="currentDeal.shipping.shippingPrice" placeholder="0" inputmode="decimal" class="ion-text-end ion-no-padding" style="font-size: 24px" color="primary"></ion-input>
                        </ion-button>

                        </ion-row>
                    </ion-grid>
                </ion-item-group>

                <!-- ============================ КОММЕНТАРИИ К ДЕЛУ ==================================================== -->
                <ion-item-group class="ion-text-left ion-padding-horizontal ion-margin-top">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4 class="ion-no-margin" >Комментарии к делу</h4>
                    </ion-text>

                    <!--  -->
                    <ion-grid class="border-bottom ion-no-padding ion-padding-bottom">
                        <ion-textarea
                            class="ion-no-padding ion-margin-top" 
                            color="medium"
                            autoGrow="true" 
                            autocapitalize="on"
                            v-model="dealComments"
                            placeholder="Написать комментарий"
                        ></ion-textarea>
                    </ion-grid>
                </ion-item-group>

                <!-- ============================ ИТОГ ==================================================== -->
                <ion-item-group class="ion-text-left ion-padding-horizontal">
                    <!-- Заголовок -->
                    <ion-text>
                        <h4>Итого</h4>
                    </ion-text>
                    
                    <!-- Итог предметов в режиме sale -->
                    <div v-if="currentDeal.dealType === 'sale'">
                        <!-- ЕСЛИ ПРЕДМЕТОВ НЕТ -->
                        <ion-list v-if="currentDeal.dealsList.length === 0" style="font-size: 0.8rem" class="border-bottom ion-padding-bottom ion-margin-bottom">
                            Нет предметов в деле
                        </ion-list>
                        <!-- ЕСЛИ ПРЕДМЕТЫ ЕСТЬ -->
                        <ion-list v-for="item in currentDeal.dealsList" :key="item.id" style="font-size: 0.8rem" class="border-bottom ion-padding-bottom ion-margin-bottom">
                            <ion-grid class="ion-no-padding">
    
                                <!-- perUnit -->
                                <ion-row v-if="item.costEstimation === 'perUnit'" class="ion-justify-content-between ion-align-items-center">
                                    <ion-text>{{ translateSelectedProduct(item.selectedProduct) }}</ion-text>
                                    <ion-text>{{ (item.productQuantity).toFixed(2) }} * {{ (item.price).toFixed(2) }} = {{ (item.subjectPrice).toFixed(2) }} </ion-text>
                                </ion-row>
    
                                <!-- perKilogram -->
                                <ion-row v-if="item.costEstimation === 'perKilogram'" class="ion-justify-content-between ion-align-items-center">
                                    <ion-text>{{ translateSelectedProduct(item.selectedProduct) }}</ion-text>
                                    <ion-text>{{ culcSubjectWeight(item.personQuantity, item.gramPerPerson) }} * {{ (item.price).toFixed(2) }} = {{ (item.subjectPrice).toFixed(2) }}</ion-text>
                                </ion-row>
    
                                <!-- per100gram -->
                                <!-- <ion-row v-if="item.costEstimation === 'per100gram'" class="ion-justify-content-between ion-align-items-center">
                                    <ion-text>{{ translateSelectedProduct(item.selectedProduct) }}</ion-text>
                                    <ion-text>{{ (item.productQuantity).toFixed(2) }} * {{ (item.price).toFixed(2) }} = {{ (item.subjectPrice).toFixed(2) }} </ion-text>
                                </ion-row> -->
    
                                <!-- Описание скидок и вывод название рецептов пока есть толкьо в режиме sale -->
                                <ion-row class="ion-justify-content-between ion-align-items-center">
                                    <ion-text color="medium">{{ showSelectedRecipe(item.recipe, item.tempRecipeName) }}</ion-text>
                                    <ion-text v-if="item.subjectDiscount > 0" color="medium">С учетом скидки {{ item.subjectDiscount }}%</ion-text>
                                    <ion-text v-else color="medium">Без скидки</ion-text>
                                </ion-row>
                            </ion-grid>
                            <!-- Атрибуты у предметов дела пока есть только в режиме sale -->
                            <div v-if="item.additionalAttributes.length !== 0" class="ion-margin-start">
                                <ion-grid v-for="attribute in item.additionalAttributes" :key="attribute.id" class="ion-no-padding ion-margin-top" >
                                    <ion-row class="ion-justify-content-between ion-align-items-center">
                                        <ion-text>{{attribute.name}}</ion-text>
                                        <ion-text>{{ (attribute.qty).toFixed(2) }} * {{ (attribute.price).toFixed(2) }} = {{ (attribute.totalPrice).toFixed(2) }} </ion-text>
                                    </ion-row>
                                    <ion-row class="ion-justify-content-between ion-align-items-center">
                                        <ion-text color="medium">Атрибут</ion-text>
                                        <!-- <ion-text style="font-size: 0.8rem" color="medium">С учетом скидки</ion-text> -->
                                    </ion-row>
                                </ion-grid>
                            </div>
                        </ion-list>
                    </div>
                    
                    <!-- Итог предметов в режиме buy -->
                    <div v-if="currentDeal.dealType === 'buy'">
                        <!-- ЕСЛИ ПРЕДМЕТОВ НЕТ -->
                        <ion-list v-if="currentDeal.dealsList.length === 0" style="font-size: 0.8rem" class="border-bottom ion-padding-bottom ion-margin-bottom">
                            Нет предметов в деле
                        </ion-list>
                        <!-- ЕСЛИ ПРЕДМЕТЫ ЕСТЬ -->
                        <ion-list v-for="item in currentDeal.dealsList" :key="item.id" style="font-size: 0.8rem" class="border-bottom ion-padding-bottom ion-margin-bottom">
                            <ion-grid class="ion-no-padding">

                                <!-- perUnit -->
                                <ion-row v-if="item.costEstimation === 'perUnit'" class="ion-justify-content-between ion-align-items-center">
                                    <ion-text>{{ translateSelectedProduct(item.selectedProduct) }}</ion-text>
                                    <ion-text>{{ (item.productQuantity).toFixed(2) }} * {{ (item.price).toFixed(2) }} = {{ (item.subjectPrice).toFixed(2) }} </ion-text>
                                </ion-row>

                                <!-- perKilogram -->
                                <ion-row v-if="item.costEstimation === 'perKilogram'" class="ion-justify-content-between ion-align-items-center">
                                    <ion-text>{{ translateSelectedProduct(item.selectedProduct) }}</ion-text>
                                    <ion-text>{{ culcBuySubjectWeight(item.gramPerPerson) }} * {{ (item.price).toFixed(2) }} = {{ (item.subjectPrice).toFixed(2) }}</ion-text>
                                </ion-row>

                                <!-- per100gram -->
                                <!-- <ion-row v-if="item.costEstimation === 'per100gram'" class="ion-justify-content-between ion-align-items-center">
                                    <ion-text>{{ translateSelectedProduct(item.selectedProduct) }}</ion-text>
                                    <ion-text>{{ (item.productQuantity).toFixed(2) }} * {{ (item.price).toFixed(2) }} = {{ (item.subjectPrice).toFixed(2) }} </ion-text>
                                </ion-row > -->

                                <!-- Указатель типа расчета цены -->
                                <ion-row class="ion-justify-content-between ion-align-items-center">
                                    <ion-text color="medium" v-if="item.costEstimation === 'perKilogram' || item.costEstimation === 'per100gram'">Расчет цены по весу</ion-text>
                                    <ion-text color="medium" v-if="item.costEstimation === 'perUnit'">Расчет цены по единицам</ion-text>
                                </ion-row>
                            </ion-grid>
                        </ion-list>
                    </div>

                    <!-- ================================ СВОД ===================================== -->
                    <ion-grid class="ion-no-padding">

                        <!-- Итог -->
                        <ion-row class="ion-justify-content-between ion-align-items-center">
                            <ion-text>Итог: </ion-text>
                            <ion-text>{{ (sumAllTotalSubjectPriceFunc(currentDeal.dealsList)).toFixed(2) }} {{ currency }}</ion-text>
                        </ion-row>

                        <!-- Доставка -->
                        <!-- SALE -->
                        <div v-if="currentDeal.dealType === 'sale'">
                            <ion-row v-if="currentDeal.shipping.typeOfShipping === 'shipping-delivery'" class="ion-margin-top ion-justify-content-between ion-align-items-center">
                                <ion-text>Доставка: </ion-text>
                                <ion-text>{{ (currentDeal.shipping.shippingPrice).toFixed(2) }} {{ currency }}</ion-text>
                            </ion-row>
                        </div>
                        <!-- BUY -->
                        <div v-if="currentDeal.dealType === 'buy'">
                            <ion-row v-if="currentDeal.shipping.typeOfShipping === 'shipping-pickup'" class="ion-margin-top ion-justify-content-between ion-align-items-center">
                                <ion-text>Самовывоз: </ion-text>
                                <ion-text>{{ (currentDeal.shipping.shippingPrice).toFixed(2) }} {{ currency }}</ion-text>
                            </ion-row>
                            <!--  -->
                            <ion-row v-if="currentDeal.shipping.typeOfShipping === 'shipping-delivery'" class="ion-margin-top ion-justify-content-between ion-align-items-center">
                                <ion-text>Доставка: </ion-text>
                                <ion-text>{{ (currentDeal.shipping.shippingPrice).toFixed(2) }} {{ currency }}</ion-text>
                            </ion-row>
                        </div>

                        <!-- Сумма к оплате -->
                        <ion-row class="ion-margin-top ion-justify-content-between ion-align-items-center">
                            <ion-text style="font-weight: bold">Сумма к оплате: </ion-text>
                            <ion-text>{{ (currentDeal.totalDealPrice).toFixed(2) }} {{ currency }}</ion-text>
                        </ion-row>

                        <!-- Оплачено -->
                        <ion-row class="ion-margin-top ion-justify-content-between ion-align-items-center">
                            <ion-text style="font-weight: bold">Оплачено: </ion-text>
                            <ion-text>{{ (currentDeal.dealPaid).toFixed(2) }} {{ currency }}</ion-text>
                        </ion-row>

                        <!-- Задолженность -->
                        <ion-row class="ion-margin-top ion-justify-content-between ion-align-items-center">
                            <ion-text style="font-weight: bold">Остаток: </ion-text>
                            <ion-text>{{ (culcDealDebt(currentDeal.totalDealPrice, currentDeal.dealPaid)).toFixed(2) }} {{ currency }}</ion-text>
                        </ion-row>
                    </ion-grid>
                    <!-- КНОПКИ ЗАВЕРШЕНИЯ ДЕЛА -->
                    <!-- ЕСЛИ DEBT > 0 -->
                    <div v-if="debt > 0" class="ion-padding border-top" style="position: fixed; bottom: 0; left: 0; width: 100%; background-color: #fff; z-index: 999999">
                        <!--  -->
                        <ion-grid>
                            <ion-row class="ion-justify-content-between ion-align-items-center">
                                <ion-text color="medium">Остаток к оплате:</ion-text>
                                <ion-text style="font-size: 32px; color: black; font-weight: bold">{{(culcDealDebt(currentDeal.totalDealPrice, currentDeal.dealPaid)).toFixed(2)}}</ion-text>
                            </ion-row>
                        </ion-grid>
                        <!-- Кнопка внести средства -->
                        <ion-button @click="openDealPaidMenu" expand="block" class="">
                            <span v-if="currentDeal.dealType === 'buy'">Внести оплату</span>  
                            <span v-else>Получить оплату</span>    
                        </ion-button>
                    </div>
                    <!-- ЕСЛИ DEBT === 0 -->
                    <div v-if="debt === 0 && currentDeal.dealStatus !== 'deal-complete'" class="ion-padding border-top" style="position: fixed; bottom: 0; left: 0; width: 100%; background-color: #fff; z-index: 999999">
                        <!-- Кнопка Завершить дело (если debt === 0) -->
                        <ion-button  expand="block" @click="finishDeal" class="ion-margin-top">
                            Завершить дело
                        </ion-button>
                    
                    </div>
                    <!-- Выполнено -->
                    <div v-if="debt === 0 && currentDeal.dealStatus === 'deal-complete'" class="deal-complete_logo">
                        <ion-icon class="icon-size" :icon="checkmarkDone" size="large" color="success"></ion-icon>
                        <ion-text color="success">Завершено</ion-text>
                    </div>

                    <!--  -->
                    <DealPaidMenu
                        :is-open="isDealPaidMenuOpened"
                        @didDismiss="isDealPaidMenuOpened = false"
                        @closeModal="closeDealPaidMenu"
                        :currentDeal="currentDeal"
                        :debt="refreshDebtValue()"
                        :amount="0"
                        :isDealPaidMenuOpenedValue="isDealPaidMenuOpened"
                        @getAmountValue="setAmountValue"
                        :balance="availableBalance"
                    />
                </ion-item-group>
                <br>
                <br>
                <br>
                <br>
                {{currentDeal}}
                <br>
                <!-- ========================== Удалить дело =================================== -->
                <!-- Не показываем в режиме edit -->
                <!-- <ion-button @click="setOpen(true)" fill="clear"  color="danger" style="opacity: 0.6" class="ion-margin-bottom ion-margin-horizontal">Удалить дело</ion-button> -->
                <!-- Всплывашка подтверждение удаления дела-->
                <ion-action-sheet
                    :is-open="isOpenRef"
                    header="Вы хотите удалить дело?"
                    :buttons="deleteDealButtons"
                    @didDismiss="setOpen(false)"
                >
                </ion-action-sheet>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
            </div>
        </ion-content>

    </div>
</template>

<script>
    import { onMounted, defineComponent, ref, computed, watch, watchEffect } from 'vue';
    import { supabase } from '../../supabase/init';
    import { useRoute, useRouter } from 'vue-router';
    import store from '../../store/index';
    import { uid } from 'uid';
    import { IonContent, IonButton, IonActionSheet, IonItemGroup, IonText, IonGrid, IonRow, IonCol, IonModal, IonItem, IonSearchbar, IonChip, IonCard, IonImg, IonThumbnail, IonLabel, IonIcon, IonInput, IonTextarea, IonList, toastController  } from '@ionic/vue';
    import { addCircleOutline, closeCircleOutline, helpOutline, shapes, checkmarkDone } from 'ionicons/icons';
    //
    import { searchFilter } from '../../helpers/filterMyContacts'; 
    import { setColorByDealType } from '@/helpers/setColorBy';
    import { setIconByDealType } from '@/helpers/setIconBy';
    import { translateValue, translateRecipeID } from '@/helpers/translateValue';
    import { checkRentAttr } from '@/helpers/checkRentAttr';
    import { setMarkerAttrColor } from '@/helpers/setMarkerColor';
    //
    import Spinner from '../../components/Spinner.vue';
    import ViewHeader from '../../components/headers/HeaderViewCurrent.vue';
    import Select from '@/components/Select.vue';
    import ModalCalendar from '../../components/modal/NewDeal-modalCalendar.vue';
    import ViewDealSubject from '../../components/modal/ViewDeal-modalViewSubject.vue';
    import CreateDealSubject from '../../components/modal/ViewDeal-modalCreateSubject.vue';
    import DealPaidMenu from '../../components/DealPaidMenu.vue';
    import StarRaiting from '../../components/StarRaiting.vue';
    import AddDeliveryAddressMenu from '../../components/modal/AddDeliveryAddressMenu.vue';
    //
    import { format, parseISO } from 'date-fns';
    import { ru } from 'date-fns/locale'
    //
    export default defineComponent({
        name: 'View-deal',
        components: {
            IonContent,
            IonButton,
            IonActionSheet,
            IonItemGroup,
            IonText,
            IonGrid,
            IonRow,
            IonCol,
            IonModal,
            IonItem,
            IonSearchbar,
            IonChip,
            IonCard,
            IonImg,
            IonThumbnail,
            IonLabel,
            IonIcon,
            IonInput,
            IonTextarea, 
            IonList,
            //
            Spinner,
            ViewHeader,
            ViewDealSubject,
            CreateDealSubject,
            Select,
            ModalCalendar,
            DealPaidMenu,
            StarRaiting,
            AddDeliveryAddressMenu
        }, 
        setup() {
            // Currency
            const currency = ref(store.state.systemCurrency.name);
            //
            const route = useRoute();
            const router = useRouter();
            // Get current info of route
            const currentId = route.params.dealId;
            // console.log(route.params)
            const info = route.params;
            const currentDeal = ref(JSON.parse(info.deal))
            // Храним на случай нажатия Отмены при редактировании контакта
            // const tempData = JSON.parse(info.deal)
            //
            const spinner = ref(null);
            // Статусы дел
            const dealStatusList = ref(store.state.dealStatusList)
            // Заготовка под шаблон нового предмета к делу
            const currentSubject = ref({})
            //
            const myContacts = ref([])
            myContacts.value = store.state.myContactsArray; 
            const searchDealContact = ref('');
            const searchedContacts = computed(() => {
                return searchFilter(myContacts.value, searchDealContact.value)
            })
            // Проверяем на возврат атрибутов
            const isAllAttrReturned = ref(false);
            // Временно обзавем данные
            const myDeals = ref([]);
            //
            const userRecipeArray = ref(store.state.userRecipeArray)
            //
            const availableBalance = ref(0);
            //
            onMounted(async () => {
                if(currentDeal.value.dealType === 'buy') {
                    await store.methods.getMyDealsFromBD();
                    myDeals.value = store.state.myDealsArray;
                    // запускаем функцию расчета баланса кошелька из store
                    store.methods.calculateBalance(myDeals.value)
                    availableBalance.value = store.state.availableBalance
                } else if (currentDeal.value.dealType === 'sale') {
                    await store.methods.getUserRecipesFromBD();
                    userRecipeArray.value = store.state.userRecipeArray;
                }
            })
            //
            const goToContact = (id) => {
                const contact = myContacts.value.filter(contact => contact.id === +id)
                // const contact = dealContactID.value
                // Проверяем по наличию в книге контактов пользователя
                if(contact.length === 0) {
                    alert('TransactionDetails: данный контакт не найден в Моих контактах')
                } else {
                    router.replace({
                        name: 'View-Contact',
                        params: {
                            contactId: +id,
                            contact: JSON.stringify(contact[0])
                        }
                    })
                }
            }

            //
            const showNameByID = (contactID) => {
                const contact = myContacts.value.filter(contact => contact.id === +contactID)
                // Проверяка
                if(contact.length !== 0) {
                    const nameByID = (contact[0].contactInfo.surname + ' ' + contact[0].contactInfo.name).toString().replace(/"/g, "")
                    return nameByID;
                } else if (contact.length === 0 && currentDeal.value.tempContactName) {
                    return currentDeal.value.tempContactName
                } else if (contact.length === 0 && !currentDeal.value.tempContactName) {
                    const nameByID = 'Неизвестный.'
                    return nameByID;
                }
            }
            // храним значение contactID
            const dealContactID = ref();
            dealContactID.value = currentDeal.value.contactID
            const dealContact = ref(showNameByID(dealContactID.value));
            // храним значение dealStatus
            const dealStatus = ref(currentDeal.value.dealStatus);
            //
            // const nextDealStatus = ref();
            // const prevDealStatus = ref();
            // следим за изменениями значения dealStatus у текущего дела и обновляем его в БД
            watch(dealStatus, async (next, prev) => {
                currentDeal.value.dealStatus = dealStatus.value
                // считаем долг
                culcDealDebt(currentDeal.value.totalDealPrice, currentDeal.value.dealPaid)
                // оцениваем долг
                if(debt.value > 0) {
                    if(next === 'deal-complete') {
                        if(confirm(`Есть долг по оплате дела. Внести сумму задолженности или её часть?`)) {
                            dealStatus.value = prev
                            currentDeal.value.dealStatus = prev
                            openDealPaidMenu()
                            // далее включается функция setAmountValue(amount)
                        } else {
                            //prev - это изначальное значение статуса у дела
                            dealStatus.value = prev
                            currentDeal.value.dealStatus = prev
                            try {
                                spinner.value = true;
                                // Вынести в store?
                                console.log(`Deal ${currentId} is updated`);
                                //
                                const {error} = await supabase.from('deals').update({
                                    dealStatus: dealStatus.value,
                                }).eq('id', currentId);
                                if(error) throw error;
                                // Дело успешно обновлено
                            } catch (error) {
                                // alert(`Error: ${error.message}`)
                            }
                            // edit.value = !edit.value;
                            spinner.value = false;
                        }
                    } 
                } 
                // Забираем предметы для работы со складом
                if(currentDeal.value.dealsList.length !== 0) {
                    if(next === 'deal-in-process' && currentDeal.value.dealType === 'sale' ) {

                        // 1. Проверяем наличие ингредиентов и предметов(атрибутов дела) на складе

                        // 2. Если всего хватает ,то тост выводим что будут вычтены

                        // 3. Если чего то не хватает - выводим тост об этом или прям запихать список туда чего не хватает
                        // и оставляем статус в букинге
                        // dealStatus.value = 'deal-in-booking'
                        substructFromWarehouseFunc(currentDeal.value)
                        substructFromWarehouseToast() // в тос можем передать данные
                        // console.log(`Можно вычитать предметы со склада по делу №${currentDeal.value.uid}`)
                        // currentDeal.value.dealsList.forEach(item => {
                        //     console.log(`Рецепт: ${item.recipe}`)

                        //     // А если нет атрибутов?
                        //     item.additionalAttributes.forEach(item => {
                        //         console.log(`Доп.атрибуты: ${item.name} ${item.qty}`)
                        //     })
                        // })
                    } 
                    // для dealType === 'buy' условие запускается в: 
                    // 1. setAmountValue(), когда полностью внесена оплата
                    // 2. changeDealStatusMenuButtons, когда debt.value === 0
                }
                try {
                    spinner.value = true;
                    // Вынести в store?
                    console.log(`Deal ${currentId} is updated`);
                    //
                    const {error} = await supabase.from('deals').update({
                        dealStatus: dealStatus.value,
                    }).eq('id', currentId);
                    if(error) throw error;
                    // Дело успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
                // edit.value = !edit.value;
                spinner.value = false;
            })

            // Уведомляем о выделении предметов со склада для реализации дела по указанному рецепту
            const substructFromWarehouseToast = async () => {
                let message1 = 'Ингредиенты, необходимые для выполнения заказа, будут взяты со склада.';
                let message2 = 'Не хватает ингредиентов, необходимых для выполнения заказа.';
                const toast = await toastController.create({
                    message: `
                        ${message1}
                    `,
                    // duration: 3000,
                    // cssClass: 'custom-toast', 
                    position: 'top',
                    buttons: [
                        {
                            text: 'ОК',
                            role: 'cnacel',
                            handler: () => {
                                console.log('toast clicked dismiss')
                            }
                        }
                    ]
                });
                await toast.present();
                // const { role } = await toast.onDidDismiss();    
            }
            const addToWarehouseToast = async () => {
                const toast = await toastController.create({
                    message: `
                        Предметы дела будут добавлены на склад
                    `,
                    // duration: 3000,
                    // cssClass: 'custom-toast', 
                    position: 'top',
                    buttons: [
                        {
                            text: 'ОК',
                            role: 'cnacel',
                            handler: () => {
                                console.log('toast clicked dismiss')
                            }
                        }
                    ]
                });
                await toast.present();
                // const { role } = await toast.onDidDismiss();    
            }

            // функция для добавления покупки на  склад
            const addToWarehouseFunc = (currentDeal) => {
                console.log(`Можно помещать предметы на склад по делу №${currentDeal.uid}`)
                currentDeal.dealsList.forEach(item => {
                    console.log(item)
                })
                //productQuantity
                //costEstimation
                //gramPerPerson
            }
            // функция исключения ингредиентов и предметов (доп. атрибутов) со склада
            const substructFromWarehouseFunc = (currentDeal) => {
                console.log(`Можно вычитать предметы со склада по делу №${currentDeal.uid}`)
                currentDeal.dealsList.forEach(item => {
                    console.log(`Рецепт: ${item.recipe}`)
                    // А если рецепт удален?

                    // А если нет атрибутов?
                    item.additionalAttributes.forEach(item => {
                        console.log(`Доп.атрибуты: ${item.name} ${item.qty}`)
                    })
                })
            }

            // выдергиваем из массива нужный контакт
            const searchContactMenu = ref(false)
            // открываем меню выбора контакта
            const openSearchContactMenu = () => {
                if(currentDeal.value.dealStatus === 'deal-complete') {
                    alert('ViewDeal: вы не можете изменить контакт, если статус "ЗАВЕРШЕН"')
                } else {
                    searchContactMenu.value = true
                }
            }
            //
            const tempContactName = ref(showNameByID(dealContactID.value))
            const choose = async (contact) => {
                dealContact.value = `${contact.contactInfo.name} ${contact.contactInfo.surname}`
                tempContactName.value = `${contact.contactInfo.name} ${contact.contactInfo.surname}`
                dealContactID.value = contact.id
                searchContactMenu.value = false
                try {
                    spinner.value = true;
                    // Вынести в store?
                    console.log(`Deal ${currentId} is updated`);
                    //
                    const {error} = await supabase.from('deals').update({
                        contactID: dealContactID.value,
                        tempContactName: `${contact.contactInfo.name} ${contact.contactInfo.surname}`
                    }).eq('id', currentId);
                    if(error) throw error;
                    // Дело успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
                // edit.value = !edit.value;
                spinner.value = false;
            }   
            // =========================== Выбираем дату ==========================
            // храним значение executionDate
            const executionDate = ref();
            // и показываем ее уже в варианте с указанием времени
            const datepicker = (eventDate) => {
                if(eventDate === '') {
                    return 'Выберите дату'
                }
                const data = eventDate;
                const formattedString = format(parseISO(data), 'd MMMM Y к HH:mm');
                // const formattedString = format(parseISO(data), 'd MMMM Y к HH:mm', { locale: ru });
                return formattedString
            }
            // Управление модалкой календаря
            const isCalendarOpened = ref(false)
            const openModalCalendar = () => {
                if(currentDeal.value.dealStatus === 'deal-complete') {
                    alert('Viewdeal: вы не можете изменить дату, если статус "ЗАВЕРШЕН"')
                } else {
                    isCalendarOpened.value = true
                }
            }
            const closeModalCalendar = (executionDate) => {
                // Может входящие данные-то и не нужны в этой функции???
                executionDate = currentDeal.value.executionDate
                isCalendarOpened.value = false;
            }
            const updateExecutionDate = async () => {
                currentDeal.value.executionDate = executionDate.value 
                isCalendarOpened.value = false;
                try {
                    spinner.value = true;
                    // Вынести в store?
                    // console.log(`Deal ${currentId} is updated`);
                    //
                    const {error} = await supabase.from('deals').update({
                        executionDate: executionDate.value,
                    }).eq('id', currentId);
                    if(error) throw error;
                    // Дело успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
                // edit.value = !edit.value;
                spinner.value = false;
            }
            // ======================================== update current deal ================================
            const update = async () => {
                try {
                    spinner.value = true;
                    // Вынести в store?
                    console.log(`Deal ${currentId} is updated`);
                    //
                    const {error} = await supabase.from('deals').update({
                        contactID: dealContactID.value,
                        dealStatus: dealStatus.value,
                        executionDate: executionDate.value,
                        dealsList: currentDeal.value.dealsList,
                        shipping: currentDeal.value.shipping,
                        dealPaid: currentDeal.value.dealPaid,
                        cancelledReason: currentDeal.value.cancelledReason,
                        totalDealPrice: currentDeal.value.totalDealPrice,
                        dealImportance: dealImportance.value,
                        comments: currentDeal.value.comments

                    }).eq('id', currentId);
                    if(error) throw error;
                    // Дело успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
                // edit.value = !edit.value;
                spinner.value = false;
            }
            const updateBD = () => {
                update()
            }
            // ======================================== refresh current deal =================================
            
            // ================================== delete current deal function ===============================
            const deleteDeal = async () => {
                if(currentDeal.value.dealPaid > 0) {
                    alert('ViewDeal: Мы не удаляем дела, по которым уже были транзакции')
                } else if (currentDeal.value.dealPaid === 0) {
                    if(currentDeal.value.dealStatus === 'deal-complete') {
                        alert('ViewDeal: Мы не удаляем завершенные дела. Используем для статистики в вашем кошельке.')
                    } else if (currentDeal.value.dealStatus === 'deal-cancelled') {
                        alert('ViewDeal: Мы не удаляем отмененные дела. Используем для статистики в вашем кошельке.')
                    } else {
                        try {
                            const { error } = await supabase.from('deals').delete().eq('id',currentId);
                            if(error) throw error;
                            // router.push({ name: 'Deals' })
                            router.go(-1)
                            alert('View Deal: Дело удалено')
                        } catch (error) {
                            // Удалить если не понадобится
                            // alert(`Error: ${error.message}`)
                        }
                    } 
                } 
            }
            // меню подтверждения удаления current contact
            const isOpenRef = ref(false);
            const setOpen = (boolean) => isOpenRef.value = boolean;
            const deleteDealSubjectButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        console.log('Delete clicked')
                        deleteCurrentDealItem(subjectToDelete.value)
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
            const deleteDealButtons = [
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
            // ==================================== массив кнопок в меню смены статуса у дела =====================================
            const changeDealStatusMenuButtons = []
            // добавляем в массив changeDealStatusMenuButtons объекты из dealStatusList
            for(let i = 1; i <= dealStatusList.value.length; i++) {
                changeDealStatusMenuButtons.push({
                    text: dealStatusList.value[i-1].name,
                    handler: () => {
                        dealStatus.value = dealStatusList.value[i-1].value
                        // зачисляем на склад только при условию что НЕТ долгов по оплате поставки
                        if(dealStatus.value === 'deal-complete' && debt.value === 0 && currentDeal.value.dealType === 'buy') {
                            addToWarehouseToast()
                            addToWarehouseFunc(currentDeal.value)
                            // console.log(`Можно помещать предметы на склад по делу №${currentDeal.value.uid}`)
                            // currentDeal.value.dealsList.forEach(item => {
                            //     console.log(item)
                            // })
                        }
                    }
                })
            }
            // Добавляем кнопку отмены (скрытия меню)
            changeDealStatusMenuButtons.push({
                text: 'Отменить',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked')
                }
            })
            // Задаем цвет chip
            const setChipColor = (value) => {
                // Это для селекта по выбоору статуса дела
                if (value === 'deal-in-debt') {
                    return 'danger'
                }
                if (value === 'deal-complete') {
                    return 'success'
                }
                if(value === 'deal-cancelled') {
                    return 'warning'
                }
                // Это для селекта по выбору типа доставки
                if(value === 'shipping-pickup') {
                    return 'primary'
                } 
                if(value === 'shipping-delivery') {
                    return 'primary'
                }
                return 'primary'
            }
            // Переводчик dealType
            const setDealType = (dealType) => {
                if(dealType === 'sale') {
                    return 'Продажа'
                } else if (dealType === 'buy') {
                    return 'Закупка'
                }
            }
            // ================================ управление current deal subject ===================================
            const currentDealSubject = ref()
            const currentPriceSubject = ref()
            const personPortionGram = ref()
            // открываем view current deal item
            const isViewDealSubjectOpened = ref(false);
            const openCurrentDealSubject = (index, item) => {
                if(currentDeal.value.dealStatus === 'deal-complete') {
                    alert('ViewDeal: вы не можете изменить предмет дела, если статус "ЗАВЕРШЕН"')
                } else {
                    isViewDealSubjectOpened.value = true;
                    //
                    currentDealSubject.value = currentDeal.value.dealsList[index];
                    currentPriceSubject.value = item.price
                    personPortionGram.value = item.gramPerPerson
                    // console.log(item)
                    //
                    setCountQtyButtonColor(currentDealSubject.value.productQuantity);
                    setCountPersonQtyButtonColor(currentDealSubject.value.personQuantity);
                }
            }
            // Вызываем action sheet меню выбор
            const actionSheetDealStatus = ref(false)
            const openActionSheetDealStatusMenu = () => {
                actionSheetDealStatus.value = true
            }
            // Вызываем action sheet уведомление в качестве подтверждения
            const deleteSubject = ref(false);
            // Храним айди предмета к удалению
            const subjectToDelete = ref();
            const openDeleteSubjectModal = (id) => {
                if(currentDeal.value.dealStatus === 'deal-complete') {
                    alert('ViewDeal: вы не можете удалить предмет дела, если статус "ЗАВЕРШЕН"')
                } else if (currentDeal.value.dealStatus === 'deal-in-delivery') {
                    alert('ViewDeal: вы не можете удалить предмет дела, если статус "В ДОСТАВКЕ"')
                } else {
                    deleteSubject.value = true;
                    subjectToDelete.value = id;
                }
            }
            // удаляем current deal item и обновляем запись в БД
            const deleteCurrentDealItem = (id) => {
                currentDeal.value.dealsList = currentDeal.value.dealsList.filter(subject => subject.id !== id);
                update();
            }
            // create new current deal subject
            const isCreateNewSubjectOpened = ref(false);
            // Открывает модалку создания нового предмета к текущему делу
            const openCreateSubjectModal = () => {
                if(currentDeal.value.dealStatus === 'deal-complete') {
                    alert('ViewDeal: вы не можете добавлять предмету к делу, если статус "ЗАВЕРШЕН"')
                } else {
                    isCreateNewSubjectOpened.value = true;
                    // Обнуляем шаблон нового предмета у дела согласно dealType
                    if (currentDeal.value.dealType === 'sale') {
                        currentSubject.value = {
                            id: uid(),
                            selectedProduct: '',
                            price: 0,
                            costEstimation: '',
                            personQuantity: 1,
                            gramPerPerson: 120,
                            subjectDiscount: 0,
                            subjectPrice: 0,
                            recipe: '',
                            tempRecipeName: '',
                            productQuantity: 1,
                            additionalAttributes: [],
                            totalSubjectPrice: 0, 
                            productNote: '',
                        }
                    } else if (currentDeal.value.dealType === 'buy') {
                        currentSubject.value = {
                            id: uid(),
                            selectedProduct: '',
                            price: 0,
                            gramPerPerson: 0,
                            subjectPrice: 0,
                            costEstimation: '',
                            productQuantity: 1,
                            totalSubjectPrice: 0, 
                            productNote: '',
                            // tempRecipeName: '',
                        }
                    }
                }
            }
            // Закрываем модалку создания нового предмета к текущему делу
            const closeCreateSubjectModal = () => {
                isCreateNewSubjectOpened.value = false;
                // Обнуляем шаблон нового предмета у дела согласно dealType
                // if (currentDeal.value.dealType === 'sale') {
                //     currentSubject.value = {
                //         id: uid(),
                //         selectedProduct: '',
                //         price: 0,
                //         costEstimation: '',
                //         personQuantity: 1,
                //         gramPerPerson: 120,
                //         subjectDiscount: 0,
                //         subjectPrice: 0,
                //         recipe: '',
                //         productQuantity: 0,
                //         additionalAttributes: [],
                //         totalSubjectPrice: 0, 
                //         productNote: '',
                //     }
                // } else if (currentDeal.value.dealType === 'buy') {
                //     currentSubject.value = {
                //         id: uid(),
                //         selectedProduct: '',
                //         price: 0,
                //         subjectPrice: 0,
                //         // costEstimation: '',
                //         productQuantity: 0,
                //         productNote: '',
                //     }
                // }
            }
            // Добавляем новый предмет к текущему делу и делаем запись в БД
            const addNewSubject = () => {
                //Выдумать варианты валидации
                if(currentSubject.value.selectedProduct === '') {
                    alert('ViewDeal: Вы не выбрали предмет дела')
                } else if(currentDeal.value.dealType === 'sale' && currentSubject.value.recipe === '') {
                    alert('ViewDeal: Вы не указали рецепт')
                } else if (currentDeal.value.dealType === 'buy' && currentSubject.value.costEstimation === 'perKilogram' &&    currentSubject.value.gramPerPerson === 0) {
                    alert('ViewDeal Вы не указали фактический вес')
                }else {
                    currentDeal.value.dealsList.push(currentSubject.value); 
                    isCreateNewSubjectOpened.value = false;
                    update();
                }
            }
            // Переводчик названий типов доставки
            const translateShippingType = (value) => {
                if(value) {
                    if(value === '') {
                        return 'Не выбрано'
                    } else {
                        return translateValue(value, shippingTypeList.value)
                    }
                } else {
                    return 'Не выбрано'
                }
                // if(currentDeal.value.dealType === 'sale') {
                //     if(value === '') {
                //         return 'Не выбрано'
                //     } else {
                //         return translateValue(value, shippingTypeList.value)
                //     }
                // }  else if (currentDeal.value.dealType === 'buy') {
                //     if(value === '') {
                //         return 'Не выбрано'
                //     } else {
                //         return translateValue(value, shippingTypeList.value)
                //     }
                // }
            }
            // Переводчик названий предметов дела
            const translateSelectedProduct = (value) => {
                if(currentDeal.value.dealType === 'sale') {
                    return translateValue(value, store.state.dealSaleSubjectArray)
                } else if (currentDeal.value.dealType === 'buy') {
                    return translateValue(value, store.state.dealBuySubjectArray)
                }
            }
            // Вспомогательная переменная
            const sumAttributesPriceValue = ref(0);
            const setSumAttributesPriceValue = (sumAttrPriceValue) => {
                sumAttributesPriceValue.value = sumAttrPriceValue
            }
            // Считаем общую totalSubjectPrice по NEW предмету
            const calcNewSubjectTotalPrice = () => {
                if(currentDeal.value.dealType === 'sale') {
                    currentSubject.value.totalSubjectPrice = currentSubject.value.subjectPrice + sumAttributesPriceValue.value
                } else if (currentDeal.value.dealType === 'buy') {
                    currentSubject.value.totalSubjectPrice = currentSubject.value.subjectPrice
                }
            }
            // ========================================= View Deal Modal View Subject ===================================================
            // Считаем общую totalSubjectPrice по предмету
            const calcSubjectTotalPrice = () => {
                if (currentDeal.value.dealType === 'sale') {
                    currentDealSubject.value.totalSubjectPrice = currentDealSubject.value.subjectPrice + sumAttributesPriceValue.value
                } else if (currentDeal.value.dealType === 'buy') {
                    currentDealSubject.value.totalSubjectPrice = currentDealSubject.value.subjectPrice
                }
            }
            // ставим Current Subject PRICE
            const setSubjectPrice = (price) => {
                if(currentDeal.value.dealType === 'sale') {
                    currentDealSubject.value.price = price;
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = +((currentDealSubject.value.price / 1000) * (currentDealSubject.value.personQuantity * currentDealSubject.value.gramPerPerson) * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        // calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // calcSubjectTotalPrice()
                        // update();
                    } 
                    // else if (currentDealSubject.value.costEstimation === 'per100gram') {
                    //     currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                    // }
                } else if (currentDeal.value.dealType === 'buy') {
                    currentDealSubject.value.price = price;
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = +((currentDealSubject.value.price / 1000) * currentDealSubject.value.gramPerPerson).toFixed(2)
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity).toFixed(2)
                    } 
                    // else if (currentDealSubject.value.costEstimation === 'per100gram') {
                    //     currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity).toFixed(2)
                    // }
                }
                calcSubjectTotalPrice()
                update();
            }
            // ставим Current Subject gramPerPerson
            const setGramPerPerson = (gram) => {
                if(currentDeal.value.dealType === 'sale') {
                    currentDealSubject.value.gramPerPerson = gram;
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = +((currentDealSubject.value.price / 1000) * (currentDealSubject.value.personQuantity * currentDealSubject.value.gramPerPerson) * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0) 
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        // calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + д
                        // calcSubjectTotalPrice()
                        // update();
                    } 
                    // else if (currentDealSubject.value.costEstimation === 'per100gram') {
                    //     currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                    // }
                } else if (currentDeal.value.dealType === 'buy') {
                    currentDealSubject.value.gramPerPerson = gram;
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = +((currentDealSubject.value.price / 1000) * currentDealSubject.value.gramPerPerson).toFixed(0)
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity).toFixed(2)
                    } 
                    // else if (currentDealSubject.value.costEstimation === 'per100gram') {
                    //     currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity).toFixed(2)
                    // }
                }
                calcSubjectTotalPrice()
                update();
            }
            // ставим Current Subject PRODUCT QUANTITY
            const setSubjectQty = (qty) => {
                if(currentDeal.value.dealType === 'sale') {
                    currentDealSubject.value.productQuantity = qty;
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = +((currentDealSubject.value.price / 1000) * (currentDealSubject.value.personQuantity * currentDealSubject.value.gramPerPerson) * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        // setCountQtyButtonColor(qty)
                        // calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // setCountQtyButtonColor(qty)
                        // calcSubjectTotalPrice()
                        // update();
                    } 
                    // else if (currentDealSubject.value.costEstimation === 'per100gram') {
                    //     currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                    // }
                } else if (currentDeal.value.dealType === 'buy') {
                    currentDealSubject.value.productQuantity = qty;
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = +((currentDealSubject.value.price / 1000) * currentDealSubject.value.gramPerPerson).toFixed(0)
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity).toFixed(2)
                    } 
                    // else if (currentDealSubject.value.costEstimation === 'per100gram') {
                    //     currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity).toFixed(2)
                    // }
                }
                setCountQtyButtonColor(qty)
                calcSubjectTotalPrice()
                update();
            }
            // ставим Current Subjecty PERSON QUANTITY
            const setPersonQty = (qty) => {
                if(currentDeal.value.dealType === 'sale') {
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        currentDealSubject.value.personQuantity = qty;
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = +((currentDealSubject.value.price / 1000) * (currentDealSubject.value.personQuantity * currentDealSubject.value.gramPerPerson) * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        // Пока не используется в perUnit
                    } 
                    // else if (currentDealSubject.value.costEstimation === 'per100gram') {
                    //     // Пока не используется в per100gram
                    // }
                } else if(currentDeal.value.dealType === 'buy') {
                    // Если не понадобится - удалить
                    console.log('В разработке')
                }
                // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                setCountPersonQtyButtonColor(qty)
                calcSubjectTotalPrice()
                update();
            }
            // Ставим Current Subject DISCOUNT
            const setSubjectDiscount = (discount) => {
                if(currentDeal.value.dealType === 'sale') {
                    currentDealSubject.value.subjectDiscount = discount;
                    if(currentDealSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentDealSubject.value.subjectPrice = +((currentDealSubject.value.price / 1000) * (currentDealSubject.value.personQuantity * currentDealSubject.value.gramPerPerson) * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        // calcSubjectTotalPrice()
                        // update();
                    } else if (currentDealSubject.value.costEstimation === 'perUnit') {
                        currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // calcSubjectTotalPrice()
                        // update();
                    } 
                    // else if (currentDealSubject.value.costEstimation === 'per100gram') {
                    //     currentDealSubject.value.subjectPrice = +(currentDealSubject.value.price * currentDealSubject.value.productQuantity * ((100 - currentDealSubject.value.subjectDiscount) / 100)).toFixed(0)
                    // }
                } else if (currentDeal.value.dealType === 'buy') {
                    // Если не понадобится - удалить
                    console.log('В разработке')
                }
                calcSubjectTotalPrice()
                update();
            }
            // count SUBJECT QTY BUTTON COLOR
            const countQtyButtonColor = ref('primary');
            const setCountQtyButtonColor = (qty) => {
                if(qty < 2) {
                    return countQtyButtonColor.value = 'light'
                } else {
                    return countQtyButtonColor.value = 'primary'
                }
            }
            // count PERSON QTY BUTTON COLOR
            const countPersonQtyButtonColor = ref('primary');
            const setCountPersonQtyButtonColor = (qty) => {
                if(qty < 2) {
                    return countPersonQtyButtonColor.value = 'light'
                } else {
                    return countPersonQtyButtonColor.value = 'primary'
                }
            }
            // ================================== View Deal Modal Create Subject ============================================
            // ставим NEW Current Subject PRICE
            const setNewSubjectPrice = (price) => {
                if(currentDeal.value.dealType === 'sale') {
                    currentSubject.value.price = price;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * (currentSubject.value.personQuantity * currentSubject.value.gramPerPerson) * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        // calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // calcNewSubjectTotalPrice()   
                    } 
                    // else if (currentSubject.value.costEstimation === 'per100gram') {
                    //     currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                    // }
                } else if (currentDeal.value.dealType === 'buy') {
                    currentSubject.value.price = price;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * currentSubject.value.gramPerPerson).toFixed(2)
                    } else if (currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity).toFixed(2)
                    } 
                    // else if (currentSubject.value.costEstimation === 'per100gram') {
                    //     currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity).toFixed(2)
                    // }
                }
                calcNewSubjectTotalPrice()
            }
            // ставим NEW Subject gramPerPerson
            const setNewGramPerPerson = (gram) => {
                if(currentDeal.value.dealType === 'sale') {
                    currentSubject.value.gramPerPerson = gram;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * (currentSubject.value.personQuantity * currentSubject.value.gramPerPerson) * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        // calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // calcNewSubjectTotalPrice()
                    } 
                    // else if (currentSubject.value.costEstimation === 'per100gram') {
                    //     currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                    // }
                } else if (currentDeal.value.dealType === 'buy') {
                    currentSubject.value.gramPerPerson = gram;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * currentSubject.value.gramPerPerson).toFixed(0)
                    } else if (currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity).toFixed(0)
                    } 
                    // else if (currentSubject.value.costEstimation === 'per100gram') {
                    //     currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity).toFixed(0)
                    // }
                }
                calcNewSubjectTotalPrice()
            }
            // ставим NEW Subject QUANTITY
            const setNewSubjectQty = (qty) => {
                if(currentDeal.value.dealType === 'sale') {
                    currentSubject.value.productQuantity = qty;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * (currentSubject.value.personQuantity * currentSubject.value.gramPerPerson) * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        // calcNewSubjectTotalPrice()
                    } else if(currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // calcNewSubjectTotalPrice()
                    } 
                    // else if (currentSubject.value.costEstimation === 'per100gram') {
                    //     currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                    // }
                } else if (currentDeal.value.dealType === 'buy') {
                    currentSubject.value.productQuantity = qty;
                    if (currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * currentSubject.value.gramPerPerson).toFixed(0) 
                    } else if (currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity).toFixed(0)
                    } 
                    // else if (currentSubject.value.costEstimation === 'per100gram') {
                    //     currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity).toFixed(0)
                    // }
                }
                calcNewSubjectTotalPrice()
            }
            // Ставим NEW Person SUBJECT QUANTITY
            const setNewPersonQty = (qty) => {
                if(currentDeal.value.dealType === 'sale') {
                    currentSubject.value.personQuantity = qty;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentSubject 
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * (currentSubject.value.personQuantity * currentSubject.value.gramPerPerson) * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                    } else if(currentSubject.value.costEstimation === 'perUnit') {
                        // Не используется
                    } 
                    // else if (currentSubject.value.costEstimation === 'per100gram') {
                    //     // Не используется
                    // }
                } else if (currentDeal.value.dealType === 'buy') {
                    // Если не понадобится - удалить
                    console.log('В разработке')
                }
                // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                calcNewSubjectTotalPrice()
            }
            // Ставим NEW Subject DISCOUNT
            const setNewSubjectDiscount = (discount) => {
                if(currentDeal.value.dealType === 'sale') {
                    currentSubject.value.subjectDiscount = discount;
                    if(currentSubject.value.costEstimation === 'perKilogram') {
                        // Формула рассчета цены currentDealSubject 
                        currentSubject.value.subjectPrice = +((currentSubject.value.price / 1000) * (currentSubject.value.personQuantity * currentSubject.value.gramPerPerson) * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                        // calcNewSubjectTotalPrice()
                    } else if (currentSubject.value.costEstimation === 'perUnit') {
                        currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                        // calcNewSubjectTotalPrice()
                    } 
                    // else if (currentSubject.value.costEstimation === 'per100gram') {
                    //     currentSubject.value.subjectPrice = +(currentSubject.value.price * currentSubject.value.productQuantity * ((100 - currentSubject.value.subjectDiscount) / 100)).toFixed(0)
                    // }
                } else if (currentDeal.value.dealType === 'buy') {
                    // Если не понадобится - удалить
                    console.log('В разработке')
                }
                // Считаем общую totalSubjectPrice по предмету (предмет + допы)
                calcNewSubjectTotalPrice()
            }
            // массив вариантов доставки из store
            const shippingTypeList = ref(store.state.shippingTypeList)
            // храним значение dealShippingType
            const dealShippingType = ref();
            // следим за изменениями значения dealShippingType у текущего дела и обновляем его в БД
            watch (dealShippingType, () => {
                if(dealShippingType.value === 'shipping-pickup') {
                    currentDeal.value.shipping = {
                        typeOfShipping: dealShippingType.value,
                        shippingPrice: 0
                    }
                } else if (dealShippingType.value === 'shipping-delivery') {
                    currentDeal.value.shipping = {
                        typeOfShipping: dealShippingType.value,
                        shippingAddress: [],
                        shippingPrice: 0
                    }
                } 
                update()
            })
            // Считаем сумму всех PRICE всех subject
            // const sumAllTotalSubjectPrice = ref();
            const sumAllTotalSubjectPriceFunc = (array) => {
                if (array.length !== 0) {
                    // Выбираем из массива данных нужные значения
                    let totalSubjectPriceArray = array.map(item => item.totalSubjectPrice)
                    // Суммируем значения
                    const sumAllTotalSubjectPrice = totalSubjectPriceArray.reduce((accumulator, currentValue) => accumulator + currentValue)
                    calcTotalDealPrice(sumAllTotalSubjectPrice)
                    // console.log(sumAllTotalSubjectPrice.value)
                    return sumAllTotalSubjectPrice
                } else {
                    calcTotalDealPrice(0)
                    return 0
                }
            }
            // функция калькуляции общей стоимости дела (с учетом доставки)
            const calcTotalDealPrice = (sumSubjectPrice) => {
                if(currentDeal.value.dealType === 'sale') {
                    currentDeal.value.totalDealPrice = sumSubjectPrice + currentDeal.value.shipping.shippingPrice
                } else if (currentDeal.value.dealType === 'buy') {
                    currentDeal.value.totalDealPrice = sumSubjectPrice + currentDeal.value.shipping.shippingPrice
                }
                update()
            }
            //
            const shippingPrice = ref();
            watch(shippingPrice, () => {
                if(currentDeal.value.dealType === 'sale') {
                    if(currentDeal.value.dealsList.length === 0) {
                        currentDeal.value.shipping.shippingPrice = +shippingPrice.value
                        currentDeal.value.totalDealPrice = currentDeal.value.shipping.shippingPrice
                        // update()
                    } else {
                        currentDeal.value.shipping.shippingPrice = +shippingPrice.value
                    }
                    update()
                } else if (currentDeal.value.dealType === 'buy') {
                    if(currentDeal.value.dealsList.length === 0) {
                        currentDeal.value.shipping.shippingPrice = +shippingPrice.value
                        currentDeal.value.totalDealPrice = currentDeal.value.shipping.shippingPrice
                        // update()
                    } else {
                        currentDeal.value.shipping.shippingPrice = +shippingPrice.value
                    }
                    update()
                }
            })
            //
            // const shippingType = ref();
            // watch(shippingType, () => {
            //     currentDeal.shipping.typeOfShipping = shippingType.value
            //     console.log(shippingType.value)
            // })
            //
            // const editShippingAddress = ref(false);
            //
            const shippingAddress = ref('');
            // watch(shippingAddress, () => {
            //     console.log(shippingAddress.value)
            //     currentDeal.value.shipping.shippingAddress = shippingAddress.value
            // })
            //
            // const toggleEditShippingAddress = () => {
            //     if(editShippingAddress.value === false) {
            //         if(currentDeal.value.dealStatus === 'deal-complete' || currentDeal.value.dealStatus === 'deal-in-delivery') {
            //             alert('ViewDeal: вы не можете изменить адрес доставки, если статус "ЗАВЕРШЕН" или "В ДОСТАВКЕ"')
            //         } else {
            //             editShippingAddress.value = true
            //         }
            //     } else {
            //         editShippingAddress.value = false
            //         currentDeal.value.shipping.shippingAddress = shippingAddress.value
            //         update()
            //     }
            // }
            //
            // const setShippingAddresPlaceholder = (note) => {
            //     if (note.length === 0) {
            //         return 'Адрес не указан'
            //     } else {
            //         shippingAddress.value = note
            //         return note
            //     }
            // }
            // считаем для свода данных ИТОГО
            // вес при расчете за КГ в режиме sale
            const culcSubjectWeight = (personQty, portionWeight) => {
                return (personQty * portionWeight / 1000).toFixed(3)
            }
            // вес при расчете за КГ в режиме buy
            const culcBuySubjectWeight = (weight) => {
                // Переводим в килограммы
                return (weight / 1000).toFixed(3)
            }

            // считаем задолженность по делу
            const debt = ref()
            //
            const culcDealDebt = (totalDealPrice, dealPaid) => {
                // Пока так
                debt.value = totalDealPrice - dealPaid
                return debt.value
            } 
            // управление модалкой deal paid
            const isDealPaidMenuOpened = ref(false)
            //
            const openDealPaidMenu = () => {
                // culcDealDebt(currentDeal.value.totalDealPrice, currentDeal.value.dealPaid)
                // dealPaidAmountValue()
                isDealPaidMenuOpened.value = true
                refreshDebtValue()
            }
            const closeDealPaidMenu = () => {
                isDealPaidMenuOpened.value = false
            }
            // функция обнуления пропса по начальному значению суммы оплаты (для DealPaidMenu)
            // const dealPaidAmountValue = () => {
            //     return 0
            // }
            // функция обновления пропса по задолженности (для DealPaidMenu)
            const refreshDebtValue = () => {
                return debt.value
            }
            // управляем внесении оплаты по задолженностям (при изменении сразу обновляется)
            // ================== переработать с учетом closeDealPaidMenu
            const setAmountValue = (amount) => {
                if (currentDeal.value.dealPaid === 0){
                    currentDeal.value.dealPaid = +amount
                } else if (currentDeal.value.dealPaid !== 0) {
                    currentDeal.value.dealPaid += +amount
                }

                // добавляем запись (строку) от транзакции в леджер
                addToLedger(amount) 

                //
                culcDealDebt(currentDeal.value.totalDealPrice, currentDeal.value.dealPaid)
                // запускаем функцию расчета баланса кошелька из store
                // store.methods.calculateBalance(myDeals.value)
                // availableBalance.value = store.state.availableBalance
                //
                if (debt.value < 0) {
                    // Удалить, если не пригодится
                    alert('Получается переплата... Верно?')
                } else if(debt.value === 0) {
                    // SALE
                    if(currentDeal.value.dealType === 'sale') {
                        dealStatus.value = 'deal-complete'
                        // console.log(`Текущий статус: ${dealStatus.value}`)
                        alert(`ViewDeal: внесено ${amount} ${currency.value}`)
                        isAllAttrReturnedFunc()
                        closeDealPaidMenu()
                    } 
                    // BUY
                    else if (currentDeal.value.dealType === 'buy') {
                        console.log(availableBalance.value)
                        // уведомляем о количестве внесенных средств
                        // if(amount > availableBalance.value) {
                        //     alert('ViewDeal: недостаточно средств на балансе')
                        // } else {
                        // }
                        alert(`ViewDeal: внесено ${amount} ${currency.value}`)
                        // Уведомляем о смене статуса
                        // alert('ViewDeal: статус дела изменен на Завершено')
                        // Меняем статус дела на ЗАВЕРШЕН
                        dealStatus.value = 'deal-complete'
                        currentDeal.value.dealStatus = 'deal-complete'
                        // закрываем dealPaid Menu
                        closeDealPaidMenu()
                        // зачисляем на склад только при условию что НЕТ долгов по оплате поставки
                        addToWarehouseToast()
                        addToWarehouseFunc(currentDeal.value)
                        // console.log(`Можно помещать предметы на склад по делу №${currentDeal.value.uid}`)
                        // currentDeal.value.dealsList.forEach(item => {
                        //     console.log(item)
                        // })
                    }
                } else if(debt.value > 0){
                    closeDealPaidMenu()
                }
            }

            // Проверяем на возврат атрибутов
            const isAllAttrReturnedFunc = () => {
                let dealsListArray = currentDeal.value.dealsList
                let subjectAttributesArray = dealsListArray.map(item => item.additionalAttributes)
                // Упрощаем массив, поднимая вложенные массивы в массив верхнего уровня
                let isReturnedArray = subjectAttributesArray.flat()
                let isReturnData = isReturnedArray.map(item => item.isReturned) 
                if(isReturnData.length === 0) {
                    // Значит массив атрибутов пустой
                    // При создании он всеравно есть, но изначально пустой
                    alert('ViewDeal: статус дела изменен на ЗАВЕРШЕН')
                 } else if (isReturnData.length !== 0) {
                    // Если массив содержит невозвращенные атрибуты какого-либо предмета дела
                    if(isReturnData.includes(false)) {
                        // console.log(`Текущий статус: ${dealStatus.value}`)
                        // Если содержит false (то есть есть то, чего не вернули)
                        isAllAttrReturned.value = false
                        // alert(`ViewDeal: внесено ${amount} ${currency.value}`)
                        alert(`VewDeal: Вам вернули не все допы по заказу. Статус дела изменен на ДОЛГ`)
                        dealStatus.value = 'deal-in-debt'
                        currentDeal.value.dealStatus = 'deal-in-debt'
                        // console.log(`Текущий статус: ${dealStatus.value}`)
                    } else{
                        // Если содержит все true (то есть всё уже вернули)
                        isAllAttrReturned.value = true
                        // alert(`ViewDeal: внесено ${amount} ${currency.value}`)
                        alert('ViewDeal: статус дела изменен на ЗАВЕРШЕН')
                        // dealStatus.value = 'deal-complete'
                        currentDeal.value.dealStatus = 'deal-complete'
                    }
                }
            }
            // функция для кнопки ЗАВЕРШИТЬ ДЕЛО
            const finishDeal = () => {
                // Ставим делу статус ЗАВЕРШЕНJ
                dealStatus.value = 'deal-complete'
                // Проверяем на предмет возврата атрибутов
                if(currentDeal.value.dealType === 'sale') {
                    isAllAttrReturnedFunc()
                } else if (currentDeal.value.dealType === 'buy') {
                    //Ничего не делаем
                }
            }
            // ================================ ВАЖНОСТЬ ДЕЛА =================================
            //const currentDeal = ref(JSON.parse(info.deal))
            const dealImportance = ref(currentDeal.value.dealImportance)
            //
            const setRatingValue = async (ratingValue) => {
                if(currentDeal.value.dealStatus === 'deal-complete') {
                    // alert('ViewDeal: вы не можете изменить дело, если статус Завершен')
                    // выводим уведомление (о невозможности изменить) в комопненте StarRating.vue
                } else {
                    // console.log(ratingValue)
                    dealImportance.value = ratingValue
                    // update()
                    try {
                    // spinner.value = true;
                    //
                    const {error} = await supabase.from('deals').update({
                        dealImportance: dealImportance.value,
                    }).eq('id', currentId);
                    if(error) throw error;
                    // Дело успешно обновлено
                    } catch (error) {
                        // alert(`Error: ${error.message}`)
                    }
                    // edit.value = !edit.value;
                    spinner.value = false;
                    }
            }

            // добавляем запись (строку) от транзакции в леджер
            const addToLedger = async (amount) => {
                try {
                    const { error } = await supabase.from('ledger').insert([{
                        dealID: currentDeal.value.id,
                        uid: currentDeal.value.uid,
                        contactID: currentDeal.value.contactID,
                        dealType: currentDeal.value.dealType,
                        amount: amount,
                        userEmail: currentDeal.value.email,
                        tempContactName: tempContactName.value
                    }])
                    if(error) throw error
                } catch (error) {
                    alert(`Error: ${error.message}`)
                }
            }
            //
            const showSelectedRecipe = (recipeID, tempName) => {
                const recipe = userRecipeArray.value.filter(recipe => recipe.uid === recipeID)
                // Проверяем по наличию в книге рецептов у пользователя
                if(recipe.length === 0) {
                    return tempName
                } else {
                    return translateRecipeID(recipeID, userRecipeArray.value)
                }
            }
            //
            const dealComments = ref(currentDeal.value.comments);
            watch(dealComments, async () => {
                currentDeal.value.comments = dealComments.value
                // update()
                try {
                    spinner.value = true;
                    //
                    const {error} = await supabase.from('deals').update({
                        comments: currentDeal.value.comments

                    }).eq('id', currentId);
                    if(error) throw error;
                    // Дело успешно обновлено
                } catch (error) {
                    // alert(`Error: ${error.message}`)
                }
                spinner.value = false;
            })

            //
            const isAddDeliveryAddressMenuOpened = ref()
            const addDeliveryAddressMenu = () => {
                currentDeliveryAddressIndex.value = -1
                isAddDeliveryAddressMenuOpened.value = true
            } 

            //
            // Вызываем action sheet увдомление в качестве подтверждения
            const deleteDeliveryAddressOpened = ref(false)
            // Храним айди адреса доставки
            const deliveryAddressToDelete = ref()
            // открывает модалку по удалению конкретного адреса доставки и вполнять некоторые условия
            const openDeleteDeliveryAddressModal = (id) => {
                if(id > -1) {
                    if(currentDeal.value.dealStatus === 'deal-complete') {
                        alert('ViewDeal: вы не можете удалить адрес доставки, если статус "ЗАВЕРШЕН"')
                    } else if (currentDeal.value.dealStatus === 'deal-in-delivery') {
                        alert('ViewDeal: вы не можете удалить адрес доставки, если статус "В ДОСТАВКЕ"')
                    } else if (currentDeal.value.shipping.shippingAddress.length === 1) {
                        alert('ViewDeal: для доставки должен быть указан хотя бы один адрес')  
                    } else {
                        deleteDeliveryAddressOpened.value = true
                        deliveryAddressToDelete.value = id
                    }
                }
            }
            // кнопки action sheet меню удаления выбранного адреса доставки
            const deleteDeliveryAddressButtons = [
                {
                    text: 'Удалить',
                    role: 'destructive',
                    data: {
                        type: 'delete'
                    },
                    handler: () => {
                        console.log('Delete clicked')
                        deleteCurrentDeliveryAddress(deliveryAddressToDelete.value)
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
            // Удаляем конкретный адрес доставки
            const deleteCurrentDeliveryAddress = (index) => {
                currentDeal.value.shipping.shippingAddress.splice(index, 1)
            }
            const currentDeliveryAddressIndex = ref();
            const showCurrentDeliveryAddressInfo = (index) => {
                currentDeliveryAddressIndex.value = index
                // console.log(index)
                isAddDeliveryAddressMenuOpened.value = true
            }

            return {
                currency, spinner, currentId, info, currentDeal, dealContactID, isOpenRef, setOpen, deleteDealButtons, deleteDealSubjectButtons, deleteDeal, dealContact, choose, searchContactMenu, searchDealContact, searchedContacts, myContacts, dealStatusList, dealStatus, translateValue, setChipColor, executionDate, datepicker, isCalendarOpened, openModalCalendar, closeModalCalendar, updateExecutionDate, addCircleOutline, setDealType, closeCircleOutline, isViewDealSubjectOpened, openCurrentDealSubject, deleteSubject, openDeleteSubjectModal, deleteCurrentDealItem, currentDealSubject, subjectToDelete, isCreateNewSubjectOpened, openCreateSubjectModal, closeCreateSubjectModal, currentSubject, addNewSubject, checkRentAttr, helpOutline, setColorByDealType, setIconByDealType, updateBD, setSubjectPrice, sumAttributesPriceValue, setSumAttributesPriceValue, calcSubjectTotalPrice, setNewSubjectPrice, calcNewSubjectTotalPrice, setNewSubjectQty, setSubjectQty, setCountQtyButtonColor, countQtyButtonColor, setPersonQty, countPersonQtyButtonColor, setCountPersonQtyButtonColor, setNewPersonQty, setGramPerPerson, setNewGramPerPerson, setSubjectDiscount, setNewSubjectDiscount, shippingTypeList, dealShippingType, shippingPrice, shippingAddress, sumAllTotalSubjectPriceFunc, translateShippingType, translateSelectedProduct, culcSubjectWeight, culcDealDebt, isDealPaidMenuOpened, openDealPaidMenu, closeDealPaidMenu, culcBuySubjectWeight, debt, setAmountValue, isAllAttrReturned, isAllAttrReturnedFunc, actionSheetDealStatus, openActionSheetDealStatusMenu, changeDealStatusMenuButtons, refreshDebtValue, finishDeal, setMarkerAttrColor, shapes, checkmarkDone, availableBalance, currentPriceSubject, personPortionGram, dealImportance, setRatingValue, addToLedger, dealComments, substructFromWarehouseToast, addToWarehouseFunc, showSelectedRecipe, userRecipeArray, openSearchContactMenu, calcTotalDealPrice, goToContact, tempContactName, isAddDeliveryAddressMenuOpened, addDeliveryAddressMenu, deleteCurrentDeliveryAddress, showCurrentDeliveryAddressInfo, currentDeliveryAddressIndex, deleteDeliveryAddressOpened, deliveryAddressToDelete, openDeleteDeliveryAddressModal, deleteDeliveryAddressButtons
            }
        }
    })
</script>

<style scoped>
    .horizontal-scroll {
        overflow: scroll;
        --overflow: scroll;
        white-space: nowrap;
    }
    ::-webkit-scrollbar, *::-webkit-scrollbar {
        display: none;
        overflow: hidden;
    }
    ion-card {
        overflow: visible;
    }
    .card-center {
        display: flex; 
        flex-direction: column; 
        justify-content: center; 
        align-items: center; 
        min-width: 140px; 
        max-width: 140px;
    }
    .card-add {
        min-height: 140px;
    }
    .icon_size {
        font-size: 25px;
    }
    .relative {
        position: relative;
    }
    .absolute {
        position: absolute;
    }
    .icon_del {
        top: 0.3rem;
        left: 0.3rem;
    }
    .mark-atribute {
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0.8rem;
        right: 0.8rem;
        width: 1.3rem;
        height: 1.3rem;
        border-radius: 100%
    }
    .flex_nowrap {
        flex-wrap: nowrap;
    }
    .border-bottom {
        border-bottom: 1px solid var(--ion-color-light);
    }
    .border-top {
        border-top: 1px solid var(--ion-color-light);
    }
    .deal-complete_logo {
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center; 
        width: 9rem; 
        height: 9rem; 
        border-radius: 100%; 
        margin: 50px auto; 
        border: 1px solid var(--ion-color-success);
    }
    /* ion-toast.custom-toast::part(message) {
        --color: #5353d3!important;
    } */
    .delivery-address-block {
        background-color: var(--ion-color-light); 
        border-radius: 2rem; 
        width: 100%; 
        white-space: nowrap; 
        overflow: hidden; 
        padding: 1rem; 
        position: relative;
    }
    .delivery-address-block_btn {
        position: absolute; 
        padding: 1rem; 
        top: -0.1rem; 
        right: 0; 
        background-color: var(--ion-color-light); 
        display: flex; 
        justify-content: center; 
        align-items: center;
    }
</style>
<template>
  <div>
    <Navigation :title="pageTitle"/>


    <!-- Create New Deal -->
    <div v-if="dataLoaded" class="container pt-20">

      <!-- App Msg -->
      <!-- разобраться со стилями ерроров и меседжей системных -->
      <!-- Status Message -->
      <div v-if="statusMsg || errorMsg" class="fixed z-30 flex left-0 top-0 w-full h-16 mb-10 pl-8 py-4 rounded-b-md shadow-md bg-white items-center place-content-between">
        <div>
          <p class="text-green">
            {{ statusMsg }}
          </p>
          <p class="text-red-500">
            {{ errorMsg }}
          </p>
        </div>
        <div class="text-dark-gray px-8 py-4" @click="closeMsgNotify">
          Ok
        </div>
      </div>

      <div>
        <!-- Loading spinner -->
        <Spinner v-if="spinner"></Spinner>          
        
        <!-- Create -->
        <form 
          id="create-deal" 
          v-if="user" 
          @submit.prevent="createDeal" 
          class="flex flex-col items-center pt-0"
          :class="{ item_fixed: dealSubjectMenu || spinner || isSelectMenuOpened}"
        >
          <!-- set deal information inputs -->
          <div class="w-full mb-32 px-4" :class="{deal_information_inputs:totalDealMenu}">

            <!-- С кем заключается дело (Укажите контакт) -->
            <div class="w-full">
              <!-- В качестве примера взято https://github.com/moreta/vue-search-select/blob/master/src/lib/BasicSelect.vue -->
              <label for="searchedContacts" class="ml-2 text-sm text-blue">Укажите контакт</label>
              <div class="search-input mt-1 px-2 h-10 flex items-center border" @click="openOptions" @focus="openOptions">
                <input 
                  @focus.prevent="openOptions"
                  required
                  autocomplete="off"
                  id="searchedContacts"
                  class="text-dark-gray outline-none w-full focus:outline-none bg-light-grey" 
                  type="search"
                  placeholder="Поиск..."
                  v-model="search"
                  @blur="blurInput"
                >
              </div>
              <div class="relative">
                <div v-if="showSearchMenu" class="dropdown-menu absolute top-0 left-0 h-40 bg-light-grey w-full py-2 rounded-b-md text-lg">
                  <!-- Список из справочника контактов -->
                  <div 
                    v-for="(option, index) in filteredOptions" 
                    :key="index" 
                    @click.prevent="selectItem(option)" 
                    class="dropdown-menu_item px-2 py-1"
                  >
                    <div>
                      {{option.contactInfo.surname}} {{option.contactInfo.name}}
                    </div>
                    <div class="text-xs text-dark-gray">
                      {{option.contactInfo.company}}
                    </div>
                  </div>
                  <!-- Если из справочника ничего не найдено -->
                  <div v-if="filteredOptions.length <= 0" @click.prevent="selectAnon()">
                    <div class="px-2 text-xs text-dark-gray">Ничего не найдено. Выберите:</div>
                    <div class="px-2 py-1 text-blue">Неизвестный</div>
                    <div class="px-2 mt-2 text-xs text-dark-gray">Или добавьте новый контакт в справочник</div>
                    <router-link 
                      class="bg-green text-white text-center webkit block mx-2 rounded-md mt-2 p-2"
                      :to="{ name: 'CreateContact' }"
                    >
                      Добавить
                    </router-link>
                  </div>
                  <!-- Если в справочнике есть даже, всеравно будет удобная возможность-->
                  <div v-if="filteredOptions.length > 1" @click.prevent="selectAnon()">
                    <div class="px-2 py-1">Неизвестный</div>
                  </div>
                </div>
    
              </div>
            </div>
    
            <!-- Укажите дату и время исполнения дела -->
            <div class="w-full mt-4">
              <label for="executionDate" class="ml-2 text-sm text-blue">Дата и время исполнения</label>
              <div class="search-input mt-1 h-10 flex items-center border">
                <input 
                  type="date" 
                  name="execution-date" 
                  id="executionDate"
                  class="webkit w-full text-gray-500 p-2 outline-none focus:outline-none bg-light-grey" 
                  v-model="executionDate"
                >
              </div>
            </div>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellendus earum quod iusto quasi harum? Commodi molestias dolorum modi sequi ut neque necessitatibus. Culpa ipsam amet ut est placeat aperiam dolorem, eum optio et tenetur asperiores error magni earum consequuntur quis illo ratione similique debitis, officia hic pariatur aspernatur? Iste corrupti odit architecto iusto labore pariatur sit dolorum, provident eos id numquam soluta similique. Recusandae quibusdam debitis sunt iure cumque sed illo alias quo natus dolore nisi, numquam, nemo impedit! Doloribus dolor, est nesciunt aspernatur possimus tenetur! Ipsum nobis harum tempore. Cum deserunt quidem est vitae numquam fugiat odit sunt dolorem veritatis perspiciatis beatae quod enim eligendi, magni excepturi rerum, nesciunt iure? Rem deleniti labore ipsa doloribus dicta cum ratione odio eius dolorum eum veniam, minima maxime optio culpa laboriosam laborum dolores mollitia rerum porro laudantium magnam obcaecati! Quos est eius sit, libero impedit facilis, nemo illum praesentium consequatur odio fugiat incidunt doloremque, et ipsum minima accusantium quisquam odit consectetur. Tenetur est quas voluptatum illum eaque quidem vel recusandae expedita mollitia, molestias ea similique. Corporis fuga, quasi laboriosam veniam harum sed, et itaque fugiat id cupiditate deserunt nemo, illo laudantium ea. Commodi, facere illo porro quibusdam incidunt ab sequi perspiciatis a!
            </p>
            <!-- set deal Status -->
            <div class="w-full flex flex-col mt-4">
              <label for="deal-status" class="mb-1 ml-2 text-sm text-blue">Статус дела</label>
              <select 
                id="deal-status" 
                class="border webkit p-2 w-full text-gray-500 bg-light-grey rounded-md focus:outline-none" 
                required
                v-model="dealStatus"
              >
                <option 
                  v-for="(item, index) in dealStatusList" 
                  :key="index" 
                  :value="item.name">{{ item.title }}</option>
              </select>
            </div>

            <!-- Тип дела -->
            <div class="w-full flex flex-col mt-4">
              <!-- Выбор типа дела -->
              <div class="flex items-center">
                <p class="text-xl font-black flex-1 text-dark">Тип дела</p>
                <Select
                  :options="dealTypeArray"
                  @select="optionSelect"
                  :selected="typeOfDeal.title"
                  @change="dealTypeChanged"
                ></Select>
              </div>

              <!-- Выбираем тип дела -->
                <!-- НЕ выбран -->
                <div class="text-dark-gray text-sm px-2 mt-2" v-if="typeOfDeal.name === 'select-deal-type'">
                  Не выбран
                </div>

                <!-- Выбран тип: Заказ -->
                <div  v-if="typeOfDeal.name === 'order'" class="text-dark-gray text-sm px-2 mt-2">
                  <!-- если 0 предметов в заказе -->
                  <div v-if="dealsList.length === 0">
                    <p >Теперь добавьте позиции к заказу</p>
                  </div>
                  <!-- если > 0 предметов в заказе -->
                  <div v-for="(item, index) in dealsList" :key="index">
                    <div id="currentSubject" @click="openCurrentSubject(index)" class="flex place-content-between items-center">
                      <div class="img-wrapper bg-light-grey rounded-full p-2">
                        <img :src="require(`../assets/images/deals/orders/${item.selectedProduct}.png`)" alt=""> 
                      </div>
                      <div class="flex-1">
                        <p>Предмет:{{ item.selectedProduct }}</p>
                        <p>Кол-во:{{ item.productQuantity }}</p>
                        <p>Цена 1 ед.:{{ item.pricePerUnit }}</p>
                        <p>Скидка, %{{ item.discountSubjectPriceValue }}</p>
                        <p>Сумма{{ item.totalSubjectPrice }}</p>
                        <p>ЗАметки{{ item.productNote }}</p>
                        <p>Атрибуты:{{ item.additionalAttributes }}</p>
                      </div>
                      <p id="deleteCurrentSubject" class="z-20" @click.stop="deleteOrderSubject(item.id)">Удалить</p>
                    </div>
                  </div>
                  <!-- Footer типа дела Заказ -->
                  <div class="w-full flex items-center place-content-between px-2 py-1 border-t">
                    <p class="text-dark-gray text-sm">Позиций в заказе: {{ dealsList.length }} </p>
                    <p class="text-blue" id="addSubject" @click="addNewSubject">Добавить</p>
                  </div>
                </div>
                <!-- Выбран тип: Поставка -->
                <div  v-if="typeOfDeal.name === 'supply'" class="text-dark-gray text-sm px-2 mt-2">
                    <!-- если 0 позиций в поставке -->
                    <div v-if="dealsList.length === 0">
                      <p >Теперь добавьте позиции поставки</p>
                    </div>
                </div>
                <!-- Выбран тип: Личное -->
                <div  v-if="typeOfDeal.name === 'personal'" class="text-dark-gray text-sm px-2 mt-2">
                    <!-- если 0 задач в личном -->
                    <div v-if="dealsList.length === 0">
                      <p >Теперь добавьте личные задачи</p>
                    </div>
                </div>
            </div>

            <!-- Внести оплату | предоплату (dealPaid) -->
            <div v-if="typeOfDeal.name !== 'select-deal-type'" class="w-full flex flex-col mt-4">
              <p class="mb-1 ml-2 text-sm text-blue">Предоплата (RUB)</p>
              <div class="flex place-content-between border items-center p-2 rounded-md">
                <label for="dealPaid" class="text-sm leading-none align-text-middle text-dark-gray">
                  Впишите сумму
                </label>
                  <input 
                    type="number" 
                    id="dealPaid"
                    inputmode="decimal"
                    class="border-b border-dashed focus:outline-none text-dark text-right mx-1 pt-1 w-16" 
                    placeholder="0.00"
                    v-model="dealPaid" 
                  >
              </div>
              
            </div>

            <!-- Тип доставки -->
            <div class="w-full flex flex-col mt-4">
              <label for="deal-type" class="mb-1 ml-2 text-sm text-blue">Доставка</label>
              <select 
                id="deal-type" 
                class="border webkit p-2 w-full text-gray-500 bg-light-grey rounded-md focus:outline-none" 
                required
                v-model="typeOfShipping"
                @change="shippingTypeChanged"
              >
              <!-- Возможно , в дальнейшем динамическое, исходя из настроек аккаунта -->
                <option disabled value="select-shipping-type">Выберите вариант доставки</option>
                <option value="shipping-pickup">Самовывоз</option>
                <option value="shipping-delivery">Доставка</option>
              </select>
            </div>
            <!-- Настройки доставки по выбранному типу доставки-->              
            <div class="w-full">
              <!-- Если Самовывоз -->
              <div v-if="typeOfShipping === 'shipping-pickup' ">
                Выбранный вариант доставки: Самовывоз
              </div>

              <!-- Если Доставка -->
              <div v-if="typeOfShipping === 'shipping-delivery'">
                Выбранный вариант доставки: Доставка
              </div>
            </div>


            <!-- Для input -->
            <!-- pattern="[0-9]+([\.,][0-9]+)?" step="0.01" -->

          </div>


          <!-- total menu wrapper -->
          <!-- Может имеет смысл сделать компонентом? -->
          <div
            class="w-full fixed bottom-0 left-0 flex items-center  justify-center flex-col pb-0 z-20"
            :class="{ shading_background:totalDealMenu}"
            @click="totalDealMenuClose"
          >
            <!-- Total Menu -->
            <div class="bg-light-grey bottom-0 border-t w-full fixed  rounded-t-3xl">

              <!-- Header -->
              <div class="flex items-center place-content-between px-4 mt-2">
                <!-- Sum Deal Value -->
                <div class="ml-2">
                  <div class="text-xs text-dark-gray">
                  Общая сумма:
                  </div>
                  <div class="text-xl">
                    {{sum()}} руб.
                  </div>
                  
                </div>
      
                <!-- btn to open total Deal Menu -->
                <div @click="showTotalDealMenu">
                  <div class="flex items-center mr-2">
                    <div v-if="totalDealMenu === false" class="text-blue mr-2">Подробнее</div>
                    <div v-if="totalDealMenu === true" class="text-blue mr-2">Скрыть</div>
                    <div class="totalMenu-more_arrow">
                      <img 
                        class="more-arrow_icon" 
                        src="../assets/images/common/arrow-right.svg"
                        :class="[{ more_arrow_icon_opened_menu: totalDealMenu === true }, {more_arrow_icon_closed_menu: totalDealMenu === false}]" 
                        alt="">
                    </div>
                  </div>
                </div>
              </div>
      
              <!-- Deal Sum Details -->
              <div v-if="totalDealMenu" class="deal-details px-4 border-t mt-2 overflow-y-auto h-48">
                {{dealsList}}


                <p>Статус дела: {{dealStatus ? dealStatus : 'не выбран'}}</p>
                <p>Остаток к уплате: {{sum() - dealPaid}}</p>
                <p>Информация по доставке: {{shippingData}}</p>
                <div v-if="shippingData.typeOfShipping === 'не указан'">
                  Указать
                </div>
                <p>Оплачено: {{dealPaid}}</p>
                <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>
                <p>Задолженность: 1579,00 руб.</p>  
                          <p>Оплачено: 1000,00 руб.</p>

              </div>

              <!-- Btn submit "Создать дело"-->
              <div 
                class="mx-4"
              >
                <button 
                  type="submit" 
                  class="w-full my-4 cursor-pointer p-2 bg-dark text-white rounded-md font-normal"
                >
                  Создать дело
                </button>
              </div>

            </div>

          </div>

          <!-- Меню выбора предмета заказа -->
          <div 
            v-if="dealSubjectMenu" 
            class="w-full h-full fixed pt-16 bottom-0 left-0 flex items-center justify-center flex-col z-20" 
            :class="{ shading_background: dealSubjectMenu}" 
            @click="closeDealSubjectMenu"
          > 
            <!-- menu -->
            <div class="bg-light-grey border-t w-full rounded-t-2xl mx-auto h-full overflow-y-auto overflow-y">
              <!-- menu header -->
              <div class="bg-white border-b rounded-t-2xl text-blue flex items-center place-content-between deal-status-menu inset-x-2/4 fixed w-full left-0">
                <!-- Отменить -->
                <span class="btn_cancel p-4 pr-0">Отменить</span>
                <!-- Цена -->
                <div class="flex flex-1 flex-col justify-center item-center p-4">
                  <span class="text-dark-gray text-xs text-center">Предмет #{{tempValue + 1}}</span>
                  <span class="text-xl text-dark text-center">                      <!-- Общая цена конкретного предмета -->
                      {{calcTotalSubjectPrice()}} RUB</span>
                </div>
                <!-- Готово -->
                <span class="btn_done p-4">Готово</span>
              </div>
              <!-- menu content -->
              <div class="mt-16 bg-white pt-6">
                <!-- list of order subjects -->
                <div class="flex radio-toolbar-wrapper mr-2">
                  <div class="radio-toolbar_item" v-for="(item, index) in assortmentList" :key="index">
                      <input 
                        type="radio"
                        :value="item.name"
                        v-model="dealsList[tempValue].selectedProduct"
                        :id="index"
                        @change="changeSubject"
                      >
                      <label :for="index">
                        <div class="radio-toolbar_item-img">
                          <img :src="require(`../assets/images/deals/orders/${item.img}`)" alt=""> 
                        </div>
                        <div class="radio-toolbar_item-title text-center text-sm text-dark-gray mt-2">{{ item.title }}</div>
                      </label>
                  </div>
                </div>
                <!-- Choose recipe -->
                <!-- Сделать с возможностью выбора из БД (настройки аккаунта или прям рецепты и сделать раздел?) -->
                <div class="flex place-content-between mx-4 mt-6 items-center">
                  <label for="recipe" class="flex-1 leading-none align-text-middle text-dark-gray">
                    Рецепт
                  </label>
                    <input 
                      id="recipe"
                      type="text"
                      class="border-b border-dashed border-blue focus:outline-none text-blue text-right rounded-none" 
                      placeholder="Выберите рецепт"
                      v-model="dealsList[tempValue].recipe" 
                    >
                </div>

                <!-- Calc Subject Price -->
                <div>
                  <!-- Если предмет заказа считается по кол-ву штук -->
                  <div v-if="calcSubjectPriceType === 'perUnit'">
                    <!-- Price per unit -->
                    <div class="flex place-content-between mx-4 mt-6 items-center">
                      <label for="pricePerUnit" class="leading-none align-text-middle text-dark-gray">
                        Цена за 1 шт. (RUB)
                      </label>
                        <input 
                          id="pricePerUnit"
                          type="number" 
                          inputmode="decimal"
                          class="border-b border-dashed border-blue focus:outline-none text-blue text-xl text-right w-16  rounded-none" 
                          placeholder="0,00"
                          v-model="dealsList[tempValue].pricePerUnit" 
                        >
                    </div>
                    <!-- Change subject (product) quantity  -->
                    <div class="flex place-content-between mx-4 mt-6 items-center">
                      <span class="leading-none align-text-middle text-dark-gray">
                        Количество, шт.
                      </span>
                      <div class="subject-quantity flex justify-items-center">
                        <button 
                          @click.prevent="if(dealsList[tempValue].productQuantity > 1) dealsList[tempValue].productQuantity--;"
                          class="subject-quantity_btn"
                          :class="{ btn_disabled: dealsList[tempValue].productQuantity < 2 }"
                        >
                          -
                        </button>

                        <input type="number" readonly class="text-xl subject-quantity leading-none w-8 text-center focus:outline-none" v-model="dealsList[tempValue].productQuantity">
                        <button 
                          class="subject-quantity_btn"
                          @click.prevent="dealsList[tempValue].productQuantity++"
                        >
                          +
                        </button>
                      </div>

                    </div>
                  </div>

                  <!-- Если предмет заказа считается по весу -->
                  <div v-if="calcSubjectPriceType === 'perKilogram'">
                    <!-- Price per kilogramm -->
                    <div class="flex place-content-between mx-4 mt-6 items-center">
                      <label for="pricePerUnit" class="leading-none align-text-middle text-dark-gray">
                        Цена за 1 кг. (RUB)
                      </label>
                        <input 
                          id="pricePerUnit"
                          type="number" 
                          inputmode="decimal"
                          class="border-b border-dashed border-blue focus:outline-none text-blue text-xl text-right w-16  rounded-none" 
                          placeholder="0,00"
                          v-model="dealsList[tempValue].pricePerKilo" 
                        >
                    </div>
                    <!-- Portions per person -->
                    <div class="flex place-content-between mx-4 mt-6 items-center">
                      <label for="pricePerUnit" class="leading-none align-text-middle text-dark-gray">
                        Вес порции в граммах
                      </label>
                        <input 
                          id="pricePerUnit"
                          type="number" 
                          inputmode="decimal"
                          class="border-b border-dashed border-blue focus:outline-none text-blue text-xl text-right w-16  rounded-none" 
                          placeholder="150"
                          v-model="dealsList[tempValue].gramPerPerson" 
                        >
                    </div>
                    <!-- Person quantity  -->
                    <div class="flex place-content-between mx-4 mt-6 items-center">

                      <span class="leading-none align-text-middle text-dark-gray">
                        Количество порций, чел.
                      </span>
                      <div class="subject-quantity flex justify-items-center">
                        <button 
                          @click.prevent="if(dealsList[tempValue].personQuantity > 1) dealsList[tempValue].personQuantity--;"
                          class="subject-quantity_btn"
                          :class="{ btn_disabled: dealsList[tempValue].personQuantity < 2 }"
                        >
                          -
                        </button>

                        <input type="number" readonly class="text-xl subject-quantity leading-none w-8 text-center focus:outline-none" v-model="dealsList[tempValue].personQuantity">
                        <button 
                          class="subject-quantity_btn"
                          @click.prevent="dealsList[tempValue].personQuantity++"
                        >
                          +
                        </button>
                      </div>

                    </div>
                    <!-- Change subject (product) quantity  -->
                    <div class="flex place-content-between mx-4 mt-6 items-center">
                      <span class="leading-none align-text-middle text-dark-gray">
                        Количество предметов, шт.
                      </span>
                      <div class="subject-quantity flex justify-items-center">
                        <button 
                          @click.prevent="if(dealsList[tempValue].productQuantity > 1) dealsList[tempValue].productQuantity--;"
                          class="subject-quantity_btn"
                          :class="{ btn_disabled: dealsList[tempValue].productQuantity < 2 }"
                        >
                          -
                        </button>

                        <input type="number" readonly class="text-xl subject-quantity leading-none w-8 text-center focus:outline-none" v-model="dealsList[tempValue].productQuantity">
                        <button 
                          class="subject-quantity_btn"
                          @click.prevent="dealsList[tempValue].productQuantity++"
                        >
                          +
                        </button>
                      </div>

                    </div>
                  </div>

                </div>

                <!-- discount for subject price -->
                <div class="flex place-content-between mx-4 mt-8 items-center">
                  <span class="leading-none align-text-middle text-dark-gray">
                    Скидка, {{dealsList[tempValue].discountSubjectPriceValue}}%
                  </span>
                    <input 
                      type="range" 
                      class="focus:outline-none w-36" 
                      placeholder="0"
                      v-model="dealsList[tempValue].discountSubjectPriceValue"
                      :min="setDiscountRange('min')"
                      :max="setDiscountRange('max')"
                      step="1"
                    >
                </div>  
                <!-- Total subject price -->
                <div class="flex place-content-between mx-4 mt-10 items-center">
                  <span class="leading-2 align-text-middle text-dark-gray">
                    За {{dealsList[tempValue].productQuantity}} шт. 
                    <span v-if="dealsList[tempValue].discountSubjectPriceValue > 0">с учетом скидки</span>
                    (RUB)
                  </span>
                  <div>
                    <span 
                      class="py-2 text-xl"
                    >
                      <!-- Общая цена конкретного предмета -->
                      {{(dealsList[tempValue].totalSubjectPrice).toFixed(2)}}
                    </span>
                  </div>
                </div>
                <!-- Subjeсt notes -->
                <div class="mt-8 mx-4">
                  <textarea placeholder="Заметки к предмету заказа" v-model="dealsList[tempValue].productNote" class="h-40 p-2 bg-light-grey text-gray-500 rounded-md w-full focus:outline-none"></textarea>
                </div>
                <!-- Set additional attributes -->
                <div class="mt-6 mx-4">
                  <p class="text-blue">Дополнительные атрибуты к предмету #{{tempValue + 1}}</p>
                  <!-- Атрибуты из массива атрибутов из экрана настроек аккаунта -->
                  <ul class="mt-6">
                    <li v-for="(item, index) in additionalAttributesList" :key="index" class="flex items-center place-content-between my-4">
                      <div class="flex">
                        <input 
                          v-model="dealsList[tempValue].additionalAttributes" type="checkbox" 
                          class="custom-checkbox" 
                          :id="item.name"
                          :value="item"
                        >
                        <label :for="item.name" class="w-full text-dark-gray mr-2">{{item.title}}</label>
                      </div>
                      <input class="focus:outline-none pt-1 w-14 text-right text-blue border-b border-blue border-dashed rounded-none" :placeholder="item.price" type="number" v-model="item.price" inputmode="decimal" />
                    </li>
                  </ul>
                </div>
                <!-- Summary -->
                <div class="mx-4 mt-6 border-t pt-6 pb-6">
                    <span class="text-dark-gray">Итого по предмету #{{tempValue + 1}}</span> 
                    <!-- Общая цена конкретного предмета -->
                    <div class="text-xl text-dark">
                      {{(dealsList[tempValue].totalSubjectPrice).toFixed(2)}} RUB
                    </div>
                </div>
              </div>

            </div>

          </div>
          
        </form>

      </div>
      
    </div>
  </div>
  
</template>

<script>
import Navigation from '../components/Navigation.vue';
import Spinner from '../components/Spinner.vue';
import Select from '../components/Select.vue'

import { ref, computed } from 'vue';
import store from '../store/index';
import { uid } from 'uid';
import { supabase } from '../supabase/init';
import { useRouter } from 'vue-router';

import { getContactInfo } from '../supabase/getContactInfoFromDB';

import { sortAlphabetically } from '../helpers/sort';
import { searchFilter } from '../helpers/filter';

export default {
  name: "createDeal",
  components: {
    Spinner, Select, Navigation
  },
  setup() {
    // Create data
    const router = useRouter();
    const statusMsg = ref(null);
    const errorMsg = ref(null);
    const user = computed(() => store.state.user);

    // Берем имя роута для заголовка
    const pageTitle = router.currentRoute._value.meta.translation;

    // Spiner
    const spinner = ref(false);

    const typeOfDeal = ref({
      name: 'select-deal-type',
      title: 'Изменить'
    });
    const contactOfDeal = ref('select-deal-contact');
    const dealStatus = ref('deal-in-booking');
    const typeOfShipping = ref('select-shipping-type');

    const dealPaid = ref('');

    const contactInfo = ref([]);
    const dataLoaded = ref(null);

    const search = ref('');
    const executionDate = ref('');

    // deal status list
    const dealStatusList = [
      {
        name: 'deal-in-booking',
        title: 'Бронь даты',
        caption: 'Нет забронированных дат',
        text: 'Создайте дело и укажите дату.'
      },
      {
        name: 'deal-in-process',
        title: 'В процессе',
        caption: 'Где дела в процессе?',
        text: 'Создайте дело и приступайте.'
      },
      {
        name: 'deal-in-delivery',
        title: 'В доставке',
        caption: 'А как же доставка?',
        text: 'Сделали дело, доставьте товар.'
      },
      {
        name: 'deal-in-debt',
        title: 'Долг',
        caption: 'У вас нет дел с долгами',
        text: 'Никто никому ничего не должен.'
      },
      {
        name: 'deal-complete',
        title: 'Завершен',
        caption: 'Где завершенные дела?',
        text: 'Кажется, вы беретесь и не доделываете...'
      },
      {
        name: 'deal-cancelled',
        title: 'Отменен',
        caption: 'Ни одного отмененного дела!',
        text: 'Вы супер! Так держать!'
      }
    ]

    // bind contact ID from DB myContacts
    const contactId = ref('');

    // Предметы заказа
    const dealsList= ref([]);

    // show search menu
    const showSearchMenu = ref(null);

    // show sum menu
    const totalDealMenu = ref(false);

    // subject make menu
    const dealSubjectMenu = ref(false);

    // open crate subject menu
    const openDealSubjectMenu = () => {
      dealSubjectMenu.value = !dealSubjectMenu.value;
    }

    const closeDealSubjectMenu = (e) => {
      // Если нажали на кнопку Готово
      if (e.target.classList.contains('btn_done')) {
        // если режим предмета perUnit
        if(calcSubjectPriceType.value === 'perUnit') {
          if (dealsList.value[tempValue.value].pricePerUnit === '') {
            errorMsg.value = 'Вы не указали стоимость цены за 1 шт.'
            setTimeout(() => {
              errorMsg.value = false;
            }, 3000)
          } else if (dealsList.value[tempValue.value].recipe === '') {
            errorMsg.value = 'Вы не выбрали рецепт'
            setTimeout(() => {
              errorMsg.value = false;
            }, 3000)
          } else {
            openDealSubjectMenu();
          }
        }
        // если режим предмета perKilogram
        if(calcSubjectPriceType.value === 'perKilogram') {
          if (dealsList.value[tempValue.value].pricePerKilo === '') {
            errorMsg.value = 'Вы не указали стоимость цены за 1 кг.'
            setTimeout(() => {
              errorMsg.value = false;
            }, 3000)
          } else if (dealsList.value[tempValue.value].recipe === '') {
            errorMsg.value = 'Вы не выбрали рецепт'
            setTimeout(() => {
              errorMsg.value = false;
            }, 3000)
          } else if (dealsList.value[tempValue.value].gramPerPerson === '') {
            errorMsg.value = 'Вы не указали вес порции'
            setTimeout(() => {
              errorMsg.value = false;
            }, 3000)
          }else {
            openDealSubjectMenu();
          }
        }
      }
      // Если нажали на кнопку Отменитьи или ткнули на фон
      if (e.target.classList.contains('shading_background') || e.target.classList.contains('btn_cancel')) {
        if (dealsList.value[tempValue.value].totalSubjectPrice === 0 || dealsList.value[tempValue.value].recipe === '') {

          dealsList.value = dealsList.value.filter(subject => subject.id != dealsList.value[tempValue.value].id);
          openDealSubjectMenu();
        } else {
          openDealSubjectMenu();
        }
        
      }
    }

    const totalDealMenuClose = (e) => {
      if (e.target.classList.contains('shading_background')) {
        showTotalDealMenu()
      }
    }

    const totalDealValue = ref(0);

    const showTotalDealMenu = () => {
      totalDealMenu.value = !totalDealMenu.value;
    }

    const editModeSearchMenu = () => {
      showSearchMenu.value = !showSearchMenu.value;
    }

    // Select Anon
    const selectAnon = () => {
      search.value = '';
      closeOptions();
      search.value = 'Неизвестный'
      // Если выбрали "Неизвестный" - ему проставляется id = 000
      contactId.value = '000'
    }

    // Select option
    const selectItem = (option) => {
      search.value = '';
      closeOptions();
      if (option.value === option.text) {
        search.value = option.contactInfo.surname + ' ' + option.contactInfo.name;
        contactId.value = option.id;
      }
    }

    const closeOptions = () => {
      showSearchMenu.value = false;
    }

    const openOptions = () => {
      search.value = '';
      showSearchMenu.value = true;
    }

    const blurInput = () => {
      setTimeout(() => {
        closeOptions();
      }, 200)
    }

    // Получаем данные по контактам из БД
    getContactInfo(contactInfo, errorMsg, dataLoaded);

    //сортируем контакты по алфавиту
    const sortedContacts = computed(() => {       
      return sortAlphabetically(contactInfo.value)
    });

    // функция поиска контакта
    const filteredOptions = computed(() => {
      return searchFilter(sortedContacts.value, search.value)
    });

    // Ассортимент по предметам заказа (устанавливается в настройках аккаунта)
    const assortmentList = [
      {
        name: 'cake',
        img: 'cake.png',
        title: 'Торт',
        costEstimation: 'perKilogram'
      },
      {
        name: 'wedding-cake',
        img: 'wedding-cake.png',
        title: 'Свадебный торт',
        costEstimation: 'perKilogram'
      },
      {
        name: 'cupcake',
        img: 'cupcake.png',
        title: 'Капкейк',
        costEstimation: 'perUnit'
      },
      {
        name: 'meringue-roll',
        img: 'meringue-roll.png',
        title: 'Меренговый рулет',
        costEstimation: 'perUnit'
      },
      {
        name: 'brownies',
        img: 'brownies.png',
        title: 'Брауни',
        costEstimation: 'perUnit'
      },
      {
        name: 'meringue',
        img: 'meringue.png',
        title: 'Меренге (Безе)',
        costEstimation: 'perUnit'
      },
      {
        name: 'pavlova',
        img: 'pavlova.png',
        title: 'Павлова',
        costEstimation: 'perUnit'
      },
      {
        name: 'cake-pop',
        img: 'cake-pop.png',
        title: 'Кейк-попсы',
        costEstimation: 'perUnit'
      },
      {
        name: 'cake-eskimos',
        img: 'cake-eskimos.png',
        title: 'Эскимошки',
        costEstimation: 'perUnit'
      }
    ]  

    // Дополнительные услуги к основным товарам /услугам (устанавливается в настройках аккаунта)
    const additionalAttributesList = [
      {
        name: 'cake-stand',
        title: 'Аренда подставки',
        price: '500.00',
        isRent: true,
        isReturned: false
      },
      {
        name: 'tableware',
        title: 'Аренда столовых приборов',
        price: '0.00',
        isRent: true,
        isReturned: false
      },
      {
        name: 'packing-box',
        title: 'Упаковочная коробка',
        price: '0.00',
        isRent: false
      }, 
      {
        name: 'drink',
        title: 'Напиток',
        price: '150.00',
        isRent: false
      }
    ]

    // Максимально допустимую скидку (устанавливается в настройках аккаунта)
    const userDiscountRangeValue = [
      {
        name: 'min',
        value: 0
      },
      {
        name: 'max',
        value: 30
      }
    ]

    // Устанавливаем значение скидок
    const setDiscountRange = (name) => {

      if(name === 'min') {
        const value = userDiscountRangeValue[0].value
        return value
      }
      if(name === 'max') {
        const value = userDiscountRangeValue[1].value
        return value
      }
    }

    // Хранится режим perUnit или perKilogram
    const calcSubjectPriceType = ref('perKilogram');

    // Добавляем еще предмет заказа
    const addOrderSubject = () => {
      // Если расчет по типу perUnit
        dealsList.value.push({
          id: uid(),
          selectedProduct: 'cake',
          recipe: '',
          // пока указываем режим ценообразования
          priceMode: calcSubjectPriceType.value,
          // для режима price perUnit
          pricePerUnit: '',
          // для режима price perKilogram
          pricePerKilo: '',
          personQuantity: 1,
          gramPerPerson: 150,
          //
          productQuantity: 1,
          discountSubjectPriceValue: setDiscountRange('min'),
          totalSubjectPrice: 0,
          productNote: '',
          additionalAttributes: []
        })
    }

    const calcTotalSubjectPrice = () => {
      // Конкретный предмет заказа
      const subject = dealsList.value[tempValue.value];

      if(calcSubjectPriceType.value === 'perUnit') {
        subject.totalSubjectPrice = Math.floor(subject.pricePerUnit * subject.productQuantity * (1 - subject.discountSubjectPriceValue/100) + sumPriceAdditionalAttributes());
        // Обнуляем значения режима perKilogram
        subject.pricePerKilo = '';
        subject.personQuantity = 1;
        subject.gramPerPerson = '';

        return (subject.totalSubjectPrice).toFixed(2);

      }
      if(calcSubjectPriceType.value === 'perKilogram') {
        subject.totalSubjectPrice = Math.floor((subject.pricePerKilo * ((subject.personQuantity * subject.gramPerPerson)/1000) * (1 - subject.discountSubjectPriceValue/100)) * subject.productQuantity + sumPriceAdditionalAttributes());
        // Обнуляем значения режима perUnit
        subject.pricePerUnit = '';

        return (subject.totalSubjectPrice).toFixed(2);
      }
    }

    // Total order price
    const sum = () => {
      if(dealsList.value.length >= 1) {
        // Берем массив данных
        let array = dealsList.value;
        // Выбираем из массива данных нужные значения
        let numbers = array.map(item => item.totalSubjectPrice)
        // Суммируем значения
        let sum = numbers.reduce( (accumulator, currentValue) => accumulator + currentValue).toFixed(2)
        // задаем значение общей стоиомсти дела
        totalDealValue.value = sum
  
        return sum, totalDealValue.value
      }
      return '0.00'
    }

    // sum price of additional attributes in current subject
    const sumPriceAdditionalAttributes = () => {
      if(dealsList.value.length >= 1 && dealsList.value[tempValue.value].additionalAttributes.length >= 1 ) {
        // Берем массив данных
        let array = dealsList.value[tempValue.value].additionalAttributes
        // Выбираем из массива данных нужные значения
        let numbers = array.map(item => +item.price)
        // Суммируем значения
        let sum = numbers.reduce( (accumulator, currentValue) => accumulator + currentValue)
        // console.log(sum)
        return sum
      }
      return 0
    }

    // Listens for changing of deal type input
    const dealTypeChanged = () => {
      dealsList.value = [];
      // addOrderSubject();
    }

    const shippingData = ref({
      typeOfShipping: 'не указан'
      // про цену = 0 написать
    });

    // Listens for changing of shipping type input
    const shippingTypeChanged = () => {
      if (typeOfShipping.value === 'shipping-pickup') {
        shippingData.value = {
          typeOfShipping: typeOfShipping.value
          // про цену = 0 написать
        }
      }
      if(typeOfShipping.value === 'shipping-delivery') {
        shippingData.value = {
          typeOfShipping: typeOfShipping.value,
          shippingAddress: 'пока не указано'
        }
      }
    }

    // Delete current order subject'
    const deleteOrderSubject = (id) => {
      if(dealsList.value.length > 1) {
        dealsList.value = dealsList.value.filter(subject => subject.id != id);
        return;
      }
      if (dealsList.value.length === 1) {
        errorMsg.value = 'Не могу удалить. Должен быть хотя бы 1 (один) предмет';
        setTimeout(() => {
          errorMsg.value = false;
        }, 5000);
      }

    }

    const closeMsgNotify = () => {
      if(statusMsg.value) {
        statusMsg.value = !statusMsg.value
      }
      if(errorMsg.value) {
        errorMsg.value = !errorMsg.value
      }
    }

    // Create deal
    const createDeal = async () => {
      try {
        const { error } = await supabase.from('deals').insert([
          {
            dealType: typeOfDeal.value.name,
            dealStatus: dealStatus.value,
            contactID: contactId.value,
            executionDate: executionDate.value,
            dealsList: dealsList.value,
            totalDealValue: totalDealValue.value,
            dealPaid: dealPaid.value,
            shipping: shippingData.value
          }
        ]);
        if (error) throw error;
        statusMsg.value = 'Дело успешно создано';
        typeOfDeal.value.name = 'select-deal-type';
        contactOfDeal.value = 'select-deal-contact';
        typeOfShipping.value = 'select-shipping-type';
        dealsList.value = [];
        spinner.value = !spinner.value;
        setTimeout(() => {
          statusMsg.value = false;
          // В идеале переходить к только что созданному делу
          router.push({ name: 'Deals' });
        }, 3000)
      } catch (error) {
        errorMsg.value = `Error: ${error.message}`;
        setTimeout(() => {
          errorMsg.value = false;
        }, 5000)
      }
    }

    const tempValue = ref();

    const addNewSubject = () => {
        openDealSubjectMenu();
        addOrderSubject();
        tempValue.value = +(dealsList.value.length - 1);
        changeSubject()
    }

    const openCurrentSubject = (index) => {
      // вставляем полученный индекс конкретного предмета заказа
      tempValue.value = +index;
      // проверяем состояния perUnit или perKilogram
      changeSubject();
      // Открываем меню
      openDealSubjectMenu();
    }

    // Helper вывода расчета цены, в зависимости от способа расчета (по весу или по шт)
    const changeSubject = () => {
      const choosenSubject = (dealsList.value[tempValue.value].selectedProduct).toString()

      const choosenSubjectByAssortment = assortmentList.find(item => item.name === choosenSubject)

      return calcSubjectPriceType.value = choosenSubjectByAssortment.costEstimation
    }

    // Тип дела
    const dealTypeArray = [
      {
        name: 'order',
        title: 'Заказ'
      },
      {
        name: 'supply',
        title: 'Поставка'
      },
      {
        name: 'personal',
        title: 'Личное'
      }
    ]

    // Метод по селекту type of deal
    const optionSelect = (option) => {
      // console.log(option)
      // console.log(areOptionsVisible)
      typeOfDeal.value = option
    }

    const isSelectMenuOpened = ref(false);

    return {
      typeOfDeal, dealStatus, contactOfDeal, contactInfo, dataLoaded, sortedContacts,filteredOptions, search, statusMsg, errorMsg, user, createDeal , editModeSearchMenu, selectItem, openOptions, showSearchMenu, blurInput, selectAnon, dealsList, addOrderSubject, assortmentList, deleteOrderSubject, dealTypeChanged, showTotalDealMenu, totalDealMenu, additionalAttributesList, userDiscountRangeValue, sum, totalDealValue, executionDate, totalDealMenuClose, setDiscountRange, dealStatusList, dealPaid, spinner, typeOfShipping, shippingTypeChanged, shippingData, closeMsgNotify, dealSubjectMenu, openDealSubjectMenu, closeDealSubjectMenu, addNewSubject, tempValue, openCurrentSubject, sumPriceAdditionalAttributes, changeSubject, calcSubjectPriceType, calcTotalSubjectPrice, dealTypeArray, optionSelect, pageTitle, isSelectMenuOpened
    };
  },
};
</script>

<style lang="scss" scoped>

  .container {
    height: 100vh;
  }
  .webkit {
    -webkit-appearance:none;
  }

  .nav {
    height: 76px;
    padding: 0.5rem 1rem;
  }
  .search-input {
    border-radius: 5px;
    background-color: #f1f1f1;
  }

  .search-input_icon {
    width: 40px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  input[type="search"] {
    background-color: #f1f1f1;
    -webkit-appearance:none;
  }

  input[type="search"]::-webkit-search-decoration {
    background-color: red;
  }

  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration {
    -webkit-appearance:none;
  }


  input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    height: 30px;
    width: 30px;
    margin-left: .4em;
    background: url('../assets/images/common/icon-close.svg') center no-repeat;
    cursor: pointer;
  }

  .dropdown-menu {
    overflow: scroll;
    top: -3px;
  }

  // Убираем ширину полос прокрутки
  .overflow-y::-webkit-scrollbar {
      width: 0;
      height: 0;
  }

  .radio-toolbar-wrapper {
    overflow-x: scroll;
    padding: 10px 0;
    -ms-overflow-style: none;
    // scrollbar-width: none;
  }

  // Убираем ширину полос прокрутки
  .radio-toolbar-wrapper::-webkit-scrollbar {
      width: 0;
      height: 0;
  }

  .radio-toolbar_item {
    margin-left: 15px;
  }

  .radio-toolbar_item:first-child {
    margin-left: 0;
  }

  .radio-toolbar_item label {
    background-color: #f1f1f1;
    border-radius: 100%;
  }

  .radio-toolbar_item-img {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    margin: 0 auto;
    background-color: #f1f1f1;
    border-radius: 100%;
  }

  .radio-toolbar_item-img img {
    width: 80%;
    height: 80%;
  }

  input[type="radio"] {
    display: none;
  }

  input[type="radio"]:checked + label .radio-toolbar_item-img {
    background: #4785E7;
    border-radius: 100%;
  }

  input[type="radio"]:checked + label .radio-toolbar_item-title {
    color: #4785E7;
  }

  .subject-quantity_btn {
    width: 36px;
    height: 36px;
    background-color: #4785E7;
    color: white;
    border-radius: 100%;
  }

  .subject-quantity {
    align-items: center;
  }

  .btn_disabled {
    background-color: #f1f1f1;
  }

  .subject-wrapper {
    border-bottom: 1px solid #f1f1f1;
    margin-top: 10px;
  }

  .totalMenu {
    height: 70vh;
    background: #f1f1f1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .shading_background {
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(2px);
  }

// Если не пригодится - удалить
  // .deal-details {
  //   height: 100%;
  //   overflow-y: scroll;
  // }

  .deal_information_inputs {
    position: fixed;
    padding: 0 1rem;
  }

  .totalMenu-more_arrow {
    width: 17px;
    height: 17px;
    padding: 2px;
    // background-color: white;
    border-radius: 100%;
  }

  .more-arrow_icon {
    width: 100%;
    height: 100%;
  }

  .more_arrow_icon_closed_menu {
    transform: rotate(270deg);
  }

  .more_arrow_icon_opened_menu {
    transform: rotate(90deg);
  }

  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    width: 50%;
  }

  // Chrome, Safari, Opera, and Edge Chromium
  input[type="range"]::-webkit-slider-runnable-track {
    background: #D8E7FF;
    height: 0.5rem;
    border-radius: 10px;
  }

  // Firefox
  input[type="range"]::-moz-range-track {
    background: #D8E7FF;
    height: 0.5rem;
    border-radius: 10px;
  }

  // Thumb Styles
  // Chrome, Safari, Opera, and Edge Chromium
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    margin-top: -12px; /* Centers thumb on the track */
    background: url('../assets/images/deals/orders/brownies.png');
    background-color: #4785E7;
    height: 32px;
    width: 32px;  
    border-radius: 50%;  
  }

  // Firefox
  input[type="range"]::-moz-range-thumb {
    border: none; /*Removes extra border that FF applies*/
    border-radius: 0; /*Removes default border-radius that FF applies*/
    background-color: #4785E7;
    height: 32px;
    width: 32px;  
    border-radius: 50%; 
  }

  input[type="range"]:focus {
    outline: none;
  }


  /***** Chrome, Safari, Opera, and Edge Chromium *****/
  //input[type="range"]:focus::-webkit-slider-thumb {
  //  border: 1px solid #053a5f;
  //  outline: 3px solid #053a5f;
  //  outline-offset: 0.125rem;
  //}

  /******** Firefox ********/
  //input[type="range"]:focus::-moz-range-thumb {
  //  border: 1px solid #053a5f;
  //  outline: 3px solid #053a5f;
  //  outline-offset: 0.125rem;     
  //}

  .custom-checkbox {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }

  .custom-checkbox+label {
    display: inline-flex;
    align-items: center;
    user-select: none;
  }
  .custom-checkbox+label::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    flex-grow: 0;
    border: 1px solid #838383;
    border-radius: 0.25em;
    margin-right: 0.5em;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 50% 50%;
  }

  .custom-checkbox:checked+label::before {
    border-color: #4785E7;
    background-color: #4785E7;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
  }

  // Если не пригодится - удалить
  // .deal-subject_wrapper {
  //   margin-top: -10px;
  //   border-top: none;
  // }

  .img-wrapper {
    width: 72px;
    height: 72px;
    margin: 0 auto
  }

  img {
    width: 100%;
    height: 100%;
  }

  .shading_background {
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(2px);
  }

  .item_fixed {
    position: fixed;
    width: 100%;
    z-index: 20;
  }

  // Потом удали
  // .item_fixed:after {
  //   content: '';
  //   position: fixed;
  //   z-index: 25;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100vh;
  //   background-color: rgba(0, 0, 0, 0.7);
  //   backdrop-filter: blur(2px);
  // }

</style>

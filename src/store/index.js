// import { createStore } from 'vuex'

// export default createStore({
//   state: {
//   },
//   getters: {
//   },
//   mutations: {
//   },
//   actions: {
//   },
//   modules: {
//   }
// })

import { reactive } from "vue";
import { supabase } from '../supabase/init';
import { sortAlphabetically  } from '../helpers/sortMyContacts.js';
import { clipboardOutline, calendarOutline, peopleOutline, leafOutline, pricetagsOutline, cubeOutline } from 'ionicons/icons';

const state = reactive({
  // user
  user: null,
  userEmail: null,
  // Валюты в сервисе
  systemCurrency: {
    name: 'RUB',
    translation: 'Рубль'
  },
  // Варианты chip в прайс-листе
  priceChipList: [
    {
      value: 'products',
      name: 'Продукты'
    },
    {
      value: 'attributes',
      name: 'Доп. атрибуты'
    }
  ],
  // Список модулей для отображения в меню
  menuList : [
      {
        name: 'Calendar',
        title: 'Календарь',
        icon: calendarOutline
      },
      {
          name: 'Deals',
          title: 'Все дела',
          icon: clipboardOutline
      },
      {
          name: 'Contacts',
          title: 'Мои контакты',
          icon: peopleOutline
      },
      {
        name: 'Recipes',
        title: 'Мои рецепты',
        icon: leafOutline
      },
      {
        name: 'MyPrice',
        title: 'Мой прайс-лист',
        icon: pricetagsOutline
      },
      {
        name: 'Warehouse',
        title: 'Мой склад',
        icon: cubeOutline
      }
  ],
  // user price list
  userSettings: [],
  // contact array in page Contacts
  myContactsArray: [],
  // deals array in page Deals
  myDealsArray: [],
  // deals type array (Для фильтра дел в экране deals)
  dealTypes: [
    {
      name: 'Все',
      value: 'all'
    },
    {
      name: 'Продажи',
      value: 'sale'
    },
    {
      name: 'Закупки',
      value: 'buy'
    }
  ],
  newDealTypes: [
    {
      name: 'Продажи',
      value: 'sale'
    },
    {
      name: 'Закупки',
      value: 'buy'
    }
  ],
  // phone types array in page my contact 
  myContactPhoneEmailTypes: [
    { name: 'Личный',
      value: 'Личный'
    }, 
    { name: 'Рабочий',
      value: 'Рабочий' 
    }
  ],
  // social networks array in page my contact
  myContactSocialNetworksType: [
    { name:'Инстаграм',
      value: 'Instagram' 
    }, 
    { name: 'Вконтакте',
      value: 'Vkontakte' 
    }, 
    { name: 'Телеграм',
      value: 'Telegram' 
    }, 
    // { value: 'Odnoklassniki' }, { value: 'Twitter' }
  ],
  // deal status list
  dealStatusList: [
    {
      name: 'Бронь даты',
      value: 'deal-in-booking',
      caption: 'Нет забронированных дат',
      text: 'Создайте дело и укажите дату'
    },
    {
      name: 'В процессе',
      value: 'deal-in-process',
      caption: 'Где дела в процессе?',
      text: 'Займитесь уже делами'
    },
    {
      name: 'В доставке',
      value: 'deal-in-delivery',
      caption: 'А как же доставка?',
      text: 'Никто ничего не доставляет'
    },
    {
      name: 'Долг',
      value: 'deal-in-debt',
      caption: 'У вас нет дел с долгами',
      text: 'Никто никому ничего не должен'
    },
    {
      name: 'Завершен',
      value: 'deal-complete',
      caption: 'Где завершенные дела?',
      text: 'Кажется, беретесь и не доделываете?'
    },
    {
      name: 'Отменен',
      value: 'deal-cancelled',
      caption: 'Ни одного отмененного дела!',
      text: 'Вы супер! Так держать!'
    }
  ],
  //
  priceEstimataionType: [
    {
      value: 'perKilogram',
      name: 'кг.'
    },
    {
      value: 'per100gram',
      name: '100г.'
    },
    {
      value: 'perUnit',
      name: 'шт.'
    },

  ],
  //
  priceAttributeType: [
    {
      value: 'rent',
      name: 'Аренда',
    },
    {
      value: 'sale',
      name: 'Продажа',
    },
  ],
  //User recipes list
  userRecipeArray: [],
  // userRecipeArray: [
  //   {
  //       value: 'red-velvet',
  //       name: 'Красный бархат'
  //   },
  //   {
  //       value: 'milk-girl',
  //       name: 'Молочная девочка',
  //   },
  //   {
  //       value: 'swiss-meringue',
  //       name: 'Швейцарская меренга',
  //       category: ['meringue']
  //   },
  //   {
  //       value: 'banana-with-gouda',
  //       name: 'Банановый с гаудой',
  //       target: ['cake'],
  //       productSize: {
  //           concept: 'diameter',
  //           measure: 'centimeters',
  //           quantity: 17
  //       },
  //       ingredient: [
  //           {
  //               name: 'Шоколадно-банановый бисквит',
  //           }
  //       ]
  //   },
  //   {
  //     value: 'creamy-pear',
  //     name: 'Сливочная груша'
  //   }
  // ],
  // deal SALE Subject List
  // User warehouse list
  userWarehouseArray: [],
  // user finance from ledger
  userLedgerArray: [],
  //
  dealSaleSubjectArray: [
    {
      value: 'cake',
      name: 'Торт',
      costEstimation: 'perKilogram'
    },
    {
      value: 'wedding-cake',
      name: 'Свадебный торт',
      costEstimation: 'perKilogram'
    },
    {
      value: 'cupcake',
      name: 'Капкейк',
      costEstimation: 'perUnit'
    },
    {
      value: 'meringue-roll',
      name: 'Меренговый рулет',
      costEstimation: 'perUnit'
    },
    {
      value: 'brownies',
      name: 'Брауни',
      costEstimation: 'perUnit'
    },
    {
      value: 'meringue',
      name: 'Меренге (Безе)',
      costEstimation: 'perUnit'
    },
    {
      value: 'pavlova',
      name: 'Павлова',
      costEstimation: 'perUnit'
    },
    {
      value: 'cake-pop',
      name: 'Кейк-попсы',
      costEstimation: 'perUnit'
    },
    {
      value: 'cake-eskimos',
      name: 'Эскимошки',
      costEstimation: 'perUnit'
    },
    {
      value: 'trifle',
      name: 'Трайфл',
      costEstimation: 'perUnit'
    }
  ],
  // deal BUY subject list by DEALS
  dealBuySubjectArray: [
    {
      value: 'sugar',
      name: 'Сахар',
      costEstimation: 'perKilogram',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'cottage-cheese',
      name: 'Сливочный творожный сыр',
      costEstimation: 'perKilogram',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'sugar-powder',
      name: 'Сахарная пудра',
      costEstimation: 'per100gram',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'sugar-powder',
      name: "Сахарная пудра",
      costEstimation: "perKilogram",
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'assorted-nuts',
      name: 'Ассорти орехов (кешью, миндаль, фундук)',
      costEstimation: 'perKilogram',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'egg',
      name: 'Яйцо',
      costEstimation: 'perUnit',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'flour',
      name: 'Мука',
      costEstimation: 'perKilogram',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'cocoa',
      name: 'Какао',
      costEstimation: 'perKilogram',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'corn-starch',
      name: 'Кукурузный крахмал',
      costEstimation: 'perKilogram',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'salt',
      name: 'Соль',
      costEstimation: 'perKilogram',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'salt',
      name: "Соль",
      costEstimation: "teaSpoon",
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'salt',
      name: "Соль",
      costEstimation: "pinch",
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'vanilla',
      name: 'Ваниль',
      costEstimation: 'perKilogram',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'vanilla',
      name: "Ваниль",
      costEstimation: "stick",
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'sour-cream',
      name: 'Сметана',
      costEstimation: 'perKilogram',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'banana',
      name: 'Банан',
      costEstimation: 'perKilogram',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'banana',
      name: 'Банан',
      costEstimation: 'perUnit',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'baking-soda',
      name: 'Пищевая сода',
      costEstimation: 'perKilogram',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'baking-soda',
      name: "Пищевая сода",
      costEstimation: "teaSpoon",
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'vanilla-extract',
      name: 'Ванильный экстракт',
      costEstimation: 'perKilogram',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'vanilla-extract',
      name: "Ванильный экстракт",
      costEstimation: "teaSpoon",
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'cream',
      name: 'Сливки',
      costEstimation: 'perKilogram',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'cream',
      name: "Сливки (от 33%)",
      costEstimation: "perKilogram",
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'gouda-cheese',
      name: 'Сыр гауда',
      costEstimation: 'perKilogram',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'cheese',
      name: "Сыр",
      costEstimation: "perKilogram",
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'lemon-juice',
      name: 'Сок лимона',
      costEstimation: 'perKilogram',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'lemon-juice',
      name: "Сок лимона",
      costEstimation: "teaSpoon",
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'lemon-juice',
      name: 'Сок лимона',
      costEstimation: 'perUnit',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'gingerbread',
      name: 'Пряник',
      costEstimation: 'perUnit',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'box-for-cake',
      name: 'Коробка под торт',
      costEstimation: 'perUnit',
      isIngredient: false,
      warehouseSuitable: true,
    },
    {
      value: 'box-for-sweet',
      name: 'Коробка под сладости',
      costEstimation: 'perUnit',
      isIngredient: false,
      warehouseSuitable: true,
    },
    {
      value: 'butter',
      name: 'Сливочное масло',
      costEstimation: 'perKilogram',
      isIngredient: true,
      warehouseSuitable: true,
    },
    {
      value: 'other',
      name: 'Прочие услуги',
      costEstimation: 'perUnit',
      isIngredient: false,
      warehouseSuitable: false,
    },
    {
      value: 'employees-salary',
      name: 'Зарплата сотрудникам',
      costEstimation: 'perUnit',
      isIngredient: false,
      warehouseSuitable: false,
    },
  ],
  // type of Shipping
  shippingTypeList: [
    {
      value: 'shipping-pickup',
      name: 'Самовывоз'
    },
    {
      value: 'shipping-delivery',
      name: 'Доставка'
    }
  ],
  // list of additional attributes by DEALS
  additionalAttributesList: [
    {
      value: 'cake-stand',
      name: 'Аренда подставки',
    },
    {
      value: 'tableware',
      name: 'Аренда столовых приборов',
    },
    {
      value: 'cake-packing-box',
      name: 'Коробка для торта',
    },
    {
      value: 'cupcake-packing-box',
      name: 'Коробка для капкейков',
    },
    {
      value: 'dessert-packing-box',
      name: 'Коробка для десертов',
    },
    {
      value: 'drink',
      name: 'Напиток',
    }
  ],
  // Максимально допустимую скидку (устанавливается в настройках аккаунта)
  userDiscountRangeValue : [
    {
      name: 'min',
      value: 0
    },
    {
      name: 'max',
      value: 30
    }
  ],
  // Для возвратных позиций по атрибутам к предмету дела
  rentTypeInfo: [
    {
      name: 'Подлежит возврату',
      value: false
    },
    {
      name: 'Возвращен',
      value: true
    }
  ],
  // Переменные для кошелька
  availableBalance: 0,
  myDebt: 0,
  debtToMe: 0,
  // Варианты профилей
  userWorkProfileArray: ['Тортодилер', 'Автозапчасти'],
  // Переменные по складу
  // Массив возможных категорий для склада, которые предлагает сервис
  // (Вариант для Автозапчастей)
  autoWarehouseCategoriesArray: ['Без категории', 'Кузов', 'Электрика', 'Трансмиссия', 'Салон'],
  // (Вариант для Тортодилеров)
  cakeWarehouseCategoriesArray: ['Без категории', 'Сыпучие', 'Посуда'],
  // Переменные по моим рецептам
  // Массив возможных категорий для рецептов, которые предлагает сервис (Вариант для тортодиллера)
  recipesCategoriesArray: ['Без категории', 'Свадебные', 'Торты', 'Бисквитные', 'Муссовые', 'Цифра', 'Капкейки', 'Кейк-попсы', 'Зефир', 'Леденцы', 'Макаронс', 'Меренге (безе)', 'Брауни', 'Павлова', 'Эскимошки', 'Трайфлы', 'Детские'],
  storeRecipesArray: [],
  // Все пользватели сервиса
  usersArray: []
});

const methods = {
  // Расчитываем балансы кошельке пользвоателя
  calculateBalance(myDeals) {
    // Массив сумм, которые мне уже вносили по делам продаж
    let payMeArray = [];
    let payMe = 0;
    // Массив сумм, которые я уже вносил по делам закупок
    let iPayArray = [];
    let iPay = 0;
    // Массив моих задолженностей
    let myDebtsArray = [];
    let myDebts = 0;
    // Массив покупательских задолженностей
    let debtsToMeArray = [];
    let debtsToMe = 0;
    //
    myDeals.forEach(item => {
      if(item.dealType === 'sale') {
          payMeArray.push(item.dealPaid);
          debtsToMeArray.push(item.totalDealPrice - item.dealPaid);
      } else if (item.dealType === 'buy') {
          iPayArray.push(item.dealPaid);
          myDebtsArray.push(item.totalDealPrice - item.dealPaid);
      }
    });
    // суммируем значения в массивах, считаем текущий баланс
    payMe = payMeArray.reduce((a, b) => a + b, 0);
    iPay = iPayArray.reduce((a, b) => a + b, 0);
    state.availableBalance = payMe - iPay;
    // store.methods.setAvailableBalanceValue(payMe, iPay)
    // 
    myDebts = myDebtsArray.reduce((a, b) => a + b, 0);
    state.myDebt = myDebts;
    //
    debtsToMe = debtsToMeArray.reduce((a, b) => a + b, 0);
    state.debtToMe = debtsToMe ;
  },
  // Устанавливаем пользователя
  setUser(payload) {
    state.user = payload ? payload.user : null;
  },
  // Забираем из БД списки дел
  getMyDealsFromBD: async () => {
    const { data: myDeals, error } = await supabase.from('deals').select('*');
    if(error) throw error;
    // Устанавливаем значение переменной myDealsArray в state
    state.myDealsArray = myDeals;
  },
  // Забираем из БД списки контактов
  getMyContactsFromDB: async () => {
    try {
      const { data: myContacts, error } = await supabase.from('myContacts').select('*');
      if (error) throw error;
      // Сортируем по алфавиту
      sortAlphabetically(myContacts);
      // Устанавливаем значение переменной myContactsArray в state
      state.myContactsArray = myContacts;
    } catch (error) {
      console.log(error);
    }
  },
  // Забираем из БД user price list
  getUserSettingsfromDB: async () => {
    try {
      let { data: accountSettings, error } = await supabase.from('accountSettings').select('*');
      if (error) throw error;
      const userSettings = accountSettings;
      state.userSettings = userSettings.filter(item => {
        return item.email === state.userEmail;
      });
    } catch (error) {
      console.log(error);
    }
  },
  // Забираем из БД user recipes list
  getUserRecipesFromBD: async () => {
      let { data: userRecipes, error } = await supabase.from('userRecipes').select('*');
      if (error) throw error;
      // Устанавливаем значение переменной userRecipeArray в state
      state.userRecipeArray = userRecipes;
  },
  // Забирвем из БД user warehouse item list
  getUserWarehouseItemsFromDB: async () => {
    let {data: userWarehouse, error } = await supabase.from('userWarehouse').select('*');
    if(error) throw error;
    state.userWarehouseArray = userWarehouse;
  },
  // Забираем из БД user ledger finance list
  getUserLedger: async () => {
    let { data: userLedger, error } = await supabase.from('ledger').select('*');
    if(error) throw error;
    state.userLedgerArray = userLedger.reverse();
    //userLedgerArray
  },
  // Забираем из БД store recipes list (магазин рецептов)
  getStoreRecipes: async () => {
    let { data: storeRecipes, error } = await supabase.from('storeRecipes').select('*');
    if(error) throw error;
    state.storeRecipesArray = storeRecipes
  },
  // Забираем из БД всех users
  getUsers: async () => {
    try {
        let { data: allUsers, error } = await supabase.from('accountSettings').select('*');
        if (error) throw error;
        state.usersArray = allUsers
    } catch (error) {
        console.log(error);
    }
  },
  //
  setUserEmail: () => {
    if(state.user) {
      state.userEmail = state.user.email;
    }
  },
};

export default {
  state,
  methods,
};
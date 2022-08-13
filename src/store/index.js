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
import { clipboardOutline, calendarOutline, peopleOutline, leafOutline, pricetagsOutline } from 'ionicons/icons';

const state = reactive({
  // user
  user: null,
  userEmail: null,
  // Список модулей для отображения в меню
  menuList : [
      {
          name: 'Deals',
          title: 'Все мои дела',
          icon: clipboardOutline
      },
      {
          name: 'Calendar',
          title: 'Календарь',
          icon: calendarOutline
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
  //User recipes list
  userRecipeArray: [
    {
        value: 'red-velvet',
        name: 'Красный бархат'
    },
    {
        value: 'milk-girl',
        name: 'Молочная девочка',
    },
    {
        value: 'swiss-meringue',
        name: 'Швейцарская меренга',
        target: ['meringue']
    },
    {
        value: 'banana-with-gouda',
        name: 'Банановый с гаудой',
        target: ['cake'],
        productSize: {
            concept: 'diameter',
            measure: 'centimeters',
            quantity: 17
        },
        ingredient: [
            {
                name: 'Шоколадно-банановый бисквит',
            }
        ]
    },
  ],
  // deal SALE Subject List
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
  ],
  // deal BUY subject list
  dealBuySubjectArray: [
    {
      value: 'sugar',
      name: 'Сахар',
      // costEstimation: 'perKilogram'
    },
    {
      value: 'cottage-cheese',
      name: 'Сливочный творожный сыр',
      // costEstimation: 'perKilogram'
    },
    {
      value: 'sugar-powder',
      name: 'Сахарная пудра',
      // costEstimation: 'perKilogram'
    },
    {
      value: 'nuts',
      name: 'Орехи',
      // costEstimation: 'perKilogram'
    },
    {
      value: 'egg',
      name: 'Яйцо',
      // costEstimation: 'perUnit'
    },
    {
      value: 'flour',
      name: 'Мука',
      // costEstimation: 'perKilogram'
    },
    {
      value: 'cocoa',
      name: 'Какао',
      // costEstimation: 'perKilogram'
    },
    {
      value: 'corn-starch',
      name: 'Кукурузный крахмал',
      // costEstimation: 'perKilogram'
    },
    {
      value: 'salt',
      name: 'Соль',
      // costEstimation: 'perKilogram'
    },
    {
      value: 'vanilla',
      name: 'Ваниль',
      // costEstimation: 'perKilogram'
    },
    {
      value: 'sour-cream',
      name: 'Сметана',
      // costEstimation: 'perKilogram'
    },
    {
      value: 'banana',
      name: 'Банан',
      // costEstimation: 'perKilogram'
    },
    {
      value: 'baking-soda',
      name: 'Пищевая сода',
      // costEstimation: 'perKilogram'
    },
    {
      value: 'vanilla-extract',
      name: 'Ванильный экстракт',
      // costEstimation: 'perKilogram'
    },
    {
      value: 'cream',
      name: 'Сливки',
      // costEstimation: 'perKilogram'
    },
    {
      value: 'gouda-cheese',
      name: 'Сыр гауда',
      // costEstimation: 'perKilogram'
    },
    {
      value: 'lemon-juice',
      name: 'Сок лимона',
      // costEstimation: 'perKilogram'
    },
    {
      value: 'lemon-juice',
      name: 'Сок лимона',
      // costEstimation: 'perUnit'
    },
    {
      value: 'gingerbread',
      name: 'Пряник',
      costEstimation: 'perUnit'
    },
    {
      value: 'box-for-cake',
      name: 'Коробка под торт',
      costEstimation: 'perUnit'
    },
    {
      value: 'box-for-sweet',
      name: 'Коробка под сладости',
      costEstimation: 'perUnit'
    },
  ]
});

const methods = {
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
  } ,
  //
  setUserEmail: () => {
    if(state.user) {
      state.userEmail = state.user.email;
    }
  }
};

export default {
  state,
  methods,
};
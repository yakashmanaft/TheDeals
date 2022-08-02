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
import { clipboardOutline, calendarOutline, peopleOutline } from 'ionicons/icons';

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
  ],
  // contact array in page Contacts
  myContactsArray: [],
  // deals array in page Deals
  myDealsArray: [],
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
      name: 'Готовлю',
      value: 'deal-in-process',
      caption: 'Где дела в процессе?',
      text: 'Создайте дело и приступайте'
    },
    {
      name: 'В доставке',
      value: 'deal-in-delivery',
      caption: 'А как же доставка?',
      text: 'Сделали дело, доставьте товар'
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
      text: 'Кажется, вы беретесь и не доделываете...'
    },
    {
      name: 'Отменен',
      value: 'deal-cancelled',
      caption: 'Ни одного отмененного дела!',
      text: 'Вы супер! Так держать!'
    }
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
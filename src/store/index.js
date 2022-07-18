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

const state = reactive({
  // user
  user: null,
  userEmail: null,
  // contact array in page Contacts
  myContactsArray: [],
  // deals array in page Deals
  myDealsArray: [],
  // phone types array in page my contact 
  myContactPhoneEmailTypes: [
    { value: 'Личный' }, { value: 'Рабочий' }
  ],
  // social networks array in page my contact
  myContactSocialNetworksType: [
    { value: 'Instagram' }, { value: 'Vkontakte' }, { value: 'Telegram' }, 
    // { value: 'Odnoklassniki' }, { value: 'Twitter' }
  ],
  // deal status list
  dealStatusList: [
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
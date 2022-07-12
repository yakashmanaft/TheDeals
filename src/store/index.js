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
  // Было для фона, чтобы не прокурчивался при открытом попапе
  // isBackgroundFixed: false

  // contact array
  myContactsArray: [],
});

const methods = {
  // Устанавливаем пользователя
  setUser(payload) {
    state.user = payload ? payload.user : null;
  },
  // Было для фона, чтобы не прокурчивался при открытом попапе
  // backgroundFixed() {
  //   state.isBackgroundFixed = !state.isBackgroundFixed;
  // }
  
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
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

const state = reactive({
  user: null,
  // Было для фона, чтобы не прокурчивался при открытом попапе
  // isBackgroundFixed: false
});

const methods = {
  setUser(payload) {
    state.user = payload ? payload.user : null;
  },
  // Было для фона, чтобы не прокурчивался при открытом попапе
  // backgroundFixed() {
  //   state.isBackgroundFixed = !state.isBackgroundFixed;
  // }
};

export default {
  state,
  methods,
};
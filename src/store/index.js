import { reactive } from "vue";

const state = reactive({
  user: null,
  isBackgroundFixed: false
});

const methods = {
  setUser(payload) {
    state.user = payload ? payload.user : null;
  },
  backgroundFixed() {
    state.isBackgroundFixed = !state.isBackgroundFixed;
  }
};

export default {
  state,
  methods,
};
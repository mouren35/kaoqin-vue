import { createStore, useStore as baseUseStore } from "vuex";
import type { Store } from "vuex";
import users from "./modules/users";
import signs from "./modules/signs";
import checks from "./modules/checks";
import news from "./modules/news";
import type { UsersState } from "./modules/users";
import type { SignsState } from "./modules/signs";
import type { ChecksState } from "./modules/checks";
import type { NewsState } from "./modules/news";
import type { InjectionKey } from "vue";
import VuexPersistence from "vuex-persist";

export interface State {}

export interface StateAll extends State {
  users: UsersState;
  signs: SignsState;
  checks: ChecksState;
  news: NewsState;
}

const vuexLocal = new VuexPersistence<State>({
  storage: window.localStorage,
  reducer: (state) => ({ users: { token: (state as StateAll).users.token } }),
});

// 1. 导出 key
// 把StateAll挂到key上,让store有提示
export const key: InjectionKey<Store<StateAll>> = Symbol();

// 3. 重写 useStore
export function useStore() {
  return baseUseStore(key); // key放进去然后导出useStore,其他文件导入useStore就有提示
}

// createStore<State>推断mutations和actions的类型
export default createStore({
  state: {},
  getters: {},
  // mutations和actions就会自动进行类型推断
  mutations: {},
  actions: {},
  modules: {
    users,
    signs,
    checks,
    news,
  },
  plugins: [vuexLocal.plugin],
});

import http from "@/utils/http";
// 手动导入类型
import type { MutationTree, ActionTree, GetterTree } from "vuex";
import type { State } from "../index";

interface Infos {
  [index: string]: unknown;
}

export interface UsersState {
  token: string;
  infos: Infos;
}

const state: UsersState = {
  token: "",
  infos: {},
};

// 没有用createStore,所以这里的类型推断需要手动写,类型要手动导入
const mutations: MutationTree<UsersState> = {
  updateToken(state, payload) {
    state.token = payload;
  },
  updateInfos(state, payload) {
    state.infos = payload;
  },
  // 清空token
  clearToken(state) {
    state.token = "";
  },
};
const actions: ActionTree<UsersState, State> = {
  login(context, payload) {
    return http.post("/users/login", payload);
  },
  // 用来获取用户信息
  infos() {
    return http.get("/users/infos");
  },
};
const getters: GetterTree<UsersState, State> = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

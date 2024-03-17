import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import store from "@/store";
import type { StateAll } from "@/store";
import { ElMessage } from "element-plus";
import router from "@/router";

// 1. 创建 axios 实例
const instance = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 5000,
});

// 2. 添加拦截器
instance.interceptors.request.use(
  function (config) {
    if (config.headers) {
      config.headers.authorization = (store.state as StateAll).users.token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  // 统一管理token过期和服务器错误
  function (response) {
    if (response.data.errmsg === "token error") {
      ElMessage.error("token error");
      // 清空token
      store.commit("users/clearToken");
      // 等弹窗弹完再刷新页面
      setTimeout(() => {
        // 跳转到登录页，还原共享状态
        window.location.replace("/login");
      }, 1000);
    } else if (response.data.errmsg === "error") {
      router.push("/500");
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// data不知道是什么类型，所以使用索引签名
interface Data {
  [index: string]: unknown;
}

interface Http {
  // config类型是根据axios每个请求方法的参数类型来配置的,返回结果也是
  get: (url: string, data?: Data, config?: AxiosRequestConfig) => Promise<AxiosResponse>;
  post: (url: string, data?: Data, config?: AxiosRequestConfig) => Promise<AxiosResponse>;
  put: (url: string, data?: Data, config?: AxiosRequestConfig) => Promise<AxiosResponse>;
  patch: (url: string, data?: Data, config?: AxiosRequestConfig) => Promise<AxiosResponse>;
  delete: (url: string, data?: Data, config?: AxiosRequestConfig) => Promise<AxiosResponse>;
}

// 3. 对接口做统一处理
const http: Http = {
  get(url, data, config) {
    return instance.get(url, {
      params: data, // axios 的 params 是用来传递 query 参数的
      ...config, // 这里的 config 是用来传递 headers 等配置的
    });
  },
  post(url, data, config) {
    return instance.post(url, data, config);
  },
  put(url, data, config) {
    return instance.put(url, data, config);
  },
  patch(url, data, config) {
    return instance.patch(url, data, config);
  },
  delete(url, data, config) {
    return instance.delete(url, {
      data,
      ...config,
    });
  },
};

export default http;

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store, { key } from "./store"; // 2.引入key
// 引入element-plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// 1.引入element-plus的图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";

const app = createApp(App);

// 2.注册element-plus的图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus, { locale: zhCn }).use(store, key).use(router).mount("#app");

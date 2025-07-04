import { createApp } from "vue";
import pinia from "./plugins/pinia";
import App from "./App.vue";

const app = createApp(App);
app.use(pinia);
app.mount("#app");

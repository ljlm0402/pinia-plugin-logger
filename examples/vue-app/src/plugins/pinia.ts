import { createPinia } from "pinia";
import piniaPluginLogger from "pinia-plugin-logger";

const pinia = createPinia();
const logger = piniaPluginLogger({
  enabled: true,
  expanded: true,
  showStoreName: true,
  showTimestamp: true,
});

pinia.use(logger);

export default pinia;

import { createPinia } from "pinia";
import piniaPluginLogger from "pinia-plugin-logger";

const pinia = createPinia();
const logger = piniaPluginLogger({
  enabled: true, // 로거 활성화
  expanded: true, // 기본적으로 확장된 상태로 로그 표시
  showStoreName: true, // 스토어 이름 표시
  showTimestamp: true, // 타임스탬프 표시
  showDuration: true, // 실행 시간 표시
  deepClone: true,    // 깊은 복사 활성화
  maxDepth: 5,        // 최대 깊이 제한
  showErrors: true, // 에러 로그 표시
  // 상태 변환 예제 (민감한 정보 마스킹)
  // stateTransformer: (state: any) => {
  //   if (state.user?.password) {
  //     return { ...state, user: { ...state.user, password: '***' } }
  //   }
  //   return state
  // }
});

pinia.use(logger);

export default pinia;

/*****************************************************************
 * Pinia Plugin Logger - Logger Plugin for Pinia
 * (c) 2025-present AGUMON (https://github.com/ljlm0402/pinia-plugin-logger)
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the project root for more information.
 *
 * Made with ❤️ by AGUMON 🦖
 *****************************************************************/

import type {
  PiniaPluginContext,
  StoreActions,
  StoreGeneric,
  _ActionsTree,
  _StoreOnActionListenerContext,
} from "pinia";

type KeyOfStoreActions<Store> = keyof StoreActions<Store>;
type PiniaActionListenerContext = _StoreOnActionListenerContext<
  StoreGeneric,
  string,
  _ActionsTree
>;

/**
 * 로거 인터페이스
 * 커스텀 로거를 구현할 때 사용
 */
interface Logger {
  log(message: string, style?: string, payload?: unknown): void;
  group(message: string, style?: string, payload?: unknown): void;
  groupCollapsed(message: string, style?: string, payload?: unknown): void;
  groupEnd(): void;
}

/**
 * Pinia 로거 플러그인 옵션
 */
export interface PiniaLoggerOptions {
  /**
   * @default true
   * @description 로거 활성화 여부
   */
  enabled?: boolean;
  /**
   * @default true
   * @description 로그 그룹을 펼친 상태로 표시할지 여부
   */
  expanded?: boolean;
  /**
   * @default true
   * @description 스토어 이름 표시 여부
   */
  showStoreName?: boolean;
  /**
   * @default true
   * @description 타임스탬프 표시 여부
   */
  showTimestamp?: boolean;
  /**
   * @default true
   * @description 에러 발생 시 로깅 여부
   */
  showErrors?: boolean;
  /**
   * @default false
   * @description 실행 시간 표시 여부
   */
  showDuration?: boolean;
  /**
   * @default []
   * @description 포함할 액션 목록 (지정 시 이 액션들만 로깅)
   */
  includeActions?: KeyOfStoreActions<StoreGeneric>[];
  /**
   * @default []
   * @description 제외할 액션 목록
   */
  excludeActions?: KeyOfStoreActions<StoreGeneric>[];
  /**
   * @default undefined
   * @description 액션 필터링을 위한 커스텀 함수
   */
  filter?: (action: PiniaActionListenerContext) => boolean;
  /**
   * @default console
   * @description 커스텀 로거 (기본값: console)
   */
  logger?: Logger;
  /**
   * @default false
   * @description 깊은 복사 사용 여부 (성능 영향 있음)
   */
  deepClone?: boolean;
  /**
   * @default Infinity
   * @description 상태 로깅 시 최대 깊이
   */
  maxDepth?: number;
  /**
   * @default undefined
   * @description 로깅 전 상태를 변환하는 함수
   */
  stateTransformer?: (state: unknown) => unknown;
  /**
   * @default 'debug'
   * @description 로그 레벨
   */
  logLevel?: "debug" | "info" | "warn" | "error";
}

/**
 * 기본 옵션 값
 */
const defaultOptions: PiniaLoggerOptions = {
  enabled: true,
  expanded: true,
  showStoreName: true,
  showTimestamp: true,
  showErrors: true,
  showDuration: false,
  includeActions: [],
  excludeActions: [],
  filter: () => true,
  logger: console,
  deepClone: false,
  maxDepth: Infinity,
  stateTransformer: undefined,
  logLevel: "debug",
};

/**
 * 타임스탬프를 HH:MM:SS:mmm 형식으로 포맷팅
 * @param date - 포맷팅할 날짜 객체
 * @returns 포맷팅된 타임스탬프 문자열
 */
function getTimeStamp(date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const ms = date.getMilliseconds().toString().padStart(3, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}:${ms}`;
}

/**
 * 객체를 깊은 복사하는 함수
 * 순환 참조와 다양한 객체 타입을 처리
 * @param obj - 복사할 객체
 * @param depth - 현재 깊이
 * @param maxDepth - 최대 허용 깊이
 * @param seen - 순환 참조 감지를 위한 WeakMap
 * @returns 깊은 복사된 객체
 */
function deepClone<T>(
  obj: T,
  depth = 0,
  maxDepth = Infinity,
  seen = new WeakMap()
): T {
  // null이거나 원시 타입인 경우 그대로 반환
  if (obj === null || typeof obj !== "object") return obj;

  // 최대 깊이를 초과한 경우 '[Max Depth Reached]' 반환
  if (depth >= maxDepth) return "[Max Depth Reached]" as T;

  // 순환 참조 감지
  if (seen.has(obj as object)) return "[Circular Reference]" as T;

  // Date 객체 처리
  if (obj instanceof Date) return new Date(obj.getTime()) as T;

  // RegExp 객체 처리
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags) as T;

  // 배열 처리
  if (obj instanceof Array) {
    seen.set(obj as object, true);
    return obj.map((item) => deepClone(item, depth + 1, maxDepth, seen)) as T;
  }

  // Map 처리
  if (obj instanceof Map) {
    const clonedMap = new Map();
    seen.set(obj as object, true);
    obj.forEach((value, key) => {
      clonedMap.set(key, deepClone(value, depth + 1, maxDepth, seen));
    });
    return clonedMap as T;
  }

  // Set 처리
  if (obj instanceof Set) {
    const clonedSet = new Set();
    seen.set(obj as object, true);
    obj.forEach((value) => {
      clonedSet.add(deepClone(value, depth + 1, maxDepth, seen));
    });
    return clonedSet as T;
  }

  // 일반 객체 처리
  if (obj instanceof Object) {
    seen.set(obj as object, true);
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key], depth + 1, maxDepth, seen);
      }
    }
    return clonedObj;
  }

  return obj;
}

/**
 * 상태 객체를 복사하는 함수
 * 옵션에 따라 얕은 복사 또는 깊은 복사를 수행
 * @param state - 복사할 상태 객체
 * @param options - 플러그인 옵션
 * @returns 복사된 상태 객체
 */
function cloneState(state: unknown, options: PiniaLoggerOptions): unknown {
  if (options.deepClone) {
    return deepClone(state, 0, options.maxDepth);
  }
  
  // 얕은 복사 (기존 방식)
  if (state && typeof state === "object") {
    return { ...state };
  }
  
  return state;
}

/**
 * 상태를 로깅 전에 변환하는 함수
 * stateTransformer 옵션이 정의된 경우 사용
 * @param state - 변환할 상태
 * @param options - 플러그인 옵션
 * @returns 변환된 상태
 */
function transformState(state: unknown, options: PiniaLoggerOptions): unknown {
  if (typeof options.stateTransformer === "function") {
    try {
      return options.stateTransformer(state);
    } catch (error) {
      console.warn("State transformer failed:", error);
      return state;
    }
  }
  return state;
}

/**
 * 두 상태가 실제로 변경되었는지 확인하는 함수
 * @param prevState - 이전 상태
 * @param nextState - 다음 상태
 * @returns 상태 변경 여부
 */
function hasStateChanged(prevState: unknown, nextState: unknown): boolean {
  try {
    return JSON.stringify(prevState) !== JSON.stringify(nextState);
  } catch {
    // JSON 직렬화 실패 시 항상 변경된 것으로 간주
    return true;
  }
}

/**
 * Pinia 스토어 옵션에 logger 속성 추가
 */
declare module "pinia" {
  export interface DefineStoreOptionsBase<S, Store> {
    logger?: boolean | PiniaLoggerOptions;
  }
}

/**
 * Pinia Plugin Logger
 * Pinia 스토어의 액션을 자동으로 로깅하는 플러그인
 * 
 * @param config - 전역 로거 설정
 * @returns Pinia 플러그인 함수
 * 
 * @example
 * ```typescript
 * import { createPinia } from 'pinia'
 * import PiniaPluginLogger from 'pinia-plugin-logger'
 * 
 * const pinia = createPinia()
 * pinia.use(PiniaPluginLogger({
 *   expanded: true,
 *   deepClone: true,
 *   showDuration: true
 * }))
 * ```
 */
const PiniaPluginLogger =
  (config: PiniaLoggerOptions = defaultOptions) =>
  (ctx: PiniaPluginContext) => {
    // 옵션 병합: 기본값 < 전역 설정 < 스토어별 설정
    const options: PiniaLoggerOptions = {
      ...defaultOptions,
      ...config,
      ...(typeof ctx.options.logger === "object" ? ctx.options.logger : {}),
    };

    // 로거가 비활성화되었거나 스토어별로 false로 설정된 경우 종료
    if (!options.enabled || ctx.options.logger === false) return;

    const logger = options.logger || console;

    // 스토어의 모든 액션에 대해 리스너 등록
    ctx.store.$onAction((action: PiniaActionListenerContext) => {
      // 포함할 액션 목록이 정의되어 있고, 현재 액션이 포함되지 않은 경우 필터링
      if (
        Array.isArray(options.includeActions) &&
        options.includeActions.length > 0 &&
        !(options.includeActions as string[]).includes(action.name)
      )
        return;
      
      // 제외할 액션 목록에 현재 액션이 포함된 경우 필터링
      if (
        Array.isArray(options.excludeActions) &&
        options.excludeActions.length > 0 &&
        (options.excludeActions as string[]).includes(action.name)
      )
        return;
      
      // 커스텀 필터 함수가 false를 반환하면 필터링
      if (typeof options.filter === "function" && !options.filter(action))
        return;

      // 액션 실행 전 상태 스냅샷 생성
      const prevState = cloneState(ctx.store.$state, options);
      
      // 액션 시작 시간 기록
      const startTime = Date.now();
      
      // 로그 타이틀 생성 (타임스탬프, 스토어 이름 포함 여부 확인)
      const time = options.showTimestamp ? ` @${getTimeStamp()}` : "";
      const storeName = options.showStoreName ? ` [${action.store.$id}]` : "";

      /**
       * 액션 실행 결과를 로깅하는 내부 함수
       * @param isError - 에러 발생 여부
       * @param error - 발생한 에러 객체
       */
      const logAction = (isError?: boolean, error?: unknown) => {
        // 액션 실행 후 상태 스냅샷 생성
        const nextState = cloneState(ctx.store.$state, options);
        
        // 실행 시간 계산
        const duration = Date.now() - startTime;
        const durationText = options.showDuration ? ` (${duration}ms)` : "";
        
        // 상태 변경 여부 확인
        const stateChanged = hasStateChanged(prevState, nextState);
        
        // 로그 타이틀 구성
        const title = `action 🍍${storeName} ${action.name}${time}${durationText}${isError ? " ❌" : stateChanged ? " ✅" : " ⚪"}`;
        
        // 로그 그룹 시작
        logger[options.expanded ? "group" : "groupCollapsed"](
          `%c${title}`,
          `font-weight: bold; ${isError ? "color: #ed4981;" : stateChanged ? "color: #4caf50;" : "color: #999;"}`
        );
        
        // 이전 상태 로깅
        logger.log(
          "%cprev state",
          "font-weight: bold; color: grey;",
          transformState(prevState, options)
        );
        
        // 액션 정보 로깅
        logger.log("%caction", "font-weight: bold; color: #69B7FF;", {
          type: action.name,
          args: action.args.length > 0 ? { ...action.args } : undefined,
          ...(options.showStoreName && { store: action.store.$id }),
          ...(options.showDuration && { duration: `${duration}ms` }),
          ...(isError && { error }),
        });
        
        // 다음 상태 로깅
        logger.log(
          "%cnext state",
          `font-weight: bold; color: ${stateChanged ? "#4caf50" : "#999"};`,
          transformState(nextState, options)
        );
        
        // 상태 변경 정보 추가
        if (!stateChanged) {
          logger.log(
            "%cℹ️ No state changes",
            "font-weight: normal; color: #999; font-style: italic;"
          );
        }
        
        // 로그 그룹 종료
        logger.groupEnd();
      };

      // 액션 성공 후 콜백 등록
      action.after(() => {
        logAction();
      });

      // 에러 처리 활성화 시 에러 콜백 등록
      if (options.showErrors) {
        action.onError((error) => {
          logAction(true, error);
        });
      }
    });
  };

export default PiniaPluginLogger;
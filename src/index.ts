import type {
  PiniaPluginContext,
  StoreActions,
  StoreGeneric,
  _ActionsTree,
  _StoreOnActionListenerContext,
} from "pinia";
import dayjs from "dayjs";

export type KeyOfStoreActions<Store> = keyof StoreActions<Store>;

export type PiniaActionListenerContext = _StoreOnActionListenerContext<
  StoreGeneric,
  string,
  _ActionsTree
>;

export interface PiniaLoggerOptions {
  /**
   * @default true
   */
  logErrors?: boolean;
  /**
   * @default false
   * @description Disable the logger
   */
  disabled?: boolean;
  /**
   * @default true
   * @description Expand the console group
   */
  expanded?: boolean;
  /**
   * @default false
   * @description Show the duration of the action in the console
   * @example "action [store] actionName @ 12:00:00:000"
   * @example "action [store] actionName failed after 100ms @ 12:00:00:000"
   */
  showDuration?: boolean;
  /**
   * @default true
   * @description show the time of the action in the console
   * @example "action [store] actionName @ 12:00:00:000"
   */
  showTime?: boolean;
  /**
   * @default true
   * @description Show the store name in the console
   */
  showStoreName?: boolean;
  /**
   * @default true
   * @description Show the pineapple Emoji in the console
   */
  showPineapple?: boolean;
  /**
   * @default
   * ```ts
   * () => true
   * ```
   * @description Filter actions to log
   * @example
   * ```ts
   * (action) => action.name !== "incrementCounter"
   * ```
   */
  filter?: (action: PiniaActionListenerContext) => boolean;
  /**
   * @default undefined
   * @description List of actions to log
   * @description If defined, only the actions in this list will be logged
   * @description If undefined, all actions will be logged
   */
  actions?: KeyOfStoreActions<StoreGeneric>[];
}

/**
 * @name getFormatTime
 * @description get TimeStamp
 */
const getFormatTime = () => {
  return dayjs().format("HH:mm:ss:SSS");
};

/**
 * @name piniaDefaultOptions
 */
const piniaDefaultOptions: PiniaLoggerOptions = {
  logErrors: true,
  disabled: false,
  expanded: true,
  showStoreName: true,
  showDuration: false,
  showTime: true,
  showPineapple: true,
  actions: undefined,
  filter: () => true,
};

declare module "pinia" {
  export interface DefineStoreOptionsBase<S, Store> {
    /**
     * Customize logger options for individual Pinia stores.
     *
     * @example
     * ```ts
     * defineStore('id', {
     *   actions: { getApi() {}},
     *   logger: false
     * })
     * ```
     * @example
     *
     * ```ts
     * defineStore('id', {
     *   actions: { getApi() {}},
     *   logger: {
     *     disabled: true,
     *     expanded: false
     *   }
     * })
     * ```
     */
    logger?:
      | boolean
      | (PiniaLoggerOptions & {
          actions?: KeyOfStoreActions<Store>[];
        });
  }
}

export default (config: PiniaLoggerOptions = piniaDefaultOptions) =>
  (ctx: PiniaPluginContext) => {
    const options = {
      ...piniaDefaultOptions,
      ...config,
      ...(typeof ctx.options.logger === "object" ? ctx.options.logger : {}),
    };

    if (options.disabled || ctx.options.logger === false) return;

    ctx.store.$onAction((action: PiniaActionListenerContext) => {
      if (
        Array.isArray(options.actions) &&
        !(options.actions as string[])?.includes(action.name)
      )
        return;

      const startTime = Date.now();
      const prevState = { ...ctx.store.$state };

      const log = (isError?: boolean, error?: unknown) => {
        const endTime = Date.now();
        const duration = endTime - startTime + "ms";
        const nextState = { ...ctx.store.$state };
        const storeName = action.store.$id;
        
        const title = `action ${options.showPineapple ? `🍍 ` : ""}${
          options.showStoreName ? `[${storeName}] ` : ""
        }${action.name} ${
          isError
            ? `failed ${options.showDuration ? `after ${duration} ` : ""}`
            : ""
        }${options.showTime ? `@ ${getFormatTime()}` : ""}`;

        console[options.expanded ? "group" : "groupCollapsed"](
          `%c${title}`,
          `font-weight: bold; ${isError ? "color: #ed4981;" : ""}`
        );
        console.log(
          "%cprev state",
          "font-weight: bold; color: grey;",
          prevState
        );
        console.log("%caction", "font-weight: bold; color: #69B7FF;", {
          type: action.name,
          args: action.args.length > 0 ? { ...action.args } : undefined,
          ...(options.showStoreName && { store: action.store.$id }),
          ...(options.showDuration && { duration }),
          ...(isError && { error }),
        });
        console.log(
          "%cnext state",
          "font-weight: bold; color: #4caf50;",
          nextState
        );
        console.groupEnd();
      };

      action.after(() => {
        const canLog = (options.filter && options.filter(action)) ?? false;
        if (canLog) log();
      });

      if (options.logErrors) {
        action.onError((error) => {
          log(true, error);
        });
      }
    });
  };

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
   * @description Activate the logger
   */
  activate?: boolean;

  /**
   * @default true
   * @description Expand the console group
   */
  expanded?: boolean;

  /**
   * @default true
   * @description Show the store name in the console
   */
  store?: boolean;

  /**
   * @default true
   * @description Show the time of the action in the console
   */
  timestamp?: boolean;

  /**
   * @default true
   * @description Show error the console
   */
  errors?: boolean;

  /**
   * @default []
   * @description If defined, only the actions in this list will be logged
   * @description If undefined, all actions will be logged
   */
  include?: KeyOfStoreActions<StoreGeneric>[];

  /**
   * @default []
   * @description If defined, the work of this list is excluded
   * @description If undefined, all actions will be logged
   */
  exclude?: KeyOfStoreActions<StoreGeneric>[];
}

/**
 * @name getTimeStamp
 * @description get TimeStamp
 */
const getTimeStamp = () => {
  return dayjs().format("HH:mm:ss:SSS");
};

const piniaDefaultOptions: PiniaLoggerOptions = {
  activate: true,
  expanded: true,
  store: true,
  timestamp: true,
  errors: true,
  include: [],
  exclude: [],
};

/**
 * @name DefineStoreOptionsBase
 * @description Customize logger options for individual Pinia stores.
 * @example
 * defineStore(id, {
 *   state: () => {},
 *   getters: {},
 *   actions: {},
 *   logger: {
 *     activate: true,
 *     expanded: false
 *   }
 * })
 */
declare module "pinia" {
  export interface DefineStoreOptionsBase<S, Store> {
    logger?: boolean | PiniaLoggerOptions;
  }
}

export default (config: PiniaLoggerOptions = piniaDefaultOptions) =>
  (ctx: PiniaPluginContext) => {
    const options = {
      ...piniaDefaultOptions,
      ...config,
      ...(typeof ctx.options.logger === "object" ? ctx.options.logger : {}),
    };

    if (!options.activate || ctx.options.logger === false) return;
    if (!Array.isArray(options.include) || !Array.isArray(options.exclude))
      return;

    ctx.store.$onAction((action: PiniaActionListenerContext) => {
      if (!(options.include as string[]).includes(action.name)) return;
      if ((options.exclude as string[]).includes(action.name)) return;

      const prevState = { ...ctx.store.$state };
      const log = (isError?: boolean, error?: unknown) => {
        const nextState = { ...ctx.store.$state };
        const store = action.store.$id;

        const title = `action 🍍
        ${options.store ? `[${store}] ` : ""}
        ${action.name}
        ${isError ? "failed" : ""}
        ${options.timestamp ? `@ ${getTimeStamp()}` : ""}`;

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
          ...(options.store && { store: action.store.$id }),
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
        log();
      });

      if (options.errors) {
        action.onError((error) => {
          log(true, error);
        });
      }
    });
  };

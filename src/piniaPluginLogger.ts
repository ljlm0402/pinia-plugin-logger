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

interface Logger {
  log(message: string, style?: string, payload?: unknown): void;
  group(message: string, style?: string, payload?: unknown): void;
  groupCollapsed(message: string, style?: string, payload?: unknown): void;
  groupEnd(): void;
}

export interface PiniaLoggerOptions {
  /**
   * @default true
   */
  enabled?: boolean;
  /**
   * @default true
   */
  expanded?: boolean;
  /**
   * @default true
   */
  showStoreName?: boolean;
  /**
   * @default true
   */
  showTimestamp?: boolean;
  /**
   * @default true
   */
  showErrors?: boolean;
  /**
   * @default []
   * @description Only include these actions (if defined)
   */
  includeActions?: KeyOfStoreActions<StoreGeneric>[];
  /**
   * @default []
   * @description Exclude these actions (if defined)
   */
  excludeActions?: KeyOfStoreActions<StoreGeneric>[];
  /**
   * @default undefined
   * @description Filter function for logging
   */
  filter?: (action: PiniaActionListenerContext) => boolean;
  /**
   * @default console
   * @description Custom logger
   */
  logger?: Logger;
}

const defaultOptions: PiniaLoggerOptions = {
  enabled: true,
  expanded: true,
  showStoreName: true,
  showTimestamp: true,
  showErrors: true,
  includeActions: [],
  excludeActions: [],
  filter: () => true,
  logger: console,
};

function getTimeStamp(date = new Date()) {
  // dayjs 사용 안 함, 직접 포맷팅
  const pad = (n: number) => n.toString().padStart(2, "0");
  const ms = date.getMilliseconds().toString().padStart(3, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}:${ms}`;
}

declare module "pinia" {
  export interface DefineStoreOptionsBase<S, Store> {
    logger?: boolean | PiniaLoggerOptions;
  }
}

const PiniaPluginLogger =
  (config: PiniaLoggerOptions = defaultOptions) =>
  (ctx: PiniaPluginContext) => {
    // merge options: default < global < store
    const options: PiniaLoggerOptions = {
      ...defaultOptions,
      ...config,
      ...(typeof ctx.options.logger === "object" ? ctx.options.logger : {}),
    };

    if (!options.enabled || ctx.options.logger === false) return;

    const logger = options.logger || console;

    ctx.store.$onAction((action: PiniaActionListenerContext) => {
      // Action filtering
      if (
        Array.isArray(options.includeActions) &&
        options.includeActions.length > 0 &&
        !(options.includeActions as string[]).includes(action.name)
      )
        return;
      if (
        Array.isArray(options.excludeActions) &&
        options.excludeActions.length > 0 &&
        (options.excludeActions as string[]).includes(action.name)
      )
        return;
      if (typeof options.filter === "function" && !options.filter(action))
        return;

      const prevState = { ...ctx.store.$state };
      const time = options.showTimestamp ? ` @${getTimeStamp()}` : "";
      const storeName = options.showStoreName ? ` [${action.store.$id}]` : "";
      const title = `action 🍍${storeName} ${action.name}${time}`;

      const logAction = (isError?: boolean, error?: unknown) => {
        const nextState = { ...ctx.store.$state };
        logger[options.expanded ? "group" : "groupCollapsed"](
          `%c${title}${isError ? " Failed" : ""}`,
          `font-weight: bold; ${isError ? "color: #ed4981;" : ""}`
        );
        logger.log(
          "%cprev state",
          "font-weight: bold; color: grey;",
          prevState
        );
        logger.log("%caction", "font-weight: bold; color: #69B7FF;", {
          type: action.name,
          args: action.args.length > 0 ? { ...action.args } : undefined,
          ...(options.showStoreName && { store: action.store.$id }),
          ...(isError && { error }),
        });
        logger.log(
          "%cnext state",
          "font-weight: bold; color: #4caf50;",
          nextState
        );
        logger.groupEnd();
      };

      action.after(() => {
        logAction();
      });

      if (options.showErrors) {
        action.onError((error) => {
          logAction(true, error);
        });
      }
    });
  };

export default PiniaPluginLogger;

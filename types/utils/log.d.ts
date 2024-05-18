export declare enum ESDKLogLevel {
    DEBUG = 0,
    INFO = 1,
    WARNING = 2,
    ERROR = 3,
    CRITICAL = 4
}
export declare function setLogLevel(level: ESDKLogLevel): void;
declare function debug(prefix: string, ...args: any): void;
declare function info(prefix: string, ...args: any): void;
declare function warn(prefix: string, ...args: any): void;
declare function error(prefix: string, ...args: any): void;
declare function critical(prefix: string, ...args: any): void;
declare const _default: {
    setLogLevel: typeof setLogLevel;
    debug: typeof debug;
    info: typeof info;
    warn: typeof warn;
    error: typeof error;
    critical: typeof critical;
};
export default _default;

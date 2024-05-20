/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-05-09 20:22:47
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-05-09 20:25:53
 * @FilePath: \PeachyTalk-IM-SDK\lib\utils\log.ts
 * @Description: 日志系统
 */
export enum ESDKLogLevel {
    DEBUG = 0,
    INFO,
    WARNING,
    ERROR,
    CRITICAL,
}


const colors = {
    [ESDKLogLevel.DEBUG]: "\x1b[37m[IM][DEBUG]\x1b[0m ", // 白色
    [ESDKLogLevel.INFO]: "\x1b[34m[IM][INFO]\x1b[0m ", // 蓝色
    [ESDKLogLevel.WARNING]: "\x1b[33m[IM][WARNING]\x1b[0m ", // 黄色
    [ESDKLogLevel.ERROR]: "\x1b[31m[IM][ERROR]\x1b[0m ", // 红色
    [ESDKLogLevel.CRITICAL]: "\x1b[35m[IM][CRITICAL]\x1b[0m ", // 紫色
}

let SDKLogLevel: ESDKLogLevel = 0

export function setLogLevel(level: ESDKLogLevel) {
    SDKLogLevel = level
}


function printLog(level: ESDKLogLevel, prefix: string, ...args: any) {
    if (level >= SDKLogLevel) {
        console.log(`${colors[level]}${prefix}`, ...args)
    }
}

function debug(prefix: string, ...args: any) {
    printLog(ESDKLogLevel.DEBUG, prefix, ...args)
}

function info(prefix: string, ...args: any) {
    printLog(ESDKLogLevel.INFO, prefix, ...args)
}

function warn(prefix: string, ...args: any) {
    printLog(ESDKLogLevel.WARNING, prefix, ...args)
}

function error(prefix: string, ...args: any) {
    printLog(ESDKLogLevel.ERROR, prefix, ...args)
}

function critical(prefix: string, ...args: any) {
    printLog(ESDKLogLevel.CRITICAL, prefix, ...args)
}

export default {
    setLogLevel,
    debug,
    info,
    warn,
    error,
    critical
}
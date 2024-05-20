/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-05-01 18:32:57
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-05-20 20:28:50
 * @FilePath: \PeachyTalk-IM-SDK\lib\utils\common.ts
 * @Description: 通用工具函数
 */

import { ChatType } from "@/protocolLayer/protobuf/proto/messages";

/**
 * 生成唯一ID
 */
let sequence = 0
let preTime = 0
function generateRandomNumber() {
    return Math.floor(Math.random() * 900) + 100;
}
export function getCMsgId(): string {
    const curTime = Date.now()
    sequence++;
    if (curTime != preTime) {
        sequence = 0
    }
    preTime = curTime
    return `${generateRandomNumber()}${curTime}${sequence}`
}

/**
 * 返回时间戳
 * @returns 
 */
export function getTimestamp() {
    return BigInt(Date.now())
}


/**
 * 节流函数
 * @param func 
 * @param wait 
 * @returns 
 */
export function throttle(func: Function, wait = 1000) {
    let isWait = false;
    let lastArgs: any;
    let lastExecutionTime = 0;

    function flush() {
        func(...lastArgs)
        lastExecutionTime = Date.now();
        isWait = false
    }

    return function (...args: any) {
        lastArgs = args;
        const now = Date.now();
        const remainingTime = wait - (now - lastExecutionTime);
        if (!isWait) {
            isWait = true
            if (remainingTime <= 0) {
                flush()
            } else {
                setTimeout(flush, remainingTime)
            }
        }
    };
}
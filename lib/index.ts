/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-04-25 20:42:47
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-05-11 19:31:00
 * @FilePath: \PeachyTalk-IM-SDK\lib\index.ts
 * @Description: 项目入口
 */
import ChatSDK from "./api"

export * from "./api"
export * from "./protocolLayer"
export * from "./transportLayer"

const instanceMap = new Map<string | number, ChatSDK>()

export interface Options {
    appId: string;
}

/**
 * @desc 创建实例
 * */
export function create(opts: Options) {
    const key = opts.appId
    let instance = instanceMap.get(key)

    if (!instance) {
        instance = new ChatSDK()
        instanceMap.set(key, instance)
    }

    return instance
}

export default {
    create,
}
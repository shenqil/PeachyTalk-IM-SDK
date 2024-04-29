/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-04-25 20:42:47
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-04-29 09:25:57
 * @FilePath: \PeachyTalk-IM-SDK\lib\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import ChatSDK from "./api"

export type * from "./api"

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
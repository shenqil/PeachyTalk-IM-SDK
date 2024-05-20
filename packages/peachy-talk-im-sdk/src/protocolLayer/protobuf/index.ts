/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-05-11 16:48:46
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-05-20 17:49:07
 * @FilePath: \PeachyTalk-IM-SDK\lib\protocolLayer\protobuf\index.ts
 * @Description: 协议层实现
 */

import EventBus from "@/utils/eventBus";
import { AProtocolLayer, ChatType, EProtocolLayerEventName, ILoginInfo, IProtocolLayerEvent, Message, ProtocolLayerEventName } from "..";
import { ATransportLayer, ETransportLayerEventName, msgTopicPrefix } from "@/transportLayer";
import TransportLayer from "@/transportLayer/mqtt";
import log from "@/utils/log";


class ProtocolLayer implements AProtocolLayer {
    #transportInstance: ATransportLayer
    // 事件
    #eventBus: EventBus<IProtocolLayerEvent> = new EventBus<IProtocolLayerEvent>();
    constructor() {
        this.#transportInstance = new TransportLayer()

        this.#transportInstance.addEventListener(ETransportLayerEventName.MESSAGE_RECEIVED, (topic, data) => {
            if (topic.startsWith(msgTopicPrefix)) {
                // 接收到消息
                this.#eventBus.emit(EProtocolLayerEventName.MESSAGE_RECEIVED, Message.fromBinary(data))
            }
        })

        // 抛出内部所有事件
        Object.keys(ETransportLayerEventName).forEach(key => {
            const name = (EProtocolLayerEventName as any)[key]
            name && this.#transportInstance.addEventListener(name, (...args: any) => {
                this.#eventBus.emit(name, ...args)
            })
        })
    }

    /**
     * 开始登陆
     * @param info 
     */
    async login(info: ILoginInfo): Promise<boolean> {
        await this.#transportInstance.connect(info)
        await this.#transportInstance.subscribeTopic(`${msgTopicPrefix}/${info.username}/#`)
        return true
    }

    /**
     * 退出登陆
     */
    logout(): void {
        this.#transportInstance.disconnect()
    }

    /**
     * 发送消息
     * @param msg 
     */
    async sendMsg(msg: Message): Promise<boolean> {
        const topic = `${msgTopicPrefix}/${msg.chatType == ChatType.GROUP_CHAT ? "GROUP@" : ""}${msg.to}/${msg.from}`
        log.info(`[protobuf][sendMsg] topic=${topic}, msg=`, msg)
        await this.#transportInstance.send(topic, Message.toBinary(msg))
        return true
    }

    /**
     * 监听事件
     * @param name 
     * @param handle 
     */
    addEventListener<K extends ProtocolLayerEventName>(
        name: K,
        handle: IProtocolLayerEvent[K]
    ): Function {
        return this.#eventBus.on(name, handle as any);
    }

    /**
     * 销毁
     */
    destroy() {
        log.debug('[protobuf][destroy]')
        this.#eventBus.clear()
        this.#transportInstance.destroy()
    }
}

export default ProtocolLayer
/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-04-28 19:07:29
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-05-11 19:30:24
 * @FilePath: \PeachyTalk-IM-SDK\lib\api\index.ts
 * @Description: 对外暴露的所有API
 */
import ProtocolLayer from "@/protocolLayer/protobuf";
import { AProtocolLayer, ChatType, EProtocolLayerEventName, IProtocolLayerEvent, Message, MessageType } from "../protocolLayer";
import { getCMsgId, getTimestamp } from "../utils/common";
import httpApi from "./http"
import { getUserInfo, setUserInfo } from "@/store/userInfo";
import EventBus from "@/utils/eventBus";
import log from "@/utils/log";

export * from "./http"

/**
 * API所有的事件名称
 * */
export const ChatEventName = Object.freeze({
    ...EProtocolLayerEventName,
})


/**
 * API所有的事件
 * */
export interface ChatEvent extends IProtocolLayerEvent {
};


/**
 * 登陆参数
 */
export interface ILoginParams {
    userId: string,
    token: string
}


interface IMsgBase {
    to: string; // 接收者
    chatType: ChatType; // 聊天类型 单聊、群聊
    serverExtension?: string;
    clientExtension?: string;
}


interface IMsgText extends IMsgBase {
    type: MessageType.TEXT | MessageType.CUSTOM,
    payload: string
}


interface IMsgImg extends IMsgBase {
    type: MessageType.IMAGE,
    file: File;
    width: number;
    height: number;
}

interface IMsgFile extends IMsgBase {
    type: MessageType.AUDIO | MessageType.VEDIO,
    file: File;
}

/**
 * @desc 发送的消息结构
 * */
export type ISendMsg = IMsgText | IMsgImg | IMsgFile

export class ChatSDK {
    #protocolInstance: AProtocolLayer
    // 事件
    #eventBus: EventBus<IProtocolLayerEvent> = new EventBus<IProtocolLayerEvent>();
    constructor() {
        this.#protocolInstance = new ProtocolLayer()

        // 抛出内部所有事件
        Object.keys(EProtocolLayerEventName).forEach(key => {
            const name = (EProtocolLayerEventName as any)[key]
            name && this.#protocolInstance.addEventListener(name, (...args: any) => {
                this.#eventBus.emit(name, ...args)
            })
        })
    }

    /**
     * 登录
     * @param loginInfo 
     */
    async login(params: ILoginParams) {
        log.info('[api][login] loginInfo', params)
        const res = await this.#protocolInstance.login({ username: params.userId, password: params.token })
        setUserInfo({ ...params })
        return res
    }

    /**
     * 退出登录
     * @returns 
     */
    logout() {
        log.info('[api][login] logout')
        setUserInfo(undefined)
        return this.#protocolInstance.logout()
    }


    /**
     * 发送消息
     * @param msg 
     * @returns 
     */
    async sendMsg(msg: ISendMsg) {

        const userId = getUserInfo()?.userId

        if (!userId) {
            throw new Error("用户未登陆")
        }

        log.info(`[api][sendMsg] msg=`, msg)

        let payload = ""
        switch (msg.type) {
            case MessageType.TEXT:
            case MessageType.CUSTOM:
                payload = msg.payload
                break;

            case MessageType.IMAGE:
            case MessageType.VEDIO:
            case MessageType.IMAGE:
                await httpApi.uploadFile({ file: msg.file })
                break

            default:
                break;
        }

        const msgId = getCMsgId()

        const data = Message.create({
            id: msgId,
            from: userId,
            to: msg.to,
            chatType: msg.chatType,
            type: msg.type,
            payload,
            timestamp: getTimestamp(),
            clientExtension: msg.clientExtension,
            serverExtension: msg.serverExtension
        })

        return await this.#protocolInstance.sendMsg(data)
    }


    /**
     * 监听事件
     * @param name 
     * @param handle 
     * @returns Function
     */
    addEventListener<K extends keyof ChatEvent>(
        name: K,
        handle: IProtocolLayerEvent[K]
    ): Function {
        return this.#eventBus.on(name, handle as any);
    }
}

export default ChatSDK
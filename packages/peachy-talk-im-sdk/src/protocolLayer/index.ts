/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-05-11 16:48:46
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-05-17 15:04:11
 * @FilePath: \PeachyTalk-IM-SDK\lib\protocolLayer\protobuf\index.ts
 * @Description: 协议层抽象类
 */
import { ETransportLayerEventName, IConnectOpts, ITransportLayerEvent } from "@/transportLayer";
import { Message } from "./protobuf/proto/messages";

export * from "./protobuf/proto/messages"

/**
 * 协议层所有的事件名称
 * */
export const EProtocolLayerEventName = Object.freeze({
    ...ETransportLayerEventName,
    MESSAGE_RECEIVED: 'MESSAGE_RECEIVED',
})


/**
 * 协议层所有的事件
 * */
export interface IProtocolLayerEvent extends ITransportLayerEvent {
    [EProtocolLayerEventName.MESSAGE_RECEIVED]: (data: Message) => void; //群聊 直播间 派对房消息派发
};

/**
 * 所有事件名称
 * */
export type ProtocolLayerEventName = keyof IProtocolLayerEvent;

/**
 * 登录参数
 */
export type ILoginInfo = IConnectOpts & {

}

/**
 * 协议层抽象类
 * */
export abstract class AProtocolLayer {

    /**
     * 开始登陆
     * @param info 
     */
    abstract login(info: ILoginInfo): Promise<boolean>

    /**
     * 退出登陆
     */
    abstract logout(): void

    /**
     * 发送消息
     * @param msg 
     */
    abstract sendMsg(msg: Message): Promise<boolean>

    /**
     * 监听事件
     * @param name 
     * @param handle 
     */
    abstract addEventListener<K extends ProtocolLayerEventName>(
        name: K,
        handle: IProtocolLayerEvent[K]
    ): Function

    /**
     * 销毁
     */
    abstract destroy(): void
}
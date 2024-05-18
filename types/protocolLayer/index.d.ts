import { IConnectOpts, ITransportLayerEvent } from "@/transportLayer";
import { Message } from "./protobuf/proto/messages";
export * from "./protobuf/proto/messages";
/**
 * 协议层所有的事件名称
 * */
export declare const EProtocolLayerEventName: Readonly<{
    MESSAGE_RECEIVED: "MESSAGE_RECEIVED";
    CONNECTING: "CONNECTING";
    CONNECTED: "CONNECTED";
    DISCONNECTED: "DISCONNECTED";
}>;
/**
 * 协议层所有的事件
 * */
export interface IProtocolLayerEvent extends ITransportLayerEvent {
    [EProtocolLayerEventName.MESSAGE_RECEIVED]: (data: Message) => void;
}
/**
 * 所有事件名称
 * */
export type ProtocolLayerEventName = keyof IProtocolLayerEvent;
/**
 * 登录参数
 */
export type ILoginInfo = IConnectOpts & {};
/**
 * 协议层抽象类
 * */
export declare abstract class AProtocolLayer {
    /**
     * 开始登陆
     * @param info
     */
    abstract login(info: ILoginInfo): Promise<boolean>;
    /**
     * 退出登陆
     */
    abstract logout(): void;
    /**
     * 发送消息
     * @param msg
     */
    abstract sendMsg(msg: Message): Promise<boolean>;
    /**
     * 监听事件
     * @param name
     * @param handle
     */
    abstract addEventListener<K extends ProtocolLayerEventName>(name: K, handle: IProtocolLayerEvent[K]): Function;
    /**
     * 销毁
     */
    abstract destroy(): void;
}

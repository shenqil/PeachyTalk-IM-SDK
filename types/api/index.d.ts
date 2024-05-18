import { ChatType, IProtocolLayerEvent, MessageType } from "@/protocolLayer";
export * from "./http";
/**
 * API所有的事件名称
 * */
export declare const ChatEventName: Readonly<{
    MESSAGE_RECEIVED: "MESSAGE_RECEIVED";
    CONNECTING: "CONNECTING";
    CONNECTED: "CONNECTED";
    DISCONNECTED: "DISCONNECTED";
}>;
/**
 * API所有的事件
 * */
export interface ChatEvent extends IProtocolLayerEvent {
}
/**
 * 登陆参数
 */
export interface ILoginParams {
    userId: string;
    token: string;
}
interface IMsgBase {
    to: string;
    chatType: ChatType;
    serverExtension?: string;
    clientExtension?: string;
}
interface IMsgText extends IMsgBase {
    type: MessageType.TEXT | MessageType.CUSTOM;
    payload: string;
}
interface IMsgImg extends IMsgBase {
    type: MessageType.IMAGE;
    file: File;
    width: number;
    height: number;
}
interface IMsgFile extends IMsgBase {
    type: MessageType.AUDIO | MessageType.VEDIO;
    file: File;
}
/**
 * @desc 发送的消息结构
 * */
export type ISendMsg = IMsgText | IMsgImg | IMsgFile;
export declare class ChatSDK {
    #private;
    constructor();
    /**
     * 登录
     * @param loginInfo
     */
    login(params: ILoginParams): Promise<boolean>;
    /**
     * 退出登录
     * @returns
     */
    logout(): void;
    /**
     * 发送消息
     * @param msg
     * @returns
     */
    sendMsg(msg: ISendMsg): Promise<boolean>;
    /**
     * 监听事件
     * @param name
     * @param handle
     * @returns Function
     */
    addEventListener<K extends keyof ChatEvent>(name: K, handle: IProtocolLayerEvent[K]): Function;
}
export default ChatSDK;

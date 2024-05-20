import mqtt from "mqtt";

export const msgTopicPrefix = 'MSG'
export const clientId = 'DESKTOP'

/**
 * 当前连接状态
 */
export type IConnectStatus =
    'CONNECTING'
    | "CONNECTED"
    | "DISCONNECTED"

/**
 * 断开类型
 */
export enum EDisconnectType {
    UNKNOWN, // 未知原因断开
    NORMAL, // 正常断开
    HEARTBEAT_TIMEOUT, // 心跳超时
    WS_ERROR,
    WS_CLOSE,
}

/**
 * 连接参数
 */
export type IConnectOpts = {
    brokerUrl: string,
    username: string,
    password: string
};

/**
 * 连接层所有的事件名称
 * */
export const ETransportLayerEventName = Object.freeze({
    /**
     * 连接中
     * */
    CONNECTING: 'CONNECTING',
    /**
     * 已连接
     * */
    CONNECTED: 'CONNECTED',
    /**
     * 断开连接
     * */
    DISCONNECTED: 'DISCONNECTED',
    /**
     * 接收到消息
     * */
    MESSAGE_RECEIVED: 'TRANSPORT_LAYER_MESSAGE_RECEIVED'
})

/**
 * 连接层所有的事件
 */
export interface ITransportLayerEvent {
    [ETransportLayerEventName.CONNECTING]: () => void;
    [ETransportLayerEventName.CONNECTED]: () => void;
    [ETransportLayerEventName.DISCONNECTED]: (type: EDisconnectType, reason?: any) => void;
    [ETransportLayerEventName.MESSAGE_RECEIVED]: (topic: string, data: Uint8Array) => void;
};

/**
 * 所有事件名称
 * */
export type TransportLayerEventName = keyof ITransportLayerEvent;

/**
 * 连接层S抽象类
 * */
export abstract class ATransportLayer {
    /**
     * 发起一次连接
     * @param opt 
     */
    abstract connect(opt: IConnectOpts): Promise<Boolean>;

    /**
     * 断开连接
     */
    abstract disconnect(): void;

    /**
     * 发送数据
     * @param topic 
     * @param data 
     */
    abstract send(topic: string, data: Uint8Array): Promise<mqtt.Packet | undefined>;

    /**
     * 订阅主题
     * @param topic 
     */
    abstract subscribeTopic(topic: string): Promise<mqtt.ISubscriptionGrant[] | undefined>

    /**
     * 监听事件
     * @param name 
     * @param handle 
     */
    abstract addEventListener<K extends TransportLayerEventName>(
        name: K,
        handle: ITransportLayerEvent[K]
    ): Function

    /**
     * 销毁
     */
    abstract destroy(): void

    /**
     * 获取连接状态
     * */
    abstract getConnectStatus(): IConnectStatus
}
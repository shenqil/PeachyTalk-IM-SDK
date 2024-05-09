/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-04-28 18:42:23
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-05-09 20:49:14
 * @FilePath: \PeachyTalk-IM-SDK\lib\protocolLayer\mqtt\mqtt.ts
 * @Description: 对MQTT进行封装
 */
import mqtt, { MqttClient } from "mqtt"
import log from "@/utils/log"
import EventBus from "@/utils/eventBus"

const msgTopicPrefix = 'MSG'
const clientId = 'DESKTOP'



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
 * 连接层所有的事件名称
 * */
export const ETransportLayerEventName = Object.freeze({
    /**
     * @desc 连接中
     * */
    CONNECTING: 'CONNECTING',
    /**
     * @desc 已连接
     * */
    CONNECTED: 'CONNECTED',
    /**
     * @desc 断开连接
     * */
    DISCONNECTED: 'DISCONNECTED',
    /**
     * @desc 接收到消息
     * */
    MESSAGE_RECEIVED: 'MESSAGE_RECEIVED'
})

/**
 * @desc 连接层所有的事件
 * */
export interface ITransportLayerEvent {
    [ETransportLayerEventName.CONNECTING]: () => void;
    [ETransportLayerEventName.CONNECTED]: () => void;
    [ETransportLayerEventName.DISCONNECTED]: (type: EDisconnectType, reason?: any) => void;
    [ETransportLayerEventName.MESSAGE_RECEIVED]: (topic: string, data: Uint8Array) => void;
};

/**
 * 当前连接状态
 */
export type IConnectStatus =
    'CONNECTING'
    | "CONNECTED"
    | "DISCONNECTED"

interface ILoginInfo {
    username: string,
    password: string
}


/**
 * 消息类型
 */
export enum IMsgTypeEnum {
    /**
     * 文本
     */
    TEXT = 0,
    /**
     * 图片
     */
    IMAGE = 1,
    /**
     * 语音
     */
    AUDIO = 2,
    /**
     * 视频
     */
    VEDIO = 3,
    /**
     * 视频
     */
    CUSTOM = 4,
}

/**
 * 聊天类型
 */
export enum IChatType {
    /**
     * 单聊消息
     */
    CHAT = 0,
    /**
     * 群聊消息
     */
    GROUP_CHAT = 1,
    /**
     * 系统消息
     */
    SYSTEM = 2,
}

/**
 * 消息体
 */
export interface IMQTTMsg {
    from: string; // 发送者
    to: string; // 接收者
    chatType: IChatType; // 聊天类型 单聊、群聊
    msgType: IMsgTypeEnum; // 消息类型
    id: string; // 消息id
    payload: string; // 消息内容
    clientTime: number; // 客户端时间
    serverTime: number; // 服务端时间
    cMsgId: string; // 客户端唯一消息id
    msgStatus: number; // 消息状态
    extends?: { [key: string]: string }; // 扩展字段
}

class ChatProtocol {
    // 唯一连接实例
    #client: MqttClient | null
    // 事件
    #eventBus: EventBus<ITransportLayerEvent> = new EventBus<ITransportLayerEvent>();
    // 最后一条消息
    #lastDisconnectReason: {
        type: EDisconnectType,
        reason?: any
    }
    // 连接状态
    #connectStatus: IConnectStatus = "DISCONNECTED"
    get connectStatus() {
        return this.#connectStatus
    }
    set connectStatus(v: IConnectStatus) {
        if (this.#connectStatus !== v) {
            this.#connectStatus = v
            switch (v) {
                case "CONNECTED":
                    this.#eventBus.emit(ETransportLayerEventName.CONNECTED)
                    break;
                case "CONNECTING":
                    this.#eventBus.emit(ETransportLayerEventName.CONNECTING)
                    break;
                case "DISCONNECTED":
                    this.#eventBus.emit(ETransportLayerEventName.DISCONNECTED, this.#lastDisconnectReason.type, this.#lastDisconnectReason.reason)
                    break;
                default:
                    log.error(`[mqtt][connectStatus] 设置了未知状态 connectStatus=${v}`)
                    break;
            }
        }
    }

    constructor() {
        this.#client = null
        this.#lastDisconnectReason = {
            type: EDisconnectType.UNKNOWN,
            reason: undefined
        }
    }

    /**
     * 销毁实例
     */
    private destoryClient() {
        if (this.#client) {
            log.debug('[mqtt][destoryClient]');

            this.#client.removeAllListeners()

            this.#client.end(false, () => {
                log.info('[mqtt][destoryClient] Closed');
            })
            this.#client = null
        }
    }



    private _login(loginInfo: ILoginInfo) {
        return new Promise((resolve, reject) => {
            log.info('[mqtt][login]');

            this.destoryClient()

            // 发起一次连接
            this.#client = mqtt.connect("websockets://localhost:9001", {
                username: loginInfo.username,
                password: loginInfo.password,
                clientId: `${loginInfo.username}-${clientId}`,
                clean: false, // 保持会话
            });

            // 接受消息
            this.#client.on("message", this.onMessage.bind(this))

            // 监听连接成功事件
            this.#client.on('connect', () => {
                log.info('[mqtt][login] Connected to MQTT server');
                resolve(true)
            });

            // 监听连接错误事件
            this.#client.on('error', (error) => {
                this.#lastDisconnectReason = {
                    type: EDisconnectType.WS_ERROR,
                    reason: error
                }
                log.error('[mqtt][login] Connection to MQTT server failed:', error);
                reject(error)
            });

            // 监听断开连接事件
            this.#client.on('close', () => {
                this.#lastDisconnectReason = {
                    type: EDisconnectType.WS_CLOSE
                }
                log.info('[mqtt][login] Disconnected from MQTT server');
                reject("onclose")
            });

        })
    }
    /**
     * 登录
     * @param loginInfo 
     * @returns 
     */
    async login(loginInfo: ILoginInfo) {

        this.connectStatus = "CONNECTING"
        return this._login(loginInfo)
            .then(() => {
                return this.subscribeMsg(loginInfo.username)
            })
            .then(() => {
                this.connectStatus = "CONNECTED"
            })
            .catch(err => {
                this.connectStatus = "DISCONNECTED"
                throw err
            })

        // await this.#client?.subscribeAsync('$SYS/broker/subscriptions/#')
        // await this.#client?.subscribeAsync('$SYS/#')
        // this.#client?.unsubscribeAsync("$SYS/#")
    }

    /**
     * 退出登录
     */
    logout() {
        log.info('[mqtt][logout]');
        this.#lastDisconnectReason = {
            type: EDisconnectType.NORMAL
        }
        this.connectStatus = "DISCONNECTED"
        this.destoryClient()
    }

    /**
     * 发送消息
     * @param msg 
     * @returns 
     */
    async sendMsg(msg: IMQTTMsg) {
        if (!this.#client) {
            throw new Error("未登陆")
        }

        const topic = `${msgTopicPrefix}/${msg.chatType == IChatType.GROUP_CHAT ? "GROUP@" : ""}${msg.to}/${msg.from}`

        log.info('[mqtt][sendMsg] request', topic, msg);
        const res = await this.#client.publishAsync(topic, JSON.stringify(msg), { qos: 1 })
        log.info('[mqtt][sendMsg] response', res);

        return res
    }

    /**
     * 接受消息
     * @param topic 
     * @param message 
     */
    private onMessage(topic: string, message: Uint8Array) {
        // message is Buffer
        this.#eventBus.emit(ETransportLayerEventName.MESSAGE_RECEIVED, topic, message)
    }

    /**
     * 订阅消息
     * @param id 
     * @param type 
     * @returns 
     */
    private async subscribeMsg(id: string, type: IChatType = IChatType.CHAT) {
        const topic = `${msgTopicPrefix}/${type == IChatType.GROUP_CHAT ? "GROUP@" : ""}${id}/#`
        log.info(`[mqtt][subscribeMsg] topic = ${topic}`);
        return this.#client?.subscribeAsync(topic, { qos: 1 })
    }

    /**
     * 监听事件
     * @param name 
     * @param handle 
     * @returns Function
     */
    addEventListener<K extends keyof ITransportLayerEvent>(
        name: K,
        handle: ITransportLayerEvent[K]
    ): Function {
        return this.#eventBus.on(name, handle as any);
    }


    /**
     * 销毁
     */
    destroy() {
        log.debug('[mqtt][destroy]')
        this.logout()
        this.#eventBus.clear()
    }
}

export default ChatProtocol

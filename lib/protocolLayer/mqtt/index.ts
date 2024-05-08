/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-04-28 18:42:23
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-05-08 21:13:21
 * @FilePath: \PeachyTalk-IM-SDK\lib\protocolLayer\mqtt\mqtt.ts
 * @Description: 对MQTT进行封装
 */
import mqtt, { MqttClient } from "mqtt"

const msgTopicPrefix = 'MSG'
const clientId = 'DESKTOP'

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
    private client: MqttClient | null
    constructor() {
        this.client = null
    }

    /**
     * 销毁实例
     */
    private destoryClient() {
        if (this.client) {
            console.log('[im][mqtt][destoryClient]');

            this.client.removeAllListeners()

            this.client.end(false, () => {
                console.log('[im][mqtt][destoryClient] Closed');
            })
            this.client = null
        }
    }


    /**
     * 登录
     * @param loginInfo 
     * @returns 
     */
    private _login(loginInfo: ILoginInfo) {
        return new Promise((resolve, reject) => {

            this.destoryClient()

            // 发起一次连接
            this.client = mqtt.connect("websockets://localhost:9001", {
                username: loginInfo.username,
                password: loginInfo.password,
                clientId: `${loginInfo.username}-${clientId}`,
                clean: false, // 保持会话
            });

            // 接受消息
            this.client.on("message", this.onMessage.bind(this))

            // 监听连接成功事件
            this.client.on('connect', function () {
                console.log('[im][mqtt][login] Connected to MQTT server');
                resolve(true)
            });

            // 监听连接错误事件
            this.client.on('error', function (error) {
                console.error('[im][mqtt][login] Connection to MQTT server failed:', error);
                reject(error)
            });

            // 监听断开连接事件
            this.client.on('close', function () {
                console.log('[im][mqtt][login] Disconnected from MQTT server');
                reject("onclose")
            });

        })
    }
    async login(loginInfo: ILoginInfo) {
        const res = await this._login(loginInfo)
        await this.subscribeMsg(loginInfo.username)
        return res
    }

    /**
     * 退出登录
     */
    logout() {
        this.destoryClient()
    }

    /**
     * 发送消息
     * @param msg 
     * @returns 
     */
    async sendMsg(msg: IMQTTMsg) {
        if (!this.client) {
            throw new Error("未登陆")
        }

        const topic = `${msgTopicPrefix}/${msg.chatType == IChatType.GROUP_CHAT ? "GROUP@" : ""}${msg.to}/${msg.from}`

        console.log('[im][api][sendMsg] request', topic, msg);
        const res = await this.client.publishAsync(topic, JSON.stringify(msg), { qos: 0 })
        console.log('[im][api][sendMsg] response', res);

        return res
    }

    /**
     * 接受消息
     * @param topic 
     * @param message 
     */
    onMessage(topic: any, message: any) {
        // message is Buffer
        console.log(topic, message.toString(), 'onMessage');
    }

    /**
     * 订阅消息
     * @param id 
     * @param type 
     * @returns 
     */
    async subscribeMsg(id: string, type: IChatType = IChatType.CHAT) {
        const topic = `${msgTopicPrefix}/${type == IChatType.GROUP_CHAT ? "GROUP@" : ""}${id}/#`
        return this.client?.subscribeAsync(topic)
    }
}

export default ChatProtocol

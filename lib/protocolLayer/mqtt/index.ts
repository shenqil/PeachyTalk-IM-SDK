/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-04-28 18:42:23
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-04-30 21:13:36
 * @FilePath: \PeachyTalk-IM-SDK\lib\protocolLayer\mqtt\mqtt.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import mqtt, { MqttClient } from "mqtt"

const msgTopicPrefix = 'MSG'

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
export interface IMsg {
    from: string; // 发送者
    name: string; // 发送者昵称
    avatarUrl: string; // 发送者头像

    to: string; // 接收者
    toName: string; // 接收人的昵称
    toAvatarUrl: string; // 接收人的头像

    chatType: IChatType; // 聊天类型 单聊、群聊
    msgType: IMsgTypeEnum; // 消息类型

    id: string; // 消息id
    payload: string; // 消息内容

    at: string; // 会话是否有@我的标识符

    replyMsgId: string; // 回复消息ID
    replyContent: string; // 回复内容

    clientTime: string; // 客户端时间
    serverTime: bigint; // 服务端时间

    cMsgId: bigint; // 客户端唯一消息id
    msgStatus: number; // 业务状态

    extends: string[]; // 扩展字段
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
    login(loginInfo: ILoginInfo) {
        return new Promise((resolve, reject) => {

            this.destoryClient()

            // 发起一次连接
            this.client = mqtt.connect("websockets://localhost:9001", {
                username: loginInfo.username,
                password: loginInfo.password,
                clean: false, // 保持会话
            });

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
    async sendMsg(msg: IMsg) {
        if (!this.client) {
            throw new Error("未登陆")
        }

        const topic = `${msgTopicPrefix}/${msg.chatType == IChatType.GROUP_CHAT ? "GROUP" : ""}${msg.to}/${msg.from}`
        return await this.client.publishAsync(topic, JSON.stringify(msg), { qos: 0 })
    }
}

export default ChatProtocol

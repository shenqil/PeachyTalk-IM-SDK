/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-04-28 18:42:23
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-05-23 15:45:14
 * @FilePath: \PeachyTalk-IM-SDK\lib\protocolLayer\mqtt\mqtt.ts
 * @Description: 传输层实现
 */
import mqtt, { MqttClient } from "mqtt"
import log from "@/utils/log"
import EventBus from "@/utils/eventBus"
import { EDisconnectType, ETransportLayerEventName, IConnectOpts, IConnectStatus, ATransportLayer, ITransportLayerEvent, TransportLayerEventName, clientId } from "@/transportLayer"


class TransportLayer implements ATransportLayer {
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


    /**
     * 发起一次连接
     * @param opt 
     */
    connect(opts: IConnectOpts): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            log.info('[mqtt][login]');

            this.destoryClient()
            this.connectStatus = "CONNECTING"

            // 发起一次连接
            this.#client = mqtt.connect(opts.brokerUrl, {
                protocol: "mqtt",
                encoding: "binary",
                protocolVersion: 5,
                username: opts.username,
                password: opts.password,
                clientId: `${opts.username}-${clientId}`,
                clean: false, // 保持会话
                connectTimeout: 4000,
                reconnectPeriod: 0, // 禁止自动重连
                properties: {
                    sessionExpiryInterval: 0xFFFFFFFF, // 0xFFFFFFFF（永不过期）
                    receiveMaximum: 0, // 表示服务器愿意同时处理的最大QoS 1和QoS 2消息的数量
                    maximumPacketSize: 0, // 指定客户端愿意接收的最大数据包大小
                }
            });

            // 接受消息
            this.#client.on("message", this.onMessage.bind(this))

            // 监听连接成功事件
            this.#client.on('connect', () => {
                log.info('[mqtt][login] Connected to MQTT server');
                this.connectStatus = "CONNECTED"
                resolve(true)
            });

            // 监听连接错误事件
            this.#client.on('error', (error) => {
                this.#lastDisconnectReason = {
                    type: EDisconnectType.WS_ERROR,
                    reason: error
                }
                log.error('[mqtt][login] Connection to MQTT server failed:', error);
                this.connectStatus = "DISCONNECTED"
                reject(error)
            });

            // 监听断开连接事件
            this.#client.on('close', () => {
                this.#lastDisconnectReason = {
                    type: EDisconnectType.WS_CLOSE
                }
                log.info('[mqtt][login] Disconnected from MQTT server');
                this.connectStatus = "DISCONNECTED"
                reject("onclose")
            });

        })
    }

    /**
     * 断开连接
     */
    disconnect() {
        log.info('[mqtt][logout]');
        this.#lastDisconnectReason = {
            type: EDisconnectType.NORMAL
        }
        this.connectStatus = "DISCONNECTED"
        this.destoryClient()
    }

    /**
     * 发送数据
     * @param msg 
     * @returns 
     */
    async send(topic: string, data: Uint8Array): Promise<mqtt.Packet | undefined> {
        if (!this.#client) {
            throw new Error("未登陆")
        }
        const res = await this.#client.publishAsync(topic, Buffer.from(data), { qos: 1 })
        return res
    }

    /**
     * 接受消息
     * @param topic 
     * @param message 
     */
    private onMessage(topic: string, message: Uint8Array) {
        this.#eventBus.emit(ETransportLayerEventName.MESSAGE_RECEIVED, topic, message)
    }

    /**
     * 订阅主题
     * @param topic 
     */
    async subscribeTopic(topic: string) {
        return this.#client?.subscribeAsync(topic, { qos: 1 })
    }

    /**
     * 监听事件
     * @param name 
     * @param handle 
     * @returns Function
     */
    addEventListener<K extends TransportLayerEventName>(
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
        this.disconnect()
        this.#eventBus.clear()
    }

    /**
     * 获取连接状态
     * */
    getConnectStatus(): IConnectStatus {
        return this.connectStatus
    }
}

export default TransportLayer

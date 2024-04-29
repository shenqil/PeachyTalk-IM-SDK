/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-04-28 18:42:23
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-04-29 10:29:51
 * @FilePath: \PeachyTalk-IM-SDK\lib\protocolLayer\mqtt\mqtt.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import mqtt, { MqttClient } from "mqtt"

interface ILoginInfo {
    username: string,
    password: string
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
                password: loginInfo.password
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
}

export default ChatProtocol

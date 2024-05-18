import mqtt from "mqtt";
import { IConnectOpts, IConnectStatus, ATransportLayer, ITransportLayerEvent, TransportLayerEventName } from "@/transportLayer";
declare class TransportLayer implements ATransportLayer {
    #private;
    get connectStatus(): IConnectStatus;
    set connectStatus(v: IConnectStatus);
    constructor();
    /**
     * 销毁实例
     */
    private destoryClient;
    /**
     * 发起一次连接
     * @param opt
     */
    connect(opts: IConnectOpts): Promise<Boolean>;
    /**
     * 断开连接
     */
    disconnect(): void;
    /**
     * 发送数据
     * @param msg
     * @returns
     */
    send(topic: string, data: Uint8Array): Promise<mqtt.Packet | undefined>;
    /**
     * 接受消息
     * @param topic
     * @param message
     */
    private onMessage;
    /**
     * 订阅主题
     * @param topic
     */
    subscribeTopic(topic: string): Promise<mqtt.ISubscriptionGrant[] | undefined>;
    /**
     * 监听事件
     * @param name
     * @param handle
     * @returns Function
     */
    addEventListener<K extends TransportLayerEventName>(name: K, handle: ITransportLayerEvent[K]): Function;
    /**
     * 销毁
     */
    destroy(): void;
    /**
     * 获取连接状态
     * */
    getConnectStatus(): IConnectStatus;
}
export default TransportLayer;

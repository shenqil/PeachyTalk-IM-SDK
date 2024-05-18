import { AProtocolLayer, ILoginInfo, IProtocolLayerEvent, Message, ProtocolLayerEventName } from "..";
declare class ProtocolLayer implements AProtocolLayer {
    #private;
    constructor();
    /**
     * 开始登陆
     * @param info
     */
    login(info: ILoginInfo): Promise<boolean>;
    /**
     * 退出登陆
     */
    logout(): void;
    /**
     * 发送消息
     * @param msg
     */
    sendMsg(msg: Message): Promise<boolean>;
    /**
     * 监听事件
     * @param name
     * @param handle
     */
    addEventListener<K extends ProtocolLayerEventName>(name: K, handle: IProtocolLayerEvent[K]): Function;
    /**
     * 销毁
     */
    destroy(): void;
}
export default ProtocolLayer;

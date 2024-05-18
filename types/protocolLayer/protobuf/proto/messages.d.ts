import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { MessageType as MessageType$ } from "@protobuf-ts/runtime";
/**
 * *
 * 消息
 *
 * @generated from protobuf message im.Message
 */
export interface Message {
    /**
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * @generated from protobuf field: string from = 2;
     */
    from: string;
    /**
     * @generated from protobuf field: string to = 3;
     */
    to: string;
    /**
     * @generated from protobuf field: im.ChatType chatType = 4;
     */
    chatType: ChatType;
    /**
     * @generated from protobuf field: im.MessageType type = 5;
     */
    type: MessageType;
    /**
     * @generated from protobuf field: string payload = 6;
     */
    payload: string;
    /**
     * @generated from protobuf field: int64 timestamp = 7;
     */
    timestamp: bigint;
    /**
     * @generated from protobuf field: im.MessageStatus status = 8;
     */
    status: MessageStatus;
    /**
     * @generated from protobuf field: bool recalled = 9;
     */
    recalled: boolean;
    /**
     * @generated from protobuf field: int64 recallTimestamp = 10;
     */
    recallTimestamp: bigint;
    /**
     * @generated from protobuf field: bool deleted = 11;
     */
    deleted: boolean;
    /**
     * @generated from protobuf field: int64 deleteTimestamp = 12;
     */
    deleteTimestamp: bigint;
    /**
     * @generated from protobuf field: string replyToMessageId = 13;
     */
    replyToMessageId: string;
    /**
     * 扩展字段1，留给服务端使用
     *
     * @generated from protobuf field: string serverExtension = 14;
     */
    serverExtension: string;
    /**
     * 扩展字段2，留给P2P客户端使用
     *
     * @generated from protobuf field: string clientExtension = 15;
     */
    clientExtension: string;
}
/**
 * *
 * 消息类型
 *
 * @generated from protobuf enum im.MessageType
 */
export declare enum MessageType {
    /**
     * *
     * 文本
     *
     * @generated from protobuf enum value: TEXT = 0;
     */
    TEXT = 0,
    /**
     * *
     * 图片
     *
     * @generated from protobuf enum value: IMAGE = 1;
     */
    IMAGE = 1,
    /**
     * *
     * 语音
     *
     * @generated from protobuf enum value: AUDIO = 2;
     */
    AUDIO = 2,
    /**
     * *
     * 视频
     *
     * @generated from protobuf enum value: VEDIO = 3;
     */
    VEDIO = 3,
    /**
     * *
     * 视频
     *
     * @generated from protobuf enum value: CUSTOM = 4;
     */
    CUSTOM = 4
}
/**
 * *
 * 聊天类型
 *
 * @generated from protobuf enum im.ChatType
 */
export declare enum ChatType {
    /**
     * *
     * 单聊消息
     *
     * @generated from protobuf enum value: CHAT = 0;
     */
    CHAT = 0,
    /**
     * *
     * 群聊消息
     *
     * @generated from protobuf enum value: GROUP_CHAT = 1;
     */
    GROUP_CHAT = 1,
    /**
     * *
     * 系统消息
     *
     * @generated from protobuf enum value: SYSTEM = 2;
     */
    SYSTEM = 2
}
/**
 * *
 * 消息确认状态
 *
 * @generated from protobuf enum im.MessageStatus
 */
export declare enum MessageStatus {
    /**
     * @generated from protobuf enum value: UNCONFIRMED = 0;
     */
    UNCONFIRMED = 0,
    /**
     * @generated from protobuf enum value: CONFIRMED = 1;
     */
    CONFIRMED = 1
}
declare class Message$Type extends MessageType$<Message> {
    constructor();
    create(value?: PartialMessage<Message>): Message;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Message): Message;
    internalBinaryWrite(message: Message, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message im.Message
 */
export declare const Message: Message$Type;
export {};

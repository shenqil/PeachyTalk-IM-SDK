/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-05-09 20:22:21
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-05-09 20:23:08
 * @FilePath: \PeachyTalk-IM-SDK\lib\utils\eventBus.ts
 * @Description: 发布订阅模式
 */
import log from "../utils/log";

type EventHandler<T extends any[]> = (...args: T) => void;

class EventBus<T extends Record<keyof T, EventHandler<any>>> {
  private events: any = {};

  on<K extends keyof T>(event: K, handler: T[K]): () => void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);

    // 返回一个函数，用于取消订阅
    return () => {
      this.off(event, handler);
    };
  }

  once<K extends keyof T>(event: K, handler: T[K]): () => void {
    const wrappedHandler: any = (...args: any) => {
      // 调用原始处理程序
      handler(...args);
      // 取消订阅
      this.off(event, wrappedHandler);
    };
    this.on(event, wrappedHandler);

    return () => {
      this.off(event, wrappedHandler);
    };
  }

  off<K extends keyof T>(event: K, handler?: T[K]): void {
    if (!handler) {
      // 如果没有传递处理程序，则清空指定事件下的所有处理程序
      delete this.events[event];
    } else {
      // 否则，移除特定事件的特定处理程序
      const handlers = this.events[event];
      if (handlers) {
        this.events[event] = handlers.filter((h: T[K]) => h !== handler);
      }
    }
  }

  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
    const handlers = this.events[event];
    if (handlers) {
      handlers.forEach((handler: T[K]) => {
        try {
          handler(...(args as any))
        } catch (error) {
          log.error(`[eventBus] 捕获到未知错误, event=${event.toString()} error=`, error)
        }
      });
    }
  }

  clear() {
    this.events = {};
  }
}

export default EventBus;

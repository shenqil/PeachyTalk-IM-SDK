type EventHandler<T extends any[]> = (...args: T) => void;
declare class EventBus<T extends Record<keyof T, EventHandler<any>>> {
    private events;
    on<K extends keyof T>(event: K, handler: T[K]): () => void;
    once<K extends keyof T>(event: K, handler: T[K]): () => void;
    off<K extends keyof T>(event: K, handler?: T[K]): void;
    emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void;
    clear(): void;
}
export default EventBus;

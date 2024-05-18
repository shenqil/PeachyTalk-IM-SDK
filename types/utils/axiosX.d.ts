import { AxiosRequestConfig } from "axios";
/**
 * 请求结果
 */
export interface RequestResult<D> {
    code: number;
    data: D;
    message: string;
}
/**
 * 常规请求
 * @param config
 * @returns
 */
export declare const request: (config: AxiosRequestConfig<any>) => Promise<any>;
/**
 * 文件服务器
 */
export declare const fileServer: import("axios").AxiosInstance;

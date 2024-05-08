/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-05-08 15:41:06
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-05-08 17:55:57
 * @FilePath: \PeachyTalk-IM-SDK\lib\utils\axiosX.ts
 * @Description: 封装axios功能
 */
import axios, { AxiosRequestConfig } from "axios";


/**
 * 请求结果
 */
export interface RequestResult<D> {
    code: number;
    data: D;
    message: string;
}
const apiServer = axios.create({
    baseURL: "/api",
    timeout: 10000,
    withCredentials: true,
});

apiServer.interceptors.request.use(
    (config) => {
        config.headers.Authorization =
            `Token`;
        return config;
    },
    (err) => {
        console.log(err);
    },
);
apiServer.interceptors.response.use(
    async (response) => {
        const res = response.data;
        switch (res.code) {
            case 0:
                return res;
            default:
                /**
                 * 有些局部需要根据code做定制化处理
                 */
                return Promise.reject(res);
        }
    },

    async (err) => {
        // 这里是AxiosError类型，所以一般我们只reject我们需要的响应即可
        return Promise.reject(err?.response || err);
    },
);

/**
 * 常规请求
 * @param config 
 * @returns 
 */
export const request = (config: AxiosRequestConfig<any>): Promise<any> => {
    return apiServer(config)
}

/**
 * 文件服务器
 */
export const fileServer = axios.create({
    baseURL: "/file-api/v1/files/",
    timeout: 0,
    withCredentials: true,
});
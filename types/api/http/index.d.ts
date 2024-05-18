export interface IUploadFileParams {
    file: File;
}
/**
 * 上传文件
 * @param params
 * @returns
 */
export declare const uploadFile: (params: IUploadFileParams) => Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    uploadFile: (params: IUploadFileParams) => Promise<import("axios").AxiosResponse<any, any>>;
};
export default _default;

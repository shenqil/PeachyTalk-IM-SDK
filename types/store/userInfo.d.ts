interface IUserInfo {
    userId: string;
    token: string;
}
export declare const setUserInfo: (info: IUserInfo | undefined) => void;
export declare const getUserInfo: () => IUserInfo | undefined;
export {};

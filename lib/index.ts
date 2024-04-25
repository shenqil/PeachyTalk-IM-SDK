

const instanceMap = new Map<string | number, any>()

export interface Options {
    appId: string;
    deviceId: string;
    token: string;
}

/**
 * @desc 创建实例
 * */
export function create(opts: Options) {
    const key = opts.appId
    let instance = instanceMap.get(key)

    return instance
}

export default {
    create,
}
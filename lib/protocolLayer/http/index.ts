import { fileServer } from "@/utils/axiosX"


export interface IUploadFileParams {
  file: File, // 文件
}

/**
 * 上传文件
 * @param params 
 * @returns 
 */
export const uploadFile = async (params: IUploadFileParams) => {
  if (!params.file.name) {
    throw "文件名称不存在"
  }

  if (!params.file.size) {
    throw "文件不能为空"
  }

  const res = await fileServer.post(params.file.name, {
    ...params
  }, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  )

  console.log(res)

  return res
}

export default {
  uploadFile
}
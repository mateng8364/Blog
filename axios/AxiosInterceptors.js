import axios from 'axios';

const CancelToken = axios.CancelToken
const axiosRequestTaskQueue = [];
const CANCEL_MESSAGE = 'INTERCEPT'
const SILENCE_PERIOD = 1000

const __removeRequestTaskQueue = function (type) {
  if (!type) return undefined
  let result = false
  for (let i = 0; i < axiosRequestTaskQueue.length; i++) {
    if (axiosRequestTaskQueue[i].type === type) {
      axiosRequestTaskQueue.splice(i, 1)
      result = true
      break
    }
  }
  return result
}

const __addRequestTaskQueue = function (type, cancel, message) {
  for (let i = 0; i < axiosRequestTaskQueue.length; i++) {
    if (axiosRequestTaskQueue[i].type === type) {
      return cancel(message)
    }
  }
  axiosRequestTaskQueue.push({cancel, type})
}

export const clearRequestTaskQueue = function () {
  axiosRequestTaskQueue.forEach(item => {
    item.cancel && item.cancel(CANCEL_MESSAGE)
  })
  axiosRequestTaskQueue.length = 0
}

class AxiosInterceptors {
  static requestInterceptor(config) {
    const type = config.baseURL + config.url + (config.data instanceof FormData ? String(config.data) : JSON.stringify(config.data))
    let cancel
    config.cancelToken = new CancelToken(c => cancel = c)
    __addRequestTaskQueue(type, cancel, `${config.url} intercept`)
    // 添加公共参数
    return config
  }

  static requestErrorInterceptor(error) {
    return Promise.reject(error)
  }

  static responseInterceptor(res) {
    const type = res.config.url + res.config.data
    setTimeout(() => {
      __removeRequestTaskQueue(type)
    }, SILENCE_PERIOD);
    // 添加统一处理
    return res.data
  }

  static responseErrorInterceptor(error) {
    if (axios.isCancel(error)) {
      return 
    }
    if (error.config) {
      const type = error.config.url + error.config.data
      setTimeout(() => {
        __removeRequestTaskQueue(type)
      }, SILENCE_PERIOD);
    }
    // 添加错误统一处理
    return Promise.reject(error)
  }
}

export default AxiosInterceptors
import axios from 'axios'
import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'
import { ElLoading } from 'element-plus'
import { ILoadingInstance } from 'element-plus/lib/el-loading/src/loading.type'

interface InterceptorHooks {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (error: any) => any

  responseInterceptor?: (response: AxiosResponse) => AxiosResponse
  responseInterceptorCatch?: (error: any) => any
}

interface MYRequestConfig extends AxiosRequestConfig {
  showLoading?: boolean
  interceptorHooks?: InterceptorHooks
}

interface MYData<T> {
  data: T
  returnCode: string
  success: boolean
}

class MYRequest {
  config: AxiosRequestConfig
  interceptorHooks?: InterceptorHooks
  showLoading: boolean
  loading?: ILoadingInstance
  instance: AxiosInstance

  constructor(options: MYRequestConfig) {
    this.config = options
    this.interceptorHooks = options.interceptorHooks
    this.showLoading = options.showLoading ?? true
    this.instance = axios.create(options)

    this.setupInterceptor()
  }

  setupInterceptor(): void {
    this.instance.interceptors.request.use(
      this.interceptorHooks?.requestInterceptor,
      this.interceptorHooks?.requestInterceptorCatch
    )
    this.instance.interceptors.response.use(
      this.interceptorHooks?.responseInterceptor,
      this.interceptorHooks?.responseInterceptorCatch
    )

    this.instance.interceptors.request.use((config) => {
      if (this.showLoading) {
        this.loading = ElLoading.service({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      }
      return config
    })

    this.instance.interceptors.response.use(
      (res) => {
        this.loading?.close()
        return res
      },
      (err) => {
        this.loading?.close()
        return err
      }
    )
  }

  request<T = any>(config: MYRequestConfig): Promise<T> {
    if (!config.showLoading) {
      this.showLoading = false
    }
    return new Promise((resolve, reject) => {
      this.instance
        .request<any, MYData<T>>(config)
        .then((res) => {
          resolve(res.data)
          this.showLoading = true
        })
        .catch((err) => {
          reject(err)
          this.showLoading = true
        })
    })
  }

  get<T = any>(config: MYRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' })
  }

  post<T = any>(config: MYRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' })
  }

  delete<T = any>(config: MYRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' })
  }

  patch<T = any>(config: MYRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PATCH' })
  }
}

export default MYRequest

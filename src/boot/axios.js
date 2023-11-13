import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { LocalStorage } from 'quasar'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: process.env.API_URL })

const tokenName = 'app_auth_token'

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // console.log(config)
    // config.time = { startTime: new Date() }
    if (LocalStorage.getItem(tokenName)) {
      config.headers.Authorization =
        'Bearer ' + LocalStorage.getItem(tokenName)
    } else {
      config.headers.Authorization = null
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // console.log(response)
    // response.config.time.endTime = new Date()
    // response.duration =
    //   response.config.time.endTime - response.config.time.startTime
    return response
  },
  (err) => {
    // console.log(err.response)
    return Promise.reject(err)
  }
)
export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }

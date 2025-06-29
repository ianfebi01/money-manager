// import axios, { AxiosError } from 'axios'
// import Cookies from 'universal-cookie'

import axios from 'axios'

// const cookie = new Cookies()

// const api = axios.create({
//   baseURL: '/api-web', // Replace with your API base URL
// })

// // Request interceptor
// api.interceptors.request.use(
//   async (config) => {
//     // Modify the request config here (add headers, authentication tokens)

//     console.log(cookie.get('accessToken'))

//     const accessToken = cookie.get('accessToken')

//     // If token is present add it to request's Authorization Header
//     if (accessToken) {
//       config.headers['Authorization'] = `Bearer ${accessToken}`
//     }
//     return config
//   },
//   (error) => {
//     // Handle request errors here

//     return Promise.reject(error)
//   }
// )
// // End of Request interceptor

// // Response interceptor
// api.interceptors.response.use(
//   (response) => {
//     // Modify the response data here

//     return response
//   },
//   (error:AxiosError) => {
//     // Handle response errors here

//     if(error.response?.status === 401){
//       console.log('gblok')
//     }

//     return Promise.reject(error)
//   }
// )
// // End of Response interceptor

// export default api

// import axios from "axios";

// const BASE_URL = '/api-web'
// export default axios.create({
//   baseURL: BASE_URL,
//   headers: { "Content-Type": "application/json" },
// });
// export const axiosAuth = axios.create({
//   baseURL: BASE_URL,
//   headers: { "Content-Type": "application/json" },
// });

const api = axios.create( {
  baseURL         : process.env.NEXT_PUBLIC_STRAPI_API_URL || '/api-web',
  headers         : { 'Content-Type' : 'application/json' },
  withCredentials : false,
} )

export default api

export const apiAuth = axios.create( {
  baseURL         : process.env.NEXT_PUBLIC_STRAPI_API_URL || '/api-web',
  headers         : { 'Content-Type' : 'application/json' },
  withCredentials : false,
} )

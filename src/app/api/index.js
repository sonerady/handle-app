// src/api.js
import axios from 'axios'
import {useGlobal} from '../context/AuthContext'

const instance = axios.create({
  baseURL: 'https://server.hypergpt.ai',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  },
})

export const useAPI = () => {
  const {accessToken} = useGlobal()

  instance.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  return instance
}

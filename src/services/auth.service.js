import { api } from 'src/boot/axios'

export async function login (data) {
  return new Promise((resolve, reject) => {
    api.post('/v1/auth/login', data)
      .then(response => {
        resolve(response?.data)
      })
      .catch(err => {
        reject(err?.response)
      })
  })
}

export async function register (data) {
  return new Promise((resolve, reject) => {
    api.post('/v1/auth/register', data)
      .then(response => {
        resolve(response?.data)
      })
      .catch(err => {
        reject(err?.response)
      })
  })
}

export async function getProfile () {
  return new Promise((resolve, reject) => {
    api.get('/v1/auth/check')
      .then(response => {
        resolve(response?.data)
      })
      .catch(err => {
        reject(err?.response)
      })
  })
}

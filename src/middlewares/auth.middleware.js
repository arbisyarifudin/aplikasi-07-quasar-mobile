// Membuat middleware untuk mengecek apakah user sudah login atau belum
// Jika belum login, redirect ke halaman login

import { LocalStorage, Notify } from 'quasar'
import { getProfile } from 'src/services/auth.service'

export default async function auth ({ to, from, next }) {
  // get referrer route
  const referrer = to.fullPath

  // Fungsi untuk menghandle error (dipakai nanti di bawah)
  const handleError = () => {
    Notify.create({
      message: 'Anda belum login',
      color: 'negative',
      position: 'top',
      timeout: 3000,
      icon: 'fas fa-exclamation-triangle'
    })
    LocalStorage.remove('app_auth_token')
    LocalStorage.remove('app_auth_user')
    return next({ name: 'Login Page', query: { referrer } })
  }

  // Cek apakah app_auth_token ada?
  // Jika tidak ada, maka redirect ke halaman login
  if (!LocalStorage.has('app_auth_token')) {
    Notify.create({
      message: 'Anda belum login',
      color: 'negative',
      position: 'top',
      timeout: 3000,
      icon: 'fas fa-exclamation-triangle'
    })
    LocalStorage.remove('app_auth_user')
    return next({ name: 'Login Page', query: { referrer } })
  } else {
    // Jika app_auth_token ada, maka ambil profile user dengan membawa token
    // Jika gagal, maka redirect ke halaman login
    await getProfile(LocalStorage.getItem('app_auth_token'))
      .then(response => {
        if (response.success) {
          // Jika berhasil, maka simpan data user ke dalam local storage
          LocalStorage.set('app_auth_user', response.data)
        } else {
          // Panggil fungsi handleError() yang sudah dibuat di atas
          handleError()
        }
      })
      .catch(handleError)
  }

  return next()
}

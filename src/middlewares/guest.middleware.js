// Membuat middleware untuk mengecek apakah user sudah login atau belum
// jika sudah login, maka redirect ke halaman dashboard

import { LocalStorage, Notify } from 'quasar'
import { getProfile } from 'src/services/auth.service'

export default async function guest ({ to, from, next }) {
  if (LocalStorage.has('app_auth_token')) {
    // Jika app_auth_token ada, maka ambil profile user dengan membawa token
    // Jika berhasil, maka redirect ke halaman dashboard
    await getProfile(LocalStorage.getItem('app_auth_token'))
      .then(response => {
        if (response.success) {
          // Simpan data user ke dalam local storage
          LocalStorage.set('app_auth_user', response.data)
          Notify.create({
            message: 'You are already logged in',
            color: 'negative',
            position: 'top',
            timeout: 3000,
            icon: 'fas fa-exclamation-triangle'
          })
          return next({ name: 'Dashboard Page' })
        }
      }).catch(() => {
        // Jika gagal, maka hapus token dan user dari local storage
        LocalStorage.remove('app_auth_token')
        LocalStorage.remove('app_auth_user')
      })
  }

  return next()
}

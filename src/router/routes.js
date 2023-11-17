import auth from 'src/middlewares/auth.middleware'
import guest from 'src/middlewares/guest.middleware'

const routes = [
  // auth routes
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login Page',
        meta: {
          title: 'Login',
          middleware: guest
        },
        component: () => import('pages/auth/LoginPage.vue')
      },
      {
        path: 'register',
        name: 'Register Page',
        meta: {
          title: 'Register',
          middleware: guest
        },
        component: () => import('pages/auth/RegisterPage.vue')
      },
      {
        path: 'verify-email',
        name: 'Verify Email Page',
        meta: {
          title: 'Verifiying Email'
          // middleware: guest
        },
        component: () => import('pages/auth/VerifyEmailPage.vue')
      },
      {
        path: 'change-password',
        name: 'Change Password Page',
        meta: {
          title: 'Change Password',
          middleware: guest
        },
        component: () => import('pages/auth/ChangePasswordPage.vue')
      },
      {
        path: 'recovery/forgot-password',
        name: 'Forgot Password Page',
        meta: {
          title: 'Forgot Password'
          // middleware: guest
        },
        component: () => import('pages/recovery/ForgotPasswordPage.vue')
      },
      {
        path: 'recovery/forgot-password-verify',
        name: 'Forgot Password Verify Page',
        meta: {
          title: 'Forgot Password Request Verification'
          // middleware: guest
        },
        component: () => import('pages/recovery/ForgotPasswordVerifyPage.vue')
      },
      {
        path: 'recovery/reset-password',
        name: 'Reset Password Page',
        meta: {
          title: 'Reset Password',
          middleware: guest
        },
        component: () => import('pages/recovery/ResetPasswordPage.vue')
      }
    ]
  },

  // main routes
  {
    path: '/',
    redirect: '/dashboard',
    meta: {
      middleware: auth
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard Page',
        meta: {
          title: 'Dashboard'
        },
        component: () => import('pages/main/dashboard/IndexPage.vue')
      },

      // CONSTITUENT
      {
        path: 'constituent',
        name: 'Constituent Index Page',
        meta: {
          title: 'Konstituen'
        },
        component: () => import('pages/main/constituent/IndexPage.vue')
      },
      {
        path: 'constituent/select-area',
        name: 'Constituent Select Area Page',
        meta: {
          title: 'Pilih Wilayah Kerja'
        },
        component: () => import('pages/main/constituent/SelectAreaPage.vue')
      },
      {
        path: 'constituent/create',
        name: 'Constituent Create Page',
        meta: {
          title: 'Tambah Konstituen'
        },
        component: () => import('pages/main/constituent/CreatePage.vue')
      },
      {
        path: 'constituent/edit/:id',
        name: 'Constituent Edit Page',
        meta: {
          title: 'Ubah Konstituen'
        },
        component: () => import('pages/main/constituent/EditPage.vue')
      },

      // TPS
      {
        path: 'tps',
        name: 'TPS Index Page',
        meta: {
          title: 'Daftar TPS'
        },
        component: () => import('pages/main/tps/IndexPage.vue')
      },
      // {
      //   path: 'tps/select-polling',
      //   name: 'TPS Select Polling Page',
      //   meta: {
      //     title: 'Pilih Pemilihan Umum'
      //   },
      //   component: () => import('pages/main/tps/SelectPollingPage.vue')
      // },
      {
        path: 'tps/select-area',
        name: 'TPS Select Area Page',
        meta: {
          title: 'Pilih Wilayah Kerja'
        },
        component: () => import('pages/main/tps/SelectAreaPage.vue')
      },
      {
        path: 'tps/create',
        name: 'TPS Create Page',
        meta: {
          title: 'Tambah TPS'
        },
        component: () => import('pages/main/tps/CreatePage.vue')
      },
      {
        path: 'tps/edit/:id',
        name: 'TPS Edit Page',
        meta: {
          title: 'Ubah TPS'
        },
        component: () => import('pages/main/tps/EditPage.vue')
      },

      {
        path: 'setting',
        name: 'Setting Index Page',
        meta: {
          title: 'Pengaturan'
        },
        component: () => import('pages/main/setting/IndexPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

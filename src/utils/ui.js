import { QSpinnerGears, Loading, Notify } from 'quasar'

const showLoading = (show = true, message = 'Loading...') => {
  if (show) {
    Loading.show({
      spinner: QSpinnerGears,
      spinnerSize: 50,
      spinnerColor: 'white',
      backgroundColor: 'primary',
      messageColor: 'white',
      message
    })
  } else {
    Loading.hide()
  }
}

const showNotification = (message, color = 'positive', icon = '') => {
  Notify.create({
    message,
    color,
    position: 'top',
    icon,
    timeout: 2000
  })
}

export {
  showLoading,
  showNotification
}

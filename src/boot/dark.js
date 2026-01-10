import { Dark } from 'quasar'

export default () => {
  // Load saved theme on app startup
  const savedTheme = localStorage.getItem('theme') || 'light'

  switch (savedTheme) {
    case 'light':
      Dark.set(false)
      break
    case 'dark':
      Dark.set(true)
      break
    case 'system':
      Dark.set('auto')
      break
    default:
      Dark.set(false)
  }
}

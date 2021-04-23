export default function ({ store, redirect, route }) {
  if (!store.getters.isSessionConnected && route.path !== '/') {
    redirect('/')
  } else {
    return true
  }
}

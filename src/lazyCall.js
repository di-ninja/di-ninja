class LazyCall {
  constructor (callback) {
    this.callback = callback
  }
  run (...params) {
    return this.callback(...params)
  }
}
export default LazyCall

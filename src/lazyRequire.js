class LazyRequire {
  constructor (container, key, path, rulePath) {
    this.container = container
    this.key = key
    this.path = path
    this.rulePath = rulePath
  }
  require () {
    const {
      container,
      key,
      path,
      rulePath
    } = this
    const req = container.requireDep(key, path, rulePath)
    if (req) { return container.registerRequire(key, req) }
  }
}
export default LazyRequire

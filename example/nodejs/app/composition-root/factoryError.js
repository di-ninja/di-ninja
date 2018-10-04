export default ({
  factory
}) => {
  return new Proxy({}, {
    get: (o, name) => {
      if (typeof name === 'symbol') {
        return o[name]
      }
      if (!o[name]) {
        o[name] = factory(name)
      }
      return o[name]
    }

  })
}

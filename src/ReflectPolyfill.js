export default class ReflectPolyfill {
  static ownKeys(o){
    return Object.getOwnPropertyNames(o).concat(Object.getOwnPropertySymbols(o))
  }
  static apply(fn, o, params){
    return fn.apply(o, params)
  }
  static getPrototypeOf(o){
    return Object.getPrototypeOf(o)
  }
  static defineProperty(target, prop, descriptor){
    let error
    try{
      Object.defineProperty(target, prop, descriptor)
      error = false
    }
    catch(e){
      error = true
    }
    return error
  }
  /* ... */
  /* implementing only used methods */
}

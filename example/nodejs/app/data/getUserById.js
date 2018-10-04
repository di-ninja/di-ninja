export default function(){
  return function getUserById(id){
    return require('./users').default[id]
  }
}

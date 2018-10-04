export default function(){
  return function getUserList(){
    return Object.values( require('./users').default )
  }
}

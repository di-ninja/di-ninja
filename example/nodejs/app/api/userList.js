export default function({
  data: {
    getUserList,
  },
}){

  return function userList(){
    return getUserList()

  }
}

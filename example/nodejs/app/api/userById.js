export default function({
  data: {
    getUserById,
  },
}){

  return function userById(id){

    return getUserById(id)

  }
}

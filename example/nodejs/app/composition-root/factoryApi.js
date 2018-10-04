export default function (di){

  return new Proxy({}, {
    get(o, name){
      if (typeof name === 'symbol')
        return o[name]

      const module = 'app/api/'+name
      if(!di.exists(module)){
        return false
      }

      return async function(request, response){

        const context = await di.get('$context', [
          '#di',
          di.value({
            request,
            response,
          }),
        ])

        const apiMethod = await di.get(module, [
          di.value(context),
        ])

        apiMethod.context = context

        return apiMethod

      }

    }
  })

}

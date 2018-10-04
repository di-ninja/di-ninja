import bodyParser from 'body-parser'

export default function createServer ({
  server,
  app,
  config: {
    SERVER_PORT,
  },
  factoryApi,
  error: {
    HttpErrorInterface,
    HttpError,
    UserError,
  },
}) {

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))

  app.use( '/api', async function apiLoader(req, res, next) {

    const requestParams = req.method === 'POST' ? req.body : req.query

    let {
      method,
      params = [],
    } = requestParams

    let result
    let code = 200

    try{

      if(!method){
        throw new HttpError(400)
      }

      if(!(params instanceof Array)){
        params = [params]
      }

      const apiFactoryMethod = factoryApi[method]

      if(!apiFactoryMethod){
        throw new HttpError(404, 'unknown method: '+method)
      }


      const apiMethod = await apiFactoryMethod(req, res)

      let error
      try{
        result = await apiMethod(...params)
      }
      catch(e){
        error = e
      }

      apiMethod.context.release()

      if(error){
        throw error
      }

    }
    catch(error){
      if(error instanceof UserError){
        code = 200
      }
      else if(error instanceof HttpErrorInterface){
        code = error.code
      }
      else {
        code = 500
        console.error(error.stack)
      }
      const message = error.message
      result = {error: message}
      result.details = error
    }


    if(result !== undefined){
      res
        .status(code)
        .json(result)
    }
    else{
      res.end()
    }

  })

  server.listen(SERVER_PORT, () => {
    console.log(`Server is running on ${SERVER_PORT}`)
  })
}

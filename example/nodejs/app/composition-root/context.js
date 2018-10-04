import path from 'path'

import dependencies from './dependencies'
import config from '../config'

async function createContext(di, {
  request = {},
  response = {},
}){

  const sharedInTree = {
    // '#aFactory' : ()=>context.object,
  }

  let context

  function getContextParam(){
    return di.value(context)
  }

  const backgroundProcessStack = []

  context = Object.create({

    get data(){
      return new Proxy({}, {
        get(o, name){
          const module = 'app/data/'+name
          if(!di.exists(module)) return
          return di.get(module, [ getContextParam() ] , sharedInTree)
        }
      })
    },

    get request(){
      return request
    },
    get session(){
      return request.session
    },
    get files(){
      return request.files
    },

    get response(){
      return response
    },

    async release(){
      if(backgroundProcessStack.length){
        await Promise.all(backgroundProcessStack)
      }
      if(this._dbConnection){
        const conn = await this._dbConnection
        this.dbPool.releaseConnection(conn)
      }
    },
    async backgroundProcess(callback){
      setImmediate(()=>{
        backgroundProcessStack.push( callback() )
      })
    }

  })

  return context
}

export default createContext

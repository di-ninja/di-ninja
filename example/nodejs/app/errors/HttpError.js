import HttpError from "standard-http-error"
import { instanceOf } from 'di-ninja'

export default function({
  error: {
    HttpErrorInterface,
  },
}){

  instanceOf(HttpErrorInterface)(HttpError)

  return HttpError
}

import StandardError from "standard-error"
export default function(){
  class UserError extends StandardError{
    
  }
  return UserError
}

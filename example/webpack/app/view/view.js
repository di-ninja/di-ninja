import { render } from 'react-dom'

import 'bulma'
import './layout.scss'

export default ({
  containerFactory : {
    ExampleHome,
  }
}) => {

  const mountNode = document.getElementById('app')

  const componentTree = (
    <ExampleHome  />
  )

  render(componentTree, mountNode)
}

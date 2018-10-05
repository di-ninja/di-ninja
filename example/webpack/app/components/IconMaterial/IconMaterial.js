import {Component} from 'react'

import MdiIcon from '@mdi/react'
import * as icons from '@mdi/js'

function capitalizeFirstLetter(a){
  return a.slice(0,1).toUpperCase()+a.slice(1)
}

export default function({
  componentFactory:{
    Icon,
  }
}){
  class IconMaterial extends Component{
    static defaultProps = {
      containerProps: {},
    }
    render(){
      const {
        as,
        large,
        left,
        medium,
        right,
        small,

        containerProps,

        icon,

        ...props
      } = this.props

      Object.assign(containerProps,{
        as,
        large,
        left,
        medium,
        right,
        small,
      })

      const iconKey = 'mdi'+capitalizeFirstLetter(icon)
      const path = icons[iconKey]

      return (
        <Icon {...containerProps}>
          <MdiIcon
            path={path}
            {...props}
          />
        </Icon>
      )
    }
  }
  return IconMaterial
}

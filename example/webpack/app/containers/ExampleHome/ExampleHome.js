import { Component } from 'react'
import css from './ExampleHome.module.scss'

export default function ({
  componentFactory: {
    IconMaterial,
  },
}){
  return class ExampleHome extends Component{
    render(){
      const iconProps = {
        containerProps: {
          className: css.icon,
        },
      }
      return (
        <div className="container">
          <div className="hero">
            <div className="hero-body">
              <div className={css.title}>

                  <IconMaterial icon="ninja" {...iconProps} />
                  Di Ninja
                  implementation example with
                  <br />
                  <IconMaterial icon="webpack" {...iconProps} />
                  Webpack
                  and
                  <IconMaterial icon="react" {...iconProps} />
                  React

              </div>

            </div>
          </div>
        </div>
      )
    }
  }
}

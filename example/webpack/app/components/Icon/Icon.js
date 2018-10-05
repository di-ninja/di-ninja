import {Component} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default function(){
  class Icon extends Component{
    static propTypes = {
      as: PropTypes.node,
      className: PropTypes.string,
      large: PropTypes.bool,
      left: PropTypes.bool,
      medium: PropTypes.bool,
      right: PropTypes.bool,
      small: PropTypes.bool
    }

    static defaultProps = {
      as: 'span'
    }

    render(){
      const {
        as: Span,
        large,
        left,
        medium,
        right,
        small,
        className,
        ...props
      } = this.props

      const classes = classNames('icon', {
        'is-small': small,
        'is-medium': medium,
        'is-large': large,
        'is-left': left,
        'is-right': right
      }, className)

      return <Span className={classes} {...props} />
    }
  }
  return Icon
}

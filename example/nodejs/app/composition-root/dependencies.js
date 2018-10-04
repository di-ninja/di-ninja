import container from 'di-ninja'

require.context = container.context

export default {
  'app/api': require.context('../api', true, /\.js$/),
  'app/data': require.context('../data', true, /\.js$/),
  'app/errors': require.context('../errors', true, /\.js$/),
}

import container from 'di-ninja'

export default {
  'app/view': require.context('app/view', true, /\.js$/),
  'app/containers': require.context('app/containers', true, /\.js$/),
  'app/components': require.context('app/components', true, /\.js$/),
}

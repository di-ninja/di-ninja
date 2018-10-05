module.exports = ({ file, options, env }) => {
  env = env || {};
  file = file || {};
  options = options || {};
  options.cssnext = options.cssnext || null;
  options.autoprefixer = options.autoprefixer || null;
  options.cssnano = options.cssnano || null;
  return {
    parser: file.extname === '.sss' ? 'sugarss' : false,
    plugins: {
      'postcss-preset-env': options['postcss-preset-env'] ? options['postcss-preset-env'] : false,
      'autoprefixer': env === 'production' ? options.autoprefixer : false,
      'cssnano': env === 'production' ? options.cssnano : false,
    }
  }
}

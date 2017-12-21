const regex = /^[a-zA-Z]{1}:[\\/]|[\\\\]/
export default function (path) {
  return regex.test(path)
}

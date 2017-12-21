//from https://github.com/sindresorhus/path-is-absolute

const splitDeviceRe = /^([a-zA-Z]:|[\\/]{2}[^\\/]+[\\/]+[^\\/]+)?([\\/])?([\s\S]*?)$/;
export default function(path){
  const result = splitDeviceRe.exec(path);
  const device = result[1] || '';
  const isUnc = Boolean(device && device.charAt(1) !== ':');

  // UNC paths are always absolute
  return Boolean(result[2] || isUnc);
}

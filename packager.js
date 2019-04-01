const packager = require('electron-packager');
const path = require('path');
const rebuild = require('electron-rebuild').default;

const platform = process.argv[2];

packager({
  afterCopy: [
    function (buildPath, electronVersion, platform, arch, callback) {
      rebuild({ arch, buildPath, electronVersion, force: true })
        .then(() => callback(null))
        .catch(callback);
    }
  ],
  arch: 'x64',
  asar: true,
  dir: __dirname,
  icon: path.join('resources', `icon.${platform === 'darwin' ? 'icns' : 'png'}`),
  out: 'out',
  overwrite: true,
  platform,
  prune: true
});

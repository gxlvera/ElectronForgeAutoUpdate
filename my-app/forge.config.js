const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'gxlvera',
          name: 'gxlvera.github.io',
        },
        prerelease: false,
        draft: true,
        private: true,
        authToken: process.env.GITHUB_TOKEN 
      },
    },
  ],
  hooks: {
    // 在打包完成后执行该钩子
    async afterPack(context) {
      // 创建 app-update.yml 文件的内容
      const appUpdateConfig = `
provider: github
owner: your-github-username
repo: your-repo-name
`;

      // 获取打包后的应用路径
      const appPath = path.join(context.appOutDir, 'resources', 'app-update.yml');

      // 将 app-update.yml 文件写入 resources 目录
      fs.writeFileSync(appPath, appUpdateConfig);
      
      console.log(`app-update.yml successfully created at ${appPath}`);
    }
  },
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

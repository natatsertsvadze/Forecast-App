
export default {
  basePath: 'https://natatsertsvadze.github.io/Forecast-App',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};

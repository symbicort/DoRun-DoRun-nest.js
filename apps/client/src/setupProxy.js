const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/users', {
      //target: 'https://43.203.227.36.sslip.io/server',
      target: 'http://localhost:3050',
      changeOrigin: true,
    }),
  );
};
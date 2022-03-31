const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  const proxy = createProxyMiddleware('/api/socket', {
    changeOrigin: true,
    target: 'ws://localhost:5001',
    ws: true
  });

  app.use('/api/socket', proxy);
};

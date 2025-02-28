const http = require('http');
const https = require('https');
const { URL } = require('url');
const fetch = require('node-fetch');

// 设置 CORS 头部
function setCorsHeaders(headers) {
  headers['Access-Control-Allow-Origin'] = '*';
  headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
  headers['Access-Control-Allow-Headers'] = '*';
}

// 创建 HTTP 服务器
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const targetUrl = `https://api.weixin.qq.com${url.pathname}${url.search}`;

  const proxyRequest = {
    method: req.method,
    headers: req.headers,
  };

  if (req.method === 'POST' || req.method === 'PUT') {
    proxyRequest.body = req;
  }

  try {
    const response = await fetch(targetUrl, proxyRequest);
    const proxyResponseHeaders = {};
    response.headers.forEach((value, name) => {
      proxyResponseHeaders[name] = value;
    });

    setCorsHeaders(proxyResponseHeaders);

    res.writeHead(response.status, response.statusText, proxyResponseHeaders);
    response.body.pipe(res);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
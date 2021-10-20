const express = require('express');
const app = express();

app.get('/abc', (req, res) => {
  // console.log(req)
  const array = [{
    a: 1,
    b: 2
  }]
  res.send(array);
})

app.listen('8080', () => {
  console.log(`服务运行在8080端口成功`)
})
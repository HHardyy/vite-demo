#! /usr/bin/env node
// 固定写法，可执行脚本
const createServer = require('../index')

// 创建一个服务
createServer().listen(12315, () => { 
  console.log('start at port http://localhost:12315')
})
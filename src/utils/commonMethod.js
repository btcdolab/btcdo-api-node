/*
  常用方法
*/
var apiMethod = require('./apiMethod.js')

// 等待n毫秒，配合await使用
function sleep(time) {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, time)
  })
}


// 挂买单  参数按顺序为 价格 数量 币对 是否燃烧BDB
function createBuyOrder(price, amount, symbol, fireBDB = true) {
  return apiMethod.createOrder({
    price,
    amount,
    symbol,
    customFeatures: fireBDB && 65536 || 0,
    orderType: 'BUY_LIMIT'
  })
}

// 挂卖单 参数按顺序为 价格 数量 币对 是否燃烧BDB
function createSaleOrder(price, amount, symbol, fireBDB = true) {
  return apiMethod.createOrder({
    price,
    amount,
    symbol,
    customFeatures: fireBDB && 65536 || 0,
    orderType: 'SELL_LIMIT'
  })
}

// 撤买单 参数按顺序为 订单ID 币对
function cancelBuyOrder(targetOrderId, symbol) {
  return apiMethod.createOrder({
    targetOrderId,
    symbol,
    orderType: 'CANCEL_BUY_LIMIT',
  })
}


// 撤卖单 参数按顺序为 订单ID 币对
function cancelSaleOrder(targetOrderId, symbol) {
  return apiMethod.createOrder({
    targetOrderId,
    symbol,
    orderType: 'CANCEL_SELL_LIMIT',
  })
}


// 找到当前未成交的卖单 参数分别为 币对 开始编号 查询个数 均为可选参数，如果不指定，默认查所有币种的100条数据
async function findSaleOrder(symbol, offsetId = 0, limit = 100) {
  let ans = []
  await apiMethod.getLatelyTransactionRecord(offsetId = 0, limit = 100, symbol).then(res => {
    res.orders && res.orders.forEach((v, i) => {
      if ((symbol ? v.symbol === symbol : true) && v.status !== 'PARTIAL_CANCELLED' && v.status !== 'FULLY_CANCELLED' && v.status !== 'FULLY_FILLED' && v.type === 'SELL_LIMIT') {
        ans.push({
          id: v.id,
          symbol: v.symbol,
          status: v.status,
          type: v.type
        })
      }
    })
  })
  // console.warn('this is ans', ans);
  return ans
}

// 找到当前未成交的买单 参数分别为 币对 开始编号 查询个数 均为可选参数，如果不指定，默认查所有币种的100条数据
async function findBuyOrder(symbol, offsetId = 0, limit = 100) {
  let ans = []
  await apiMethod.getLatelyTransactionRecord(offsetId = 0, limit = 100, symbol).then(res => {
    res.orders && res.orders.forEach((v, i) => {
      if ((symbol ? v.symbol === symbol : true) && v.status !== 'PARTIAL_CANCELLED' && v.status !== 'FULLY_CANCELLED' && v.status !== 'FULLY_FILLED' && v.type === 'BUY_LIMIT') {
        ans.push({
          id: v.id,
          symbol: v.symbol,
          status: v.status,
          type: v.type
        })
      }
    })
  })
  // console.warn('this is ans', ans);
  return ans
}

// 找到当前未成交的所有订单 参数分别为 币对 开始编号 查询个数 均为可选参数，如果不指定，默认查所有币种的100条数据
async function findAllOrder(symbol, offsetId = 0, limit = 100) {
  let ans = []
  await apiMethod.getLatelyTransactionRecord(offsetId = 0, limit = 100, symbol).then(res => {
    res.orders && res.orders.forEach((v, i) => {
      if ((symbol ? v.symbol === symbol : true) && v.status !== 'PARTIAL_CANCELLED' && v.status !== 'FULLY_CANCELLED' && v.status !== 'FULLY_FILLED') {
        ans.push({
          id: v.id,
          symbol: v.symbol,
          status: v.status,
          type: v.type
        })
      }
    })
  })
  // console.warn('this is ans', ans);
  return ans
}


// 撤销所有订单
async function cancelAllOrder() {
  
}






module.exports = {
  sleep, // 等待n毫秒，配合await使用
  createBuyOrder, // 挂买单
  createSaleOrder, // 挂卖单
  cancelBuyOrder, // 撤买单
  cancelSaleOrder, // 撤卖单
  findSaleOrder, // 找到当前未成交的卖单
  findBuyOrder, // 找到当前未成交的买单
  findAllOrder, // 找到当前未成交的所有订单
}

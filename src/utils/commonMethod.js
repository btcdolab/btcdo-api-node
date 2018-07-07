/*
  常用方法
*/
var apiMethod = require('./apiMethod.js')
var Decimal = require('Decimal.js')

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
  }, true)
}


// 撤卖单 参数按顺序为 订单ID 币对
function cancelSaleOrder(targetOrderId, symbol) {
  return apiMethod.createOrder({
    targetOrderId,
    symbol,
    orderType: 'CANCEL_SELL_LIMIT',
  })
}


// 找到当前未成交的卖单 参数分别为 币对 开始编号 查询个数 均为可选参数，如果不指定，默认查所有币种的100条数据 返回数组 [{id:'订单id',symbol:'订单币对',status:'订单状态',type:'订单类型'}]
async function findSaleOrder(symbol, offsetId = 0, limit = 100) {
  let ans = []
  await apiMethod.getLatelyTransactionRecord(offsetId = 0, limit = 100, symbol).then(res => {
    typeof res === 'string' && (res = JSON.parse(res))
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

// 找到当前未成交的买单 参数分别为 币对 开始编号 查询个数 均为可选参数，如果不指定，默认查所有币种的100条数据 返回数组 [{id:'订单id',symbol:'订单币对',status:'订单状态',type:'订单类型'}]
async function findBuyOrder(symbol, offsetId = 0, limit = 100) {
  let ans = []
  await apiMethod.getLatelyTransactionRecord(offsetId = 0, limit = 100, symbol).then(res => {
    typeof res === 'string' && (res = JSON.parse(res))
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

// 找到当前未成交的所有订单 参数分别为 币对 开始编号 查询个数 均为可选参数，如果不指定，默认查所有币种的100条数据 返回数组 [{id:'订单id',symbol:'订单币对',status:'订单状态',type:'订单类型'}]
async function findAllOrder(symbol, offsetId = 0, limit = 100) {
  let ans = []
  await apiMethod.getLatelyTransactionRecord(offsetId = 0, limit = 100, symbol).then(res => {
    typeof res === 'string' && (res = JSON.parse(res))
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
  return ans
}

// 撤销一列订单 参数为撤销的订单数组 [{id:'订单id',symbol:'订单币对',type:'订单类型'}] 返回布尔值 是否撤销成功
async function cancelAppointedOrder(orderArr) {
  let cancelReady = true
  await Promise.all(orderArr.map((v, i) => {

    if (v.type === 'BUY_LIMIT') {
      return cancelBuyOrder(v.id, v.symbol)
    }
    if (v.type === 'SELL_LIMIT') {
      return cancelSaleOrder(v.id, v.symbol)
    }

  })).then(res => {

  }).catch(err => {
    cancelReady = false
  })
  return cancelReady
}


// 撤销所有订单 返回布尔值 是否全撤成功
async function cancelAllOrder() {
  let cancelOrderArr = await findAllOrder()
  return cancelAppointedOrder(cancelOrderArr)
}



// 获取最高的买单价格和最低的卖单价格 返回一个数组 [价格最高的买单 价格最低的卖单]
async function getLatelyBuyAndSalePrice(symbol) {
  let lastBuy, lastSale
  await apiMethod.getSpecifiedTradeDepth(symbol).then(res => {
    typeof res === 'string' && (res = JSON.parse(res))
    lastBuy = res.buyOrders.sort((a, b) => b.price - a.price).shift()
    lastSale = res.sellOrders.sort((a, b) => a.price - b.price).shift()
  })
  return [lastBuy, lastSale]
}

// 获取我的账户某个币种的信息 返回一个数组 [可用金额 冻结金额]
async function getSpecifiedAccount(currency) {
  let myCurrencyAvailable = new Decimal(0),
    myCurrencyFrozen = new Decimal(0)
  await apiMethod.getAccounts().then(res => {
    typeof res === 'string' && (res = JSON.parse(res))
    res.accounts && res.accounts.forEach((v, i) => {
      if (v.currency == currency) {
        if (v.type === 'SPOT_AVAILABLE') {
          myCurrencyAvailable = myCurrencyAvailable.plus(new Decimal(v.balance))
        }
        if (v.type === 'SPOT_FROZEN') {
          myCurrencyFrozen = myCurrencyFrozen.plus(new Decimal(v.balance))
        }
      }
    })
  })
  return [myCurrencyAvailable.toString(), myCurrencyFrozen.toString()]
}

// 加法
function accAdd(num1, num2) {
  return Decimal.add(num1, num2).toString()
}
// 乘法
function accMul(num1, num2) {
  return Decimal.mul(num1, num2).toString()
}

// 减法
function accSub(num1, num2) {
  return Decimal.sub(num1, num2).toString()
}

// 除法
function accDiv(num1, num2) {
  return Decimal.div(num1, num2).toString()
}

// 取平均数
function getAverage(num1, num2) {
  return (Decimal.add(num1, num2).div(2)).toString()
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
  cancelAppointedOrder, // 撤销一列订单
  cancelAllOrder, //撤销所有订单
  getLatelyBuyAndSalePrice, // 获取最高的买单价格和最低的卖单价格
  getSpecifiedAccount, // 获取我的账户某个币种的信息
  accAdd, // 精度加法
  accMul, // 精度乘法
  accSub, // 精度减法
  accDiv, // 精度除法
  getAverage, //精度取平均数
}

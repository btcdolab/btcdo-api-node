var apiMethod = require('./src/utils/apiMethod.js')
var commonMethod = require('./src/utils/commonMethod.js')

apiMethod.getAccounts().then(body => {
  // console.warn('this is fetch body', body)
})

apiMethod.getDepositRecord('ETH').then(body => {
  // console.warn('this is fetch body', body)
})

apiMethod.getCurrencyInfo().then(body => {
  // console.warn('this is fetch body', body)
})

apiMethod.getSpecifiedCurrencyInfo('ETH').then(body => {
  // console.warn('this is fetch body', body)
})

apiMethod.getErrorCode().then(body => {
  // console.warn('this is fetch body', body)
})



apiMethod.getSymbols().then(body => {
  // console.warn('this is fetch body', body)
})


apiMethod.getSystemTime().then(body => {
  // console.warn('this is fetch body', body)
})

apiMethod.getSpecifiedSymbol('BDB_ETH').then(body => {
  // console.warn('this is fetch body', body)
})

apiMethod.getSpecifiedSymbolTradeInfo('BDB_ETH', 'K_1_DAY').then(body => {
  // console.warn('this is fetch body', body)
})


apiMethod.getSpecifiedTradeDepth('BDB_ETH').then(body => {
  // console.warn('this is fetch body', body)
})

apiMethod.getAllSymbolTransactionInfo().then(body => {
  // console.warn('this is fetch body', body)
})

apiMethod.getLatelyTransactionRecord().then(body => {
  // console.warn('this is fetch body', body)
})

apiMethod.createOrder({}, true).then(body => {
  // console.warn('this is fetch body', body)
}).catch(err => {
  // console.warn('创建订单出错')
})

apiMethod.getOrderInfo(5801165).then(body => {
  // console.warn('this is fetch body', body)
})

apiMethod.getMatchesOrderInfo(5801165).then(body => {
  // console.warn('this is fetch body', body)
})

commonMethod.findSaleOrder()

console.warn("end")

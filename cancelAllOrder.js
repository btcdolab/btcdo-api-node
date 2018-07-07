var commonMethod = require('./src/utils/commonMethod.js');
var apiMethod = require('./src/utils/apiMethod.js');
var Decimal = require('Decimal.js')



async function cancelAll() {
  let myAllOrder = await commonMethod.findAllOrder()
  let cancelReady
  if (myAllOrder.length > 0)
    cancelReady = await commonMethod.cancelAppointedOrder(myAllOrder)
}



(async function() {
  cancelAll()
})()

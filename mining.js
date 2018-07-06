let apiMethod = require('./src/utils/apiMethod');

(async function mining() {

    let currentPrice
    let myCurrencyAvailable = 0
    let myCurrencyFrozen = 0
    let currency = 'BDB'

    await apiMethod.getAccounts().then(res => {
        typeof res === 'string' && (res = JSON.parse(res))
        res.accounts && res.accounts.forEach((v, i) => {
            if (v.currency == currency) {
                if (v.type === 'SPOT_AVAILABLE') {
                    myCurrencyAvailable += v.balance
                }
                if (v.type === 'SPOT_FROZEN') {
                    myCurrencyFrozen += v.balance
                }
            }
        })
    })

    console.warn(`我的账户${currency}信息：${myCurrencyAvailable}可用,${myCurrencyFrozen}冻结`)


    console.warn('end')

})()


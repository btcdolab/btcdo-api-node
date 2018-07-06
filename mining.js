let apiMethod = require('./src/utils/apiMethod');

try {
    (async function mining() {

        let currentPrice
        let myCurrencyAvailable = 0
        let myCurrencyFrozen = 0
        let currency = 'ICC'
        let symbol = 'ICC_ETH'
        let lastSalePrice = 0, lastSaleAmount = 0
        let lastBuyPrice = 0, lastBuyAmount = 0

        let getAccount = () => apiMethod.getAccounts().then(res => {
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


        let getDepth = () => apiMethod.getSpecifiedTradeDepth('ICC_ETH',).then(res => {
            typeof res === 'string' && (res = JSON.parse(res))

            let lastBuy = res.buyOrders.sort((a, b) => b.price - a.price).shift()
            let lastSale = res.sellOrders.sort((a, b) => a.price - b.price).shift()
            lastBuyPrice = lastBuy.price
            lastBuyAmount = lastBuy.amount
            lastSalePrice = lastSale.price
            lastSaleAmount = lastSale.amount
        })


        await Promise.all([getAccount(), getDepth()]).then(() => {
            console.log(`我的账户${currency}信息：${myCurrencyAvailable}可用,${myCurrencyFrozen}冻结`)
            console.log(`最新买价：${lastBuyPrice}，最新卖价：${lastSalePrice}，差价为${lastSalePrice - lastBuyPrice}`)

            let toSalePrice = (lastSalePrice - ((lastSalePrice - lastBuyPrice) / 2)).toFixed(8)


            if (toSalePrice < lastBuyPrice) return
            if (toSalePrice > lastSalePrice) return

            console.warn(`自动化订单价格为`, toSalePrice)

            apiMethod.createOrder({
                amount: 700,
                customFeatures: 65536,
                orderType: 'SELL_LIMIT',
                price: toSalePrice,
                symbol: symbol,
            }, true).then(res => {
                console.warn('下单成功！', res)
            }).catch(err => {
                console.warn('下单报错！', err)
            })


        }).catch(err => {
            console.warn('promise all wrong', err)
        })


        console.warn('end')

    })()

} catch (e) {
    console.warn('some thing go wrong', e)
}
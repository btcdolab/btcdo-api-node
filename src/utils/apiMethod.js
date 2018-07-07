var fetch = require('./fetch')

// 获取账户信息
function getAccounts() {
    return fetch({
        pathname: '/v1/user/accounts'
    }, {
        method: 'GET',
    })
}

// 获取充值记录 参数 currency为币种，如 'ETH'
function getDepositRecord(currency) {
    return fetch({
        pathname: `/v1/user/deposits/${currency}`
    }, {
        method: 'GET'
    })
}

// 获取所有币种信息
function getCurrencyInfo() {
    return fetch({
        pathname: '/v1/common/currencies'
    }, {
        method: 'GET'
    })
}

// 获取指定币种信息 参数 currency为币种，如 'ETH'
function getSpecifiedCurrencyInfo(currency) {
    return fetch({
        pathname: `/v1/common/currencies/${currency}`
    }, {
        method: 'GET'
    })
}

// 获取错误信息
function getErrorCode() {
    return fetch({
        pathname: '/v1/common/errorCodes'
    }, {
        method: 'GET'
    })
}

// 获取所有交易对
function getSymbols() {
    return fetch({
        pathname: '/v1/common/symbols'
    }, {
        method: 'GET'
    })
}

// 获取指定交易对 参数symbol为交易对 交易币种_计价币种 例：BDB_ETH
function getSpecifiedSymbol(symbol) {
    return fetch({
        pathname: `/v1/common/symbols/${symbol}`
    }, {
        method: 'GET'
    })
}

// 获取系统时间
function getSystemTime() {
    return fetch({
        pathname: '/v1/common/timestamp'
    }, {
        method: 'GET'
    })
}

// 获取指定交易对行情数据 参数 symbol为交易对 交易币种_计价币种 例：BDB_ETH
// type为行情类型，字符串，分别为：
// K_1_SEC：秒K（最近1小时）
// K_1_MIN：分钟K(最近24小时）
// K_1_HOUR：小时K（最近30天）
// K_1_DAY：日K
function getSpecifiedSymbolTradeInfo(symbol, type) {
    return fetch({
        pathname: `/v1/market/bars/${symbol}/${type}`
    }, {
        method: 'GET'
    })
}

// 获取指定交易对深度 参数symbol为交易对 交易币种_计价币种 例：BDB_ETH
function getSpecifiedTradeDepth(symbol) {
    return fetch({
        pathname: `/v1/market/depth/${symbol}`
    }, {
        method: 'GET'
    })

}


// 获取所有交易对成交信息
function getAllSymbolTransactionInfo() {
    return fetch({
        pathname: '/v1/market/prices'
    }, {
        method: 'GET'
    })
}


// 获取最近交易记录（默认100条记录）
function getLatelyTransactionRecord(offsetId = 0, limit = 100, symbol) {
    return fetch({
        pathname: '/v1/trade/orders'
    }, {
        method: 'GET'
    })
}


// 创建订单（挂买单、挂卖单、挂撤买单、挂撤卖单）
// amount	float	NO	数量（限价买/卖单必输）
// customFeatures	int	NO	订单特性 65536：燃烧DBD(使用BDB抵扣手续费)
// orderType	String	YES	订单类型 BUY_LIMIT：限价买单； SELL_LIMIT：限价卖单； CANCEL_BUY_LIMIT：限价买单撤单； CANCEL_SELL_LIMIT：限价卖单撤单
// price	float	NO	价格（限价买/卖单必输）
// symbol	String	YES	交易对
// targetOrderId	Long	NO	原订单ID（撤销订单必输）
function createOrder({
                         amount,
                         customFeatures = 65536,
                         orderType,
                         price,
                         symbol,
                         targetOrderId,
                     }, openWarn = false) {

    if (!orderType) {
        openWarn && console.warn('请输入订单类型！可输入的类型有：BUY_LIMIT：限价买单 SELL_LIMIT：限价卖单 CANCEL_BUY_LIMIT：限价买单撤单 CANCEL_SELL_LIMIT：限价卖单撤单')
        return Promise.reject()
    }
    if ((orderType === 'SELL_LIMIT' || orderType === 'BUY_LIMIT') && (!price || !amount)) {
        openWarn && console.warn('挂单请输入价格和数量')
        return Promise.reject()
    }
    if ((orderType === 'CANCEL_BUY_LIMIT' || orderType === 'CANCEL_SELL_LIMIT') && (!targetOrderId)) {
        openWarn && console.warn('撤单请输入订单ID')
        return Promise.reject()
    }
    if (customFeatures != 65536) openWarn && console.warn('此笔交易不开启BDB燃烧')

    return fetch({
        pathname: '/v1/trade/orders'
    }, {
        method: 'POST',
        body: {
            amount,
            customFeatures,
            orderType,
            price,
            symbol,
            targetOrderId
        }
    })
}

// 获取订单详情信息 参数orderId为订单编号
function getOrderInfo(orderId) {
    return fetch({
        pathname: `/v1/trade/orders/${orderId}`
    }, {
        method: 'GET'
    })
}


// 获取订单撮合信息 参数orderId为订单编号
function getMatchesOrderInfo(orderId) {
    return fetch({
        pathname: `/v1/trade/orders/${orderId}/matches`
    }, {
        method: 'GET'
    })
}


module.exports = {
    getAccounts,    // 获取账户信息
    getDepositRecord,  // 获取充值记录 参数 currency为币种，如 'ETH'
    getCurrencyInfo,   // 获取所有币种信息
    getSpecifiedCurrencyInfo, // 获取指定币种信息 参数 currency为币种，如 'ETH'
    getErrorCode, // // 获取错误信息
    getSymbols, // 获取所有交易对
    getSpecifiedSymbol, // 获取指定交易对 参数symbol为交易对 交易币种_计价币种 例：BDB_ETH
    getSystemTime, // 获取系统时间
    getSpecifiedSymbolTradeInfo, // 获取指定交易对行情数据 参数 symbol为交易对 交易币种_计价币种 例：BDB_ETH
    getSpecifiedTradeDepth, // 获取指定交易对深度 参数symbol为交易对 交易币种_计价币种 例：BDB_ETH
    getAllSymbolTransactionInfo, // 获取所有交易对成交信息
    getLatelyTransactionRecord, // 获取最近交易记录（默认100条记录）
    createOrder, // 创建订单（挂买单、挂卖单、挂撤买单、挂撤卖单）
    getOrderInfo, // 获取订单详情信息 参数orderId为订单编号
    getMatchesOrderInfo // 获取订单撮合信息 参数orderId为订单编号
}

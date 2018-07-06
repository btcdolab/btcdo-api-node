### node-api

> 声明：本工程由热心网友提供，供接入机构/个人调用Btcdo API参考之用，代码可自由使用，但未经全面测试，Btcdo不承担任何连带责任。
> 使用本工程中代码造成的任何后果完全自负。  

1.登录Btcdo账户，在“个人中心”→“安全中心”获取API-KEY和API-SECRET  

2.搭建[node](<link https://nodejs.org/zh-cn/>)环境，把代码`git clone`下来，运行`npm install`  

2.配置`config/config.js`  

3.使用`src/utils/apiMethod`中的各个方法，也可以直接使用`src/utils/fetch`方法，采用和`window.fetch`相同的包，支持`.then`链式调用和`async await`同步写法  

4.具体接口请参考[官方文档](link "https&#x3A;//github.com/btcdolab/btcdo-official-api-docs/blob/master/rest-api.md")

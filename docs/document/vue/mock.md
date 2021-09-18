# Mock.js

在日常开发中，前后端分离已是常态，前端攻城师独立于后台开发是非常有必要的，mock.js就是一款常用的拦截ajax请求，生成随机数据的工具，用于模拟接口返回数据。下面讲解如何在项目中使用它。 

首先我们来看一下目录结构（vue项目）  
![项目目录结构](/images/vue/mock_mljg.png "项目目录结构")  

安装mock
```
npm install mockjs -D
```

在mock文件夹下面新建一个`index.js`和`user.js`  
`index.js`代码如下：
```
import Mock from 'mockjs'
// 设置 300-600ms 的延时，模拟接口的延时
Mock.setup({
    timeout: '300-600'
});

let configArray = [];

// 使用webpack的require.context()遍历所有mock文件
// require.context( 文件夹目录， 是否遍历文件夹， 匹配文件后缀 )
const files = require.context('.', true, /\.js$/);
console.log('files', files)
files.keys().forEach((key) => {
  if (key === './index.js') return;
  configArray = configArray.concat(files(key).default);
});

// 注册所有的mock服务
configArray.forEach((item) => {
  // Object.entries() 返回可枚举属性的键值对数组
  // eg: let o = { a: 1, b: { c: 2 }}
  //      Object.entries(o)  =>   [[a, 1], [b, {c:2}]]
  for (let [path, target] of Object.entries(item)) {
    let protocol = path.split('|');
    // 匹配接口
    console.log('mock_url', new RegExp('^' + protocol[1]))
    // 请求方式
    console.log('mock_type', protocol[0]) 
    // 返回相应的template或者 执行相应的function，并返回数据
    console.log('mock_temp_or_func', target)
    Mock.mock(new RegExp('^' + protocol[1]), protocol[0], target);
  }
});
```
其中Mock.mock是mock.js提供的接口，用法如下：
```
// rurl => 需要拦截的接口url，可选参数
// rtype => 请求方式（get、post、delete等等），可选参数
// template | function => 返回的模板 | 执行相应的函数，并且返回相应的模板

Mock.mock( rurl?, rtype?, template|function )
```

`user.js`代码如下：
```
/******************
 * 基础 - 用户信息 - mock
 *****************/
// 用户信息
let user = {
    "code":0,
    "msg":"",
    "data":{
        "given_name":"星星",
        "first_name":"周",
        "phone":"159****3622",
        "email":"***@163.com",
        "qq":"123456588",
        "cover":"http://cdn.your-domain-name.com/img/5f15901f5e3.png@!tiny",
        "number":90649107,
        "bind_wechat":0,
        "full_name":"周星星",
        "province":"香港",
        "province_id":5687,
        "city":"中西区",
        "city_id":5688,
        "area":"中西区",
        "area_id":89299,
    }
}
export default {
    /**
     * 基础 - 登录
     * @param： {}    
     * @returns：Promise {<pending>}
     **/
    'post|/user/center': () => {
        return user
    }
}
```

这样我们就已经编写好mock文件了，接下来需要在main.js中引入mock文件  
```
// 开发模式下才引入mock
process.env.NODE_ENV === 'development' && require('./mock') 
```

接下来，当我们在组件页面中请求了`/user/center`时，mock就会主动拦截请求，并返回我们定义好的template数据  
```
import axios from 'axios'

axios.post('/user/center').then( res => {
    console.log(res)
})
```
这里有一个细节需要注意，由于请求被mock拦截了，所以我们在NetWork里面是找不到这个请求的，可以通过在控制台将数据打印出来进行验证：  
![network查看请求](/images/vue/mock_network.jpg "network查看请求")   
![控制台打印](/images/vue/mock_console.jpg "控制台打印数据")

##参考  
- [Github](https://github.com/nuysoft/Mock/wiki/Getting-Started)  
- [简书文章](https://www.jianshu.com/p/c5568910e946)





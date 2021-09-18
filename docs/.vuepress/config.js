const config = require('./config/index.js')
const urlEncode = require("markdown-it-disable-url-encode")
const fs = require('fs')

let dir_list = fs.readdirSync('./docs/document', {withFileTypes : true}) // md文档下的所有文件已经目录，并返回文件类型
// 只取文件夹目录
dir_list = dir_list.filter((file) => {
    return file.isDirectory()
})
// 读取文件夹，已经文件夹下面的.md，自动生成 sidebar 配置，这里只适配了二级目录，可封装成函数递归读取多级目录
const sidebar = []
dir_list.forEach((item) => {
    let files = fs.readdirSync(`./docs/document/${item.name}`, {withFileTypes: true})
    // 过滤非.md文件 并且不是README.md文件
    files = files.filter((file) => file.isFile())
    files = files.filter((file) => {
        let index = file.name.lastIndexOf('.')
        let ext = file.name.substr(index)
        return ext === '.md' && file.name !== 'README.md'
    })
    let readme = files.find(file =>  file.name === 'README.md')
    let children = files.map((file) => {
        return `/document/${item.name}/${file.name}`
    })
    if(children.length === 0 && readme === undefined) return  //如果没有相应的文件，直接return
    let title = config.sidebar && config.sidebar[item.name] ? config.sidebar[item.name] : item.name[0].toUpperCase() + item.name.substr(1)
    const options = {
        title: title,
        path: `/document/${item.name}`,
        children: children
    }
    sidebar.push(options)
})
console.log('sidebar', sidebar)

// 文档配置
module.exports = {
    title: 'JohnsonHuang94 Blog',
    description: '丢掉幻想，准备斗争',
    head: [ // 注入到当前页面的 HTML <head> 中的标签
        ['link', { rel: 'icon', href: '' }], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    base: '/',
    themeConfig: {
        repo: 'https://github.com/JohnsonHuang94/blog',
        repoLabel: 'Github',
        nav: [
            {text: 'Home', link: '/'},
        ],
        logo: '/images/logo.jpg',
        lastUpdated: 'Last Updated',
        sidebar: sidebar,
        sidebarDepth: 2,
    },
    markdown: {
        // 处理图片路径问题
        extendMarkdown: md => {
            md.use(urlEncode)
        }
    }
}
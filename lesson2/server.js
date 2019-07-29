const Vue = require('vue')
const server = require('express')()
const VueServerRenderer = require('vue-server-renderer')
const renderer = VueServerRenderer.createRenderer()

function init(req) {
  return new Vue({
    data: {
      url: req.url,
      text: `vue ssr lessons from： <a href="https://github.com/neveryu" target="_blank">NeverYu</a>`,
      repository: `项目仓库地址： <a href="https://github.com/Neveryu/vue-ssr-lessons" target="_blank">vue-ssr-lessons</a>`,
      state: `非单例模式造成状态污染`,
    },
    template: `
      <div>
        <div>当前访问的 URL 是： {{ url }}</div>
        <div v-html="text"></div>
        <div v-html="repository"></div>
        <div v-html="state"></div>
      </div>
    `
  })
}

let app = null;

server.get('*', (req, res) => {
  // const app = new Vue({
  //   data: {
  //     url: req.url,
  //     text: `vue ssr lessons from： <a href="https://github.com/neveryu" target="_blank">NeverYu</a>`,
  //     repository: `项目仓库地址： <a href="https://github.com/Neveryu/vue-ssr-lessons" target="_blank">vue-ssr-lessons</a>`
  //   },
  //   template: `
  //     <div>
  //       <div>当前访问的 URL 是： {{ url }}</div>
  //       <div v-html="text"></div>
  //       <div v-html="repository"></div>
  //     </div>
  //   `
  // })
  // if(!app){
    app = init(req)
  // }

  renderer.renderToString(app).then(html => {
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <meta charset="utf-8">
        <head><titleVue SSR 课程</title></head>
        <body>${html}</body>
      </html>
    `)
  }).catch(err => {
    res.status(500).end('Internal Server Error')
    return
  })
})

/**
 * 下面是两种起 server 的方式
 * 用其一即可
 */

server.set('port', process.env.PORT || 8888)
let hostname = '0.0.0.0'
server.listen(server.get('port'), hostname, () => {
  console.log(`Server running at http://${hostname}:${server.get('port')}`)
})

// const port = process.env.PORT || 8888
// server.listen(port, () => {
//   console.log(`server started at localhost:${port}`)
// })

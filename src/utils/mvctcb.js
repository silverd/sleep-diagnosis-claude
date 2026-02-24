const tcb = require('@cloudbase/node-sdk')
const mvcTcb = tcb.init({
  env: 'mvfcminiprogram-k997i',
  secretId: process.env.MVC_TCB_KEY,
  secretKey: process.env.MVC_TCB_SECRET,
})
const mvcDb = mvcTcb.database()

module.exports = {
  mvcDb,
  mvcTcb,
  getData(collection, limit, sort) {
    console.log('get data', collection, limit)
    return mvcDb
      .collection(collection)
      .where({
        publish: true,
      })
      .limit(limit || 20)
      .orderBy(sort || '_updateTime', 'desc')
      .field({
        content: false,
      })
      .get()
  },
//   getHrefList(collection) {
//     console.log('get href list', collection)
//     return mvcDb
//       .collection(collection)
//       .where({
//         publish: true,
//       })
//       .field({
//         href: true,
//       })
//       .get()
//   },
//   getPost(collection, href) {
//     console.log('get post', collection, href)
//     return mvcDb
//       .collection(collection)
//       .orderBy('_updateTime', 'desc')
//       .where({
//         href,
//         publish: true,
//       })
//       .get()
//   },
}

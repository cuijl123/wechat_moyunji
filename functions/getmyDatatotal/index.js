// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'test-ekqau',
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
  const {OPENID} = cloud.getWXContext()
  
  let noteNum = await db.collection('Note').where({
    _openid:OPENID
  }).count().then(res => {
    return res.total
  })
  let praisenum = await db.collection('star').where({
    userId: OPENID
  }).count().then(res => {
    return res.total
  })

    return {noteNum,praisenum}

}
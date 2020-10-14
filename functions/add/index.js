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
  return await db.collection('Note').add({
    data: {
      _openid:OPENID,
      userPic:event.userPic,
      userName:event.userName,
      praiseNum:event.praiseNum,
      createTime:event.createTime,  
      content: event.content,
      classify:event.classify,
      flag:false,
      latitude:event.latitude,
      longitude:event.longitude,
      address:event.address
    }
  })
}
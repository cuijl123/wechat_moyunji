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
  return await db.collection('star').add({
    data:{
      userId:OPENID,
      noteId:event.noteId
    }
  })

   
}
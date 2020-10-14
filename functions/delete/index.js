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
  let noteId = event.noteId
  //先删除Note中的记录
   await db.collection('Note').where({
    _id:noteId

  }).remove()
  //再删除star中的记录
   await db.collection('star').where({
    noteId:noteId
  }).remove()

  return
  
  
   
}
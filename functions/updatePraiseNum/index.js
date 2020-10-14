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
  //点赞数量+1
  if(event.type == 'add'){
    return await db.collection('Note').doc(noteId).update({
      data: {
        praiseNum: _.inc(1)
      }
     }).then({})
  }else{ //点赞数量-1
    return await db.collection('Note').doc(noteId).update({
      data: {
        praiseNum: _.inc(-1)
      }
     }).then({})
  }
  

   
}
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
  let _id = event._id
  let resData
  let pariseData
  resData = await db.collection('Note').where({
    _id:_id
  }).get({}).then(res=>{return res.data})
if(!event.loginState){

}else{
  pariseData = await db.collection('star').where({
    userId: OPENID
  }).get({}).then(res=>{return res.data})

  for(let i of resData){
    for(let j of pariseData){
      if(i._id == j.noteId){
        i.starId = j._id
        i.flag = true
      }
    }
  }
}
  
  return resData

}
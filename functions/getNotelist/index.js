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
  let resData
  let pariseData
  // type='my' 查询我发表的
  if(event.type == 'myPublish'){
      resData = await db.collection('Note').where({
      _openid:OPENID
    }).orderBy('createTime', 'desc').limit(20).get({}).then(res=>{return res.data})

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
    return resData
  }
  //查询 排行榜
  else if(event.type == 'rank'){
    resData = await db.collection('Note').where({}).orderBy('praiseNum', 'desc').orderBy('createTime', 'desc').limit(20).get({}).then(res=>{return res.data})
    //是否已登录
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
  //查询 我点赞的
  else if(event.type == 'myPraise'){
    if(event.type_router == "myPraise"){ //我点赞的分页
      let dataLength = event.dataLength
      resData = await db.collection('Note').where({}).orderBy('createTime', 'desc').get({}).then(res=>{return res.data})
      pariseData = await db.collection('star').where({
        userId: OPENID
      }).get({}).then(res=>{return res.data})
  
      let list = [];
      for(let i of resData){
        for(let j of pariseData){
          if(i._id == j.noteId){
            i.starId = j._id
            i.flag = true
            list.push(i)
          }
        }
      }
      return list
    }else{
      resData = await db.collection('Note').where({}).orderBy('createTime', 'desc').get({}).then(res=>{return res.data})
    pariseData = await db.collection('star').where({
      userId: OPENID
    }).get({}).then(res=>{return res.data})

    let list = [];
    for(let i of resData){
      for(let j of pariseData){
        if(i._id == j.noteId){
          i.starId = j._id
          i.flag = true
          list.push(i)
        }
      }
    }
    return list

    }
  }
  //分页加载数据
  else if(event.type == 'newPage'){
    let dataLength = event.dataLength
    if(event.type_router == ''){ //全部分页
      resData = await db.collection('Note').where({}).orderBy('createTime', 'desc').skip(dataLength).limit(20).get({}).then(res=>{return res.data})
    }else if(event.type_router == 'rank'){ //排行榜分页
      resData = await db.collection('Note').where({}).orderBy('praiseNum', 'desc').orderBy('createTime', 'desc').skip(dataLength).limit(20).get({}).then(res=>{return res.data})
    }else if(event.type_router == 'myPublish'){  //我发布的分页
      resData = await db.collection('Note').where({
        _openid:OPENID
      }).orderBy('praiseNum', 'desc').orderBy('createTime', 'desc').skip(dataLength).limit(20).get({}).then(res=>{return res.data})
    }else{
      let classify = event.type_router
      resData = await db.collection('Note').where({
        classify:classify
      }).orderBy('praiseNum', 'desc').orderBy('createTime', 'desc').skip(dataLength).limit(20).get({}).then(res=>{return res.data})
    }
     //是否已登录
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
  //查询 发现页
  else{
    let classify = event.classify
    if(classify == ''){
    resData = await db.collection('Note').where({}).orderBy('createTime', 'desc').limit(20).get({}).then(res=>{return res.data})
    }else{
    resData = await db.collection('Note').where({
      classify:classify
    }).orderBy('createTime', 'desc').limit(20).get({}).then(res=>{return res.data})
    }
    //是否已登录
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
 
}
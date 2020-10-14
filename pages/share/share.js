// pages/share/share.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:[],
    id:'',
    e:{},
    num:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id  

    let loginState = app.globalData.userInfo?true:false  //判断是否已登录
    console.log(this.data.id)
    //请求share数据
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getSharedata',
      // 传给云函数的参数
      data: {
        _id: this.data.id,
        loginState:loginState
      },
    })
    .then(res => {
      this.setData({
        datas:res.result
      })
      console.log(res.result)
    })
    .catch(console.error)
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
   
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.reLaunch({
      url: '/pages/allsays/allsays',
    })
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let path
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res)
      let id = res.target.dataset.id
      let url = encodeURIComponent('/pages/share/share?id='+id);
      path =`/pages/index/index?url=${url}`
    } else {
      path ='/pages/allsays/allsays'
    }
    return {
      title: '正道的光！',
      path:path ,
      // 设置转发的图片
      imageUrl: '../../images/share.jpg',
      // 成功的回调
      success: (res) => {
        console.log("111")
      },
      // 失败的回调
      fail: (res) => {},
      // 无论成功与否的回调
      complete: (res) => {}
    }

  },
  itemClick(e){
    
    if(e.target.dataset.type == 'praise'){
      if(!app.globalData.userInfo){
        wx.showToast({
          title: '请先登录!',
          icon: 'none',
          duration: 1000
        })
        return
      }
      this.data.e = e
      this.throttle(e,()=>{
        if(this.data.num%2 == 0){
          this.data.num = 0
          return
        }
        this.data.num = 0

        let index = this.data.e.currentTarget.dataset.id
        if(!this.data.datas[index].starId){
          wx.cloud.callFunction({
                    name: 'praise',
                    data: {
                      noteId:this.data.datas[index]._id
                    },
                  })
                  .then(res => {
                    this.data.datas[index].starId = res.result._id
                     //更新数据库的praiseNum
                     wx.cloud.callFunction({
                      name: 'updatePraiseNum',
                      data: {
                        type:'add',
                        noteId:this.data.datas[index]._id
                      },
                    }).then(res=>{
                      console.log("数据库更新成功")
                    }).catch(console.error)
                  })
                  .catch(console.error)
          
        }else{
          //删除用户点赞记录并更新点赞数量
         wx.cloud.callFunction({
          name: 'removePraise',
          data: {
            starId:this.data.datas[index].starId
          },
        })
        .then(res => {
          this.data.datas[index].starId = ''
          //更新数据库的praiseNum
          wx.cloud.callFunction({
            name: 'updatePraiseNum',
            data: {
              type:'remove',
              noteId:this.data.datas[index]._id
            },
          }).then(res=>{
            console.log("数据库更新成功")
          }).catch(console.error)
          
        })
        .catch(console.error)

        }
      },1000)()
    }else{
      return
    }
    
  },
  //防抖(频繁点击点赞按钮)
  throttle(e,func,time){
    let timer = null
    this.data.num++
    let index = e.currentTarget.dataset.id
    let oldData = this.data.datas
    if(this.data.datas[index].flag){
               oldData[index].praiseNum--
               oldData[index].flag = false
               //数据从逻辑层发送到视图层
               this.setData({
                 datas:oldData
               })
    }else{
      oldData[index].praiseNum++
     oldData[index].flag = true
     //数据从逻辑层发送到视图层
     this.setData({
      datas:oldData
    })
    }
    
    return  ()=>{
       //每次清除定时器
       clearTimeout(timer)
       //重新打开定时器，做到只有最后一个
       timer = setTimeout(()=>{
            func()
       },time)
    }
  },

  //查看位置
 toPositionView(e){
  let latitude = e.currentTarget.dataset.lat
  let longitude = e.currentTarget.dataset.lon
 wx.openLocation({
   latitude,
   longitude,
   scale: 13
 })
},

})
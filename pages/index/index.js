//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello ',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //页面自动跳转
  pageto: function() {
    setTimeout(()=>{
      wx.switchTab({
        url: '../allsays/allsays'
      })
    },1000)
   
  },
  onLoad: function (options) {
    this.data.url = options.url
    wx.getSetting({
      success: res => {
         if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              app.globalData.userInfo = res.userInfo
              this.setData({
                userInfo:res.userInfo,
                hasUserInfo: true
              })
              if(options.url){
                let url = decodeURIComponent(options.url);
                wx.navigateTo({
                  url
                })
              }
            }
          })
         }else{
          if(options.url){
            let url = decodeURIComponent(options.url);
            wx.navigateTo({
              url
            })
          }

         }
         
      }
    }) 

    //获取版本号
    wx.cloud.callFunction({
      name: 'getVersion',
      data: {},
    })
    .then(res => {
      app.globalData.version = res.result[0].version
    })
    .catch(console.error)

  },
  getUserInfo: function(e) {
    console.log(e)
    if(e.detail.userInfo){
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      if(this.data.url){
        let url = decodeURIComponent(this.data.url);
        wx.navigateTo({
          url
        })
      }else{
       this.pageto()
      }
     
    }else{
      this.pageto()
    }
    
   
  }
})

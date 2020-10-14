// pages/mysays/mysays.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
     userPic:'',
     userName:'',
     noteNum:0,
     praisenum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      version:app.globalData.version
    })
    wx.showLoading({
      title: '加载中',
    })
    if(app.globalData.userInfo){
      const {avatarUrl,nickName} = app.globalData.userInfo
      this.setData({
        userPic:avatarUrl,
        userName:nickName
      })
    }else{

    }
  
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

    if(app.globalData.userInfo){
     this.getNoteNum()
    }else{
      wx.hideLoading()
    }
   
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
  onShareAppMessage: function () {

  },
  //跳转到我发布的
  tomyPublish(){
    if(app.globalData.userInfo){
      wx.navigateTo({
        url: '/pages/myPublish/myPublish'
      })
    }
  },
  //跳转到我点赞的
  tomyPraise(){
    if(app.globalData.userInfo){
      wx.navigateTo({
        url: '/pages/myPraise/myPraise'
      })
    } 
  },
  //登录
  getUserInfo: function(e) {
    if(e.detail.userInfo){
      app.globalData.userInfo = e.detail.userInfo
      const {avatarUrl,nickName} = app.globalData.userInfo
      this.setData({
        userPic:avatarUrl,
        userName:nickName
      })
      wx.showLoading({
        title: '加载中',
      })
      this.getNoteNum()
    }else{
     
    }
    
   
  },
  getNoteNum(){
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getmyDatatotal',
      // 传给云函数的参数
      data: {},
    })
    .then(res => {
      wx.hideLoading()
      console.log(res)
      this.setData({
        noteNum:res.result.noteNum,
        praisenum:res.result.praisenum
      })
    })
    .catch(console.error)
  }
})
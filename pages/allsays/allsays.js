// pages/allsays/allsays.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab_item:[{classify:""},{classify:"energy"},{classify:"laugh"},{classify:"emotion"}],
    datas:[],
    datas1:[],
    datas2:[],
    datas3:[],
    num:0,
    e:{},
    currentIndex: 0,
    currentData:"datas",
    state:false,
    isHidenLoadMore:true,
    //分页数据请求状态
    getflag:false,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
     version:app.globalData.version
   })
    // let oldTime = new Date("2020/08/14 00:00:00")
    // let time = Date.now() - oldTime.getTime()
    // console.log(time)
    // if(time>0){
    //   this.setData({
    //     timeState:true
    //   })
    // }
    wx.showLoading({
      title: '加载中',
    })
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
    this.getData(this.data.currentIndex);
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
      path ='/pages/index/index'
    }
   
    return {
      title: '每日一句,烦恼退去',
      path:path ,
      // 设置转发的图片
      imageUrl: '../../images/share.gif',
      // 成功的回调
      success: (res) => {
      },
      // 失败的回调
      fail: (res) => {},
      // 无论成功与否的回调
      complete: (res) => {}
    }

    
  },
  //获取list数据
  getData(index,flag){
    let data = this.data.currentData
    let classify = this.data.tab_item[index].classify

    let loginState = app.globalData.userInfo?true:false  //判断是否已登录
    
   /*  if(flag){

    }                              //判断是否为刷新}
    else if(this.data[data].length != 0){   //判断是否加载过
      return
    }
 */  
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getNotelist',
      // 传给云函数的参数
      data: {
        classify:classify,
        loginState:loginState
      },
    })
    .then(res => {
      wx.hideLoading()
      this.setData({
        state:false
      })
      console.log(res.result)
      this.setData({
        [data]:res.result
      })
    })
    .catch(console.error)
  

  },
  //点赞或取消赞
  itemClick(e){
    
    let data = this.data.currentData
    let number = this.data.currentIndex
   
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
        if(!this.data[data][index].starId){
          //更新数据库的praiseNum
          wx.cloud.callFunction({
            name: 'updatePraiseNum',
            data: {
              type:'add',
              noteId:this.data[data][index]._id
            },
          }).then(res=>{
            console.log("数据库更新成功")
          }).catch(console.error)
          //新增一条记录
          wx.cloud.callFunction({
                    name: 'praise',
                    data: {
                      noteId:this.data[data][index]._id
                    },
                  })
                  .then(res => {
                    this.data[data][index].starId = res.result._id
                  })
                  .catch(console.error)
          
        }else{
          //更新数据库的praiseNum
          wx.cloud.callFunction({
            name: 'updatePraiseNum',
            data: {
              type:'remove',
              noteId:this.data[data][index]._id
            },
          }).then(res=>{
            console.log("数据库更新成功")
          }).catch(console.error)
          //删除用户点赞记录并更新点赞数量
         wx.cloud.callFunction({
          name: 'removePraise',
          data: {
            starId:this.data[data][index].starId
          },
        })
        .then(res => {
          this.data[data][index].starId = ''
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
    let data = this.data.currentData
    let timer = null
    this.data.num++
    let index = e.currentTarget.dataset.id
    let oldData = this.data[data]
    if(this.data[data][index].flag){
               oldData[index].praiseNum--
               oldData[index].flag = false
               //数据从逻辑层发送到视图层
               this.setData({
                 [data]:oldData
               })
    }else{
      oldData[index].praiseNum++
     oldData[index].flag = true
     //数据从逻辑层发送到视图层
     this.setData({
      [data]:oldData
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
  //顶部下拉刷新
  pullDownRefresh(e){
    this.getData(this.data.currentIndex,"refresh");
  },

  //底部下拉加载
  lower(){
    let data = this.data.currentData
    let type_router = this.data.tab_item[this.data.currentIndex].classify

    let loginState = app.globalData.userInfo?true:false  //判断是否已登录

    //判断上个请求是否结束
    if(this.data.getflag == true){
      return
    }else{
      this.setData({
        getflag:true
      })
    }
    this.setData({
      isHidenLoadMore:false
    })
    let oldData = this.data[data]
    //加载下一页数据
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getNotelist',
      // 传给云函数的参数
      data: {
        type:"newPage",
        type_router:type_router,
        dataLength:oldData.length,
        loginState:loginState
      },
    })
    .then(res => {

      console.log(res.result)

      this.setData({  
        isHidenLoadMore:true,  //隐藏加载的loading
        [data]:oldData.concat(res.result),
        getflag:false,
      })
      
    })
    .catch(console.error)
  

  },
  //swiper切换时会调用
  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      let index = e.detail.current
      //切换当前数据
      this.changeData(index)
      //获取数据
      this.getData(index)
      this.setData({
        currentIndex:e.detail.current
      })
      
    }
  },
  //用户点击tab时调用
  titleClick: function (e) {
    //切换当前数据
    this.changeData(Number(e.currentTarget.dataset.idx))
    //获取数据
    this.getData(Number(e.currentTarget.dataset.idx))
      this.setData({
        //拿到当前索引并动态改变
        currentIndex: e.currentTarget.dataset.idx
      })
  },
 //切换当前数据
 changeData(index){
  switch(index){
    case 0:
      this.setData({
        currentData:"datas"
      })
    break;
    case 1:
      this.setData({
        currentData:"datas1"
      })
    break;
    case 2:
      this.setData({
        currentData:"datas2"
      })
    break;
    case 3:
      this.setData({
        currentData:"datas3"
      })
    break;
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
  //跳转到发布界面
  tosaysAdd(){
    if(!app.globalData.userInfo){
      wx.showToast({
        title: '请先登录!',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.navigateTo({
      url: '../addSays/addSays'
    })
  }
})
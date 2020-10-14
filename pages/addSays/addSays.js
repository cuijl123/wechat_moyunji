// pages/addSays/addSays.js
const util = require('../../utils/util.js');

//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder:'我来说一句(100字以内)',
    content:'',
    longitude:0,
    latitude:0,
    address:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      version:app.globalData.version
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
  //提交表单
  formSubmit(e){
    let content = e.detail.value.content;
    let classify = e.detail.value.class?e.detail.value.class:[];
    let createTime = util.formatTime(new Date())
    wx.cloud.callFunction({
      // 云函数名称
      name: 'add',
      // 传给云函数的参数
      data: {
        userPic:app.globalData.userInfo.avatarUrl,
        userName:app.globalData.userInfo.nickName,
        praiseNum:0,
        classify:classify,
        createTime:createTime,  
        content: content,
        latitude:this.data.latitude,
        longitude:this.data.longitude,
        address:this.data.address
      },
    })
    .then(res => {
      console.log("提交成功")
      wx.showToast({
        title:'发表成功',
        icon:'success',
        duration:2000,
        success:()=>{
          setTimeout(function () {
            //要延时执行的代码
           wx.navigateBack({
           delta: 1
           })
          }, 1000)
        }
      })
    })
    .catch(console.error)
  },
  //获取位置
  toPosition(){
    let that = this
    wx.getSetting({
      success: (res) => {
        console.log(res)
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      that.getAddress();
                    } else {
                      wx.showToast({
                        title: '取消授权',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else {
          
          //调用wx.getLocation的API
          this.getAddress();
        }
      }
    });
  },
  //获取定位信息
  getAddress(){
    let that = this
    wx.showLoading({
      title: '定位中',
    })
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      //定位成功，更新定位结果      
      success: function(res) {
        wx.hideLoading();
        let latitude = res.latitude
        let longitude = res.longitude
        wx.chooseLocation({
          latitude,
          longitude,
          success:function(res){
            console.log(res)
            let address = res.name?res.name:res.address.substring(3,res.address.length)
            that.setData({//赋值
              latitude:res.latitude,
              longitude:res.longitude,
              address:address
            })
          }
        }) 
      }, //定位失败回调      
      fail: function() {
        wx.hideLoading();
        wx.showModal({
          title: '您手机定位功能没有开启',
          content: '请在系统设置中打开定位服务',
          success() {
                
          }
        })
      },
      complete: function() {
        //隐藏定位中信息进度       
       // wx.hideLoading()
      }
    })

    // wx.navigateTo({
    //   url: '../mapShow/mapShow',
    // })

    // // 实例化腾讯地图API核心类
    // qqmapsdk = new QQMapWX({
    //   key: 'LLRBZ-KW33D-CUM44-HCLUG-CJFQE-3CFWN'
    // });
    // var that = this;
    // //获取当前位置
    // wx.getLocation({
    //   type: 'gcj02',
    //   success: function (res) {
    //     let latitude = res.latitude;
    //     let longitude = res.longitude;
    //     wx.openLocation({
    //       latitude,
    //       longitude,
    //       scale: 18
    //     })
    //     //根据坐标获取当前位置名称，腾讯地图逆地址解析
    //     qqmapsdk.reverseGeocoder({
    //       location: { latitude: latitude, longitude: longitude },
    //       success: function (res) {
    //         var address = res.result.address;
    //         console.log(res.result)
    //         that.setData({
    //           latitude: latitude,
    //           longitude: longitude,
    //           markers: [{
    //             id: '1',
    //             iconPath: "../../../images/icon_cur_position.png",
    //             width: 22,
    //             height: 32,
    //             latitude: latitude,
    //             longitude: longitude,
    //             callout: {
    //               content: address,
    //               color: "#393939",
    //               textAlign: 'center',
    //               fontSize: 13,
    //               borderRadius: 20,
    //               bgColor: "#ffffff",
    //               padding: 10,
    //               display: "ALWAYS"
    //             },
    //           }]
    //         })
    //       }
    //     });
    //   }
    // });
  },
  removePosition(){
    this.setData({
      address:'',
      latitude:'',
      longitude:''
    })
  }


  
})
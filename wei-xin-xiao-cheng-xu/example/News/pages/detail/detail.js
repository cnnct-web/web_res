// pages/detail/detail.js
var WxParse = require('../../wxParse/wxParse.js');
var Utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article:null,
    comments:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var _this = this
    var aid = options.article_id
    wx.request({
      url: "http://winterfeel.com/testapi/news/detail",
      data:{
        article_id:aid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success:function(res){
        console.log(res)
        _this.setData({
          article: res.data.article
        })
        WxParse.wxParse('content', 'html', res.data.article.content, _this, 5);
      }
    })
    wx.request({
      url: "http://winterfeel.com/testapi/news/commentList",
      data:{
        article_id:aid,
        start_id:0,
        limit:10,
        orderType:0
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        for(var i in res.data.comments){
          res.data.comments[i].time = Utils.getDate(res.data.comments[i].time)
        }
        _this.setData({
          comments:res.data.comments
        })
      }
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
    return {
      title: this.article.title,
      path: '/pages/detail/detail?article_id=' + this.article.article_id
    }
  }
})
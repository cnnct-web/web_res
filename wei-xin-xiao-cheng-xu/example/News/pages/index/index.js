//index.js
var data = null
var index = 0
Page({
  data: {
    sections:null,
    articles:null,
  },
  onArticleClick:function(e){
    var aid = e.currentTarget.dataset.aid
    wx.navigateTo({
      url: '/pages/detail/detail?article_id='+aid,
    })
  },
  onSectionClick:function(e){
    var sid = e.currentTarget.dataset.sid
    for(var i in data){
      data[i]['active'] = false
      if(data[i].section_id == sid){
        index = i;
      }
    }
    data[index]['active'] = true
    this.setData({
      sections:data
    })
    if(data[index]['acticle']){    //如果当前项的文章被加载过，直接使用缓存
      this.setData({
        articles: data[index]['acticle']
      })
    }else{
      this.loadArticles(sid,false)
    }
   
  },
  onLoad: function () {
    var _this = this;
    wx.request({
      url: 'http://winterfeel.com/testapi/news/section',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      method:"GET",
      success: function (res) {
        data = res.data.sections
        index = 0
        data[index]['active'] = true    //默认选中第一个section
        _this.setData({
          sections:res.data.sections
        })
        _this.loadArticles(res.data.sections[0].section_id,false)
      }
    })
  },
  loadArticles:function(section_id,ifMore){
    var _this = this
    wx.request({
      url: 'http://winterfeel.com/testapi/news/article',
      data:{
        section_id: section_id,
        start_id:ifMore ? data[index]['article'].length : 0,
        limit:10,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method:"POST",
      success:function(res){
        if(ifMore){    //如果是加载更多，就需要追加到原来的数组
          data[index]['article'] = data[index]['article'].concat(res.data.articles)
        }else{       //否则就是直接赋值
          data[index]['article'] = res.data.articles   //缓存机制
        }
        _this.setData({
          articles: data[index]['article']
        })
        wx.stopPullDownRefresh()      //微信提供方法，加载完成之后阻止下拉刷新的动画
      }
    })
  },
  onPullDownRefresh:function(){      //下拉刷新
    this.loadArticles(data[index].section_id,false)
  },
  onReachBottom:function(){    //上拉加载
    this.loadArticles(data[index].section_id,true)
  }
})

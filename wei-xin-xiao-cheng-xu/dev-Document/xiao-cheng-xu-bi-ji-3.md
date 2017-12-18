# **微信小程序开发踩坑记录** #
1.由于小程序wx.request()方法是异步的，在app.js执行ajax后，各分页加载app.js的全局数据时，无法按顺序加载。例：

    //app.jsApp({
		ajax:function(){
			let that = this;
			wx.request({
				url: 'https://a.com/url.php',
				method: 'GET',
				success: function(e){
				that.data = 123;
				}
			})
		};
	})
	//content.jsletapp = getApp()
	Page({
		getData: function()
		app.ajax();
		console.log(app.data); //undefined
		}
	})

解决方法，使用Promise异步函数：

	//app.jsApp({
		ajax:function(){
			let that = this;
			let promise = newPromise(function(resolve, reject){
			wx.request({
				url: 'https://a.com/url.php',
				method: 'GET',
				success: function(e){
				that.data = 123;resolve();
				}
			})
			});
			};
		})
		//content.jsletapp = getApp()
		Page({
			getData: function(){
				app.ajax().then(()=>{console.log(app.data); //123
			});
			}
		})

2.图片只能获取原始宽高，无法获取现有宽高。不过image标签封装了mode属性，可以根据需求自行设置。

3.每个image标签底部有一条透明间隔，非padding，非margin。在图片前面做遮罩层时可能会被坑。
设置css为vertical-align: middle; 就可以

4.网络请求必须部署https 

5.配置tabBar时，list参数中的pagePath参数至少需要包含app.json里pages数组中的第一个路径，否则会导致tabBar不显示。

6.tabBar跳转时无法带参数，解决方法：

	//search.jsvarapp = getApp();
	Page({
		confirm: function(e){
		//获取数据，添加到全局
			let val = e.detail.value;
			app.searchWord = val;
			this.jump();
		},
		jump: function(){
			//跳转tabBar
			wx.switchTab({
				url: '../index/index',
			});
		},
	});
	//index.jsvarapp = getApp();
	Page({onShow: function(e){
		//获取全局数据
		let val = app.searchWord;
		}
	});
	//需要传递参数的页面在跳转前将数据添加到app.js里。需要接受参数的页面在onShow方法接受之前添加到app.js的数据。

7.小程序wx.request()方法请求的url必须是https开头

8.wx.request()使用post方法请求时，还需要加上header，header[content-type]值为application/x-www-form-urlencoded。例：

	wx.request({
	url: 'https://a.com/url.php',
	data: {message: 123},
	method: 'POST',
	header: {'content-type': 'application/x-www-form-urlencoded'},
	success: function(e){
			console.log(e)
		}
	});

9.小程序无法加载html标签(现在可以用rich-text组件，但是对图片很不友好)，同时数据渲染也无法渲染wxml标签（等），可以使用wxParse.js来处理相关数据。

10.安卓无法渲染wx.request()请求的数据。

检测返回的数据是否有BOM头（3个字符的空白）。安卓的wx.request解析不会跳过BOM头，导致数据返回的是字符串，而不是对象或者数组。

例：
返回的数据是：(3个字符的空白){a:1, b:2}

解析的数据是：'{a:1, b:2}'(字符串)，而不是{a:1, b:2}(对象)

由于不是对象，模板渲染之类会无法正常进行。解决方法，后台返回数据前去掉BOM头就行。如果后台不会去BOM头，可以在前端去除，但是wx.request如果dataType缺省，会默认为json并自动解析，导致无法去除BOM头。

解决方案：

	wx.request({
		url: url,
		method: 'GET',
		dataType: 'txt',
		success: function(e){
			let json = e.data.trim();
			let arr = JSON.parse(json);
		}
	});

dataType改为json以外的格式，避免小程序自动解析json字符串，然后对返回的数据用 trim() 方法去掉空白，最后解析json字符串就行。

11.调试时多行省略（-webkit-line-clamp）正常，发布时多行省略无效。

解决方案：如果不想重新审核，让后台截断就好

12.单次setData长度有限制：1048576

<p style="color: red">appservice:16 invokewebviewmethod 数据传输长度为 2432088 已经超过最大长度 1048576</p>
在用富文本的时候容易发生，特别是图片为base64且像素特别大的时候

13.页面的生命周期很迷，只有当redirectTo或navigateBack的时候才会卸载页面，也就是触发onUnload。

导致变量会存在很久，如果用setTimeout循环调用，可能会被坑，可以在onHide的时候清除有影响的变量或者setTimeout
### 微信小程序详解——页面之间的跳转方式【路由】和参数传递 ###

微信小程序拥有web网页和Application共同的特征，我们的页面都不是孤立存在的，而是通过和其他页面进行交互，来共同完成系统的功能。今天我们来研究小程序页面之间的跳转方式。

**1.先导**

在Android中，我们Activity和Fragment都有栈的概念在里面，微信小程序页面也有栈的概念在里面。微信小程序页面跳转有四种方式：

    1.wx.navigateTo(OBJECT)；
    2.wx.redirectTo(OBJECT)；
    3.wx.switchTab(OBJECT)；
    4.wx.navigateBack(OBJECT)

使用实现对应的跳转功能；

分析：
其中navigateTo是将原来的页面保存在页面栈中，在跳入到下一个页面的时候目标页面也进栈，只有在这个情况下点击手机的返回按钮才可以跳转到上一个页面；

redirectTo和switchTab都是先清除栈中原来的页面，然后目标页面进栈，使用这两种跳转方式，都不能通过系统的返回键回到上一个页面，而是直接退出小程序；

redirectTo使用的时候一定要配合tabBar或是页面里面可以再次跳转按钮，否则无法回到上一个页面；
switchTab跳转的页面必须是tabBar中声明的页面；

tabBar中定义的字段不能超过5个页面，小程序的页面栈层次也不能超过5层。

navigateBack只能返回到页面栈中的指定页面，一般和navigateTo配合使用。

wx.navigateTo 和 wx.redirectTo 不允许跳转到 tabbar 页面，只能用 wx.switchTab 跳转到 tabbar 页面

**2.页面跳转的具体操作**

(1)wx.navigateTo(OBJECT)

保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。

OBJECT 参数说明：
<table style="border-collapse:collapse;">
	<tr>
		<td>参数</td>
		<td>类型</td>
		<td>必填</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>url</td>
		<td>String</td>
		<td>是</td>
		<td>需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 ‘path?key=value&key2=value2’</td>
	</tr>
	<tr>
		<td>success</td>
		<td>Function</td>
		<td>否</td>
		<td>接口调用成功的回调函数</td>
	</tr>
	<tr>
		<td>fail</td>
		<td>Function</td>
		<td>否</td>
		<td>接口调用失败的回调函数</td>
	</tr>
	<tr>
		<td>complete</td>
		<td>Function</td>
		<td>否</td>
		<td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
	</tr>
</table>

示例代码：
wx.navigateTo({  url:'test?id=1'//实际路径要写全})

//test.jsPage({  onLoad: function(option){    console.log(option.query)    }})

注意：为了不让用户在使用小程序时造成困扰，我们规定页面路径只能是五层，请尽量避免多层级的交互方式。

（2）wx.redirectTo(OBJECT)

关闭当前页面，跳转到应用内的某个页面。

OBJECT 参数说明：
<table style="border-collapse:collapse;">
	<tr>
		<td>参数</td><td>类型</td><td>必填</td><td>说明</td>
	</tr>
	<tr>
		<td>url</td>
		<td>String</td>
		<td>是</td>
		<td>需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数</td>。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 ‘path?key=value&key2=value2’
	</tr>
	<tr>
		<td>success</td>
		<td>Function</td>
		<td>否</td>
		<td>接口调用成功的回调函数</td>
	</tr>
	<tr>
		<td>fail</td>
		<td>Function</td>
		<td>否</td>
		<td>接口调用失败的回调函数</td>
	</tr>
	<tr>
		<td>complete</td>
		<td>Function</td>
		<td>否</td>
		<td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
	</tr>
</table>


示例代码：

    wx.redirectTo({  url:'test?id=1'})

（3）wx.switchTab(OBJECT)

跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面

OBJECT 参数说明：
<table style="border-collapse: collapse;">
	<tr>
		<td>参数</td>
		<td>类型</td>
		<td>必填</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>url</td>
		<td>String</td>
		<td>是</td>
		<td>需要跳转的 tabBar 页面的路径（需在 app.json 的 tabBar</td>字段定义的页面），路径后不能带参数
	</tr>
	<tr>
		<td>success</td>
		<td>Function</td>
		<td>否</td>
		<td>接口调用成功的回调函</td>
	</tr>
	<tr>
		<td>fail</td>
		<td>Function</td>
		<td>否</td>
		<td>接口调用失败的回调函</td>
	</tr>
	<tr>
		<td>complete</td>
		<td>Function</td>
		<td>否</td>
		<td>接口调用结束的回调函数（调用成功、失败都会执行</td>
	</tr>
</table>


示例代码：

    {  "tabBar":
	 {"list": [
		{  "pagePath": "index",  "text": "首页"},
		{  "pagePath": "other",  "text": "其他"}] 
	 }}

	wx.switchTab({  url:'/index'})

（4）wx.navigateBack(OBJECT)

关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages()) 获取当前的页面栈，决定需要返回几层。

OBJECT 参数说明：
参数 类型 必填 说明
delta Number 1 返回的页面数，如果 delta 大于现有页面数，则返回到首页。

示例代码：

// 注意：调用 navigateTo 跳转时，调用该方法的页面会被加入堆栈，而 redirectTo 方法则不会。
见下方示例代码

// 此处是A页面wx.navigateTo({  url: 'B?id=1'})


// 此处是B页面wx.navigateTo({  url: 'C?id=1'})


// 在C页面内 navigateBack，将返回A页面wx.navigateBack({  delta: 2})


（5）使用标签实现页面跳转

navigator
页面链接。
<table style="border-collapse: collapse;">
	<tr>
		<td>参数</td>
		<td>类型</td>
		<td>必填</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>url</td>
		<td>String</td>
		<td>应用内的跳转链接</td>
		<td></td>
	</tr>
	<tr>
		<td>redirect</td>
		<td>Boolean</td>
		<td>false</td>
		<td>打开方式为页面重定向，对应 wx.redirectTo（将被废弃，推荐使用 open-type）</td>
	</tr>
	<tr>
		<td>open-type</td>
		<td>String</td>
		<td>navigate</td>
		<td>可选值‘navigate’、’redirect’、’switchTab’，对应于wx.navigateTo、wx.redirectTo</td>、wx.switchTab的功能
	</tr>
	<tr>
		<td>hover-class</td>
		<td>String</td>
		<td>navigator-hover</td>
		<td>指定点击时的样式类，当hover-class=”none”时，没有点击态效果</td>
	</tr>
	<tr>
		<td>hover-start-time</td>
		<td>Number</td>
		<td>50</td>
		<td>按住后多久出现点击态，单位毫秒</td>
	</tr>
	<tr>
		<td>hover-stay-time</td>
		<td>Number</td>
		<td>600</td>
		<td>手指松开后点击态保留时间，单位毫秒</td>
	</tr>
</table>


示例代码：

    "navigate?title=navigate" hover-class="navigator-hover">跳转到新页面  "redirect?title=redirect"open-type="redirect" hover-class="other-navigator-hover">在当前页打开  "index"open-type="switchTab" hover-class="other-navigator-hover">切换 Tab

**3.页面的路由和生命周期**

（1）页面的路由

在小程序中所有页面的路由全部由框架进行管理，对于路由的触发方式以及页面生命周期函数如下：

路由方式 触发时机 路由后页面 路由前页面
初始化 小程序打开的第一个页面 onLoad，onShow 
打开新页面 调用 API wx.navigateTo 或使用组件 onLoad，onShow onHide
页面重定向 调用 API wx.redirectTo 或使用组件 onLoad，onShow onUnload
页面返回 调用 API wx.navigateBack 或用户按左上角返回按钮 onShow onUnload（多层页面返回每个页面都会按顺序触发onUnload）
Tab 切换 调用 API wx.switchTab 或使用组件 或用户切换 Tab 各种情况请参考下表 


Tab 切换对应的生命周期（以 A、B 页面为 Tabbar 页面，C 是从 A 页面打开的页面，D 页面是从 C 页面打开的页面为例）：
<table style="border-collapse: collapse;">
	<tr>
		<td>当前页面</td>
		<td>路由后页面</td>
		<td>触发的生命周期（按顺序）</td>
	</tr>
	<tr>
		<td>A</td>
		<td>A</td>
		<td>Nothing happend</td>
	</tr>
	<tr>
		<td>A</td>
		<td>B</td>
		<td>A.onHide(), B.onLoad(), B.onShow()</td>
	</tr>
	<tr>
		<td>A</td>
		<td>B</td>
		<td>（再次打开） A.onHide(), B.onShow()</td>
	</tr>
	<tr>
		<td>C</td>
		<td>A</td>
		<td>C.onUnload(), A.onShow()</td>
	</tr>
	<tr>
		<td>C</td>
		<td>B</td>
		<td>C.onUnload(), B.onLoad(), B.onShow()</td>
	</tr>
	<tr>
		<td>D</td>
		<td>B</td>
		<td>D.onUnload(), C.onUnload(), B.onLoad(), B.onShow()</td>
	</tr>
	<tr>
		<td>D（从分享进入）</td>
		<td>A</td>
		<td>D.onUnload(), A.onLoad(), A.onShow()</td>
	</tr>
	<tr>
		<td>D（从分享进入）</td>
		<td>B</td>
		<td>D.onUnload(), B.onLoad(), B.onShow()</td>
	</tr>
</table>

**4.参数传递**

（1）通过路径传递参数

通过路径传递参数在wx.navigateTo(OBJECT)、wx.redirectTo(OBJECT)和中使用方法相同
示例代码：以wx.navigateTo为代表
```wx.navigateTo({  url:'test?id=1'//实际路径要写全})

//test.jsPage({  onLoad: function(option){    console.log(option.id)    }})

参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；

test?id=1 中id为参数键，1 为参数值
在目的页面中onLoad（）方法中option对象即为参数对象，可以通过参数键来取出参数值
/*
 * 检测浏览器
 * 
 * */
if(typeof browser != 'object') {
	browser = {
		versions: function() {
			var u = navigator.userAgent,
				app = navigator.appVersion;
			return {
				trident: u.indexOf('Trident') > -1, //IE内核
				ie: u.indexOf('Trident') > -1, //IE内核
				presto: u.indexOf('Presto') > -1, //opera内核
				webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核

				iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
				iPad: u.indexOf('iPad') > -1, //是否iPad
				webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部

				mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
				android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
				weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
				qqBrowser: u.indexOf('MQQBrowser') > -1,
				qq: /QQ\/[\d\.]+/ig.test(u),
				JLHM: /hmsh\s?\d?/ig.test(u)
			};
		}(),
		language: (navigator.browserLanguage || navigator.language).toLowerCase()
	};
}
/*
 * 获取+解析 location.search 参数
 * 
 * */
function getUrlData(urls) { //获取参数
	var url = typeof urls == 'string' ? urls : location.search ; //获取url中"?"符后的字串
	var theRequest = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			if(strs[i].length == 0) {
				continue;
			}
			theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}


/*
 * 主逻辑 
 * */
$(function() {
	/*幻灯*/
	var mySwiper = new Swiper ('.swiper-container', {
	    direction: 'horizontal',
	    loop: true,
	    autoplay: {
		    delay: 1000 * 5,//5秒切换一次
		},
	    // 如果需要分页器
	    pagination: {
	      el: '.swiper-pagination',
	    },
	})
	/*懒加载*/
//	var images = $(".ariticle-content img").lazyload();
	var images = new LazyLoad($(".ariticle-content img"),{
		src:'_src'
	});
	console.log(images);
	
});


function testAjax() {
	$.ajax({
		type: "get",
		url: "http://test.jlhmsh-test.com/goods/getGoods",
		data: {
			type: "mall",
			goodsSkuId: "2368801019098112"
		},
		dataType: 'jsonp',
		success: function(data) {
			if(data.code == 0) {
				if(data.data) {
					//操作dom;
					operationDom(data.data);
				} else {
					alert('获取数据失败 !（ data 为null ）');
				}

			} else {
				alert('请求失败 !（ code!=0 ）');
			}
		},
		complete: function(xhr, status) {
			alert('(ajax-complete) status >> ' + status);
		},
		error: function(xhr, errorType, error) {
			alert('(ajax-error) errorType >> ' + errorType + ' ; error >> ' + error);
		}
	});
}
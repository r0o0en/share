/*
 * 预定义
 * */
var browser = {
	versions: function() {
		var u = navigator.userAgent,
			app = navigator.appVersion;
		return {
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
			iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
			weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
			qq: u.match(/\sQQ/i) == " qq" //是否QQ
		};
	}(),
	language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

//获取参数
function getRequest() {
	var url = decodeURI(location.search); //获取url中"?"符后的字串
	var theRequest = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}
//获取imgurl
function getImgurl(str) {
	if(typeof str == 'string' && str.length > 0) {
		var reg = /http:[/]{2}[a-zA-Z0-9.%=/_\-]{1,}[.](jpg|jpeg|png)/ig;
		if(reg.test(str)) {
			return str.match(reg);
		} else {
			return false;
		}
	}
}
//传入对象、属性名、默认值，属性存在就返回属性值，否则返回默认值
function getAttribute(obj, key, defaults) {
	if(typeof obj != 'object' || !key) { return false; }
	var val = obj[key];
	if(val || $.trim(val).length > 0) {
		return val;
	} else if(defaults) {
		return defaults;
	} else {
		return false;
	}
}

//加减控制
var cuQuantity = function(data) {
	var defaults = {
		max: 9999,
		min: 1,
		$minus: $('.cu-quantity .cu-minus'),
		$add: $('.cu-quantity .cu-add'),
		$input: $('.cu-quantity .cu-input'),
		callback:function (value) {
//			console.log(value);
		}
	};
	var opt = $.extend({}, defaults, data);

	function judegMin() {
		opt.callback(opt.$input.val());
		if(opt.$input.val() <= opt.min) {
			opt.$minus.prop('disabled', true);
			return false;
		} else {
			opt.$minus.removeAttr('disabled');
			return true;
		}
	};

	function judegMax() {
		if(opt.$input.val() >= opt.max) {
			opt.$add.prop('disabled', true);
			return false;
		} else {
			opt.$add.removeAttr('disabled');
			return true;
		}
	};
	judegMin();
	judegMax();
	
	opt.$minus.on('click', function(e) {
		opt.$input.val(function(i, v) {
			if(v.length < 1) { return opt.min; }
			return parseInt(v) - 1;
		});
		judegMin();
		judegMax();
	})
	opt.$add.on('click', function(e) {
		opt.$input.val(function(i, v) {
			if(v.length < 1) { return opt.min > 0 ? opt.min : 1; }
			return parseInt(v) + 1
		});
		judegMin();
		judegMax();
	})
	opt.$input.on('input propertychange ', function(e) {
		var k = v = parseInt($(this).val());
		if(v || v === 0) {
			judegMin() ? '' : k = opt.min;
			judegMax() ? '' : k = opt.max;
			$(this).val(k);
		} else { return false; }
	});
}
//window.onload
function addLoadEvent(func){ 
    var oldonload=window.onload; 
    if(typeof window.onload!='function'){ 
        window.onload=func; 
    }else{ 
        window.onload=function(){ 
            oldonload(); 
            func(); 
        } 
    } 
} 
(function() {
	/*zepto scrolltop*/
	var goTopSetTimeOut;
	$.fn.goTop = function (data) {
		clearInterval(goTopSetTimeOut);
		var dafaults = {
			top:0,
			time:500,
			interval:5,
			callback:function () {}
		}
		var o = $.extend({},dafaults,data),
			obj = $(this);
		var now = obj.scrollTop();
//		if(now == o.top){return false;}
		var num = o.time/o.interval,
			spend = (o.top-now)/num;
		goTopSetTimeOut = setInterval(function () {
			num -- ;
			obj.scrollTop(now+=spend);
			if(num <= 0){o.callback(obj);clearInterval(goTopSetTimeOut)}
			goTopSetTimeOut;
		},o.interval);
	}
	
	/* li scrolltop*/
	var defaults = {
		subtracts: $('.fixed-header').height(), //要减去的高度
		$li: $('.fixed-header ul li '), //btn elements
		li_active:'active',
		data_target: 'data-target' // btn 通过 data-[name] 指向的靶子
	}
	
	//获取$li 对应的 靶子
	function getTarget ($li,data_target){
		var arr = [];
		$li.each(function (i,e) {
			arr.push( $('#'+ $(e).attr(data_target))[0] );
		})
		return $(arr);
	}
	//获取靶子元素的滚动距离
	function getTargetDistance($target,$wp,subtracts) {
		var  arr = [];
		$target.each(function (i,e) {
			arr[i] = $(e).offset().top - subtracts;
		})
		return arr;
	}
	
	$.fn.liScroll = function(data) {
		var o = $.extend({},defaults,data);
		var $this = this , //滚动的外层容器（over：hide）
			$wp = $this.children(); //被滚动的元素
			
		//获取$li 对应的靶子元素
		o.$target = getTarget(o.$li,o.data_target);
		//获取靶子元素的滚动距离
		var distance = getTargetDistance(o.$target,$wp,o.subtracts);
		//滚动监听
		var scrollFun = function (e) {
			var now = $(this).scrollTop(),
				now_i = 0 ;
			for(var i in distance){
				if(now >= distance[i]){
					now_i = i ;
				}else{
					break;
				}
			}
			o.$li.removeClass(o.li_active).eq(now_i).addClass(o.li_active);
		};
		$this.on('scroll',scrollFun);
		
		o.$li.on('click',function (e) {
			e.preventDefault();
			var i = $(this).index();
//			if( distance[i] == $this.scrollTop()){return false;}
			$this.off('scroll',scrollFun);
			o.$li.removeClass(o.li_active).eq(i).addClass(o.li_active);
			$this.goTop({top:distance[i],callback:function () {
				$this.on('scroll',scrollFun);	
			}});
		})
		
		return {
			setArr:function(){
				distance = getTargetDistance(o.$target,$wp,o.subtracts);
			}
		}
	};
}())

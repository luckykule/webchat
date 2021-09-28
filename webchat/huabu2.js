var canvas;//定义全局画布
var context;//定义全局context
var img1=[];//储存图像数组，用于撤销
var canX;//画布左上角的x坐标
var canY;//画布左上角y坐标

//let txtSelfId = document.querySelector("input#txtSelfId");
//let txtTargetId = document.querySelector("input#txtTargetId");
// let btnRegister = document.querySelector("button#btnRegister");
let btnclose = document.querySelector("button#btnclose");
let peer2 = null;
let localConn2 = null;
let localStream2 = null;
let started = false;
let buffer = [];

hashCode = function (str) {
    let hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}
function sendMessage(from, to, action) {
    var message = { "from": from, "to": to, "action": action };
    if (!localConn2) {
        localConn2 = peer2.connect(hashCode(to));
        
        localConn2.on('open', () => {
            localConn2.send(JSON.stringify(message));
            console.log(message);
        });
    }
    if (localConn2.open){
        localConn2.send(JSON.stringify(message));
        console.log(message);
    }
}
function sendData(from, to, data) {
    if (from.length == 0 || to.length == 0 || data.length == 0) {
        return;
    }
    let message = { "from": from, "to": to, "data": data };
    if (!localConn2) {
        localConn2 = peer2.connect(hashCode(to));
        localConn2.on('open', () => {
            localConn2.send(JSON.stringify(message));
            console.log(message);
        });
    }
    if (localConn2.open) {
        localConn2.send(JSON.stringify(message));
        console.log(message);
    }
}

$(function(){
	canvas = $('#cavs')[0];//获取画布的dom
	context = canvas.getContext('2d');//获取context
	canX=canvas.offsetLeft;//获取画布左上角的x坐标
	canY=canvas.offsetTop;//获取画布左上角的y坐标
	// var imgData=context.getImageData(0,0,canvas.width,canvas.height);
	// img1.push(imgData);

	var paint=Object.create(Line);//定义父类，初始化获取画线条的对象
	context.lineCap="round";//线条起始和结尾样式
	context.lineJoin="round";//线条转弯样式
	$('#Line').click(function(event) {//点击线条按钮，获取线条对象
		context.lineWidth = $('#thickness').val();
		paint=Object.create(Line);
		context.strokeStyle = $("#color").val();
		console.log(paint);
	}); 
	$('#xpc').click(function(event) {
		context.lineWidth = $('#thickness').val();
		paint=Object.create(xpc);
		context.strokeStyle = "#FFF";
		console.log(paint);
	});
	$('#qingping').click(function(event) {
		 context.clearRect(0,0,canvas.width,canvas.height);
		 //context的clearRect方法
		 sendMessage(usera, userb, "clear");
	});
	$('#chexiao').click(function() {
		context.putImageData(img1.pop(),0,0);
	});
	paint.draw();
	$("#xiazai").click(function(event) {
		xiazai.draw();
	});
	 
});


window.onload = function () {

	{
    if (!navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia) {
        console.log('webrtc is not supported!');
        alert("webrtc is not supported!");
        return;
    }

    //获取摄像头列表
    navigator.mediaDevices.enumerateDevices()
        .then(gotDevices)
        .catch(handleError);

    $("#dialog-confirm").hide();
    $("#videoending").hide();

    //连接到peerjs服务器的选项
    let connOption = { host: 'localhost', port: 9000, path: '/', debug: 3 };

//register处理
if (!peer) {
        
        peer = new Peer(hashCode(caller_id), connOption);
        peer.on('open', function (id) {
            console.log("register success. " + id);
        });
        peer.on('call', function (call) {
            call.answer(localStream);
        });
        peer.on('connection', (conn) => {
            conn.on('data', (data) => {
                var msg = JSON.parse(data);
                console.log(msg);
                //收到视频邀请时，弹出询问对话框
                if (msg.action === "call") {
                    lblFrom.innerText = reciver_name;

                    console.log("gg at call");
                    $("#dialog-confirm").dialog({
                        resizable: false,
                        height: "auto",
                        width: 400,
                        modal: true,
                        buttons: {
                            "Accept": function () {
                                $(this).dialog("close");
                                sendMessage(msg.to, msg.from, "accept");
                            },
                            Cancel: function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
                if (msg.action === "close") {
                    console.log("close video => " + JSON.stringify(msg));
                    sendMessage(msg.to, msg.from, "close-ok");
                    window.close();
                    
                }
                if (msg.action === "close-ok") {
                    console.log("close-ok  => " + JSON.stringify(msg));
                    window.close();
                   
                }

                //接受视频通话邀请
                if (msg.action === "accept") {
                    console.log("accept call => " + JSON.stringify(msg));
                    var call = peer.call(hashCode(msg.from), localStream);
                    call.on('stream', function (stream) {
                        console.log('received remote stream');
                        remoteVideo.srcObject = stream;
                        sendMessage(msg.to, msg.from, "accept-ok");
                    });
                }

                //接受视频通话邀请后，通知另一端    
                if (msg.action === "accept-ok") {
                    console.log("accept-ok call => " + JSON.stringify(msg));
                    var call = peer.call(hashCode(msg.from), localStream);
                    call.on('stream', function (stream) {
                        console.log('received remote stream');
                        remoteVideo.srcObject = stream;                            
                    });
                }
				if (msg.action === "clear") {
	                    	context.clearRect(0,0,canvas.width,canvas.height);
	                    	console.log("clear canvas!");
	                    }
                 {
	                    	//txtTargetId.value = msg.from;
	                    //还原canvas
	                    //context.strokeStyle = '#f00';
	                    console.log("gg");
	                    context.beginPath();
	                    context.moveTo(msg.data[0].x, msg.data[0].y);
	                    for (const pos in msg.data) {
	                    	context.strokeStyle = msg.data[pos].color;
	                    	context.lineWidth = msg.data[pos].cuxi;
	                        context.lineTo(msg.data[pos].x, msg.data[pos].y);
	                    }
	                    context.stroke();
	                    }
            });
        });
    }

btnRegister.onclick = function () {
    console.log('you click running!');
    console.log(caller_id, reciver_id);
        sendMessage(caller_id, reciver_id, "call");
        
}
btnclose.onclick = function () {
    console.log('you click!');
     $("#videoending").dialog({
                        resizable: false,
                        height: "auto",
                        width: 400,
                        modal: true,
                        buttons: {
                            "YES": function () {
                                $(this).dialog("close");
                                sendMessage(caller_id, reciver_id, "close");
                            },
                            "NO": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
       
}
 

    videoSelect.onchange = start;

    start();
}
	if (!navigator.mediaDevices ||
	        !navigator.mediaDevices.getUserMedia) {
	        console.log('webrtc is not supported!');
	        alert("webrtc is not supported!");
	        return;
	    }
    let connOption = { host: 'localhost', port: 9000, path: '/', debug: 3 };
	
	            peer2 = new Peer(hashCode(usera), connOption);
	            peer2.on('open', function (id) {
	                console.log("canvas register success. " + id);
	            });
	            peer2.on('connection', (conn) => {
	                conn.on('data', (data) => {
	                    let msg = JSON.parse(data);
	                    console.log(msg);
	                    //收到视频邀请时，弹出询问对话框
                if (msg.action === "call") {
                    lblFrom.innerText = msg.from;
                    
                    $("#dialog-confirm").dialog({
                        resizable: false,
                        height: "auto",
                        width: 400,
                        modal: true,
                        buttons: {
                            "Accept": function () {
                                $(this).dialog("close");
                                sendMessage(msg.to, msg.from, "accept");
                            },
                            Cancel: function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
                
                //接受视频通话邀请
                if (msg.action === "accept") {
                    console.log("accept call => " + JSON.stringify(msg));
                    var call = peer.call(hashCode(msg.from), localStream);
                    call.on('stream', function (stream) {
                        console.log('received remote stream');
                        remoteVideo.srcObject = stream;
                        sendMessage(msg.to, msg.from, "accept-ok");
                    });
                }

                if (msg.action === "close") {
                    console.log("close video => " + JSON.stringify(msg));



                    sendMessage(msg.to, msg.from, "close-ok");
                    window.close();
                    
                }
                if (msg.action === "close-ok") {
                    console.log("close-ok  => " + JSON.stringify(msg));
                    window.close();
                    
                }

                //接受视频通话邀请后，通知另一端    
                if (msg.action === "accept-ok") {
                    console.log("accept-ok call => " + JSON.stringify(msg));
                    var call = peer.call(hashCode(msg.from), localStream);
                    call.on('stream', function (stream) {
                        console.log('received remote stream');
                        remoteVideo.srcObject = stream;                            
                    });
                }
	                    if (msg.action === "clear") {
	                    	context.clearRect(0,0,canvas.width,canvas.height);
	                    	console.log("clear canvas!");
	                    }
	                    // else if (msg.action === "call") {
	                    // 	console.log("connect!");
	                    // }
	                    else{
	                    	//txtTargetId.value = msg.from;
	                    //还原canvas
	                    //context.strokeStyle = '#f00';
	                    console.log("gg");
	                    context.beginPath();
	                    context.moveTo(msg.data[0].x, msg.data[0].y);
	                    for (const pos in msg.data) {
	                    	context.strokeStyle = msg.data[pos].color;
	                    	context.lineWidth = msg.data[pos].cuxi;
	                        context.lineTo(msg.data[pos].x, msg.data[pos].y);
	                    }
	                    context.stroke();
	                    }
	                    
	                });
	            });
	        }
	    

	    //share按钮处理
	    
	   // sendMessage(usera, userb, "call");
	    
	    
	    //start();
	

var Line={
	name:"line",
	draw:function(){
		var painting = false;//初始化设置为不可画状态
		var p_x;//画笔初始x坐标
		var p_y;//画笔初始y坐标
		// var canvas = $('#cavs')[0];//获取画布的dom
		// var context = canvas.getContext('2d');//获取绘制2d图形的context
		//初始化画笔颜色
		console.log(context.strokeStyle);
		$('#cavs').mousemove(function(e){//当鼠标在画布上移动时执行
			if(painting===true){//判断是否是可绘画状态
				var x = e.pageX;//鼠标当前x坐标
				var y = e.pageY;//鼠标当前y坐标
				context.lineTo(x-canX,y-canY);//确定线的结束位置，canvas.offsetLeft画板离浏览器左侧的距离，canvas.offsetTop画板离浏览器上部的距离
				context.stroke();
				
				buffer.push({ "x": x-canX, "y": y-canY, "color":context.strokeStyle,"cuxi":context.lineWidth }); //
			}
		});
		$('#cavs').mousedown(function(e){//当鼠标按下时触发
			painting = true;//鼠标按下可以作画
			p_x = e.pageX;//画笔起始x坐标
			p_y = e.pageY;//画笔起始y坐标
			context.beginPath();//开始作画
			context.moveTo(p_x-canX,p_y-canY);//画笔开始位置
			$('#cavs').css('cursor','pointer');//将鼠标图形设置成小手
			//复制图像，为了撤销
			var imgData=context.getImageData(0,0,canvas.width,canvas.height);
			//加入数组
			img1.push(imgData);

			buffer.push({ "x": p_x-canX, "y": p_y-canY, "color":context.strokeStyle,"cuxi":context.lineWidth }); //
			
		});
		$('#cavs').mouseup(function(e){
			painting = false;//鼠标松开，禁止作画
			context.closePath();//关闭画笔路径
			$('#cavs').css('cursor','');//消除鼠标小手

			//鼠标抬起时，发送坐标数据
			sendData(usera, userb, buffer);
			buffer = [];
			console.log("over!");
		});
		$('#cavs').mouseleave(function(e){//鼠标移出时，禁止作画
			painting = false;
			context.closePath();
			$('#cavs').css('cursor','');//消除鼠标小手
		});
		$("#color").change(function(event) {//当颜色改变时触发
			context.strokeStyle = $(this).val();//改变画笔颜色
		});
		$("#cuxi").change(function(event) {
			context.lineWidth = $(this).val();
		});
	}
}
var xpc={
	name:"xpc",
	draw:function(){
		var painting = false;//初始化设置为不可画状态
		var p_x;//画笔初始x坐标
		var p_y;//画笔初始y坐标
		console.log(context.strokeStyle);
		ontext.lineWidth = $("#cuxi").val();
		$('#cavs').mousemove(function(e){//当鼠标在画布上移动时执行
			if(painting===true){//判断是否是可绘画状态
				var x = e.pageX;//鼠标当前x坐标
				var y = e.pageY;//鼠标当前y坐标
				context.lineTo(x-canX,y-canY);//确定线的结束位置，canvas.offsetLeft画板离浏览器左侧的距离，canvas.offsetTop画板离浏览器上部的距离
				context.stroke();

				buffer.push({ "x": x-canX, "y": y-canY, "color":context.strokeStyle,"cuxi":context.lineWidth }); //
			}
		});
		$('#cavs').mousedown(function(e){//当鼠标按下时触发
			painting = true;//鼠标按下可以作画
			 p_x = e.pageX;//画笔起始x坐标
			 p_y = e.pageY;//画笔起始y坐标
			 context.beginPath();//开始作画
			context.moveTo(p_x-canX,p_y-canY);//画笔开始位置
			$('#cavs').css('cursor','pointer');//将鼠标图形设置成小手
			//复制图像，为了撤销
			var imgData=context.getImageData(0,0,canvas.width,canvas.height);
			//加入数组
			img1.push(imgData);

			buffer.push({ "x": p_x-canX, "y": p_y-canY, "color":context.strokeStyle,"cuxi":context.lineWidth }); //
		});
		$('#cavs').mouseup(function(e){
			painting = false;//鼠标松开，禁止作画
			context.closePath();//关闭画笔路径
			$('#cavs').css('cursor','');//消除鼠标小手
		});
		$('#cavs').mouseleave(function(e){//鼠标移出时，禁止作画
			painting = false;
			context.closePath();
		});
		$("#cuxi").change(function(event) {//修改粗细时，进行赋值
			context.lineWidth = $(this).val();
		});
	}
}

var xiazai={
	draw:function(){
	// 保存图片，下载到本地
		var type = 'png';
		var imgData = $('#cavs')[0].toDataURL(type);
		/**
		 * 获取mimeType
		 * @param  {String} type the old mime-type
		 * @return the new mime-type
		 */
		 var _fixType = function(type) {
		 	type = type.toLowerCase().replace(/jpg/i, 'jpeg');
		 	var r = type.match(/png|jpeg|bmp|gif/)[0];
		 	return 'image/' + r;
		 };
		// 加工image data，替换mime type
		imgData = imgData.replace(_fixType(type),'image/octet-stream');
		/**
		 * 在本地进行文件保存
		 * @param  {String} data     要保存到本地的图片数据
		 * @param  {String} filename 文件名
		 */
		 var saveFile = function(data, filename){
		 	var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
		 	save_link.href = data;
		 	save_link.download = filename;

		 	var event = document.createEvent('MouseEvents');
		 	// initMouseEvent()方法参数解释在    http://blog.sina.com.cn/s/blog_3e9b01a50100leyj.html
		 	event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		 	save_link.dispatchEvent(event);
		 };
		// 下载后的文件名
		var filename = 'xiaoguangren' + (new Date()).getTime() + '.' + type;
		// download
		saveFile(imgData,filename);
  }
}
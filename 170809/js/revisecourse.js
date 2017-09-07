$(function() {
	var server = "http://172.13.16.2:8900/school/";
	var api = frameElement.api,W = api.opener;
	var name=null;
	api.button({
		id: 'valueOk',
		name: '确定',
		callback: ok,
		disabled: true
	},{
		id:'cancel',
		name:'取消',
		callback:cancel,
	});
	function ok() {
		var data={
			id:$("#rid").val(),
			name:$("#rName").val(),
			credit:$("#rCredit").val(),
			content:$("#rContent").val()
		}
		$.ajax({
			type:"post",
			url:server+"course/update",
			async:false,
			data:data,
			success:function(r){
				if(r.result){
					W.$.dialog.tips("修改成功！",2);
				}else{
					W.$.dialog.tips("修改失败！",2);
				}
			}
		});
	}
	function cancel(){
		return true;
	}
	$("#rName").on("blur", function() {
		if($("#rName").val() == "") {
			$("#tips1").append("<img src='img/false.png'/>课程名不能为空");
			api.button({
				id: 'valueOk',
				name: '确定',
				disabled: true
			})
		} else {
			if($("#rName").val()!=name){
				$.get(server + "course/isexist/" + $("#rName").val(), function(r) {
					if(r.data) {
						$("#tips1").append("<img src='img/false.png'/>已存在该课程");
						api.button({
							id: 'valueOk',
							name: '确定',
							disabled: true
						})
					} else {
						$("#tips1").append("<img src='img/true.png'/>");
						api.button({
							id: 'valueOk',
							name: '确定',
							disabled: false
						})
					}
				})
			}else{
				$("#tips1").append("<img src='img/true.png'/>");
				api.button({
					id: 'valueOk',
					name: '确定',
					disabled: false
				})
			}
			
		}
	}).on("focus", function() {
		if(name==null){
			name=$("#rName").val();
		}
		$("#tips1").empty();
	})
	$("#rCredit").on("blur", function() {
		if($("#rCredit").val() == "") {
			$("#tips2").append("<img src='img/false.png'/>学分不能为空");
			api.button({
				id: 'valueOk',
				name: '确定',
				disabled: true
			})
		} else {
			$("#tips2").append("<img src='img/true.png'/>");
			api.button({
				id: 'valueOk',
				name: '确定',
				disabled: false
			})
		}
	}).on("focus", function() {
		$("#tips2").empty();
	})
	$("#rContent").on("input",function(){
		api.button({
				id: 'valueOk',
				name: '确定',
				disabled: false
		})
	})
})
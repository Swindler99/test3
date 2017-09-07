$(function() {
	var server = "http://172.13.16.2:8900/school/";
	var api = frameElement.api,W = api.opener;
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
			name:$("#aName").val(),
			credit:$("#aCredit").val(),
			content:$("#aContent").val()
		}
		$.ajax({
			type:"post",
			url:server+"course/add",
			async:false,
			data:data,
			success:function(r){
				if(r.result){
					W.$.dialog.tips("添加成功！",2);
				}else{
					W.$.dialog.tips("添加失败！",2);
				}
			}
		});
	}
	function cancel(){
		return true;
	}
	$("#aName").on("blur", function() {
		if($("#aName").val() == "") {
			$("#tips1").append("<img src='img/false.png'/>课程名不能为空");
			api.button({
				id: 'valueOk',
				name: '确定',
				disabled: true
			})
		} else {
			$.get(server + "course/isexist/" + $("#aName").val(), function(r) {
				$("#confirm").prop("disabled", r.data);
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
		}
	}).on("focus", function() {
		$("#tips1").empty();
	})
	$("#aCredit").on("blur", function() {
		if($("#aCredit").val() == "") {
			$("#confirm").prop("disabled", true);
			$("#tips2").append("<img src='img/false.png'/>学分不能为空");
			api.button({
				id: 'valueOk',
				name: '确定',
				disabled: true
			})
		} else {
			$("#confirm").prop("disabled", false);
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

})
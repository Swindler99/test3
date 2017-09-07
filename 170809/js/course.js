
$(function(){
	var server="http://172.13.16.2:8900/school/";
	var page=1;//当前页数
	var num=15;//每页展示数量
	var pageNum=0;//总页数
	var searchResults=new Array();//查询结果
	search();
	$("#search").click(function(){
		search();
	});
	
	$("#all").on("click",function(){
		$('[name="check"]').prop("checked",this.checked);
	})
	$(document).on("click",'[name="check"]',function(){
		if($('[name="check"]:checked').length==0){
			$("#all").prop("indeterminate",false);
			$("#all").prop("checked",false);
		}else if($('[name="check"]:checked').length==$('[name="check"]').length){
			$("#all").prop("indeterminate",false);
			$("#all").prop("checked",true);
		}else{
			$("#all").prop("indeterminate",true);
		}	
	}).on("click",".delete",function(){
		var id=$(this).parent().prevAll().eq(3).children().val();
		$.dialog.confirm("确认删除吗？",function(){
			for (var i=0;i<searchResults.length;i++) {
				if(searchResults[i].id==id){
					searchResults.splice(i,1);
					$("#result").text("共找到"+searchResults.length+"条记录");
					writeToTable(displaycontent());
					break;
				}
			}
			$.post(server+"course/del/"+id,function(r){
				if(r.result){
					$.dialog.tips("操作成功！",2);
				}else{
					$.dialog.tips("删除失败！",2);
				}
			});
		})
	}).on("click",".revise",function(e){
		$.dialog({
			content:"url:revisecourse.html",
			title:"修改课程",
			min:false,
			max:false,
			lock:true,
			init:function(){
				var data;
				$.ajax({
					type:"get",
					url:server+"course/view/"+$(e.target).parent().prevAll().eq(3).children().val(),
					async:false,
					success:function(r){
						data=r.data;
					}
				});
				this.content.document.getElementById("rid").value=data.id;
				this.content.document.getElementById("rName").value=data.name;
				this.content.document.getElementById("rCredit").value=data.credit;
				this.content.document.getElementById("rContent").value=data.content;
			},
			close:function(){	
				$(e.target).parent().prevAll().eq(2).text(this.content.document.getElementById("rName").value);
				$(e.target).parent().prevAll().eq(1).text(this.content.document.getElementById("rCredit").value);
				$(e.target).parent().prevAll().eq(0).text(this.content.docu ment.getElementById("rContent").value);
			}
		})
	})
	$("#del").click(function(){
		if($('[name="check"]:checked').length==0){
			$.dialog.tips("请选择至少一条记录",2);
		}else{
			$.dialog.confirm("确认删除全部选中吗？",function(){
				for (var i=0;i<$('[name="check"]:checked').length;i++) {
					for(var j=0;j<searchResults.length;j++){
						if($('[name="check"]:checked')[i].value==searchResults[j].id){
							searchResults.splice(j,1);
						}
					}
					$.post(server+"course/del/"+$('[name="check"]:checked')[i].value);
				}
				$.dialog.tips("操作成功！",2);
				$("#result").text("共找到"+searchResults.length+"条记录");
				writeToTable(displaycontent());
			})
		}
	})
	$("#add").click(function(){
		$.dialog({
			content:"url:addcourse.html",
			title:"添加课程",
			min:false,
			max:false,
			lock:true,
			close:function(){
				search();
			}
		})
	})	
	
	//ajax查询出课程列表
	function search(){
		$.get(server+"course /list",function(r){
			searchResults.length=0;
			for (var i=0;i<r.data.length;i++) {
				if(r.data[i].name.indexOf($("#searchName").val())!=-1){
					if($("#searchCredit").val()==""||$("#searchCredit").val()==r.data[i].credit){
						searchResults.push(r.data[i]);
					}
				}
			}
			$("#result").text("共找到"+searchResults.length+"条记录");
			pageNum=Math.ceil(searchResults.length/num);
			createPagination();
			writeToTable(displaycontent());
			$("#searchName").val("");
			$("#searchCredit").val("");
		})
	}
	
	//选择要展示的内容
	function displaycontent(){
		var display=new Array();
		for (var i=num*(page-1);i<searchResults.length;i++) {
			display[display.length]=searchResults[i];
			if(i==num*page-1){
				break;
			}
		}
		return display;
	}
	
	//将要展示的内容写入表格
	function writeToTable(display){
		$("#message tbody").children().remove(".c");
		var data={
			courses:display
		}
		$("#message tbody").append(template('tr',data));
		if($("#message tbody").children().length==2){
			var newTr=document.createElement("tr");
			newTr.className="c";
			$(newTr).append('<td colspan="5">未找到任何匹配课程！请重新查询</td>');
			$("#message").append(newTr);
		}
	}
	
	//创建导航页标
	function createPagination(){
		if(pageNum==0){
			pageNum=1;
		}
		var pages={
			nums:[]
		}
		for(var i=1;i<=pageNum;i++){
			pages.nums.push(i);
		}
		$("#pagination").append(template('a',pages));
	}
})
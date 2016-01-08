define('publish',function(require){

    editText = {
    	title:null,
    	raw:null,
    	real:null
    }

	fun = {

		postBtnEvent : function(){
			$('.add-btn').on('click',function(){
				fun.getRealContent();
				if(!editText.real){
					$.toast('请输入文章内容');
				}else if(editText.raw && editText.raw.length<= 10){
					$.toast('文章内容需超过10个字符');
				}else{
					$.ajax({
						url:"http://www.nostory.cn/addPost",
						type:"post",
						dataType:"json",
						data:{
							uId:'11',
							title:'test article title',
							content:editText.real
						},
						success:function(r){
							if(r.data.code == '0'){
								$.toast('发表成功');
							}
						}
					});
				}
				
			});
		},

		resetBtnEvent : function(){
			$('.reset-btn').on('click',function(){
				var activeEditor = tinymce.activeEditor;
				var editBody = activeEditor.getBody();
				$(editBody).text("");
				$('.char-count').find('span').text("0");
				editText.raw = null;
				editText.real = null;
			});
		}, 

		getRealContent : function(){
			editText.real = tinymce.activeEditor.getContent();
		},

		getRawContentLength : function(){
			var activeEditor = tinymce.activeEditor;
			var editBody = activeEditor.getBody();
			editText.raw = $(editBody).text()
			$(document).find('.char-count').find('span').text(editText.raw.length);
		},
	}

	init = function(){

		fun.postBtnEvent();
		fun.resetBtnEvent();

		$("iframe").contents().find("body").on('keyup',function(){
			fun.getRawContentLength()
		});
		
	};

	return {
		init:init
	};
	
});
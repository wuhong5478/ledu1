$(function(){
	
	/*导航切换*/
	var bookManage = $('.j-book');
	var manageSection = $('.content');
	bookManage.on('click', function(event) {
		bookManage.removeClass('z-sel');
		$(this).addClass('z-sel');
		manageSection.hide().eq($(this).parent().index()).show();
	});
	
	var hash = window.location.hash;
    console.log(hash)
    if(hash=='#add'){
        $("#j-book-list").removeClass("z-sel");
        $("#j-book-add").addClass("z-sel");
        manageSection.eq(0).hide();
        manageSection.eq(1).show();
    }else{
        $("#j-book-list").addClass("z-sel");
        $("#j-book-add").removeClass("z-sel");
        manageSection.eq(1).hide();
        manageSection.eq(0).show();
    }
    
	/*
    * 遮罩层
    */
    var cover = $('.update-cover');
    var updateSection = $('.update-section');
    cover.on('click', function(event) {
        updateSection.hide();
        $(this).hide();
        event.preventDefault();
    });

    /*
    * 书籍管理列表
    */  
    initMusicList();
    function initMusicList(){
       var musicListBox=$(".m-musiclist");
       var ajaxUrl="getAllBooks";
       var html="";
       $.ajax({
            type:"POST",
            url:ajaxUrl,
            dataType:"json"
       })
       .done(function(res){  
            $.each(res,function(index,obj){
                var txt=obj.bookStatus==1? "下架" : "上架";
                html+=  '<tr class="m-book-unit">'+
                        '    <td class="m-book-ceil titlepage">'+
                        '        <img src="'+obj.bookImgUrl+'" class="titlepage-img">'+
                        '    </td>'+
                        '    <td class="m-book-ceil bookname">'+obj.bookName+'</td>'+
                        '    <td class="m-book-ceil author">'+obj.bookAuthor+'</td>'+
                        '    <td class="m-book-ceil update"><a href="javascript:;" data-bookid="'+obj.bookId+'" data-bookauthor="'+obj.bookAuthor+'" data-bookimg="'+obj.bookImgUrl+'" data-booktitle="'+obj.bookTitle+'" data-bookname="'+obj.bookName+'" class="j-replace">替换</a></td>'+
                        '    <td class="m-book-ceil handle"><a href="javascript:;" data-type="'+obj.bookStatus+'" data-bookid="'+obj.bookId+'" class="j-musichandle">'+txt+'</a></td>'+
                        '</tr>';
            })
           musicListBox.html(html);
       })
    }
    /*
	* 替换书籍
	*/
	replaceMusic();
    function replaceMusic(){
        var replaceBtn = $('.replace-btn');
        var replaceBox=$(".replace");

        var bookId=replaceBox.find(".j-id");
        var bookImg=replaceBox.find(".j-img");
        var bookName=replaceBox.find(".j-name");
        var bookTitle=replaceBox.find(".j-title");
        var bookAuthor=replaceBox.find(".j-author");
        var oldBookId;//要被替换的书籍
        $(".m-musiclist").on('click','.j-replace',function(event) {
	        $('.replace').show();
	        cover.show();
	        oldBookId = $(this).data("bookid");
            var dateBookId = $(this).attr('data-bookid');    
            var dateBookImg = $(this).attr('data-bookimg');
            var dateBookName = $(this).attr('data-bookname');
            var dateBookTitle = $(this).attr('data-booktitle');  
            var dateBookAuthor = $(this).attr('data-bookauthor');    
            bookId.val(dateBookId);
            bookImg.val(dateBookImg);
            bookTitle.val(dateBookTitle);
            bookAuthor.val(dateBookAuthor);
            bookName.val(dateBookName);
	        event.preventDefault();
	    });  
	    replaceBtn.on('click', function(event) {
	    	var ajaxUrl = 'replaceBook';
            if(!oldBookId){alert("书籍ID不存在");return false;}
	        $.ajax({
	            url: ajaxUrl,
	            type: 'POST',
	            data: {
                    oldBookId:oldBookId,
	                bookId:bookId.val(),
                    bookImgUrl:bookImg.val(),
                    bookName:bookName.val(),
                    bookTitle:bookTitle.val(),
                    bookAuthor:bookAuthor.val()
	            },
	        })
	        .done(function(res) {
	            if(res == 1){
	                alert('替换成功');
	                location.reload();
	            }else if(res==2){
	                alert('书籍已存在');
	            }else{
                    alert('操作失败！');
                }
	        })
	        .fail(function() {
	            alert('网络错误！！');
	        })        
	        event.preventDefault();
	    });
    }
        
    /*
    * 添加新书
    */
    var addMusicBtn=$(".add-musicbtn");
    addMusicBtn.on('click', function(event) {
        var _bookId=$(this).parent().find('.u-input').val();
        if(!_bookId){
            alert('请先输入书籍ID');
            return false;
        }
        var box=$(".j-addmusic");
        var bookId=box.find(".j-id");
        var bookName=box.find(".j-name");
        var bookImg=box.find(".j-img");
        var bookTitle=box.find(".j-title");
        var bookAuthor=box.find(".j-author");
        var ajaxUrl = 'insertBook';
        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: {
                bookId:bookId.val(),
                bookImgUrl:bookImg.val(),
                bookTitle:bookTitle.val(),
                bookName:bookName.val(),
                bookAuthor:bookAuthor.val()
            }
        })
        .done(function(res) {
            if(res== 1){
                alert('添加成功！！');
                location.reload();
            }else{
            	alert('添加失败,请重新添加');
            }
        })
        .fail(function(res) {
            alert('网络错误');
        });
        event.preventDefault();
    });
    
    /*
    * 书籍上下架
    */
    $(".m-musiclist").on('click','.j-musichandle',function(){
        var bookId=$(this).attr("data-bookid");
        var bookStatus=$(this).attr("data-type"); 
        var that=$(this);
        var ajaxUrl="putOnOrOffBook";
        $.ajax({
            url:ajaxUrl,
            type:'POST',
            data:{
               bookId:bookId,
               bookStatus:bookStatus
            },
            success:function(res){
                if(res==0){
                    that.text("上架");
                    that.attr("data-type",0);
                }else if(res==1){
                    that.text("下架");
                    that.attr("data-type",1);
                }else{
                    alert("操作失败");
                }
            },
            error:function(){
                alert("网络错误");
            }

        })
    })
})
$(function(){

	/* 音乐数据 */
    var initMusicData = [
                            {
                                "albumId":34702163,
                                "albumImg":"http://p4.music.126.net/QBDTIDTqh8zh9U0UsZcvHQ==/1424967078450658.jpg?param=202y202",
                                "albumAuthor":"袁咏仪",
                                "albumTitle":"我爱我自己",
                                "status":1
                            },
                            {
                                "albumId":34678769,
                                "albumImg":"http://p3.music.126.net/SblDD95Bpv2-EdTcSIxSrw==/1395280264340029.jpg?param=202y202",
                                "albumAuthor":"G.E.M.邓紫棋",
                                "albumTitle":"画",
                                "status":1
                            },
                            {
                                "albumId":34700135,
                                "albumImg":"http://p3.music.126.net/QwQjcDiW9gjiEf2Oflm2vQ==/1389782707237423.jpg?param=202y202",
                                "albumAuthor":"小娟&山谷里的居民",
                                "albumTitle":"无画",
                                "status":1
                            },
                            {
                                "albumId":34701014,
                                "albumImg":"http://p3.music.126.net/bSbXRzDaV0RXl3HbV4iz7w==/3310629515524887.jpg?param=202y202",
                                "albumAuthor":"张希",
                                "albumTitle":"迷失的星斗",
                                "status":1
                            },
                            {
                                "albumId":34701137,
                                "albumImg":"http://p3.music.126.net/sglri2wVmJN0cK0jnJU4iQ==/1369991497870406.jpg?param=202y202",
                                "albumAuthor":"萧忆情 / 西瓜JUN",
                                "albumTitle":"绝代双萌",
                                "status":1
                            },
                            {
                                "albumId":34702035,
                                "albumImg":"http://p4.music.126.net/u9dYZ5r0v2bNFOyFTo_t9A==/1424967078156360.jpg?param=202y202",
                                "albumAuthor":"李治廷",
                                "albumTitle":"绅士作风",
                                "status":0
                            }
                        ];

    localStorage.musicData = JSON.stringify(initMusicData);





	/*导航切换*/
	var bookManage = $('.j-music');
	var manageSection = $('.content');
	bookManage.on('click', function(event) {
		bookManage.removeClass('z-sel');
		$(this).addClass('z-sel');
		manageSection.hide().eq($(this).parent().index()-2).show();
	});
	
	var hash = window.location.hash;
    console.log(hash)
    if(hash=='#add'){
        $("#j-music-list").removeClass("z-sel");
        $("#j-music-add").addClass("z-sel");
        manageSection.eq(0).hide();
        manageSection.eq(1).show();
    }else{
        $("#j-music-list").addClass("z-sel");
        $("#j-music-add").removeClass("z-sel");
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
    * 音乐管理列表
    */  
    initMusicList();
    function initMusicList(){
       var musicListBox=$(".m-musiclist");
       var musicData =$.parseJSON(localStorage["musicData"]);
       var html="";
       $.each(musicData,function(index,obj){
            var txt=obj.status==1? "下架" : "上架";
            html+=  '<tr class="m-book-unit">'+
                    '    <td class="m-book-ceil titlepage">'+
                    '        <img src="'+obj.albumImg+'" class="titlepage-img">'+
                    '    </td>'+
                    '    <td class="m-book-ceil bookname">'+obj.albumTitle+'</td>'+
                    '    <td class="m-book-ceil author">'+obj.albumAuthor+'</td>'+
                    '    <td class="m-book-ceil update"><a href="javascript:;" data-albumid="'+obj.albumId+'" data-albumimg="'+obj.albumImgUrl+'" data-albumauthor="'+obj.albumAuthor+'" data-albumtitle="'+obj.albumTitle+'" class="j-replace">替换</a></td>'+
                    '    <td class="m-book-ceil handle"><a href="javascript:;" data-type="'+obj.status+'" data-albumid="'+obj.albumId+'" class="j-musichandle">'+txt+'</a></td>'+
                    '</tr>';
        })
       musicListBox.html(html);
    }

    /*
    * 搜索专辑信息
    */
    var musicSearch=$(".j-search");
    musicSearch.on('click',function(){
        var box;
        if( $(this).hasClass('j-addsearch') ){
            box=$(".j-addmusic"); 
        }else{     
           box=$(".replace"); 
        }
        var ajaxUrl = 'albumlist.json';

        var albumId=box.find(".j-albumid");
        var albumImg=box.find(".j-albumimg");
        var albumTitle=box.find(".j-albumtitle");
        var albumAuthor=box.find(".j-albumauthor");
        $.ajax({
            type:"post",
            url:ajaxUrl,
            dataType:'json'
        })
        .done(function(res){
            var hasAlblumId=true;
            var obj=null;
            $.each(res,function(i,o){
                if( o.albumId==albumId.val() ){
                  obj=o;
                  hasAlblumId=true;
                  return false;
                }else{
                  hasAlblumId=false;
                }
            })  

            if(hasAlblumId){
                albumImg.attr('src',obj.albumImg);
                albumTitle.text(obj.albumTitle);
                albumAuthor.text(obj.albumAuthor);
            }else{
                alert('专辑ID不存在');
            }    

        })
        .fail(function() {
            alert('网络错误！！');
        });
    })
    /*
	* 替换专辑
	*/
	replaceMusic();
    function replaceMusic(){
        var replaceBtn = $('.replace-btn');
        var replaceBox=$(".replace");

        var albumId=replaceBox.find(".j-albumid");
        var albumImg=replaceBox.find(".j-albumimg");
        var albumTitle=replaceBox.find(".j-albumtitle");
        var albumAuthor=replaceBox.find(".j-albumauthor");
        var oldAlbumId;//要被替换的专辑
        $(".m-musiclist").on('click','.j-replace',function(event) {
	        $('.replace').show();
	        cover.show();
	        oldAlbumId=$(this).data("albumid");
            var dateAlbumId = $(this).attr('data-albumid');    
            var dateAlbumImg = $(this).attr('data-albumimg');
            var dateAlbumTitle = $(this).attr('data-albumtitle');  
            var dateAlbumAuthor = $(this).attr('data-albumauthor');    
            albumId.val(dateAlbumId);
            albumImg.attr('src',dateAlbumImg);
            albumTitle.text(dateAlbumTitle);
            albumAuthor.text(dateAlbumAuthor);
	        event.preventDefault();
	    });  
	    replaceBtn.on('click', function(event) {
	    	var ajaxUrl = 'replaceAlbum';
            if(!oldAlbumId){alert("专辑ID不存在");return false;}

	        $.ajax({
	            url: ajaxUrl,
	            type: 'POST',
	            data: {
                    oldAlbumId:oldAlbumId,
	                albumId:albumId.val(),
                    albumImgUrl:albumImg.attr('src'),
                    albumTitle:albumTitle.text(),
                    albumAuthor:albumAuthor.text()
	            },
	        })
	        .done(function(res) {
	            if(res == 1){
	                alert('替换成功');
	                location.reload();
	            }else if(res==2){
	                alert('专辑已存在');
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
    * 添加专辑
    */
    var addMusicBtn=$(".add-musicbtn");
    addMusicBtn.on('click', function(event) {
        var _musicId=$(this).parent().find('.u-input').val();
        if(!_musicId){
            alert('请先输入专辑ID');
            return false;
        }
        var box=$(".j-addmusic");
        var albumId=box.find(".j-albumid");
        var albumImg=box.find(".j-albumimg");
        var albumTitle=box.find(".j-albumtitle");
        var albumAuthor=box.find(".j-albumauthor");

        if(albumImg.attr('src')){
            $(this).removeClass("f-cgray").removeAttr("disabled");
        }else{
            alert('请先搜索出专辑');
            return false;
        }

        var ajaxUrl = 'insert';
        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: {
                albumId:albumId.val(),
                albumImgUrl:albumImg.attr('src'),
                albumTitle:albumTitle.text(),
                albumAuthor:albumAuthor.text()
            }
        })
        .done(function(res) {
            if(res== 1){
                alert('添加成功！！');
                location.reload();
            }else if(res == 2){
                alert('添加失败,专辑已添加');
            }else{
            	alert('添加失败,服务器异常');
            }
        })
        .fail(function(res) {
            alert('网络错误');
        });
        event.preventDefault();
    });
    
    /*
    * 音乐上下架
    */
    $(".m-musiclist").on('click','.j-musichandle',function(){
        var albumId=$(this).attr("data-albumid");
        var albumStatus=$(this).attr("data-type"); 
        var musicData =$.parseJSON(localStorage["musicData"]);
        var that = $(this);
        if(albumStatus==1){
            $.each(musicData,function(index,obj){
                if( obj.albumId==albumId ){
                    obj.status = 0;
                    that.text("上架");
                    that.attr("data-type",0);
                }
            })
            localStorage.musicData = JSON.stringify(musicData);
        }else{
           $.each(musicData,function(index,obj){
                if( obj.albumId==albumId ){
                    obj.status = 1;
                    that.text("下架");
                    that.attr("data-type",1);
                }
            })
            localStorage.musicData = JSON.stringify(musicData); 
        }
    })
})
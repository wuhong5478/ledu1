$(function(){
	var addBtn = $('.add-btn');
	var bookManage = $('.j-tap');
	var manageSection = $('.content');
    var bookHandle = $('.j-handle');
	bookManage.on('click', function(event) {
		
		bookManage.removeClass('z-sel');
		$(this).addClass('z-sel');
		manageSection.hide().eq($(this).parent().index()).show();
	});
    /*
    * 增加新书
    * params formdata
    *
    */
	addBtn.on('click', function(event) {
		var addForm = $('#j-add-form');
        var ajaxUrl = '/manager/book/add.json';
        var _uuid = $('#add-uuid').val();
        var _name = $('#add-name').val();
        var _author = $('#add-author').val();
        var _description = $('#add-description').val();
        var _coverImage = $('#add-img-url').val();
        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            dataType: 'json',
            data: {
                uuid: _uuid,
                name: _name,
                author: _author,
                description: _description,
                coverImage: _coverImage
            },
        })
        .done(function(res) {
            if(res.code == 0){
                alert('添加成功！！');
                location.reload();
            }else{
                alert('操作失败！！' + res.message);
            }
        })
        .fail(function() {
            alert('网络错误！！');
        });
		event.preventDefault();
	});
    /*
    * 上架下架操作 
    * params uuid,status
    **/
    bookHandle.on('click', function(event) {

        var that = $(this);
        var _type = that.attr('data-type') == 0 ? 0 : -1;
        var _message = that.attr('data-type') == 0 ? '上架成功!' : '下架成功!';
        var _url = '/manager/book/update_status.json';
        var uuid = that.attr('data-uuid');
        $.ajax({
            url: _url,
            type: 'POST',
            dataType: 'json',
            data: {
                uuid: uuid,
                status: _type
            },
        })
        .done(function(res) {
            if(res.code == 0){
                alert(_message);
                location.reload();
            }else{
                alert('操作失败！！' + res.message);
            }
            
        })
        .fail(function(err) {
            alert('网络错误！！');
        });
        
        event.preventDefault();
    });

    var cover = $('.update-cover');
    var updateForm = $('#j-update-form');
    var updateSection = $('.update-section');
    var updateHandle = $('.j-update');
    var updateBtn = $('.update-btn');
    cover.on('click', function(event) {
        updateSection.hide();
        $(this).hide();
        event.preventDefault();
    });
    var _uuid = $('#update-uuid');
    var _name = $('#update-name');
    var _author = $('#update-author');
    var _description = $('#update-description');
    var _url = $('#update-img-url');
    var ajaxUrl = '/manager/book/update.json';
    updateHandle.on('click', function(event) {
        var that = $(this);
        updateSection.show();
        cover.show();
        _uuid.val(that.attr('data-uuid'));
        _name.val(that.attr('data-bookname'));
        _author.val(that.attr('data-author'));
        _description.val(that.attr('data-description'));
        _url.val(that.attr('data-url'));
        event.preventDefault();
    });
    updateBtn.on('click', function(event) {
        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            dataType: 'json',
            data: {
                uuid: _uuid.val(),
                name: _name.val(),
                author: _author.val(),
                description: _description.val(),
                coverImage: _url.val()
            },
        })
        .done(function(res) {
            if(res.code == 0){
                alert('更新成功');
                location.reload();
            }else{
                alert('操作失败！！' + res.message);
            }
        })
        .fail(function() {
            alert('网络错误！！');
        })
        
        event.preventDefault();
    });

})
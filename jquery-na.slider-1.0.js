/**
 * @name 滚动条（简洁版）
 * @version version 1.1
 * @author Na Chao
 * @fileoverview
 * 
 */
function nSlider ( value ) {
    value = value || {};

    this.param_ = {};
    
    // 全部元素参数
    this.param_.are = value.are || null;
    this.param_.con = value.con || null;
    this.param_.bar = value.bar || null;
    this.param_.btn = value.btn || null;

    // 其他参数
    this.param_.num = 0.5;  // 每次滚动距离为内容显示范围的指定比例
    this.param_.actClass = value.actClass;  // 激活时的样式

    // 如果参数完整
    if ( this.param_.are && this.param_.con && this.param_.bar && this.param_.btn ) {
        this._init();
    }
}


/**
*  初始化
*
*  @private
*/
nSlider.prototype._init = function () {
    this.param_.con.css({ top: 0 });
    if( this.param_.con.height() > this.param_.are.height() ){
        this.param_.bar.show();
        this.param_.btn.show();
        this._bindDragEvent();
        this._bindRollEvent();
    } else {
        this.param_.bar.hide();
        this.param_.btn.hide();
        this._unbindDragEvent();
        this._unbindRollEvent();
    }
}


/**
*  拖动事件
*
*  @private
*/
nSlider.prototype._bindDragEvent = function () {
    var top = 0,
        last = false,
        that = this;

    var btn = this.param_.btn.mousedown(function(event){
        event.preventDefault();
        top = parseInt(that.param_.btn.css('top')) || 0;
        last = event.clientY;

        if ( that.param_.actClass )
            btn.addClass(that.param_.actClass);
    });
    $(document).mousemove(function(event){
        var number = 0;
        if( last ){
            number = that._getLimit(top + (event.clientY - last));
            that.param_.btn.css('top', Number(number) / that.param_.bar.height() * 100 + '%');
            that.param_.con.css('top', -number * that._getScale());
        }
    });
    $(document).mouseup(function(){ 
        last = false;

        if ( that.param_.actClass )
            btn.removeClass(that.param_.actClass);
    });
}


/**
*  解除拖动事件
*
*  @private
*/
nSlider.prototype._unbindDragEvent = function () {
    $(document).unbind('mousemove,mouseup');
}


/**
*  绑定滚动事件
*
*  @private
*/
nSlider.prototype._bindRollEvent = function (v) {
    var that = this;
    this.param_.are.bind('mousewheel', function(event){
        event.preventDefault();
        that._countMove( -event.originalEvent.wheelDelta/120 );
    });
    this.param_.are.bind('DOMMouseScroll', function(event){
        event.preventDefault();
        that._countMove( event.originalEvent.detail/3 );
    });
}


/**
*  解绑绑定滚动事件
*
*  @private
*/
nSlider.prototype._unbindRollEvent = function (v) {
    this.param_.are.unbind('mousewheel');
    this.param_.are.unbind('DOMMouseScroll');
}


/**
*  计算值
*
*  @private
*/
nSlider.prototype._countMove = function ( value ) {
    var top = parseInt(this.param_.btn.css('top')) || 0,
        num = value * (this.param_.are.height() * this.param_.num / this._getScale());
    value = this._getLimit(num + top);
    this._moveEl(value);
}


/**
*  修改样式
*
*  @private
*/
nSlider.prototype._moveEl = function ( value ) {
    this.param_.btn.stop().animate(eval('({ top:'+ value +'})'));
    this.param_.con.stop().animate(eval('({ top:'+ -value * this._getScale() +'})'));
}


/**
*  取值
*
*  @private
*/
nSlider.prototype._getLimit = function ( value ) {
    var max = this.param_.bar.height() - this.param_.btn.height();
    if ( value < 0 ) {
        value = 0;
    } else if ( value > max ) {
        value = max;
    }
    return value;
}


/**
*  获取比例
*
*  @private
*/
nSlider.prototype._getScale = function ( value ) {
    return (this.param_.con.height() - this.param_.are.height()) / (this.param_.bar.height() - this.param_.btn.height());
}


/**
*  修改参数
*
*  @param {object} value
*  @public
*/
nSlider.prototype.set = function ( value ) {
    if ( $.isPlainObject(value) ) {
        for ( key in value ) {
            this.param_[key] = value[key];
        }
    }
    return this;
}


/**
*  设置滚动条位置
*
*  @param {number} value = 0 - 100 以百分比的方式显示
*  @public
*/
nSlider.prototype.top = function ( value ) {
    if ( $.isNumeric(value) ) {
        if ( value < 0 )
            value = 0;
        if ( value > 100 )
            value = 100;
        
        value = (this.param_.bar.height() - this.param_.btn.height()) * (value / 100);
        this._moveEl(value);
    }
    return this;
}


/**
*  公共方法说明
*
*  @private
*/
nSlider.prototype.readme = function ( value ) {
    return {
        set: '设置参数，以对象的传参方式修改功能。（返回功能自身，可链式调用）',
        top: '设置滚动条的位置，0 - 100 以百分比的方式显示。（返回功能自身，可链式调用）'
    };
}


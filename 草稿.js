function statistics(){
    var _statistics = 0;
    $('#consume_info').html('<dt></dt>');
    $('#integral_money').text(0);
    $('#pack_money').text(0);
    $('.item h3 .add-more').text('');
    //取推荐助力包
    var _personalRecommend = $("#personalRecommend");
    var _service_str = _personalRecommend.attr("services");
    var _services = getRecommendService(_service_str);
    if( _personalRecommend.hasClass("choose")) {
        var _input_sell_price = _personalRecommend.find("input[name='personalRecommend_sell_price']");
        _statistics += Number(_input_sell_price.val());
        var _name = _personalRecommend.attr('name');
        var _html = '<dd><div class="hd fl">';
        if (_name.length > 0) {
            _html += _name + ':';
        }
        _html += '</div><div class="bd fl"><b>' + Number(_input_sell_price.val()) + '</b>'+currencyUnit+'</div></dd>';
        $('#consume_info').append(_html);
    }
    var _saveTotalPrice = 0;
    var _saveTotalCount = 0;
    //取所有附加系统
    $(".item .new-middleon-xt").each(function(){
        var _this = $(this);
        var _id = _this.attr('data-id');
        var _saveUnit = Number(_this.attr('data-save-unit'));
        var _saveUnitPrice = Number(_this.attr('data-save-unit-price'));
        var _saveUnitType = Number(_this.attr('data-save-unit-type'));
        var _lastWordCount = Number($("#lastWordCount").val());
        if(_saveUnitType==1){
            _saveTotalPrice+=Number(_saveUnitPrice);
        }else{
            _saveTotalPrice+=Math.ceil((_lastWordCount / _saveUnit)) * _saveUnitPrice;
        }
        _saveTotalCount+=1;
        var _input = _this.find("input[name='unit_" + _id + "_m']");
        if(_input.length > 0){
            _statistics += Number(_input.val());
            var _name = _this.find('.middle-p p:eq(0) span:eq(0)');
            var _html = '<dd><div class="hd fl">';
            if(_name.length > 0){
                _html += _name.text() + ':';
            }
            _html += '</div><div class="bd fl"><b>' + Number(_input.val()) + '</b>'+currencyUnit+'</div></dd>';
            $('#consume_info').append(_html);
        }
    });
    _saveTotalPrice =  Math.ceil(_saveTotalPrice*10)/10;
    $("#editionKindCount").text(_saveTotalCount);
    $("#editionKindSaveMoney").text(_saveTotalPrice+"元")

    //一元体验
    if($('#use_preferential').length > 0 && $('#use_preferential').hasClass('new-middleon')){
        isPreferential = true;
    }else{
        isPreferential = false;
    }
    //一元体验选中/取消 修改免费查重券是否显示
    var _mfq = $(".item .integral[btype='1']");
    var _edition = $(".address").data("edition");
    if(isPreferential){
        if(_mfq.length > 0){
            _mfq.removeClass('add-meal').hide();
        }
    }else{
        if(_mfq.length > 0 || _edition === "-1"){
            _mfq.addClass('add-meal').show();
        }
    }

    //取所有增值服务
    $('.item .new-middleon').each(function(){
        var isPreferentialFlag = false;
        if($('#usePreferential').length > 0 && $('#usePreferential').hasClass('new-middleon')){
            isPreferentialFlag = true;
        }else{
            isPreferentialFlag = false;
        }
        var _this = $(this);
        var _id = _this.attr('id');
        var _input = _this.find("input[name='" + _id + "_m']");
        if(_id==="useSpeed"){
            if(_personalRecommend.hasClass("choose") && contains(_services,_id)){
            }else{
                if(!isPreferentialFlag){
                    if(_input.length > 0){
                        _statistics += Number(_input.val());
                        var _name = _this.find('.middle-p p:eq(0)');
                        var _html = '<dd><div class="hd fl">';
                        if(_name.length > 0){
                            _html += _name.text() + ':';
                        }
                        _html += '</div><div class="bd fl"><b>' + Number(_input.val()) + '</b>'+currencyUnit+'</div></dd>';
                        $('#consume_info').append(_html);
                    }
                }
            }
        }else{
            if(_personalRecommend.hasClass("choose") && contains(_services,_id)){
            }else{
                if(_input.length > 0){
                    _statistics += Number(_input.val());
                    var _name = _this.find('.middle-p p:eq(0)');
                    var _html = '<dd><div class="hd fl">';
                    if(_name.length > 0){
                        _html += _name.text() + ':';
                    }
                    _html += '</div><div class="bd fl"><b>' + Number(_input.val()) + '</b>'+currencyUnit+'</div></dd>';
                    $('#consume_info').append(_html);
                }
            }
        }

    });
    //降重处理
    var pack_money = 0;
    var integral_money = 0;
    //查重券使用
    var _icheck_l = $(".item .add-meal[btype="+ $(".address").data("coupon") +"]");
    var _integral = $(".item .integral[type='integral']");
    if(_icheck_l.length > 0 || $("#personalRecommend").hasClass("choose")){
        isCheck = true; //有使用查重卡券
        $(".integral-no-show").hide();
        if(_integral.length > 0){
            _integral.removeClass('add-meal').hide();

        }
    }else{
        isCheck = false;
        $(".integral-no-show").show();
        if(_integral.length > 0){
            _integral.show();
        }
    }

    $(".item .coupons[btype!='"+$(".address").data("coupon")+"']").hide();
    var _reduce_l = $(".item .new-middleon");
    _reduce_l.each(function(){
		var ctype= $(".item .integral[btype='"+$(this).attr('type')+"']").find('.c_'+$(this).attr('type')).val();
		var fAmout=$(".item .integral[btype='"+$(this).attr('type')+"']").find('.f_'+$(this).attr('type')).val();
		var price=$(this).data('price');
        $(".item .integral[btype='"+$(this).attr('type')+"']").addClass('show').show();
		if(ctype==1){
			$(".item .integral[btype='"+$(this).attr('type')+"']").find('.m_'+$(this).attr('type')).val(price);
		}else if(ctype==0){
			if(fAmout>price){
				$(".item .integral[btype='"+$(this).attr('type')+"']").find('.m_'+$(this).attr('type')).val(price);
			}else{
				 $(".item .integral[btype='"+$(this).attr('type')+"']").find('.m_'+$(this).attr('type')).val(fAmout);
			}
		}
    });

    //取所有套餐
    $('.item .add-meal').each(function(){
        var _this = $(this);
        var _type = _this.attr('type');
        if(_type == 'integral'){//积分抵扣
            var _input = _this.find("input[name='integral_m']");
            if(_input.length > 0 && !isCheck){
                integral_money = Number(_input.val());
                $('#integral_money').text(Number(_input.val()));
            }
        }else{
            var _id = _this.attr('id');
            var _input = _this.find("input[name='" + _id + "_m']");
            if(_input.length > 0) {
                pack_money += Number(_input.val());
                var _name = _this.find('.change-cp');
                var _html = '<dd><div class="hd fl">';
                if(_name.length > 0){
                    _html += _name.text() + ':';
                }
                _html += '</div><div class="bd fl"><b>-' + Number(_input.val()) + '</b>'+currencyUnit+'</div></dd>';
                $('#consume_info').append(_html);
            }
        }
    });
    pack_money = Math.ceil(pack_money * 10)/10;
    integral_money = Math.ceil(integral_money * 10)/10
    $('#pack_money').text(pack_money);
    if(pack_money > 0){
        $('.item h3 .add-more').text('卡券共抵扣' + pack_money + currencyUnit);
        $("#integral_span").hide();
        $("#integral_a").hide();
        $("#integral_p").hide();
    }else{
        $("#personalRecommend").hasClass("choose") || $("#integral_span").show();
        $("#integral_a").show();
        $("#integral_p").show();
    }
    setMoney(_statistics, pack_money, integral_money);
}

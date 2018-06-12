/**
 * Epage v1.3
 * MIT licensed. By Mr.Hung <mr.hung91@gmail.com>
 * A part of Eway .JSC.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['EpageX'], function (EpageX) {
            return (root.Epage = factory(EpageX));
        });
    } else {
        root.Epage = factory(root.EpageX);
    }
}(this, function (EpageX) {
    var _opt = {
        lang: 'vi',
        hint_name: 'Phạm Văn A',
        hint_phone: '0912345678',
        offer_id : '',
        name_phone:'phone',
        name_name: 'name',
        submit_class: 'js_submit',
        error_class: 'js_errorMessage',
        validate: true,
        popup: true,
        set_input_js: true,
        pre: true,
        popup_time: 30000,
        popup_wrap: '.cookie-popup-wrap',
        pre_url: "http://cpa-tracking.mclick.mobi/v1/phone_tracking.json",
        debug: false
        //proof: false
    };
    var phone_config = {
        locale: {
            vi:{
                cod: '',
                numbers_min: 9,
                numbers_max: 12,
                primer: ''
            }
        }
    }; 
    var defaults = {
        locale: {
            en: {
                set_fio: "Name is a required field",
                error_fio: "Name field is entered incorrectly",
                set_phone: "Phone number is a required field",
                error_phone: "The phone number is entered incorrectly",
                exit_text: "You really want to close tab?"
            },
            vi: {
                set_fio: "Bạn chưa điền họ tên",
                error_fio: "Tên không hợp lệ",
                set_phone: "Bạn chưa điền số điện thoại",
                error_phone: "Số điện thoại không hợp lệ",
                exit_text: "Bạn có chắc muốn rời đi không? Chỉ còn còn một bước đặt hàng nữa thôi!"
            }
        }
    };
    function getParam(name) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(window.location.href);
        if (!results) return '';
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    
    function setInput($name, $value){
        $('input[name='+$name+']').val($value);
    }
    function setOpt(name, value) {
        _opt[name] = value;
    }
    function setOpts(opts) {
        for (var o in opts) {
            setOpt(o, opts[o]);
        }
    }
    //set adf_source click_id
    function setInputsJs(){
        if(_opt.set_input_js){
            setInput('click_id',getParam('click_id'));
            setInput('adf_source',getParam('adf_source'));
            setInput('address',document.referrer);
        }
    }

    //function gtPrJ() {return JSON.parse('{"' + decodeURI(window.location.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')};    

    //show hide popup
    function valPopup() {
        if(_opt.popup){
            setTimeout(function () {
                $(_opt.popup_wrap).fadeIn(600);
            }, _opt.popup_time);

            $('#closepopup').click(function (e) {
                e.preventDefault();
                $(_opt.popup_wrap).fadeOut(200);
            });

            $('html').click(function (e) {
                var a = e.target;
                if ($(a).parents(_opt.popup_wrap).length === 0) {
                    $(_opt.popup_wrap).fadeOut(600);
                }
            });    
        }
    }
    function valPhone() {
        $('input[name='+_opt.name_phone+']').attr('type','tel');
        $('input[name='+_opt.name_phone+']').on('keydown', function(event) {
            if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 187 ||
                (event.keyCode == 65 && event.ctrlKey === true) ||
                (event.keyCode >= 35 && event.keyCode <= 39)) {return;}
            else {
                if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {event.preventDefault();}
            }
        });
        $('input[name='+_opt.name_phone+']').on('touchend, click', function () {
            if (_opt.hint_phone != '') {
                show_form_hint(this, _opt.hint_phone);
                return false;
            }
        });
    }
    function valName() {
        $('input[name='+_opt.name_name+']').on('touchend, click', function () {
            if (_opt.hint_name != '') {
                show_form_hint(this, _opt.hint_name);
                return false;
            }
        });
    }
    function checkForm(target) {
        $('.'+_opt.error_class).remove();

        var form = $(target).parents('form').first();
        var formInputs = {
            fio: form.find('[name="'+_opt.name_name+'"]'),
            phone: form.find('[name="'+_opt.name_phone+'"]')
        };
        var postParams = {
            name: (formInputs.fio.val()).trim(),
            phone: (formInputs.phone.val()).trim()
        };

        var rename = /^[\D+ ]*$/i,
            rephone = /^[0-9\-\+\(\) ]*$/i;
      
        if(!postParams.phone || !postParams.phone.length){
            show_form_hint(formInputs.phone, defaults.locale[_opt.lang].set_phone);
            return false;
        }

        if(!postParams.name.length){
            show_form_hint(formInputs.fio, defaults.locale[_opt.lang].set_fio);
            return false;
        }

        if(!postParams.name.length || !rename.test(postParams.name)){
            show_form_hint(formInputs.fio, defaults.locale[_opt.lang].error_fio);
            return false;
        }

        if(phone_config.locale[_opt.lang] !== undefined) {
            if(phone_config.locale[_opt.lang].numbers_min && postParams.phone.length < phone_config.locale[_opt.lang].numbers_min){
                show_form_hint(formInputs.phone, defaults.locale[_opt.lang].error_phone);
                return false;
            }

            if(phone_config.locale[_opt.lang].numbers_max && postParams.phone.length > phone_config.locale[_opt.lang].numbers_max){
                show_form_hint(formInputs.phone, defaults.locale[_opt.lang].error_phone);
                return false;
            }
        } else {
            if(!rephone.test(postParams.phone) || postParams.phone.length < 8){
                show_form_hint(formInputs.phone, defaults.locale[_opt.lang].error_phone);
                return false;
            }
        }
        $('.'+_opt.submit_class).attr('disabled', 'disabled');
        form.submit();  
    } 
    function show_form_hint(elem, msg) {
      if (typeof dataLayer !== 'undefined') {
        var name = $(elem).attr('name');
        dataLayer.push({ 'event': 'form-submit-' + name + '-error'});
      }
      
      $('.'+_opt.error_class).remove();
      $('<div class="'+_opt.error_class+'">' + msg + '</div>').appendTo('body').css({
        'left': $(elem).offset().left,
        'top': $(elem).offset().top - 30,
        'background-color':'#e74c3c',
        'border': '1px dashed black',
        'border-radius': '5px',
        'color': '#fff',
        'font-family': 'Arial',
        'font-size': '14px',
        'margin': '3px 0 0 0px',
        'padding': '6px 5px 5px',
        'position': 'absolute',
        'z-index': '9999'
      });
      $(elem).focus();
    };

    //pre
    var sentPhoneList = {};
    var name = '', phone = '';
    function isPhoneNumber(phoneNumber) {
        var phoneStartwithMap = {
            9: '9',
            10: '1',
            11: '849',
            12: '841'
        }
        return phoneNumber.startsWith(phoneStartwithMap[phoneNumber.length]);
    }
    function createPhone(phone_value) {
        var click_id = getParam('click_id');
        var data = {
            source_domain: window.location.hostname,
            customer_phone: phone_value,
            click_id: click_id,
            offer_id: _opt.offer_id
        }
        if (!click_id) {
            data.pixel_tracking = 1;
        }
        if(getParam('backFromPre')) {
            data.back_from_pre = 1;
        }
        $.ajax({
            contentType: "application/json",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            url: _opt.pre_url,
            method: 'GET',
            data: data,
            async: false,
            success: function(res) {
                sentPhoneList[phone] = res.data._id;
                if(name) {
                    updateName(name, phone);
                }
            }
        });
    }
    function updateName(name, phone) {
        $.ajax({
            contentType: "application/json",
            url: _opt.pre_url + '?id=' + sentPhoneList[phone],
            method: 'PUT',
            data: JSON.stringify({
                name: name
            })
        });
    }
    function updateSubmit(phone) {
        $.ajax({
            contentType: "application/json",
            url: _opt.pre_url + '?id=' + sentPhoneList[phone],
            method: 'PUT',
            data: JSON.stringify({
                submitted: 1
            })
        });
    }
    function valPre(){
        if(_opt.pre){
            if(_opt.offer_id == '' || _opt.offer_id == null){
                console.error('offer_id empty! Can\'t use pre-list!');
                return false;
            }

            $('input[name="'+_opt.name_phone+'"]').keyup(function () {
                var phoneValue = parseInt($(this).val()).toString(); // Bỏ số 0 ở đầu
                if (isPhoneNumber(phoneValue) && !sentPhoneList[phoneValue]) {
                    phone = phoneValue;
                    createPhone($(this).val());
                }
            });
            $('input[name="'+_opt.name_name+'"]').change(function () {
                name = $(this).val();
                if(phone) {
                    updateName(name, phone);
                }
            })
            $('.'+_opt.submit_class).click(function () {
                if(phone) {
                    updateSubmit(phone);
                }
            })    
        }
    }
    //pre-end
    
    function valWidget(){
        $a = getParam('widget');
        $a = $a.split(",");
        $.each( $a, function( key, value ) {
            //console.log(value);
            if($.trim(value) == 'proof'){
                var currentNumber = Math.floor(Math.random() * (72 - 20 + 1)) + 20;
                var places = ['Hà Nội', 'Nghệ An', 'Hồ Chí Minh', 'Vũng Tàu', 'Nha Trang', 'Cà Mau', 'Hà Giang', 'Hải Phòng', 'Quảng Ninh', 'Thanh Hóa', 'Ninh Bình'];
                var proofWrapper = $('<div id="scpf" style="transition:all 2s ease 0s;position:fixed;z-index:99999;border-radius:30px;bottom:5px;left:20px;width:300px;height:65px;background-color:white"></div>');
                var proofLeft = $('<div style="position:absolute;float:left;width:65px;height:65px;"></div>');
                var proofRight = $('<div style="position:relative;float:left;margin-left:75px;margin-top:15px;width:200px;"></div>');

                function proof() {
                    var halogen = $('<img style="width:100%" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif"></img>')
                    var text = $('<p id="proofcontent" style="color:#000;">Có <span id="people" style="color:#F44336;background-color:#FFEBEE;padding:1px 5px;">' + currentNumber +' khách truy cập</span> đang xem trang.</p>')
                    $(proofLeft).append(halogen);
                    $(proofRight).append(text);
                    $(proofWrapper).append(proofLeft);
                    $(proofWrapper).append(proofRight);

                    $('body').append(proofWrapper);

                    function loopThis() {
                        var delay = Math.floor(Math.random() * (20000 - 15000 + 1)) + 15000;
                        
                        setTimeout(function() {
                            var place = places[Math.floor(Math.random()*places.length)];
                            $('#proofcontent').html('Một khách hàng từ <span style="color:#F44336;background-color:#FFEBEE;padding:1px 5px;">' + place + '</span> vừa đặt hàng thành công!');
                            $('#scpf').css("bottom", "5px");
                            
                            setTimeout(function() {
                                $(proofRight).fadeOut("slow", function() {
                                    currentNumber = currentNumber + (Math.floor(Math.random() * (5 - 1 + 1)) + 1) * (Math.random() > 0.3 ? 1 : -1); 

                                    $('#proofcontent').html('<p id="proofcontent" style="color:#000;"><span id="people" style="color:#F44336;background-color:#FFEBEE">' + currentNumber +' người</span> đang xem trang</p>')
                        
                                    $(proofRight).fadeIn("slow", function() {
                                        setTimeout(function() {
                                            $('#scpf').css('bottom', '-80px');
                                        }, 3000);
                                        loopThis();
                                    });
                                });   
                            }, 4000);

                        }, delay);
                     
                    }

                    setTimeout(function() {
                        $('#scpf').css("bottom", "-80px");
                        loopThis();
                    }, 3000);
                }

                proof();
            }

            if($.trim(value) == 'popup'){
                setTimeout(function () {
                    $(_opt.popup_wrap).fadeIn(600);
                }, _opt.popup_time);

                $('#closepopup').click(function (e) {
                    e.preventDefault();
                    $(_opt.popup_wrap).fadeOut(200);
                });

                $('html').click(function (e) {
                    var a = e.target;
                    if ($(a).parents(_opt.popup_wrap).length === 0) {
                        $(_opt.popup_wrap).fadeOut(600);
                    }
                });    
            }
        });

    }
    function valProof() {

        if (getParam('proof') == 1) {
            var currentNumber = Math.floor(Math.random() * (72 - 20 + 1)) + 20;
            var places = ['Hà Nội', 'Nghệ An', 'Hồ Chí Minh', 'Vũng Tàu', 'Nha Trang', 'Cà Mau', 'Hà Giang', 'Hải Phòng', 'Quảng Ninh', 'Thanh Hóa', 'Ninh Bình'];
            var proofWrapper = $('<div id="scpf" style="transition:all 2s ease 0s;position:fixed;z-index:99999;border-radius:30px;bottom:5px;left:20px;width:300px;height:65px;background-color:white"></div>');
            var proofLeft = $('<div style="position:absolute;float:left;width:65px;height:65px;"></div>');
            var proofRight = $('<div style="position:relative;float:left;margin-left:75px;margin-top:15px;width:200px;"></div>');

            function proof() {
                var halogen = $('<img style="width:100%" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif"></img>')
                var text = $('<p id="proofcontent" style="color:#000;">Có <span id="people" style="color:#F44336;background-color:#FFEBEE;padding:1px 5px;">' + currentNumber +' khách truy cập</span> đang xem trang.</p>')
                $(proofLeft).append(halogen);
                $(proofRight).append(text);
                $(proofWrapper).append(proofLeft);
                $(proofWrapper).append(proofRight);

                $('body').append(proofWrapper);

                function loopThis() {
                    var delay = Math.floor(Math.random() * (20000 - 15000 + 1)) + 15000;
                    
                    setTimeout(function() {
                        var place = places[Math.floor(Math.random()*places.length)];
                        $('#proofcontent').html('Một khách hàng từ <span style="color:#F44336;background-color:#FFEBEE;padding:1px 5px;">' + place + '</span> vừa đặt hàng thành công!');
                        $('#scpf').css("bottom", "5px");
                        
                        setTimeout(function() {
                            $(proofRight).fadeOut("slow", function() {
                                currentNumber = currentNumber + (Math.floor(Math.random() * (5 - 1 + 1)) + 1) * (Math.random() > 0.3 ? 1 : -1); 

                                $('#proofcontent').html('<p id="proofcontent" style="color:#000;"><span id="people" style="color:#F44336;background-color:#FFEBEE">' + currentNumber +' người</span> đang xem trang</p>')
                    
                                $(proofRight).fadeIn("slow", function() {
                                    setTimeout(function() {
                                        $('#scpf').css('bottom', '-80px');
                                    }, 3000);
                                    loopThis();
                                });
                            });   
                        }, 4000);

                    }, delay);
                 
                }

                setTimeout(function() {
                    $('#scpf').css("bottom", "-80px");
                    loopThis();
                }, 3000);
            }

            proof();
        }

    }

    function _init(opts) {
        setOpts(opts);
        valPre();
        setInputsJs();
        //valProof();
        valWidget()
        if(_opt.validate){
            valPhone();
            valName();
            valPopup();

            $("body").on('touchend, click', function(){
                $('.'+_opt.error_class).remove();
            });

            $('.'+_opt.submit_class).click(function(e){
                //e.preventDefault();
                checkForm(this);
                return false;
            });
        }

    }

    return {
        init: _init
    };
}));
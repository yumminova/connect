winkstart.module('connect', 'numbers', {
        css: [
            'css/numbers.css'
        ],

        templates: {
            numbers: 'tmpl/numbers.html',
            number: 'tmpl/number.html',
            endpoint_number: 'tmpl/endpoint_number.html',
            //port_dialog: 'tmpl/port_dialog.html',
            port_dialog: 'tmpl/port_popup.html',
            failover_dialog: 'tmpl/failover_dialog.html',
            cnam_dialog: 'tmpl/cnam_dialog.html',
            e911_dialog: 'tmpl/e911_dialog.html',
            basic_add_number_dialog: 'tmpl/basic_add_number_dialog.html',
            add_number_dialog: 'tmpl/add_number_dialog.html',
            add_number_search_results: 'tmpl/add_number_search_results.html'
        },

        subscribe: {
            'numbers.render': 'render_numbers',
            'numbers.render_endpoint_numbers': 'render_endpoint_numbers',
            'numbers.render_endpoint_number_dropzone': 'render_endpoint_number_dropzone',
        },

        resources: {
            'number.search': {
                url: '{api_url}/phone_numbers?prefix={prefix}&quantity={quantity}',
                contentType: 'application/json',
                verb: 'GET'
            },

            'number.create': {
                url: '{api_url}/accounts/{account_id}/phone_numbers/{phone_number}',
                contentType: 'application/json',
                verb: 'PUT'
            },

            'number.port': {
                url: '{api_url}/accounts/{account_id}/phone_numbers/{phone_number}/port',
                contentType: 'application/json',
                verb: 'PUT'
            },

            /*'number.reserve': {
                url: '{api_url}/accounts/{account_id}/phone_numbers/{phone_number}/reserve',
                contentType: 'application/json',
                verb: 'PUT'
            },*/

            'number.activate': {
                url: '{api_url}/accounts/{account_id}/phone_numbers/{phone_number}/activate',
                contentType: 'application/json',
                verb: 'PUT'
            },

            'number.update': {
                url: '{api_url}/accounts/{account_id}/phone_numbers/{phone_number}',
                contentType: 'application/json',
                verb: 'POST'
            },

            'number.get': {
                url: '{api_url}/accounts/{account_id}/phone_numbers/{phone_number}',
                contentType: 'application/json',
                verb: 'GET'
            },

            'number.delete': {
                url: '{api_url}/accounts/{account_id}/phone_numbers/{phone_number}',
                contentType: 'application/json',
                verb: 'DELETE'
            },

            'number.list': {
                url: '{api_url}/accounts/{account_id}/phone_numbers',
                contentType: 'application/json',
                verb: 'GET'
            },

            'number_doc.create': {
                url: '{api_url}/accounts/{account_id}/phone_numbers/{phone_number}/docs/{file_name}',
                contentType: 'application/x-base64',
                verb: 'PUT'
            },

            'number_doc.get': {
                url: '{api_url}/accounts/{account_id}/phone_numbers/{phone_number}/docs/{file_name}',
                contentType: 'application/json',
                verb: 'GET'
            },

            'number_doc.update': {
                url: '{api_url}/accounts/{account_id}/phone_numbers/{phone_number}/doc/{file_name}',
                contentType: 'application/x-base64',
                verb: 'POST'
            },

            'number_doc.list': {
                url: '{api_url}/accounts/{account_id}/phone_numbers/{phone_number}/doc/',
                contentType: 'application/json',
                verb: 'GET'
            }

        }
    },

    function() {
        var THIS = this;

        winkstart.registerResources(THIS.__whapp, THIS.config.resources);
    },

    {
        update_trunkstore: function(data, success, error) {
            var THIS = this;

            winkstart.request(true, 'trunkstore.update', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].api_url,
                    connectivity_id: winkstart.apps['connect'].connectivity_id,
                    data: data
                },
                function(_data, status) {
                    if(typeof success == 'function') {
                        success(_data, status);
                    }
                },
                function(_data, status) {
                    if(typeof error == 'function') {
                        error(_data, status);
                    }
                }
            );
        },

        move_number: function(number_data, endpoint_data, data, success, error) {
            var THIS = this,
                phone_number = number_data.phone_number,
                src_did_list = ('serverid' in number_data) ? data.servers[number_data.serverid].DIDs : data.DIDs_Unassigned,
                dest_did_list = (endpoint_data && !$.isEmptyObject(endpoint_data)) ? endpoint_data.DIDs : data.DIDs_Unassigned;

            dest_did_list[phone_number] = src_did_list[phone_number];
            delete src_did_list[phone_number];

            THIS.update_trunkstore(data, success, error);
        },

        delete_number: function(data, success, error) {
            var THIS = this;

            winkstart.request(true, 'number.delete', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].api_url,
                    phone_number: encodeURIComponent(data.phone_number)
                },
                function(data, status) {
                    if(typeof success == 'function') {
                        success(data, status);
                    }
                },
                function(data, status) {
                    if(typeof error == 'function') {
                        error(data, status);
                    }
                }
            );
        },

        search_numbers: function(data, success, error) {
            var THIS = this;

            winkstart.request(true, 'number.search', {
                    api_url: winkstart.apps['connect'].api_url,
                    prefix: data.prefix,
                    quantity: data.quantity || 15
                },
                function(_data, status) {
                    if(typeof success == 'function') {
                        success(_data, status);
                    }
                },
                function(_data, status) {
                    if(typeof error == 'function') {
                        error(_data, status);
                    }
                }
            );
        },

        get_number: function(data, success, error) {
            var THIS = this;

            winkstart.request(true, 'number.get', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].api_url,
                    phone_number: encodeURIComponent(data.phone_number)
                },
                function(_data, status) {
                    if(typeof success == 'function') {
                        success(_data, status);
                    }
                },
                function(_data, status) {
                    if(typeof success == 'function') {
                        error(_data, status);
                    }
                }
            );
        },

        update_number: function(data, success, error) {
            var THIS = this;

            winkstart.request('number.update', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].api_url,
                    phone_number: encodeURIComponent(data.phone_number),
                    data: data.options || {}
                },
                function(_data, status) {
                    if(typeof success == 'function') {
                        success(_data, status);
                    }
                },
                function(_data, status) {
                    if(typeof error == 'function') {
                        error(_data, status);
                    }
                }
            );
        },

        port_number: function(data, success, error) {
            var THIS = this;

            winkstart.request('number.port', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].api_url,
                    phone_number: encodeURIComponent(data.phone_number),
                    data: data.options || {}
                },
                function(_data, status) {
                    if(typeof success == 'function') {
                        success(_data, status);
                    }
                },
                function(_data, status) {
                    if(typeof error == 'function') {
                        error(_data, status);
                    }
                }
            );
        },

        create_number: function(data, success, error) {
            var THIS = this;

            winkstart.request('number.create', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].api_url,
                    phone_number: encodeURIComponent(data.phone_number),
                    data: data.options || {}
                },
                function(_data, status) {
                    if(typeof success == 'function') {
                        success(_data, status);
                    }
                },
                function(_data, status) {
                    if(typeof error == 'function') {
                        error(_data, status);
                    }
                }
            );
        },

        activate_number: function(data, success, error) {
            var THIS = this;

            winkstart.request(false, 'number.activate', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].api_url,
                    phone_number: encodeURIComponent(data.phone_number),
                    data: data.options || {}
                },
                function(_data, status) {
                    if(typeof success == 'function') {
                        success(_data, status);
                    }
                },
                function(_data, status) {
                    if(typeof error == 'function') {
                        error(_data, status);
                    }
                }
            );
        },

        create_number_doc: function(data, success, error) {
            var THIS = this;

            winkstart.request('number_doc.create', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].api_url,
                    phone_number: encodeURIComponent(data.phone_number),
                    file_name: data.file_name,
                    data: data.file_data
                },
                function(_data, status) {
                    if(typeof success == 'function') {
                        success(_data, status);
                    }
                },
                function(_data, status) {
                    if(typeof error == 'function') {
                        error(_data, status);
                    }
                }
            );
        },

        get_e911_key: function() {
            var key = "";

            if(winkstart.apps['connect'].e911_provider) {
                key = winkstart.apps['connect'].e911_provider + '_';
            }

            return key + 'e911';
        },

        add_numbers: function(numbers_data, data, callback) {
            var THIS = this,
                number_data;

            if(numbers_data.length == 0) {
                THIS.update_trunkstore(data, function(_data, status) {
                        if(typeof callback == 'function') {
                            callback(_data);
                        }
                    },
                    function(_data, status) {
                        winkstart.confirm('There was an error processing your request, would you like to try it again?',
                            function() {
                                THIS.add_numbers(numbers_data, data, callback);
                            },
                            function() {
                                winkstart.alert('Continuing with without saving.', function() {
                                    if(typeof callback == 'function') {
                                        callback({
                                            data: data
                                        });
                                    }
                                });
                            }
                        );
                    }
                );
            }
            else {
                number_data = {
                    phone_number: numbers_data[0].phone_number,
                    options: {}
                };

                THIS.activate_number(number_data, function(_data, status) {
                        data.DIDs_Unassigned[number_data.phone_number] = number_data.options;


                        THIS.add_numbers(numbers_data.slice(1), data, callback);
                    },
                    function(_data, status) {
                        winkstart.confirm('There was an error when trying to aquire ' + number_data.phone_number +
                            ', would you like to retry?',
                            function() {
                                THIS.add_numbers(numbers_data, data, callback);
                            },
                            function() {
                                THIS.add_numbers(numbers_data.slice(1), data, callback);
                            }
                        );
                    }
                );
            }
        },

        cancel_number: function(number_data, callback) {
            var THIS = this,
                cancel = function() {
                    THIS.delete_number({
                            account_id: winkstart.apps['connect'].account_id,
                            api_url: winkstart.apps['connect'].api_url,
                            phone_number: number_data.phone_number
                        },
                        function(data, status) {
                            if(typeof callback == 'function') {
                                callback(data);
                            }
                        }
                    );
                };

            winkstart.confirm('<b>Warning</b> - You cannot undo this action!<br>' +
                              'If you cancel this number it will become disconnected.<br>' +
                              'Are you absolutely sure you want to do this?',
                              cancel);
        },

        submit_port: function(port_data, number_data, callback) {
            var THIS = this,
                uploads_done = 0,
                put_port_data = function() {
                    number_data.options.port = port_data.port;

                    THIS.update_number(number_data, function(data) {
                        if(typeof callback == 'function') {
                            callback(data);
                        }
                    });
                },
                put_port_doc = function(index) {
                    /* Add files */
                    THIS.create_number_doc({
                            phone_number: number_data.phone_number,
                            file_name: port_data.loa[0].file_name,
                            file_data: port_data.loa[0].file_data
                        },
                        function(_data, status) {
                            THIS.create_number_doc({
                                    phone_number: number_data.phone_number,
                                    file_name: port_data.files[index].file_name,
                                    file_data: port_data.files[index].file_data
                                },
                                function(_data, status) {
                                    put_port_data();
                                }
                            );
                        }
                    );
                };

            if(port_data.port.main_number === number_data.phone_number) {
                put_port_doc(0);
            }
            else{
                put_port_data();
            }
        },

        set_e911: function(number_data, callback) {
            var THIS = this;

            THIS.get_number(number_data, function(data) {
                var _e911_data = $.extend(true, {}, data.data[THIS.get_e911_key()], { phone_number: number_data.phone_number });

                THIS.render_e911_dialog(_e911_data, function(e911_data) {
                    if(!$.isEmptyObject(e911_data)) {
                        $.each(e911_data, function(key, val) {
                            if(val == '') {
                                delete e911_data[key];
                            }
                        });

                        data.data[THIS.get_e911_key()] = e911_data;

                        if('id' in data.data) {
                            delete data.data.id;
                        }

                        THIS.update_number({
                                phone_number: number_data.phone_number,
                                options: data.data
                            },
                            function(_data, status) {
                                if(typeof callback == 'function') {
                                    callback(_data);
                                }
                            }
                        );
                    }
                });
            });
        },

        set_cnam: function(number_data, callback) {
            var THIS = this;

            THIS.get_number(number_data, function(data) {
                var _cnam_data = $.extend(true, {}, data.data.cnam, { phone_number: number_data.phone_number });

                THIS.render_cnam_dialog(_cnam_data, function(cnam_data) {
                    if(!$.isEmptyObject(cnam_data)) {
                        if(cnam_data.display_name == '') {
                            delete cnam_data.display_name;
                        }

                        data.data.cnam = cnam_data;

                        if('id' in data.data) {
                            delete data.data.id;
                        }

                        THIS.update_number({
                                phone_number: number_data.phone_number,
                                options: data.data
                            },
                            function(_data, status) {
                                if(typeof callback == 'function') {
                                    callback(_data);
                                }
                            }
                        );
                    }
                });
            });
        },

        set_failover: function(number_data, callback) {
            var THIS = this;

            THIS.get_number(number_data, function(data) {
                var _failover_data = $.extend(true, {}, data.data.failover, { phone_number: number_data.phone_number });

                THIS.render_failover_dialog(_failover_data, function(failover_data) {
                    if(!$.isEmptyObject(failover_data)) {
                        $.each(failover_data, function(key, val) {
                            if(val == '') {
                                delete failover_data[key];
                            }
                        });

                        data.data.failover = failover_data;

                        if('id' in data.data) {
                            delete data.data.id;
                        }

                        THIS.update_number({
                                phone_number: number_data.phone_number,
                                options: data.data
                            },
                            function(_data, status) {
                                if(typeof callback == 'function') {
                                    callback(_data);
                                }
                            }
                        );
                    }
                });
            });
        },

        render_port_dialog: function(callback) {
            var THIS = this,
                port_form_data = {},
                popup_html = THIS.templates.port_dialog.tmpl({
                    support_file_upload: (File && FileReader)
                }),
                popup,
                files,
                loa,
                phone_numbers,
                current_step = 1,
                max_steps = 4,
                $prev_step = $('.prev_step', popup_html),
                $next_step = $('.next_step', popup_html),
                $submit_btn = $('.submit_btn', popup_html);

            $('.step_div:not(.first)', popup_html).hide();
            $prev_step.hide();
            $submit_btn.hide();

            $('.other_carrier', popup_html).hide();

            $('.carrier_dropdown', popup_html).change(function() {
                if($(this).val() === 'Other') {
                    $('.other_carrier', popup_html).show();
                }
                else {
                    $('.other_carrier', popup_html).empty().hide();
                }
            });

            $('#postal_code', popup_html).blur(function() {
                $.getJSON('http://www.geonames.org/postalCodeLookupJSON?&country=US&callback=?', { postalcode: $(this).val() }, function(response) {
                    if (response && response.postalcodes.length && response.postalcodes[0].placeName) {
                        $('#locality', popup_html).val(response.postalcodes[0].placeName);
                        $('#region', popup_html).val(response.postalcodes[0].adminName1);
                    }
                });
            });

            $('.prev_step', popup_html).click(function() {
                $next_step.show();
                $submit_btn.hide();
                $('.step_div', popup_html).hide();
                $('.step_div:nth-child(' + --current_step + ')', popup_html).show();
                $('.wizard_nav .steps_text li, .wizard_nav .steps_image .round_circle').removeClass('current');
                $('#step_title_'+current_step +', .wizard_nav .steps_image .round_circle:nth-child('+ current_step +')', popup_html).addClass('current');

                current_step === 1 ? $('.prev_step', popup_html).hide() : true;
            });

            $('.next_step', popup_html).click(function() {
                $prev_step.show();
                $('.step_div', popup_html).hide();
                $('.step_div:nth-child(' + ++current_step + ')', popup_html).show();
                $('.wizard_nav .steps_text li, .wizard_nav .steps_image .round_circle').removeClass('current');
                $('#step_title_'+current_step +', .wizard_nav .steps_image .round_circle:nth-child('+ current_step +')', popup_html).addClass('current');
                if(current_step === max_steps) {
                    $next_step.hide();
                    $submit_btn.show();
                }
            });

            $('.loa', popup_html).change(function(ev) {
                var slice = [].slice,
                    raw_files = slice.call(ev.target.files, 0),
                    file_reader = new FileReader(),
                    file_name,
                    read_file = function(file) {
                        file_name = file.fileName || file.name || 'noname';
                        file_reader.readAsDataURL(file);
                    };

                loa = [];

                file_reader.onload = function(ev) {
                    loa.push({
                        file_name: file_name,
                        file_data: ev.target.result
                    });

                    if(raw_files.length > 1) {
                        raw_files = raw_files.slice(1);
                        read_file(raw_files[0]);
                    }
                };

                read_file(raw_files[0]);
            });

            $('.files', popup_html).change(function(ev) {
                var slice = [].slice,
                    raw_files = slice.call(ev.target.files, 0),
                    file_reader = new FileReader(),
                    file_name,
                    read_file = function(file) {
                        file_name = file.fileName || file.name || 'noname';
                        file_reader.readAsDataURL(file);
                    };

                files = [];

                file_reader.onload = function(ev) {
                    files.push({
                        file_name: file_name,
                        file_data: ev.target.result
                    });

                    if(raw_files.length > 1) {
                        raw_files = raw_files.slice(1);
                        read_file(raw_files[0]);
                    }
                    else {
                        $('.number_of_docs', popup_html).html(files.length);
                    }
                };

                read_file(raw_files[0]);
            });

            $('.submit_btn', popup_html).click(function(ev) {
                ev.preventDefault();
                port_form_data = form2object('port');

                var string_alert = '';

                if($('.carrier_dropdown', popup_html).val() === 'Other') {
                    port_form_data.port.service_provider = $('.other_carrier', popup_html).val();
                }

                if(!port_form_data.extra.agreed) {
                    string_alert += 'You must agree to the terms before continuing!<br/>';
                }

                $.each(port_form_data.extra.cb, function(k, v) {
                    if(v === false) {
                        string_alert += 'You must confirm the first conditions before continuing!<br/>';
                        return false;
                    }
                });

                port_form_data.phone_numbers = $('.numbers_text', popup_html).val().replace(/\n/g,',');
                port_form_data.phone_numbers = port_form_data.phone_numbers.replace(/[\s-\(\)\.]/g, '').split(',');

                port_form_data.port.main_number = port_form_data.port.main_number.replace(/[\s-\(\)\.]/g, '');

                var res = port_form_data.port.main_number.match(/^\+?1?([2-9]\d{9})$/);
                res ? port_form_data.port.main_number = '+1' + res[1] : string_alert += 'You need to enter a main number.<br/>';

                port_form_data.phone_numbers.push(port_form_data.port.main_number);

                phone_numbers = [];
                $.each(port_form_data.phone_numbers, function(i, val) {
                    var result = val.match(/^\+?1?([2-9]\d{9})$/);

                    if(result) {
                        phone_numbers.push('+1' + result[1]);
                    }
                    else {
                        if(val !== '') {
                            string_alert += val + ' : this Phone Number is not valid.<br/>';
                        }
                    }
                });
                port_form_data.phone_numbers = phone_numbers;

                port_form_data.files = files;
                port_form_data.loa = loa;

                if(string_alert === '') {
                    delete port_form_data.extra;

                    if(typeof callback === 'function') {
                        callback(port_form_data, popup);
                    }
                }
                else {
                    winkstart.alert(string_alert);
                }
            });

            popup = winkstart.dialog(popup_html, {
                title: 'Port a number'
            });
        },

        render_basic_add_number_dialog: function(callback) {
            var THIS = this,
                number_data = {},
                popup_html = THIS.templates.basic_add_number_dialog.tmpl(),
                popup;

            $('#add_number_btn', popup_html).click(function(ev) {
                ev.preventDefault();

                number_data.phone_number = $('#phone_number', popup_html).val();

                popup.dialog('close');
            });

            popup = winkstart.dialog(popup_html, {
                title: 'Add number',
                onClose: function() {
                    if(typeof callback == 'function' && number_data.phone_number) {
                        callback(number_data);
                    }
                }
            });
        },

        render_add_number_dialog: function(callback) {
            var THIS = this,
                numbers_data = [],
                popup_html = THIS.templates.add_number_dialog.tmpl(),
                popup;

            $('.toggle_div', popup_html).hide();

            $('#search_numbers_button', popup_html).click(function(ev) {
                $('.toggle_div', popup_html).hide();

                var npa_data = {},
                    npa = $('#sdid_npa', popup_html).val(),
                    nxx = $('#sdid_nxx', popup_html).val();

                ev.preventDefault();

                npa_data.prefix = npa + nxx;

                THIS.search_numbers(npa_data, function(results_data) {
                    var results_html = THIS.templates.add_number_search_results.tmpl(results_data);

                    $('#foundDIDList', popup_html)
                        .empty()
                        .append(results_html);

                    $('.toggle_div', popup_html).show();
                });
            });

            $('#add_numbers_button', popup_html).click(function(ev) {
                ev.preventDefault();

                $('#foundDIDList .checkbox_number:checked', popup_html).each(function() {
                    numbers_data.push($(this).dataset());
                });

                popup.dialog('close');
            });

            $(popup_html).delegate('.checkbox_number', 'click', function() {
                var selected_numbers =  $('.checkbox_number:checked', popup_html).size(),
                    sum_price = 0;

                $.each($('.checkbox_number:checked', popup_html), function() {
                    sum_price += parseFloat($(this).dataset('price'));
                });

                sum_price = '$'+sum_price+'.00';

                $('.selected_numbers', popup_html).html(selected_numbers);
                $('.cost_numbers', popup_html).html(sum_price);
            });

            popup = winkstart.dialog(popup_html, {
                title: 'Add number',
                width: '600px',
                position: ['center', 20],
                onClose: function() {
                    if(typeof callback == 'function') {
                        callback(numbers_data);
                    }
                }
            });
        },

        render_e911_dialog: function(e911_data, callback) {
            var THIS = this,
                e911_form_data = {},
                popup_html = THIS.templates.e911_dialog.tmpl(e911_data || {}),
                popup;

            $('#postal_code', popup_html).blur(function() {
                $.getJSON('http://www.geonames.org/postalCodeLookupJSON?&country=US&callback=?', { postalcode: $(this).val() }, function(response) {
                    if (response && response.postalcodes.length && response.postalcodes[0].placeName) {
                        $('#locality', popup_html).val(response.postalcodes[0].placeName);
                        $('#region', popup_html).val(response.postalcodes[0].adminName1);
                    }
                });
            });

            $('.submit_btn', popup_html).click(function(ev) {
                ev.preventDefault();

                e911_form_data = form2object('e911');

                popup.dialog('close');
            });

            popup = winkstart.dialog(popup_html, {
                title: e911_data.phone_number ? 'Edit Location for ' + e911_data.phone_number : 'Edit 911 Location',
                onClose: function() {
                    if(typeof callback == 'function') {
                        callback(e911_form_data);
                    }
                },
                width: '465px'
            });
        },

        render_cnam_dialog: function(cnam_data, callback) {
            console.log(cnam_data);
            var THIS = this,
                cnam_form_data = {},
                popup_html = THIS.templates.cnam_dialog.tmpl(cnam_data || {}),
                popup;

            $('.submit_btn', popup_html).click(function(ev) {
                ev.preventDefault();

                cnam_form_data = form2object('cnam');

                popup.dialog('close');
            });

            popup = winkstart.dialog(popup_html, {
                title: 'Edit CID',
                onClose: function() {
                    if(typeof callback == 'function') {
                        callback(cnam_form_data);
                    }
                }
            });
        },

        render_failover_dialog: function(failover_data, callback) {
            var THIS = this,
                failover_form_data = {},
                tmpl_data = {
                    radio: (failover_data || {}).e164 ? 'number' : ((failover_data || {}).sip ? 'sip' : ''),
                    failover: (failover_data || {}).e164 || (failover_data || {}).sip || '',
                    phone_number: failover_data.phone_number || ''
                },
                popup_html = THIS.templates.failover_dialog.tmpl(tmpl_data),
                popup,
                result,
                popup_title = failover_data.phone_number ? 'Setup Failover for ' + failover_data.phone_number : 'Setup Failover';

            $('.radio_block input[type="radio"]', popup_html).click(function() {
                $('.radio_block input[type="text"]', popup_html).hide();

                $(this).siblings('input[type="text"]').show('fast');

                $('.header', popup_html).removeClass('number sip').addClass($('.radio_block input[type="radio"]:checked', popup_html).val());
            });

            $('.submit_btn', popup_html).click(function(ev) {
                ev.preventDefault();

                failover_form_data.raw_input = $('input[name="failover_type"]:checked', popup_html).val() === 'number' ? $('.failover_number', popup_html).val() : $('.failover_sip', popup_html).val();

                console.log(failover_form_data.raw_input);

                if(failover_form_data.raw_input.match(/^sip:/)) {
                    failover_form_data.sip = failover_form_data.raw_input;
                }
                else if(result = failover_form_data.raw_input.replace(/-|\(|\)|\s/g,'').match(/^\+?1?([2-9]\d{9})$/)) {
                    failover_form_data.e164 = '+1' + result[1];
                }
                else {
                    failover_form_data.e164 = '';
                }

                delete failover_form_data.raw_input;

                if(failover_form_data.e164 || failover_form_data.sip) {
                    callback(failover_form_data);
                    popup.dialog('close');
                }
                else {
                    winkstart.alert('Invalid Failover Number, please type it again.');
                }
            });

            $('.remove_failover', popup_html).click(function(ev) {
                ev.preventDefault();
                callback({ e164: '', sip: '' });
                popup.dialog('close');
            });

            popup = winkstart.dialog(popup_html, {
                title: popup_title,
                width: '640px'
            });
        },

        render_endpoint_number_dropzone: function(endpoint_data, data, target) {
            var THIS = this,
                number_dropzone_html = $('<div class="drop_area"/>');

            (number_dropzone_html).droppable({
                /* The :not([data-serverid...]) bit prevents dropping a DID on the server it's currently assigned to */
                accept: '.number:not([data-serverid="' + endpoint_data.serverid + '"])',
                drop: function(ev, ui) {
                    var number_data = ui.draggable.dataset();

                    THIS.move_number(number_data, endpoint_data, data, function(_data) {
                        winkstart.publish('trunkstore.refresh', _data.data);
                    });
                }
            });

            (target)
                .empty()
                .append(number_dropzone_html);
        },

        render_endpoint_number: function(number_data, data, parent) {
            var THIS = this,
                number_html = THIS.templates.endpoint_number.tmpl(number_data);

            $('.number', number_html).draggable({
                cursor: 'pointer',
                opacity: 0.35,
                revert: 'invalid',
                appendTo: 'body',
                helper: 'clone',
                zIndex: 9999
            });

            $('.edit_failover', number_html).click(function(ev) {
                ev.preventDefault();

                THIS.set_failover(number_data, function(_data) {
                    number_data.options.failover = !$.isEmptyObject(_data.data.failover);

                    THIS.update_trunkstore(data, function(_data) {
                        winkstart.publish('trunkstore.refresh', _data.data);
                    });
                });
            });

            $('.edit_cnam', number_html).click(function(ev) {
                ev.preventDefault();

                THIS.set_cnam(number_data, function(_data) {
                    number_data.options.cnam = !$.isEmptyObject(_data.data.cnam);

                    THIS.update_trunkstore(data, function(_data) {
                        winkstart.publish('trunkstore.refresh', _data.data);
                    });
                });
            });

            $('.edit_e911', number_html).click(function(ev) {
                ev.preventDefault();

                THIS.set_e911(number_data, function(_data) {
                    number_data.options[THIS.get_e911_key()] = !$.isEmptyObject(_data.data[THIS.get_e911_key()]);

                    THIS.update_trunkstore(data, function(_data) {
                        winkstart.publish('trunkstore.refresh', _data.data);
                    });
                });
            });

            $('.unassign', number_html).click(function(ev) {
                ev.preventDefault();

                THIS.move_number(number_data, {}, data, function(_data) {
                    winkstart.publish('trunkstore.refresh', _data.data);
                });
            });

            (parent).append(number_html);
        },

        render_endpoint_numbers: function(endpoint_data, data, target) {
            var THIS = this,
                container = $('<div/>');

            $.each(endpoint_data.DIDs, function(phone_number, options) {
                THIS.render_endpoint_number({
                        phone_number: phone_number,
                        options: options || {},
                        serverid: endpoint_data.serverid,
                        e911_key: THIS.get_e911_key()
                    },
                    data,
                    container
                );
            });

            (target)
                .empty()
                .append(container.children());
        },

        render_number: function(number_data, data, parent) {
            var THIS = this,
                number_html = THIS.templates.number.tmpl(number_data);

            if(!('server_name' in data)) {
                $('.cancel_number', number_html).click(function(ev) {
                    ev.preventDefault();

                    THIS.cancel_number(number_data, function() {
                        delete data.DIDs_Unassigned[number_data.phone_number];

                        THIS.update_trunkstore(data, function(_data) {
                            winkstart.publish('trunkstore.refresh', _data.data);
                        });
                    });
                });
            }

            $('.number', number_html).draggable({
                cursor: 'pointer',
                opacity: 0.35,
                revert: 'invalid',
                appendTo: 'body',
                helper: 'clone',
                zIndex: 9999
            });

            (parent).append(number_html);
        },

        render_numbers: function(data, parent) {
            var THIS = this,
                target = $('#numbers', parent),
                numbers_html = THIS.templates.numbers.tmpl({
                    unassigned: THIS.count(data.DIDs_Unassigned)
                });

            $('.numbers.add', numbers_html).click(function(ev) {
                ev.preventDefault();

                if(winkstart.apps['connect'].admin) {
                    THIS.render_basic_add_number_dialog(function(number_data) {
                        THIS.create_number(number_data, function(_data) {
                            number_data.data = _data.data;

                            THIS.activate_number(number_data, function(_data) {
                                data.DIDs_Unassigned[number_data.phone_number] = _data.data;

                                THIS.update_trunkstore(data, function(_data) {
                                    winkstart.publish('trunkstore.refresh', _data.data);
                                });
                            });
                        });
                    });
                }
                else {
                    THIS.render_add_number_dialog(function(numbers_data) {
                        if(numbers_data.length > 0) {
                            THIS.add_numbers(numbers_data, data, function(_data) {
                                winkstart.publish('trunkstore.refresh', _data.data);
                            });
                        }
                    });
                }
            });

            $('.numbers.port', numbers_html).click(function(ev) {
                ev.preventDefault();

                THIS.render_port_dialog(function(port_data, popup) {
                    var ports_done = 0;

                    $.each(port_data.phone_numbers, function(i, val) {
                        var number_data = {
                            phone_number: val
                        };

                        THIS.port_number(number_data, function(_number_data) {
                            number_data.options = _number_data.data;

                            if('id' in number_data.options) {
                                delete number_data.options.id;
                            }

                            THIS.submit_port(port_data, number_data, function(_data) {
                                if(++ports_done > port_data.phone_numbers.length - 1) {
                                    $.each(port_data.phone_numbers, function(i, val) {
                                        data.DIDs_Unassigned[val] = {};
                                    });

                                    THIS.update_trunkstore(data, function(_data) {
                                        winkstart.publish('trunkstore.refresh', _data.data);
                                        popup.dialog('close');
                                    });
                                }
                            });
                        });
                    });
                });
            });

            $.each(data.servers, function(index, server) {
                $.each(server.DIDs, function(phone_number, options) {
                    THIS.render_number({
                            phone_number: phone_number,
                            serverid: "" + index, /* Gross hack to prevent 0 tripping the false condition in the template */
                            server_name: server.server_name
                        },
                        data,
                        $('#number_list', numbers_html)
                    );
                });
            });

            $.each(data.DIDs_Unassigned, function(phone_number, options) {
                THIS.render_number({
                        phone_number: phone_number,
                        status: 'unassigned'
                    },
                    data,
                    $('#number_list', numbers_html)
                );
            });

            (target)
                .empty()
                .append(numbers_html);
        },

        count: function(obj) {
            var size = 0;

            $.each(obj, function() {
                size++;
            });

            return size;
        }
    }
);

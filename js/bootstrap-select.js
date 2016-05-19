(function($) {
    'use strict';

    //<editor-fold desc="Shims">
    if (!String.prototype.includes) {
        (function() {
            'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
            var toString = {}.toString;
            var defineProperty = (function() {
                // IE 8 only supports `Object.defineProperty` on DOM elements
                try {
                    var object = {};
                    var $defineProperty = Object.defineProperty;
                    var result = $defineProperty(object, object, object) && $defineProperty;
                } catch (error) {}
                return result;
            }());
            var indexOf = ''.indexOf;
            var includes = function(search) {
                if (this == null) {
                    throw new TypeError();
                }
                var string = String(this);
                if (search && toString.call(search) == '[object RegExp]') {
                    throw new TypeError();
                }
                var stringLength = string.length;
                var searchString = String(search);
                var searchLength = searchString.length;
                var position = arguments.length > 1 ? arguments[1] : undefined;
                // `ToInteger`
                var pos = position ? Number(position) : 0;
                if (pos != pos) { // better `isNaN`
                    pos = 0;
                }
                var start = Math.min(Math.max(pos, 0), stringLength);
                // Avoid the `indexOf` call if no match is possible
                if (searchLength + start > stringLength) {
                    return false;
                }
                return indexOf.call(string, searchString, pos) != -1;
            };
            if (defineProperty) {
                defineProperty(String.prototype, 'includes', {
                    'value': includes,
                    'configurable': true,
                    'writable': true
                });
            } else {
                String.prototype.includes = includes;
            }
        }());
    }

    if (!String.prototype.startsWith) {
        (function() {
            'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
            var defineProperty = (function() {
                // IE 8 only supports `Object.defineProperty` on DOM elements
                try {
                    var object = {};
                    var $defineProperty = Object.defineProperty;
                    var result = $defineProperty(object, object, object) && $defineProperty;
                } catch (error) {}
                return result;
            }());
            var toString = {}.toString;
            var startsWith = function(search) {
                if (this == null) {
                    throw new TypeError();
                }
                var string = String(this);
                if (search && toString.call(search) == '[object RegExp]') {
                    throw new TypeError();
                }
                var stringLength = string.length;
                var searchString = String(search);
                var searchLength = searchString.length;
                var position = arguments.length > 1 ? arguments[1] : undefined;
                // `ToInteger`
                var pos = position ? Number(position) : 0;
                if (pos != pos) { // better `isNaN`
                    pos = 0;
                }
                var start = Math.min(Math.max(pos, 0), stringLength);
                // Avoid the `indexOf` call if no match is possible
                if (searchLength + start > stringLength) {
                    return false;
                }
                var index = -1;
                while (++index < searchLength) {
                    if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
                        return false;
                    }
                }
                return true;
            };
            if (defineProperty) {
                defineProperty(String.prototype, 'startsWith', {
                    'value': startsWith,
                    'configurable': true,
                    'writable': true
                });
            } else {
                String.prototype.startsWith = startsWith;
            }
        }());
    }

    if (!Object.keys) {
        Object.keys = function(
            o, // object
            k, // key
            r // result array
        ) {
            // initialize object and result
            r = [];
            // iterate over object keys
            for (k in o)
            // fill result array with non-prototypical keys
                r.hasOwnProperty.call(o, k) && r.push(k);
            // return result
            return r;
        };
    }

    $.fn.triggerNative = function(eventName) {
        var el = this[0],
            event;

        if (el.dispatchEvent) {
            if (typeof Event === 'function') {
                // For modern browsers
                event = new Event(eventName, {
                    bubbles: true
                });
            } else {
                // For IE since it doesn't support Event constructor
                event = document.createEvent('Event');
                event.initEvent(eventName, true, false);
            }

            el.dispatchEvent(event);
        } else {
            if (el.fireEvent) {
                event = document.createEventObject();
                event.eventType = eventName;
                el.fireEvent('on' + eventName, event);
            }

            this.trigger(eventName);
        }
    };
    //</editor-fold>
    // Case insensitive contains search
    $.expr[':'].icontains = function(obj, index, meta) {
        var $obj = $(obj);
        var haystack = ($obj.data('tokens') || $obj.text()).toUpperCase();
        return haystack.includes(meta[3].toUpperCase());
    };

    // Case insensitive begins search
    $.expr[':'].ibegins = function(obj, index, meta) {
        var $obj = $(obj);
        var haystack = ($obj.data('tokens') || $obj.text()).toUpperCase();
        return haystack.startsWith(meta[3].toUpperCase());
    };

    // Case and accent insensitive contains search
    $.expr[':'].aicontains = function(obj, index, meta) {
        var $obj = $(obj);
        var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toUpperCase();
        return haystack.includes(meta[3].toUpperCase());
    };

    // Case and accent insensitive begins search
    $.expr[':'].aibegins = function(obj, index, meta) {
        var $obj = $(obj);
        var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toUpperCase();
        return haystack.startsWith(meta[3].toUpperCase());
    };


    /**
     * Remove all diatrics from the given text.
     * @access private
     * @param {String} text
     * @returns {String}
     */
    function normalizeToBase(text) {
    var rExps = [
      {re: /[\xC0-\xC6]/g, ch: "A"},
      {re: /[\xE0-\xE6]/g, ch: "a"},
      {re: /[\xC8-\xCB]/g, ch: "E"},
      {re: /[\xE8-\xEB]/g, ch: "e"},
      {re: /[\xCC-\xCF]/g, ch: "I"},
      {re: /[\xEC-\xEF]/g, ch: "i"},
      {re: /[\xD2-\xD6]/g, ch: "O"},
      {re: /[\xF2-\xF6]/g, ch: "o"},
      {re: /[\xD9-\xDC]/g, ch: "U"},
      {re: /[\xF9-\xFC]/g, ch: "u"},
      {re: /[\xC7-\xE7]/g, ch: "c"},
      {re: /[\xD1]/g, ch: "N"},
      {re: /[\xF1]/g, ch: "n"}
    ];
        $.each(rExps, function() {
            text = text.replace(this.re, this.ch);
        });
        return text;
    }


    function htmlEscape(html) {
        var escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '`': '&#x60;'
        };
        var source = '(?:' + Object.keys(escapeMap).join('|') + ')',
            testRegexp = new RegExp(source),
            replaceRegexp = new RegExp(source, 'g'),
            string = html == null ? '' : '' + html;
        return testRegexp.test(string) ? string.replace(replaceRegexp, function(match) {
            return escapeMap[match];
        }) : string;
    }

    $.selectpicker = {};

    $.extend($.selectpicker, {
        escapeRegex: function(value) {
            return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
        },
        filter: function(array, term) {
            var matcher = new RegExp($.selectpicker.escapeRegex(term), "i");
            return $.grep(array, function(value) {
                return matcher.test(value.text || value.value || value);
            });
        }
    });

    var Selectpicker = function(element, options, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        this.$element = $(element);
        this.$newElement = null;
        this.$button = null;
        this.$menu = null;
        this.$lis = null;
        this.options = options;

        // If we have no title yet, try to pull it from the html title attribute (jQuery doesnt' pick it up as it's not a
        // data-attribute)
        if (this.options.title === null) {
            this.options.title = this.$element.attr('title');
        }

        //Expose public methods
        this.val = Selectpicker.prototype.val;
        this.render = Selectpicker.prototype.render;
        this.refresh = Selectpicker.prototype.refresh;
        this.setStyle = Selectpicker.prototype.setStyle;
        this.selectAll = Selectpicker.prototype.selectAll;
        this.deselectAll = Selectpicker.prototype.deselectAll;
        this.addSource = Selectpicker.prototype.addSource;
        this.destroy = Selectpicker.prototype.destroy;
        this.remove = Selectpicker.prototype.remove;
        this.show = Selectpicker.prototype.show;
        this.hide = Selectpicker.prototype.hide;

        this.init();
    };

    Selectpicker.VERSION = '1.10.0';

    // part of this is duplicated in i18n/defaults-en_US.js. Make sure to update both.
    Selectpicker.DEFAULTS = {
        noneSelectedText: 'Nothing selected',
        noneResultsText: 'No results match',
        noneSelectOption: 'No select option',
        countSelectedText: function(numSelected, numTotal) {
            return (numSelected == 1) ? "{0} item selected" : "{0} items selected";
        },
        maxOptionsText: function(numAll, numGroup) {
            var arr = [];

            arr[0] = (numAll == 1) ? 'Limit reached ({n} item max)' : 'Limit reached ({n} items max)';
            arr[1] = (numGroup == 1) ? 'Group limit reached ({n} item max)' : 'Group limit reached ({n} items max)';

            return arr;
        },
        selectAllText: 'Select All',
        deselectAllText: 'Deselect All',
        multipleSeparator: ', ',
        styleBase: 'btn',
        style: 'btn-default',
        wrapperClassName: '',

        size: 'auto',
        title: null,
        selectedTextFormat: 'values',
        width: false,
        container: false,
        hideDisabled: false,
        showSubtext: false,
        showIcon: true,
        showContent: true,
        dropupAuto: true,
        header: false,
        liveSearch: false,
        liveSearchPlaceholder: '',
        liveSearchClassName: '',
        liveSearchNormalize: false,
        liveSearchStyle: 'contains',
        actionsBox: false,
        source: null,
        delay: 300,
        minLength: 1,
        sourceLoadMore: false,
        iconBase: 'glyphicon',
        tickIcon: 'glyphicon-ok',
        showTick: false,
        template: {
            caret: '<span class="caret"></span>'
        },
        maxOptions: false,
        mobile: false,
        selectOnTab: false,
        dropdownAlignRight: false,
        searchAccentInsensitive: false
    };

    Selectpicker.prototype = {

        constructor: Selectpicker,

        init: function() {
            var that = this,
                id = this.$element.attr('id');
            this.$element.addClass('bs-select-hidden');
            this.setCacheDomData();
            // this.$element.hide();
            this.multiple = this.$element.prop('multiple');
            this.autofocus = this.$element.prop('autofocus');
            this.$newElement = this.createView();
            this.$element.after(this.$newElement);
            this.$element.addClass('sr-only');
            // this.$menu = this.$newElement.find('> .dropdown-menu');
            // this.$button = this.$newElement.find('> button');
            // this.$searchbox = this.$newElement.find('input');

            // this.$element
            //     .after(this.$newElement)
            //     .appendTo(this.$newElement);
            this.$button = this.$newElement.children('button');
            this.$menu = this.$newElement.children('.dropdown-menu');
            this.$menuInner = this.$menu.children('.inner');
            this.$searchbox = this.$menu.find('input');


            this.$element.removeClass('bs-select-hidden');

            if (this.options.dropdownAlignRight)
                this.$menu.addClass('dropdown-menu-right');

            if (typeof id !== 'undefined') {
                this.$button.attr('data-id', id);
                $('label[for="' + id + '"]').click(function(e) {
                    e.preventDefault();
                    that.$button.focus();
                });
            }

            this.checkDisabled();
            this.clickListener();

            if (this.options.source) {
                this._initSource();
                this.postRender();
            }
            this.defaultLiveSearch = false;

            if (this.options.liveSearch) {
                this.liveSearchListener();
                if(!this.source){
                    this.defaultLiveSearch = true;
                }
            }
            this.render();
            this.liHeight();
            this.setStyle();
            this.setWidth();
            if (this.options.container) this.selectPosition();
            this.$menu.data('this', this);
            this.$newElement.data('this', this);
            if (this.options.mobile) this.mobile();


            this.dropdownshowtime = 0;


            this.$newElement.on({
                'hide.bs.dropdown': function(e) {
                    that.$element.trigger('hide.bs.select', e);
                },
                'hidden.bs.dropdown': function(e) {
                    that.$element.trigger('hidden.bs.select', e);
                },
                'show.bs.dropdown': function(e) {
                    that.$element.trigger('show.bs.select', e);
                    if(that.dropdownshowtime > 0){
                        if (that.options.liveSearch) {
                            that.postRender();
                        }
                    }
                    this.dropdownshowtime++;
                },
                'shown.bs.dropdown': function(e) {
                    that.$element.trigger('shown.bs.select', e);
                }
            });

            if (that.$element[0].hasAttribute('required')) {
                this.$element.on('invalid', function() {
                    that.$button
                        .addClass('bs-invalid')
                        .focus();

                    that.$element.on({
                        'focus.bs.select': function() {
                            that.$button.focus();
                            that.$element.off('focus.bs.select');
                        },
                        'shown.bs.select': function() {
                            that.$element
                                .val(that.$element.val()) // set the value to hide the validation message in Chrome when menu is opened
                                .off('shown.bs.select');
                        },
                        'rendered.bs.select': function() {
                            // if select is no longer invalid, remove the bs-invalid class
                            if (this.validity.valid) that.$button.removeClass('bs-invalid');
                            that.$element.off('rendered.bs.select');
                        }
                    });

                });
            }

            setTimeout(function() {
                that.$element.trigger('loaded.bs.select');
            });


        },
        requestIndex: 0,
        pending: 0,
        term: "",
        /**
         * request @object {
         *     trem: "",
         *     more: true,
         *     searching: true
         * }
         *
         * response @function
         */
        _initSource: function() {
            var array, url,
                that = this;
            if ($.isArray(this.options.source)) {
                array = this.getCacheDomData();
                array = array.concat(this._normalize(this.options.source));
                this.source = function(request, response) {
                    response($.selectpicker.filter(array, request.term));
                };
            } else if (typeof this.options.source === "string") {
                url = this.options.source;
                this.source = function(request, response) {
                    if (that.xhr) {
                        that.xhr.abort();
                    }
                    if (that.options.liveSearch) {
                        that.xhr = $.ajax({
                            url: url,
                            data: request,
                            dataType: "json",
                            success: function(data) {
                                response(data);
                            },
                            error: function() {
                                response([]);
                            }
                        });
                    } else {


                    }
                };
            } else {
                this.source = this.options.source;
            }

        },
        _setDefaultOption: function() {
            //If we are not multiple, we don't have a selected item, and we don't have a title, select the first element so something is set in the button
            if (!this.multiple && this.$element.find('option:selected').length === 0 && !this.options.title) {
                this.$element.find('option').eq(0).prop('selected', true).attr('selected', 'selected');
            }
        },
        _parseHTMLtoData: function() {
            var that = this;
            var optID = 0;
            /**
             * {
             *   value: '',
             *   text: '',
             *   data:{
             *     content: '',
             *     icon: '',
             *     subtext: ''
             *   },
             *   divider: [true |false],
             *   disabled: [true | false],
             * }
             */
            var results = [];

            this.$element.find('option').each(function(i) {
                var $this = $(this);
                var index = i;
                if (that.options.hideDisabled && isDisabled) {
                    return;
                }

                if ($this.parent().is('optgroup') && $this.data('divider') !== true) {
                    if ($this.index() === 0) { // Is it the first option of the optgroup?
                        optID += 1;
                        // Get the opt group label
                        var label = $this.parent().attr('label');
                        var labelSubtext = typeof $this.parent().data('subtext') !== 'undefined' ? '<small class="muted text-muted">' + $this.parent().data('subtext') + '</small>' : '';
                        var labelIcon = $this.parent().data('icon') ? '<span class="' + that.options.iconBase + ' ' + $this.parent().data('icon') + '"></span> ' : '';
                        label = labelIcon + '<span class="text">' + label + labelSubtext + '</span>';

                        if (index !== 0 && results.length > 0) { // Is it NOT the first option of the select && are there elements in the dropdown?
                            results.push({
                                    divider: true,
                                    className: 'divider'
                                })
                                // _li.push(generateLI('',  null, 'divider'));
                        }
                        var optgroup = this.parentNode;
                        results.push({
                                divider: true,
                                className: 'dropdown-header',
                                label: optgroup.getAttribute('label') || '',
                                disabled: optgroup.disabled,
                                optgroupId: optID,
                                data: {
                                    subtext: optgroup.getAttribute('data-subtext') || '',
                                    icon: optgroup.getAttribute('data-icon') || ''
                                }
                            })
                            // _li.push(generateLI(label, null, 'dropdown-header'));
                    }
                    results.push({
                            text: this.innerHTML, // $this.html(),
                            value: this.getAttribute('value'), // $this.attr('value'),
                            title: this.getAttribute('title'), // $this.attr('title'),
                            className: 'opt ' + (this.getAttribute('class') || ''),
                            style: this.getAttribute('style'), //$this.attr('style'),
                            optgroupId: optID,
                            index: index,
                            disabled: this.disabled, //$this.is(':disabled'),
                            selected: this.selected, // $this.is(':selected'),
                            data: {
                                content: $this.data('content') || '',
                                subtext: $this.data('subtext') || '',
                                icon: $this.data('icon') || ''
                            }
                        })
                        // _li.push(generateLI(generateA(text, title, 'opt ' + optionClass, inline, optID), index));
                } else if ($this.data('divider') === true) {
                    results.push({
                            divider: true,
                            className: 'divider',
                            index: index
                        })
                        // _li.push(generateLI('', index, 'divider'));
                } else if ($this.data('hidden') === true) {
                    results.push({
                        text: this.innerHTML, // $this.html(),
                        value: this.getAttribute('value'), // $this.attr('value'),
                        title: this.getAttribute('title'), // $this.attr('title'),
                        className: this.getAttribute('class') || '', //$this.attr('class') || '',
                        style: this.getAttribute('style'), //$this.attr('style'),
                        index: index,
                        hidden: true,
                        selected: this.selected, // $this.is(':selected'),
                        data: {
                            content: $this.data('content') || '',
                            subtext: $this.data('subtext') || '',
                            icon: $this.data('icon') || ''
                        }
                    })

                    //_li.push(generateLI(generateA(text, title, optionClass, inline), index, 'hide is-hidden'));
                } else {

                    results.push({
                            text: this.innerHTML, // $this.html(),
                            value: this.getAttribute('value'), // $this.attr('value'),
                            title: this.getAttribute('title'), // $this.attr('title'),
                            className: this.getAttribute('class') || '', //$this.attr('class') || '',
                            style: this.getAttribute('style'), //$this.attr('style'),
                            disabled: this.disabled, //$this.is(':disabled'),
                            selected: this.selected, // $this.is(':selected'),
                            index: index,
                            data: {
                                content: $this.data('content') || '',
                                subtext: $this.data('subtext') || '',
                                icon: $this.data('icon') || ''
                            }
                        })
                        //_li.push(generateLI(generateA(text, title, optionClass, inline), index));
                }
            });
            return results;
        },
        _delay: function(handler, delay) {
            function handlerProxy() {
                return (typeof handler === "string" ? instance[handler] : handler)
                    .apply(instance, arguments);
            }
            var instance = this;
            return setTimeout(handlerProxy, delay || 0);
        },
        _searchTimeout: function(event) {
            clearTimeout(this.searching);
            this.searching = this._delay(function() {
                // only search if the value has changed
                if (this.term !== this._value()) {
                    // this.selectedItem = null;
                    this.search(null, event);
                }
            }, this.options.delay);
        },
        search: function(value, event) {
            value = value != null ? value : this._value();

            // always save the actual value, not the one passed as an argument
            this.term = this._value();

            // if (value.length < this.options.minLength) {
            //     return this.close(event);
            // }

            // if (this._trigger("search", event) === false) {
            //     return;
            // }

            return this._search(value);
        },
        _value: function() {
            return this.$searchbox['val'].apply(this.$searchbox, arguments);
        },
        _search: function(value) {
            this.pending++;
            // this.element.addClass("ui-autocomplete-loading");
            this.cancelSearch = false;

            this.loadending = false;

            this.source({
                term: value,
                searching: value != "" ? true : false
            }, this._response());
        },
        _response: function() {
            var index = ++this.requestIndex;

            return $.proxy(function(content) {
                if (index === this.requestIndex) {
                    this.__response(content);
                }

                this.pending--;
                if (!this.pending) {
                    // this.element.removeClass("ui-autocomplete-loading");
                }
            }, this);
        },
        _normalize: function(items) {
            // assume all items have the right format when the first item is complete
            if (items.length && items[0].text && items[0].value) {
                return items;
            }
            return $.map(items, function(item) {
                if (typeof item === "string") {
                    return {
                        text: item,
                        value: item
                    };
                }
                return item;
            });
        },
        __response: function(content) {
            if (content) {
                content = this._normalize(content);
            }

            // this._trigger("response", null, {
            //     content: content
            // });
            // 
            // !this.options.disabled &&
            if (content && content.length && !this.cancelSearch) {
                this.renderOptions(content);
                this.setCacheDomData(content);
                this._suggest(content);
                this.selectFirstLi();
                // this._trigger("open");
            } else {
                if (this._value()) {
                    this._noResults();
                } else {
                    this._noResults("No Select Collection.");
                }
                // use ._close() instead of .close() so we don't cancel future searches
                // this._close();
            }
        },
        _noResults: function(text) {
            var that = this,
                no_results = $('<li class="no-results"></li>');
            no_results.html(text || (that.options.noneResultsText + ' "' + htmlEscape(that._value()) + '"')).show();
            that.$menu.find('ul').empty().append(no_results);

        },
        renderOptions: function(content, add) {
            add || (add = false);
            this.$element[add ? "append" : "html"]($.map(content, function(item) {
                item.data || (item.data = {});

                var op = $('<option/>', {
                    value: item.value,
                    html: item.text,
                    style: item.style || '',
                    class: item.className || '',
                });
                if (item.selected) {
                    op.prop('selected', true);
                }
                if (item.data.content) {
                    op.attr('data-content', item.data.content);
                }
                if (item.data.hidden) {
                    op.attr('data-hidden', item.data.hidden);
                }
                if (item.data.subtext) {
                    op.attr('data-subtext', item.data.subtext);
                }
                if (item.data.icon) {
                    op.attr('data-icon', item.data.icon);
                }
                return op;
            }));
            if (!this.options.liveSearch) {
                this._setDefaultOption();
            }
        },
        selectFirstLi: function() {
            this.$menu.find('li.active').removeClass('active');
            this.$menu.find('li').filter(':visible:not(.divider)').eq(0).addClass('active').find('a').focus();
            this.$searchbox.focus();
        },
        _postRender: function() {
            return $.proxy(function(content) {
                if (content) {
                    content = this._normalize(content);
                }
                if (content && content.length) {
                    this.renderOptions(content);
                    this.refresh();
                    this.setSize();

                } else {
                    this._noResults("No Select Collection.");
                }
                // this.element.removeClass("ui-autocomplete-loading");
            }, this);
        },
        addSource: function(content) {
            if (content) {
                content = this._normalize(content);
            }
            if (content && content.length) {
                this.renderOptions(content, true);
                this.setCacheDomData();
                this._suggest();
            }
            return this.$element;
        },
        getMoreSource: function() {
            clearTimeout(this.moreloading);
            if (this.loadending)
                return;
            this.moreloading = this._delay(function() {
                // only search if the value has changed
                if (this.term == this._value()) {
                    // this.selectedItem = null;

                    this.source({
                        term: this._value(),
                        more: true
                    }, this._getMoreSource());
                }
            }, this.options.delay);

        },
        _getMoreSource: function() {
            return $.proxy(function(content) {
                if (content && content.length) {
                    this.addSource(content);
                } else {
                    this.loadending = true;
                }
                // this.element.removeClass("ui-autocomplete-loading");
            }, this);
        },
        postRender: function() {
            if (this.options.source) {
                this.source({
                    term: "",
                    searching: false
                }, this._postRender());
            }
        },
        _resetLi: function() {
            this.reloadLi();
            this.setWidth();
            this.setStyle();
            this.checkDisabled();
            this.liHeight();
        },
        _suggest: function(content, add) {
            this.$lis = null;
            this.reloadLi(content, add);
            this.render();
            this.setWidth();
            this.setStyle();
            this.checkDisabled();
            this.liHeight();
        },
        setCacheDomData: function(data) {
            if (data) {
                this._cacheDomData = data;
            } else {
                this._cacheDomData = this._parseHTMLtoData(); // init this;
            }
        },
        getCacheDomData: function() {
            return this._cacheDomData;
        },

        createDropdown: function() {
            // Options
            // If we are multiple, then add the show-tick class by default
            var showTick = (this.multiple || this.options.showTick) ? ' show-tick' : '',
                inputGroup = this.$element.parent().hasClass('input-group') ? ' input-group-btn' : '',
                autofocus = this.autofocus ? ' autofocus' : '',
                btnSize = this.$element.parents().hasClass('form-group-lg') ? ' btn-lg' : (this.$element.parents().hasClass('form-group-sm') ? ' btn-sm' : '');
            // Elements
            var header = this.options.header ? '<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>' + this.options.header + '</div>' : '';
            var searchbox = this.options.liveSearch ? '<div class="bs-searchbox ' + this.options.liveSearchClassName + '"><input type="text" class="input-block-level form-control" autocomplete="off" placeholder="' + this.options.liveSearchPlaceholder + '" /></div>' : '';
            var actionsbox = this.options.actionsBox ? '<div class="bs-actionsbox">' +
                '<div class="btn-group btn-block">' +
                '<button class="actions-btn bs-select-all btn btn-sm btn-default">' +
                this.options.selectAllText +
                '</button>' +
                '<button class="actions-btn bs-deselect-all btn btn-sm btn-default">' +
                this.options.deselectAllText +
                '</button>' +
                '</div>' +
                '</div>' : '';
            var drop =
                '<div class="btn-group bootstrap-select' + showTick + inputGroup + '">' +
                '<button type="button" class="' + this.options.styleBase + ' dropdown-toggle selectpicker' + btnSize + '" data-toggle="dropdown"' + autofocus + '>' +
                '<span class="filter-option pull-left"></span>&nbsp;' +
                '<span class="bs-caret">' +
                this.options.template.caret +
                '</span>' +
                '</button>' +
                '<div class="dropdown-menu open">' +
                header +
                searchbox +
                actionsbox +
                '<ul class="dropdown-menu inner selectpicker" role="menu">' +
                '</ul>' +
                '</div>' +
                '</div>';

            return $(drop);
        },

        createView: function() {
            var $drop = this.createDropdown();
            var $li = this.createLi();
            $drop.find('ul').append($li);
            return $drop;
        },
        renderItem: function(data, index) {
            var that = this;

            data.data = (data.data || {});
            // Helper functions
            /**
             * @param content
             * @param [index]
             * @param [classes]
             * @returns {string}
             */
            var generateLI = function(content, index, classes) {
                return '<li' +
                    (typeof classes !== 'undefined' ? ' class="' + classes + '"' : '') +
                    (typeof index !== 'undefined' | null === index ? ' data-original-index="' + index + '"' : '') +
                    ' role="menuitem" >' + content + '</li>';
            };

            /**
             * @param text
             * @param [classes]
             * @param [inline]
             * @param [optgroup]
             * @returns {string}
             */
            var generateA = function(itemdata, text, title, classes, inline, optgroup) {
                var normText = normalizeToBase(htmlEscape(text));
                return '<a tabindex="0"' +
                    ' data-item-id="' + itemdata.value + '"' +
                    (typeof classes !== 'undefined' ? ' class="' + classes + '"' : '') +
                    (typeof inline !== 'undefined' ? ' style="' + inline + '"' : '') +
                    (typeof title !== 'undefined' ? ' title="' + title + '"' : '') +
                    (typeof optgroup !== 'undefined' ? 'data-optgroup="' + optgroup + '"' : '') +
                    ' data-normalized-text="' + normText + '"' +
                    '>' + text +
                    '<span class="' + that.options.iconBase + ' ' + that.options.tickIcon + ' check-mark"></span>' +
                    '</a>';
            };

            if (data.divider) {
                var label = data.label || '';
                var labelSubtext = data.data.subtext ? '<small class="muted text-muted">' + data.data.subtext + '</small>' : '';
                var labelIcon = data.data.icon ? '<span class="' + that.options.iconBase + ' ' + data.data.icon + '"></span> ' : '';
                label = labelIcon + '<span class="text">' + label + labelSubtext + '</span>';

                return generateLI(label, data.index || null, data.className);
            }


            data = $.extend(true, {}, {
                index: index
            }, data);

            // Get the class and text for the option
            var optionClass = data.className || '',
                inline = data.style,
                text = data.data.content ? data.data.content : data.text,
                subtext = data.data.subtext ? '<small class="muted text-muted">' + data.data.subtext + '</small>' : '',
                icon = data.data.icon ? '<span class="' + that.options.iconBase + ' ' + data.data.icon + '"></span> ' : '',
                isDisabled = data.disabled,
                title = data.title,
                index = data.index;
            if (icon !== '' && isDisabled) {
                icon = '<span>' + icon + '</span>';
            }

            if (!data.data.content) {
                // Prepend any icon and append any subtext to the main text.
                text = icon + '<span class="text">' + text + subtext + '</span>';
            }

            return generateLI(generateA(data, text, title, optionClass, inline, data.optgroupId), index, data.hidden ? 'hidden is-hidden' : '')
        },
        reloadLi: function(data, add) {
            add || (add = false);
            //Remove all children.
            if (!add) {
                this.destroyLi();
            }
            //Re build
            var $li = this.createLi(data);
            this.$menu.find('ul').append($li);
        },

        destroyLi: function() {
            this.$menu.find('li').remove();
        },
        createLi: function(data) {
            var that = this,
                _li = [];
            if (true) {

                var colelction = data || that.getCacheDomData();

                $.each(colelction, function(i, item) {
                    _li.push(that.renderItem(item, i));
                })

                return $(_li.join(''));
            }

        },
        findLis: function() {
            if (this.$lis == null) this.$lis = this.$menu.find('li');
            return this.$lis;
        },
        render: function (updateLi) {
          var that = this;

          //Update the LI to match the SELECT
          if (updateLi !== false) {
            this.$element.find('option').each(function (index) {
              that.setDisabled(index, $(this).is(':disabled') || $(this).parent().is(':disabled'));
              that.setSelected(index, $(this).is(':selected'));
            });
          }

          this.tabIndex();
          var notDisabled = this.options.hideDisabled ? ':not([disabled])' : '';
          var selectedItems = this.$element.find('option:selected' + notDisabled).map(function () {
            var $this = $(this);
            var icon = $this.data('icon') && that.options.showIcon ? '<i class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></i> ' : '';
            var subtext;
            if (that.options.showSubtext && $this.attr('data-subtext') && !that.multiple) {
              subtext = ' <small class="muted text-muted">' + $this.data('subtext') + '</small>';
            } else {
              subtext = '';
            }
            var reData = {};

            if ($this.data('content') && that.options.showContent) {
              reData['content'] = $this.data('content');
            } else if (typeof $this.attr('title') !== 'undefined') {
              reData['title'] = $this.attr('title');
            }
            if(!reData['content']){
              reData['content'] = icon + $this.html() + subtext;
            }
            if(!reData['title']){
              reData['title'] = icon + $this.html() + subtext;
            }
            return reData;
          }).toArray();

          //Fixes issue in IE10 occurring when no default option is selected and at least one option is disabled
          //Convert all the values into a comma delimited string
          var title = !this.multiple ? selectedItems[0] && selectedItems[0].title || this.options.noneSelectOption : ($.map(selectedItems, function(el) { return el.title})).join(this.options.multipleSeparator) || this.options.noneSelectOption;

          //If this is multi select, and the selectText type is count, the show 1 of 2 selected etc..
          if (this.multiple && this.options.selectedTextFormat.indexOf('count') > -1) {
            var max = this.options.selectedTextFormat.split('>');
            if ((max.length > 1 && selectedItems.length > max[1]) || (max.length == 1 && selectedItems.length >= 2)) {
              notDisabled = this.options.hideDisabled ? ', [disabled]' : '';
              var totalCount = this.$element.find('option').not('[data-divider="true"], [data-hidden="true"]' + notDisabled).length,
                  tr8nText = (typeof this.options.countSelectedText === 'function') ? this.options.countSelectedText(selectedItems.length, totalCount) : this.options.countSelectedText;
              title = tr8nText.replace('{0}', selectedItems.length.toString()).replace('{1}', totalCount.toString());
            }
          }

          this.options.title = this.$element.attr('title');

          if (this.options.selectedTextFormat == 'static') {
            title = this.options.title;
          }

          //If we dont have a title, then use the default, or if nothing is set at all, use the not selected text
          if (!title) {
            title = typeof this.options.title !== 'undefined' ? this.options.title : this.options.noneSelectedText;
          }
          var content =  !this.multiple ? selectedItems[0] && selectedItems[0].content || this.options.noneSelectOption : ($.map(selectedItems, function(el) { return el.content})).join(this.options.multipleSeparator) || this.options.noneSelectOption;

          this.$button.attr('title', htmlEscape(title));
          this.$newElement.find('.filter-option').html(content);
        },

        /**
         * @param [updateLi] defaults to true
         */
        render2: function(updateLi) {
            var that = this;

            var optionsData = this._parseHTMLtoData();
            //Update the LI to match the SELECT
            if (updateLi !== false) {

                $.each(optionsData, function(index, item) {
                        if (!item.divider) {
                            that.setDisabled(item.index, item.disabled); // || (index > 0 && array[index-1].disabled)
                            that.setSelected(item.index, item.selected);
                        }
                    })
            }

            this.tabIndex();
            var notDisabled = this.options.hideDisabled ? ':not([disabled])' : '';


            var selectedItems = $.grep(optionsData, function(item) {
                return item.selected && !item.disabled
            });


            selectedItems = !selectedItems.length ? $.grep(optionsData, function(item) {
                return item.value == ""
            }) : selectedItems;

            selectedItems = $.map(selectedItems, function(item) {
                item.data = (item.data || {});

                var $this = $(this);
                var icon = item.data.icon && that.options.showIcon ? '<i class="' + that.options.iconBase + ' ' + item.data.icon + '"></i> ' : '';
                var subtext;
                if (that.options.showSubtext && item.data.subtext && !that.multiple) {
                    subtext = ' <small class="muted text-muted">' + item.data.subtext + '</small>';
                } else {
                    subtext = '';
                }
                var reData = {};
                if (item.data.content && that.options.showContent) {
                    reData['content'] = item.data.content;
                } else if (item.title) {
                    reData['title'] = item.title;
                }
                if (!reData['content']) {
                    reData['content'] = icon + item.text + subtext;
                }
                if (!reData['title']) {
                    reData['title'] = icon + item.text + subtext;
                }
                return reData;
            })

            //Fixes issue in IE10 occurring when no default option is selected and at least one option is disabled
            //Convert all the values into a comma delimited string
            var title = !this.multiple ? (selectedItems[0] && selectedItems[0].title) || this.options.noneSelectOption : ($.map(selectedItems, function(el) {
                return el.title
            })).join(this.options.multipleSeparator) || this.options.noneSelectOption;

            //If this is multi select, and the selectText type is count, the show 1 of 2 selected etc..
            if (this.multiple && this.options.selectedTextFormat.indexOf('count') > -1) {
                var max = this.options.selectedTextFormat.split('>');
                if ((max.length > 1 && selectedItems.length > max[1]) || (max.length == 1 && selectedItems.length >= 2)) {
                    notDisabled = this.options.hideDisabled ? ', [disabled]' : '';

                    // var totalCount = this.$element.find('option').not('[data-divider="true"], [data-hidden="true"]' + notDisabled).length,
                    var totalCount = ($.grep(optionsData, function(item) {
                            return !item.divider || !item.hidden || !item.disabled
                        })).length,
                        tr8nText = (typeof this.options.countSelectedText === 'function') ? this.options.countSelectedText(selectedItems.length, totalCount) : this.options.countSelectedText;
                    title = tr8nText.replace('{0}', selectedItems.length.toString()).replace('{1}', totalCount.toString());
                }
            }

            if (this.options.title == undefined) {
                this.options.title = this.$element.attr('title');
            }

            if (this.options.selectedTextFormat == 'static') {
                title = this.options.title;
            }
            //If we dont have a title, then use the default, or if nothing is set at all, use the not selected text
            if (!title) {
                title = typeof this.options.title !== 'undefined' ? this.options.title : this.options.noneSelectedText;
            }
            var content = !this.multiple ? selectedItems[0] && selectedItems[0].content || this.options.noneSelectOption : ($.map(selectedItems, function(el) {
                return el.content
            })).join(this.options.multipleSeparator) || this.options.noneSelectOption;

            this.$button.attr('title', htmlEscape(title));
            this.$button.find('.filter-option').html(content);

            this.$element.trigger('rendered.bs.select');
        },

        /**
         * @param [style]
         * @param [status]
         */
        setStyle: function(style, status) {
            if (this.$element.attr('class')) {
                this.$newElement.addClass((" " + this.$element.attr('class')).replace(/selectpicker|mobile-device|(\s+sr-only)|validate\[.*\]/gi, ''));
            }

            if (this.options.wrapperClassName) {
                this.$newElement.addClass(this.options.wrapperClassName);
            }

            var buttonClass = style ? style : this.options.style;

            if (status == 'add') {
                this.$button.addClass(buttonClass);
            } else if (status == 'remove') {
                this.$button.removeClass(buttonClass);
            } else {
                this.$button.removeClass(this.options.style);
                this.$button.addClass(buttonClass);
            }
        },

        liHeight: function() {
            if (this.options.size === false) return;

            var $selectClone = this.$menu.parent().clone().find('> .dropdown-toggle').prop('autofocus', false).end().appendTo('body'),
                $menuClone = $selectClone.addClass('open').find('> .dropdown-menu'),
                liHeight = $menuClone.find('li').not('.divider').not('.dropdown-header').filter(':visible').children('a').outerHeight(),
                headerHeight = this.options.header ? $menuClone.find('.popover-title').outerHeight() : 0,
                searchHeight = this.options.liveSearch ? $menuClone.find('.bs-searchbox').outerHeight() : 0,
                actionsHeight = this.options.actionsBox ? $menuClone.find('.bs-actionsbox').outerHeight() : 0;

            $selectClone.remove();

            this.$newElement
                .data('liHeight', liHeight)
                .data('headerHeight', headerHeight)
                .data('searchHeight', searchHeight)
                .data('actionsHeight', actionsHeight);
        },

        setSize: function() {
            this.findLis();
            var that = this,
                menu = this.$menu,
                menuInner = this.$menuInner,
                selectHeight = this.$newElement.outerHeight(),
                liHeight = this.$newElement.data('liHeight'),
                headerHeight = this.$newElement.data('headerHeight'),
                searchHeight = this.$newElement.data('searchHeight'),
                actionsHeight = this.$newElement.data('actionsHeight'),
                divHeight = this.$lis.filter('.divider').outerHeight(true),
                menuPadding = parseInt(menu.css('padding-top')) +
                parseInt(menu.css('padding-bottom')) +
                parseInt(menu.css('border-top-width')) +
                parseInt(menu.css('border-bottom-width')),
                notDisabled = this.options.hideDisabled ? ', .disabled' : '',
                $window = $(window),
                menuExtras = menuPadding + parseInt(menu.css('margin-top')) + parseInt(menu.css('margin-bottom')) + 2,
                menuHeight,
                selectOffsetTop,
                selectOffsetBot,
                posVert = function() {
                    // JQuery defines a scrollTop function, but in pure JS it's a property
                    //noinspection JSValidateTypes
                    selectOffsetTop = that.$newElement.offset().top - $window.scrollTop();
                    selectOffsetBot = $window.height() - selectOffsetTop - selectHeight;
                };
            posVert();
            if (this.options.header) menu.css('padding-top', 0);

            if (this.options.size == 'auto') {
                var getSize = function() {
                    var minHeight,
                        lisVis = that.$lis.not('.hidden');

                    posVert();
                    menuHeight = selectOffsetBot - menuExtras;

                    if (that.options.dropupAuto) {
                        that.$newElement.toggleClass('dropup', (selectOffsetTop > selectOffsetBot) && ((menuHeight - menuExtras) < menu.height()));
                    }
                    if (that.$newElement.hasClass('dropup')) {
                        menuHeight = selectOffsetTop - menuExtras;
                    }

                    if ((lisVis.length + lisVis.filter('.dropdown-header').length) > 3) {
                        minHeight = liHeight * 3 + menuExtras - 2;
                    } else {
                        minHeight = 0;
                    }

                    menu.css({
                        'max-height': menuHeight + 'px',
                        'overflow': 'hidden',
                        'min-height': minHeight + headerHeight + searchHeight + actionsHeight + 'px'
                    });
                    menuInner.css({
                        'max-height': menuHeight - headerHeight - searchHeight - actionsHeight - menuPadding + 'px',
                        'overflow-y': 'auto',
                        'min-height': Math.max(minHeight - menuPadding, 0) + 'px'
                    });
                };
                getSize();
                this.$searchbox.off('input.getSize propertychange.getSize').on('input.getSize propertychange.getSize', getSize);
                $(window).off('resize.getSize').on('resize.getSize', getSize);
                $(window).off('scroll.getSize').on('scroll.getSize', getSize);
            } else if (this.options.size && this.options.size != 'auto' && menu.find('li' + notDisabled).length > this.options.size) {
                var optIndex = this.$lis.not('.divider' + notDisabled).find(' > *').slice(0, this.options.size).last().parent().index();
                var divLength = this.$lis.slice(0, optIndex + 1).filter('.divider').length;
                menuHeight = liHeight * this.options.size + divLength * divHeight + menuPadding;
                if (that.options.dropupAuto) {
                    //noinspection JSUnusedAssignment
                    this.$newElement.toggleClass('dropup', (selectOffsetTop > selectOffsetBot) && (menuHeight < menu.height()));
                }
                menu.css({
                    'max-height': menuHeight + headerHeight + searchHeight + actionsHeight + 'px',
                    'overflow': 'hidden'
                });
                menuInner.css({
                    'max-height': menuHeight - menuPadding + 'px',
                    'overflow-y': 'auto'
                });
            }
        },

        setWidth: function() {
            if (this.options.width == 'auto') {
                this.$menu.css('min-width', '0');

                // Get correct width if element hidden
                var selectClone = this.$newElement.clone().appendTo('body');
                var ulWidth = selectClone.find('> .dropdown-menu').css('width');
                var btnWidth = selectClone.css('width', 'auto').find('> button').css('width');
                selectClone.remove();

                // Set width to whatever's larger, button title or longest option
                this.$newElement.css('width', Math.max(parseInt(ulWidth), parseInt(btnWidth)) + 'px');
            } else if (this.options.width == 'fit') {
                // Remove inline min-width so width can be changed from 'auto'
                this.$menu.css('min-width', '');
                this.$newElement.css('width', '').addClass('fit-width');
            } else if (this.options.width) {
                // Remove inline min-width so width can be changed from 'auto'
                this.$menu.css('min-width', '');
                this.$newElement.css('width', this.options.width);
            } else {
                // Remove inline min-width/width so width can be changed
                this.$menu.css('min-width', '');
                this.$newElement.css('width', '');
            }
            // Remove fit-width class if width is changed programmatically
            if (this.$newElement.hasClass('fit-width') && this.options.width !== 'fit') {
                this.$newElement.removeClass('fit-width');
            }
        },

        selectPosition: function() {
            this.$bsContainer = $('<div class="bs-container" />');

            var that = this,
                pos,
                actualHeight,
                getPlacement = function($element) {
                    that.$bsContainer.addClass($element.attr('class').replace(/form-control|fit-width/gi, '')).toggleClass('dropup', $element.hasClass('dropup'));
                    pos = $element.offset();
                    actualHeight = $element.hasClass('dropup') ? 0 : $element[0].offsetHeight;
                    that.$bsContainer.css({
                        'top': pos.top + actualHeight,
                        'left': pos.left,
                        'width': $element[0].offsetWidth
                    });
                };

            this.$button.on('click', function() {
                var $this = $(this);

                if (that.isDisabled()) {
                    return;
                }

                getPlacement(that.$newElement);

                that.$bsContainer
                    .appendTo(that.options.container)
                    .toggleClass('open', !$this.hasClass('open'))
                    .append(that.$menu);
            });

            $(window).on('resize scroll', function() {
                getPlacement(that.$newElement);
            });

            this.$element.on('hide.bs.select', function() {
                that.$menu.data('height', that.$menu.height());
                that.$bsContainer.detach();
            });
        },

        setSelected: function(index, selected) {
            this.findLis();
            this.$lis.filter('[data-original-index="' + index + '"]').toggleClass('selected', selected);
        },

        setDisabled: function(index, disabled) {
            this.findLis();
            if (disabled) {
                this.$lis.filter('[data-original-index="' + index + '"]').addClass('disabled').find('a').attr('href', '#').attr('tabindex', -1);
            } else {
                this.$lis.filter('[data-original-index="' + index + '"]').removeClass('disabled').find('a').removeAttr('href').attr('tabindex', 0);
            }
        },

        isDisabled: function() {
            return this.$element.is(':disabled');
        },

        checkDisabled: function() {
            var that = this;

            if (this.isDisabled()) {
                this.$button.addClass('disabled').attr('tabindex', -1);
            } else {
                if (this.$button.hasClass('disabled')) {
                    this.$button.removeClass('disabled');
                }

                if (this.$button.attr('tabindex') == -1 && !this.$element.data('tabindex')) {
                    this.$button.removeAttr('tabindex');
                }

            }

            this.$button.click(function() {
                return !that.isDisabled();
            });
        },

        tabIndex: function() {
            if (this.$element.data('tabindex') !== this.$element.attr('tabindex') &&
                (this.$element.attr('tabindex') !== -98 && this.$element.attr('tabindex') !== '-98')) {
                this.$element.data('tabindex', this.$element.attr('tabindex'));
                this.$button.attr('tabindex', this.$element.data('tabindex'));
            }

            this.$element.attr('tabindex', -98);
        },

        clickListener: function() {
            var that = this,
                $document = $(document);


            this.$newElement.on('touchstart.dropdown', '.dropdown-menu', function(e) {
                e.stopPropagation();
            });

            $document.data('spaceSelect', false);

            this.$button.on('keyup', function(e) {
                if (/(32)/.test(e.keyCode.toString(10)) && $document.data('spaceSelect')) {
                    e.preventDefault();
                    $document.data('spaceSelect', false);
                }
            });

            this.$button.on('click', function() {
                that.setSize();
            });

            this.$element.on('shown.bs.select', function() {
                if (!that.options.liveSearch && !that.multiple) {
                    that.$menuInner.find('.selected a').focus();
                } else if (!that.multiple) {
                    // var selectedIndex = that.liObj[that.$element[0].selectedIndex];

                    // if (typeof selectedIndex !== 'number' || that.options.size === false) return;

                    // // scroll to selected option
                    // var offset = that.$lis.eq(selectedIndex)[0].offsetTop - that.$menuInner[0].offsetTop;
                    // offset = offset - that.$menuInner[0].offsetHeight/2 + that.sizeInfo.liHeight/2;
                    // that.$menuInner[0].scrollTop = offset;
                }
            });


            // original 
            // original change option, and refresh
            // search with source
            // search with html
            // cache data 
            // orginal data
            // 

            this.$menuInner.on('click', 'li a', function(e) {
                that.$lis = null;
                var $this = $(this),
                    clickedIndex = $this.parent().data('originalIndex'),
                    prevValue = that.$element.val(),
                    prevIndex = that.$element.prop('selectedIndex');

                // Don't close on multi choice menu
                if (that.multiple) {
                    e.stopPropagation();
                }

                e.preventDefault();

                //Don't run if we have been disabled
                if (!that.isDisabled() && !$this.parent().hasClass('disabled')) {
                    // var optionsData = that.getCacheDomData();

                    var $options = that.$element.find('option'),
                        $option = $options.eq(clickedIndex),

                        state = $option.prop('selected'),
                        $optgroup = $option.parent('optgroup'),
                        maxOptions = that.options.maxOptions,
                        maxOptionsGrp = $optgroup.data('maxOptions') || false;

                    if (!that.multiple) { // Deselect all others if not multi select box

                        $options.prop('selected', false);
                        $option.prop('selected', true);
                        that.$menuInner.find('.selected').removeClass('selected');
                        that.setSelected(clickedIndex, true);
                    } else { // Toggle the one we have chosen if we are multi select.
                        $option.prop('selected', !state);
                        that.setSelected(clickedIndex, !state);
                        $this.blur();

                        if (maxOptions !== false || maxOptionsGrp !== false) {

                            var maxReached = maxOptions < $options.filter(':selected').length,
                                maxReachedGrp = maxOptionsGrp < $optgroup.find('option:selected').length;

                            if ((maxOptions && maxReached) || (maxOptionsGrp && maxReachedGrp)) {
                                if (maxOptions && maxOptions == 1) {

                                    $options.prop('selected', false);
                                    $option.prop('selected', true);
                                    that.$menuInner.find('.selected').removeClass('selected');
                                    that.setSelected(clickedIndex, true);
                                } else if (maxOptionsGrp && maxOptionsGrp == 1) {

                                    $optgroup.find('option:selected').prop('selected', false);
                                    $option.prop('selected', true);

                                    var optgroupID = $this.parent().data('optgroup'); // option.optgroupId;

                                    that.$menuInner.find('[data-optgroup="' + optgroupID + '"]').removeClass('selected');

                                    that.setSelected(clickedIndex, true);
                                } else {
                                    var maxOptionsArr = (typeof that.options.maxOptionsText === 'function') ?
                                        that.options.maxOptionsText(maxOptions, maxOptionsGrp) : that.options.maxOptionsText,
                                        maxTxt = maxOptionsArr[0].replace('{n}', maxOptions),
                                        maxTxtGrp = maxOptionsArr[1].replace('{n}', maxOptionsGrp),
                                        $notify = $('<div class="notify"></div>');
                                    // If {var} is set in array, replace it
                                    /** @deprecated */
                                    if (maxOptionsArr[2]) {
                                        maxTxt = maxTxt.replace('{var}', maxOptionsArr[2][maxOptions > 1 ? 0 : 1]);
                                        maxTxtGrp = maxTxtGrp.replace('{var}', maxOptionsArr[2][maxOptionsGrp > 1 ? 0 : 1]);
                                    }

                                    $option.prop('selected', false);

                                    that.$menu.append($notify);

                                    if (maxOptions && maxReached) {
                                        $notify.append($('<div>' + maxTxt + '</div>'));
                                        that.$element.trigger('maxReached.bs.select');
                                    }

                                    if (maxOptionsGrp && maxReachedGrp) {
                                        $notify.append($('<div>' + maxTxtGrp + '</div>'));
                                        that.$element.trigger('maxReachedGrp.bs.select');
                                    }

                                    setTimeout(function() {
                                        that.setSelected(clickedIndex, false);
                                    }, 10);

                                    $notify.delay(750).fadeOut(300, function() {
                                        $(this).remove();
                                    });
                                }
                            }
                        }
                    }

                    if (!that.multiple) {
                        that.$button.focus();
                    } else if (that.options.liveSearch) {
                        that.$searchbox.focus();
                    }


                    that.setCacheDomData(); // update select status

                    // Trigger select 'change'
                    if ((prevValue != that.$element.val() && that.multiple) || (prevIndex != that.$element.prop('selectedIndex') && !that.multiple)) {
                        // $option.prop('selected') is current option state (selected/unselected). state is previous option state.
                        that.$element
                            .trigger('changed.bs.select', [clickedIndex, $option.prop('selected'), state])
                            .triggerNative('change');
                    }

                }
            });

            this.$menu.on('click', 'li.disabled a, .popover-title, .popover-title :not(.close)', function(e) {
                if (e.currentTarget == this) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (that.options.liveSearch && !$(e.target).hasClass('close')) {
                        that.$searchbox.focus();
                    } else {
                        that.$button.focus();
                    }
                }
            });


            this.$menuInner.on('click', '.divider, .dropdown-header', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (that.options.liveSearch) {
                    that.$searchbox.focus();
                } else {
                    that.$button.focus();
                }
            });


            this.$menu.on('click', '.popover-title .close', function() {
                that.$button.click();
            });


            this.$searchbox.on('click', function(e) {
                e.stopPropagation();
            });


            this.$menu.on('click', '.actions-btn', function(e) {
                if (that.options.liveSearch) {
                    that.$searchbox.focus();
                } else {
                    that.$button.focus();
                }

                e.preventDefault();
                e.stopPropagation();

                if ($(this).hasClass('bs-select-all')) {
                    that.selectAll();
                } else {
                    that.deselectAll();
                }

                that.$element.change();
            });

            this.$element.change(function() {
                that.render(false);
            });
        },

        liveSearchListener: function() {
          var that = this,
              $no_results = $('<li class="no-results"></li>');

            this.$button.on('click.dropdown.data-api touchstart.dropdown.data-api', function() {
                that.$menuInner.find('.active').removeClass('active');
                if (!!that._value()) {
                    that._value('');
                    that.$lis.not('.is-hidden').removeClass('hidden');
                    if (!!$no_results.parent().length) $no_results.remove();
                }
                if (!that.multiple) that.$menuInner.find('.selected').addClass('active');
                setTimeout(function() {
                    that.$searchbox.focus();
                }, 10);
            });

            this.$searchbox.on('click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api', function(e) {
                e.stopPropagation();
            });

            this.$searchbox.on('input propertychange', function(event) {

                if(!that.defaultLiveSearch){
                    if (that._value()) {
                        that._searchTimeout(event);
                    } else {
                        that._resetLi();
                    }
                } else {
                    if (that._value()) {
                      var $searchBase = that.$lis.not('.is-hidden').removeClass('hidden').children('a');
                      if (that.options.liveSearchNormalize) {
                        $searchBase = $searchBase.not(':a' + that._searchStyle() + '("' + normalizeToBase(that._value()) + '")');
                      } else {
                        $searchBase = $searchBase.not(':' + that._searchStyle() + '("' + that._value() + '")');
                      }
                      $searchBase.parent().addClass('hidden');

                      that.$lis.filter('.dropdown-header').each(function () {
                        var $this = $(this),
                            optgroup = $this.data('optgroup');

                        if (that.$lis.filter('[data-optgroup=' + optgroup + ']').not($this).not('.hidden').length === 0) {
                          $this.addClass('hidden');
                          that.$lis.filter('[data-optgroup=' + optgroup + 'div]').addClass('hidden');
                        }
                      });

                      var $lisVisible = that.$lis.not('.hidden');

                      // hide divider if first or last visible, or if followed by another divider
                      $lisVisible.each(function (index) {
                        var $this = $(this);

                        if ($this.hasClass('divider') && (
                          $this.index() === $lisVisible.first().index() ||
                          $this.index() === $lisVisible.last().index() ||
                          $lisVisible.eq(index + 1).hasClass('divider'))) {
                          $this.addClass('hidden');
                        }
                      });

                      if (!that.$lis.not('.hidden, .no-results').length) {
                        if (!!$no_results.parent().length) {
                          $no_results.remove();
                        }
                        $no_results.html(that.options.noneResultsText.replace('{0}', '"' + htmlEscape(that.$searchbox.val()) + '"')).show();
                        that.$menuInner.append($no_results);
                      } else if (!!$no_results.parent().length) {
                        $no_results.remove();
                      }
                    } else {
                      that.$lis.not('.is-hidden').removeClass('hidden');
                      if (!!$no_results.parent().length) {
                        $no_results.remove();
                      }
                    }

                    that.$lis.filter('.active').removeClass('active');
                    if (that.$searchbox.val()) that.$lis.not('.hidden, .divider, .dropdown-header').eq(0).addClass('active').children('a').focus();
                    $(this).focus();
                }
            });

            if (this.options.sourceLoadMore) {
                // support loadmore.
                this.$menuInner.on('scroll.selectpicker.dropdown.menu', function(e) {
                    var menu = this;
                    if (menu.scrollHeight - (menu.offsetHeight + menu.scrollTop) < 10) {
                        that.getMoreSource();
                    }
                });
            }

        },
        _searchStyle: function() {
            var styles = {
                begins: 'ibegins',
                startsWith: 'ibegins'
            };

            return styles[this.options.liveSearchStyle] || 'icontains';
        },
        val: function(value) {
            if (typeof value !== 'undefined') {
                this.$element.val(value);
                this.render();

                return this.$element;
            } else {
                return this.$element.val();
            }
        },

        changeAll: function(status) {
            if (typeof status === 'undefined') status = true;

            this.findLis();

            var $options = this.$element.find('option'),
                $lisVisible = this.$lis.not('.divider, .dropdown-header, .disabled, .hidden').toggleClass('selected', status),
                lisVisLen = $lisVisible.length,
                selectedOptions = [];

            for (var i = 0; i < lisVisLen; i++) {
                var origIndex = $lisVisible[i].getAttribute('data-original-index');
                selectedOptions[selectedOptions.length] = $options.eq(origIndex)[0];
            }

            $(selectedOptions).prop('selected', status);

            this.render(false);

            this.$element
                .trigger('changed.bs.select')
                .triggerNative('change');
        },
        selectAll: function() {
            return this.changeAll(true);
        },

        deselectAll: function() {
            return this.changeAll(false);
        },
        toggle: function(e) {
            e = e || window.event;
            if (e) e.stopPropagation();
            this.$button.trigger('click');
        },
        keydown: function(e) {
            var $this = $(this),
                $parent = $this.is('input') ? $this.parent().parent() : $this.parent(),
                $items,
                that = $parent.data('this'),
                index,
                next,
                first,
                last,
                prev,
                nextPrev,
                prevIndex,
                isActive,
                selector = ':not(.disabled, .hidden, .dropdown-header, .divider)',
                keyCodeMap = {
                    32: ' ',
                    48: '0',
                    49: '1',
                    50: '2',
                    51: '3',
                    52: '4',
                    53: '5',
                    54: '6',
                    55: '7',
                    56: '8',
                    57: '9',
                    59: ';',
                    65: 'a',
                    66: 'b',
                    67: 'c',
                    68: 'd',
                    69: 'e',
                    70: 'f',
                    71: 'g',
                    72: 'h',
                    73: 'i',
                    74: 'j',
                    75: 'k',
                    76: 'l',
                    77: 'm',
                    78: 'n',
                    79: 'o',
                    80: 'p',
                    81: 'q',
                    82: 'r',
                    83: 's',
                    84: 't',
                    85: 'u',
                    86: 'v',
                    87: 'w',
                    88: 'x',
                    89: 'y',
                    90: 'z',
                    96: '0',
                    97: '1',
                    98: '2',
                    99: '3',
                    100: '4',
                    101: '5',
                    102: '6',
                    103: '7',
                    104: '8',
                    105: '9'
                };

            if (that.options.liveSearch) $parent = $this.parent().parent();

            if (that.options.container) $parent = that.$menu;

            $items = $('[role=menu] li', $parent);

            isActive = that.$newElement.hasClass('open');

            if (!isActive && (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 65 && e.keyCode <= 90)) {
                if (!that.options.container) {
                    that.setSize();
                    that.$menu.parent().addClass('open');
                    isActive = true;
                } else {
                    that.$button.trigger('click');
                }
                that.$searchbox.focus();
            }

            if (that.options.liveSearch) {
                if (/(^9$|27)/.test(e.keyCode.toString(10)) && isActive && that.$menu.find('.active').length === 0) {
                    e.preventDefault();
                    that.$menu.parent().removeClass('open');
                    if (that.options.container) that.$newElement.removeClass('open');
                    that.$button.focus();
                }
                // $items contains li elements when liveSearch is enabled
                $items = $('[role=menu] li' + selector, $parent);
                if (!$this.val() && !/(38|40)/.test(e.keyCode.toString(10))) {
                    if ($items.filter('.active').length === 0) {
                        $items = that.$menuInner.find('li');
                        if (that.options.liveSearchNormalize) {
                            $items = $items.filter(':a' + that._searchStyle() + '(' + normalizeToBase(keyCodeMap[e.keyCode]) + ')');
                        } else {
                            $items = $items.filter(':' + that._searchStyle() + '(' + keyCodeMap[e.keyCode] + ')');
                        }
                    }
                }
            }

            if (!$items.length) return;
            if (/(38|40)/.test(e.keyCode.toString(10))) {
                index = $items.index($items.find('a').filter(':focus').parent());
                first = $items.filter(selector).first().index();
                last = $items.filter(selector).last().index();
                next = $items.eq(index).nextAll(selector).eq(0).index();
                prev = $items.eq(index).prevAll(selector).eq(0).index();
                nextPrev = $items.eq(next).prevAll(selector).eq(0).index();

                if (that.options.liveSearch) {
                    $items.each(function(i) {
                        if (!$(this).hasClass('disabled')) {
                            $(this).data('index', i);
                        }
                    });
                    index = $items.index($items.filter('.active'));
                    first = $items.first().data('index');
                    last = $items.last().data('index');
                    next = $items.eq(index).nextAll().eq(0).data('index');
                    prev = $items.eq(index).prevAll().eq(0).data('index');
                    nextPrev = $items.eq(next).prevAll().eq(0).data('index');
                }

                prevIndex = $this.data('prevIndex');

                if (e.keyCode == 38) {
                    if (that.options.liveSearch) index--;
                    if (index != nextPrev && index > prev) index = prev;
                    if (index < first) index = first;
                    if (index == prevIndex) index = last;
                } else if (e.keyCode == 40) {
                    if (that.options.liveSearch) index++;
                    if (index == -1) index = 0;
                    if (index != nextPrev && index < next) index = next;
                    if (index > last) index = last;
                    if (index == prevIndex) index = first;
                }

                $this.data('prevIndex', index);

                if (!that.options.liveSearch) {
                    $items.eq(index).children('a').focus();
                } else {
                    e.preventDefault();
                    if (!$this.hasClass('dropdown-toggle')) {
                        $items.removeClass('active').eq(index).addClass('active').children('a').focus();
                        $this.focus();
                    }
                }

            } else if (!$this.is('input')) {
                var keyIndex = [],
                    count,
                    prevKey;

                $items.each(function() {
                    if (!$(this).hasClass('disabled')) {
                        if ($.trim($(this).children('a').text().toLowerCase()).substring(0, 1) == keyCodeMap[e.keyCode]) {
                            keyIndex.push($(this).index());
                        }
                    }
                });

                count = $(document).data('keycount');
                count++;
                $(document).data('keycount', count);

                prevKey = $.trim($(':focus').text().toLowerCase()).substring(0, 1);

                if (prevKey != keyCodeMap[e.keyCode]) {
                    count = 1;
                    $(document).data('keycount', count);
                } else if (count >= keyIndex.length) {
                    $(document).data('keycount', 0);
                    if (count > keyIndex.length) count = 1;
                }

                $items.eq(keyIndex[count - 1]).children('a').focus();
            }
            // Select focused option if "Enter", "Spacebar" or "Tab" (when selectOnTab is true) are pressed inside the menu.
            if ((/(13|32)/.test(e.keyCode.toString(10)) || (/(^9$)/.test(e.keyCode.toString(10)) && that.options.selectOnTab)) && isActive) {
                if (!/(32)/.test(e.keyCode.toString(10))) e.preventDefault();
                if (!that.options.liveSearch) {
                    var elem = $(':focus');
                    elem.click();
                    // Bring back focus for multiselects
                    elem.focus();
                    // Prevent screen from scrolling if the user hit the spacebar
                    e.preventDefault();
                    // Fixes spacebar selection of dropdown items in FF & IE
                    $(document).data('spaceSelect', true);
                } else if (!/(32)/.test(e.keyCode.toString(10))) {
                    that.$menuInner.find('.active a').click();
                    $this.focus();
                }
                $(document).data('keycount', 0);
            }


            if ((/(^9$|27)/.test(e.keyCode.toString(10)) && isActive && (that.multiple || that.options.liveSearch)) || (/(27)/.test(e.keyCode.toString(10)) && !isActive)) {
                that.$menu.parent().removeClass('open');
                if (that.options.container) that.$newElement.removeClass('open');
                that.$button.focus();
            }
        },

        mobile: function() {
            this.$element.addClass('mobile-device').appendTo(this.$newElement);
            if (this.options.container) this.$menu.hide();
        },

        refresh: function() {
            this.$lis = null;

            this.setCacheDomData();
            this.reloadLi();
            this.render();
            this.setWidth();
            this.setStyle();
            this.checkDisabled();
            this.liHeight();

            if (this.$lis) this.$searchbox.trigger('propertychange');

            this.$element.trigger('refreshed.bs.select');

        },

        update: function() {
            this.setCacheDomData();
            this.reloadLi();
            this.setWidth();
            this.setStyle();
            this.checkDisabled();
            this.liHeight();
        },

        hide: function() {
            this.$newElement.hide();
        },

        show: function() {
            this.$newElement.show();
        },

        remove: function() {
            this.$newElement.remove();
            this.$element.remove();
        },

        destroy: function() {
            this.$newElement.before(this.$element).remove();

            if (this.$bsContainer) {
                this.$bsContainer.remove();
            } else {
                this.$menu.remove();
            }
            this.$element
                .off('.bs.select')
                .removeData('selectpicker')
                .removeClass('bs-select-hidden selectpicker sr-only');
        }
    };

    // SELECTPICKER PLUGIN DEFINITION
    // ==============================
    function Plugin(option, event) {
        // get the args of the outer function..
        var args = arguments;
        // The arguments of the function are explicitly re-defined from the argument list, because the shift causes them
        // to get lost/corrupted in android 2.3 and IE9 #715 #775
        var _option = option,
            _event = event;
        [].shift.apply(args);

        var value;
        var chain = this.each(function() {
            var $this = $(this);
            if ($this.is('select')) {
                var data = $this.data('selectpicker'),
                    options = typeof _option == 'object' && _option;

                if (!data) {
                    var config = $.extend({}, Selectpicker.DEFAULTS, $.fn.selectpicker.defaults || {}, $this.data(), options, {
                        mobile: $('html').hasClass('mobile')
                    });
                    config.template = $.extend({}, Selectpicker.DEFAULTS.template, ($.fn.selectpicker.defaults ? $.fn.selectpicker.defaults.template : {}), $this.data().template, options.template);
                    $this.data('selectpicker', (data = new Selectpicker(this, config, _event)));
                } else if (options) {
                    for (var i in options) {
                        if (options.hasOwnProperty(i)) {
                            data.options[i] = options[i];
                        }
                    }
                }

                if (typeof _option == 'string') {
                    if (data[_option] instanceof Function) {
                        value = data[_option].apply(data, args);
                    } else {
                        value = data.options[_option];
                    }
                }
            }
        });

        if (typeof value !== 'undefined') {
            //noinspection JSUnusedAssignment
            return value;
        } else {
            return chain;
        }
    }

    var old = $.fn.selectpicker;
    $.fn.selectpicker = Plugin;
    $.fn.selectpicker.Constructor = Selectpicker;

    // SELECTPICKER NO CONFLICT
    // ========================
    $.fn.selectpicker.noConflict = function() {
        $.fn.selectpicker = old;
        return this;
    };

    $(document)
        .data('keycount', 0)
        .on('keydown.bs.select', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="menu"], .bs-searchbox input', Selectpicker.prototype.keydown)
        .on('focusin.modal', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="menu"], .bs-searchbox input', function(e) {
            e.stopPropagation();
        });
    window.Selectpicker = Selectpicker;
    // SELECTPICKER DATA-API
    // =====================
    $(window).on('load.bs.select.data-api', function() {
        $('.selectpicker').each(function() {
            var $selectpicker = $(this);
            Plugin.call($selectpicker, $selectpicker.data());
        })
    });
})(jQuery);

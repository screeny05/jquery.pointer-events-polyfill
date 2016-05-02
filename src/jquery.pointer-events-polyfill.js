/**
 * CSS pointer-events polyfill
 * Adds support for `pointer-events: none;` for browsers not supporting this property
 * Requires jQuery@>1.7
 *
 * @copyright Sebastian Langer 2016
 * @license MIT
 * @author Sebastian Langer <sl@scn.cx>
 */
(function($){
    /**
     * Polyfill main-method
     * @param  {object} userOptions override default options
     */
    var Polyfill = function(userOptions){
        this.options = $.extend({}, Polyfill.defaultOptions, userOptions);

        if(this.options.forcePolyfill || this.supportsPointerEvents()){
            this.registerEvents();
        }
    };

    Polyfill.defaultOptions = {
        forcePolyfill: false,
        selector: '*',
        listenOn: ['click', 'dblclick', 'mousedown', 'mouseup'],
        pointerEventsNoneClass: null,
        pointerEventsAllClass: null
    };

    /**
     * registers events needed for the polyfill to work properly
     */
    Polyfill.prototype.registerEvents = function(){
        $(document).on(this.options.listenOn.join(' '), this.options.selector, $.proxy(this.onElementClick, this));
    };

    /**
     * detects support for css pointer-events
     * stolen from modernizr - https://github.com/Modernizr/Modernizr/blob/1f8af59/feature-detects/css/pointerevents.js
     * @return {boolean} indicates support
     */
    Polyfill.prototype.supportsPointerEvents = function(){
        var style = document.createElement('a').style;
        style.cssText = 'pointer-events:auto';
        return style.pointerEvents === 'auto';
    };

    /**
     * recursively checks parent nodes if they have a pointer-events css-property
     * @param  {jQuery} $el element to test
     * @return {boolean}    indicates click-through-ability of the given element
     */
    Polyfill.prototype.isClickThrough = function($el){
        if($el.length === 0 || $el.is(':root') || $el.hasClass(this.options.pointerEventsAllClass) || $el.css('pointer-events') === 'all'){
            return false;
        }
        if($el.hasClass(this.options.pointerEventsNoneClass) || $el.css('pointer-events') === 'none' || this.isClickThrough($el.parent())){
            return true;
        }
        return false;
    };

    /**
     * proxies click-through to underlying element if necessary
     * @param  {Event} e click-event
     * @return {boolean} preventDefault
     */
    Polyfill.prototype.onElementClick = function(e){
        var $elOrg = $(e.target);

        if(!this.isClickThrough($elOrg)){
            return true;
        }

        // retrieve element below the clicked one
        $elOrg.hide();
        var elBelow = document.elementFromPoint(e.clientX, e.clientY);

        // trigger the original element on the one below
        e.target = elBelow;
        $(elBelow).trigger(e);

        // restore clicked element
        $elOrg.show();

        return false;
    };

    /**
     * make polyfill available globally
     * @param  {object} userOptions override default options
     * @return {Polyfill}           polyfill-object
     */
    window.pointerEventsPolyfill = function(userOptions){
        return new Polyfill(userOptions);
    };
})(jQuery);

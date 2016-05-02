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
        clickthroughClass: false
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
     * detects whether or not the element allows click-through
     * @param  {jQuery} $el  element to test
     * @return {boolean}     indicates click-through-ability
     */
    Polyfill.prototype.isClickThrough = function($el){
        return $el.css('pointer-events') === 'none' || (this.options.clickthroughClass && $el.hasClass(this.options.clickthroughClass));
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

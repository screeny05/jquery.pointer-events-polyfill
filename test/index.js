describe('Polyfill Basics', function(){

    it('should be added when necessary', function(){
        var polyfill = window.pointerEventsPolyfill();
        expect(polyfill.isEnabled).to.equal(!polyfill.supportsPointerEvents());
        polyfill.destroy();
    });

    it('should be added when forced', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true });
        expect(polyfill.isEnabled).to.be.true;
        polyfill.destroy();
    });

    it('should add a dom-listener', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true });
        expect($._data(document, 'events').dblclick).to.exist;
        polyfill.destroy();
    });

    it('should be destroyable', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true });
        polyfill.destroy();
        expect(polyfill.isEnabled).to.be.false;
    });
});


describe('Polyfill Events', function(){

    it('should remove events on destroy', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true });
        polyfill.destroy();
        expect($._data(document, 'events')).to.be.empty;
    });

    it('should only destroy namespaced events', function(){
        var namespace = 'pointer-events-polyfill-namespace';
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true, eventNamespace: namespace });
        $(document).on('click.test', '*', function(){});
        expect($._data(document, 'events').click).to.have.lengthOf(2);
        polyfill.destroy();
        expect($._data(document, 'events').click).to.have.lengthOf(1);
        $(document).off('click.test');
        expect($._data(document, 'events')).to.be.empty;
    });

    it('should use the correct event-namespace', function(){
        var namespace = 'pointer-events-polyfill-namespace';
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true, eventNamespace: namespace });
        expect($._data(document, 'events').click[0].namespace).to.equal(namespace);
        polyfill.destroy();
    });

    it('should allow the use of no namespace', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true, eventNamespace: null });
        expect($._data(document, 'events').click).to.have.lengthOf(1);
        expect($._data(document, 'events').click[0].namespace).to.not.be.ok;
        $(document).off();
        expect($._data(document, 'events')).to.be.empty;
    });

    it('should subscribe to default events', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true });
        expect($._data(document, 'events')).to.have.all.keys(['click', 'dblclick', 'mousedown', 'mouseup']);
        polyfill.destroy();
    });

    it('should subscribe to custom events', function(){
        var customEvents = ['click', 'mousedown', 'mouseover'];
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true, listenOn: customEvents });
        expect($._data(document, 'events')).to.have.all.keys(customEvents);
        polyfill.destroy();
    });

    it('should subscribe to all elements by default', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true });
        expect($._data(document, 'events').click[0].selector).to.equal('*');
        polyfill.destroy();
    });

    it('should allow custom selectors', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true, selector: 'a' });
        expect($._data(document, 'events').click[0].selector).to.equal('a');
        polyfill.destroy();
    });
});


describe('Polyfill Clickthrough Detection', function(){

    it('should detect pointer-events:none css', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true });
        var $el = $('<div>', { css: { pointerEvents: 'none' } });
        expect(polyfill.isClickThrough($el)).to.be.true;
        polyfill.destroy();
    });

    it('should detect pointer-events:all css', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true });
        var $el = $('<div>', { css: { pointerEvents: 'all' } });
        expect(polyfill.isClickThrough($el)).to.be.false;
        polyfill.destroy();
    });

    it('should detect pointer-events:auto css', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true });
        var $el = $('<div>', { css: { pointerEvents: 'auto' } });
        expect(polyfill.isClickThrough($el)).to.be.false;
        polyfill.destroy();
    });

    it('should detect the pointerEventsNoneClass', function(){
        var cls = 'pointerEventsNone';
        var $el = $('<div>', { 'class': cls });
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true, pointerEventsNoneClass: cls });
        expect(polyfill.isClickThrough($el)).to.be.true;
        polyfill.destroy();
    });

    it('should detect the pointerEventsAllClass', function(){
        var cls = 'pointerEventsAll';
        var $el = $('<div>', { 'class': cls });
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true, pointerEventsAllClass: cls });
        expect(polyfill.isClickThrough($el)).to.be.false;
        polyfill.destroy();
    });

    it('should detect that plain elements are not clickthrough', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true });
        var $elTest = $('<div>');
        expect(polyfill.isClickThrough($elTest)).to.be.false;
        polyfill.destroy();
    });

    it('should detect that encapsulated plain elements are not clickthrough', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true });
        var $elParent = $('<div>');
        var $elTest = $('<div>').appendTo($elParent);
        expect(polyfill.isClickThrough($elTest)).to.be.false;
        polyfill.destroy();
    });

    it('should detect that dom-elements are not clickthrough per default', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true });
        var $fixture = $('#fixture');
        expect(polyfill.isClickThrough($fixture)).to.be.false;
        polyfill.destroy();
    });

    it('should detect that dom-elements inherit pointer-events:none', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true });
        var $fixture = $('#fixture');
        var $body = $('body');
        $body.css('pointer-events', 'none');
        expect(polyfill.isClickThrough($fixture)).to.be.true;
        $body.css('pointer-events', '');
        polyfill.destroy();
    });

    it('should detect that dom-elements inherit pointerEventsNoneClass', function(){
        var cls = 'pointerEventsNone';
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true, pointerEventsNoneClass: cls });
        var $fixture = $('#fixture');
        var $body = $('body');
        console.log($body);
        $body.addClass(cls);
        expect(polyfill.isClickThrough($fixture)).to.be.true;
        $body.removeClass(cls);
        polyfill.destroy();
    });

    it('should detect 1x encapsulated pointer-events:none elements', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true });
        var $elParent = $('<div>', { css: { pointerEvents: 'none' } });
        var $elTest = $('<div>').appendTo($elParent);
        expect(polyfill.isClickThrough($elTest)).to.be.true;
        polyfill.destroy();
    });

    it('should detect 1x encapsulated pointer-events:all elements', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true });
        var $elParent = $('<div>', { css: { pointerEvents: 'all' } });
        var $elTest = $('<div>').appendTo($elParent);
        expect(polyfill.isClickThrough($elTest)).to.be.false;
        polyfill.destroy();
    });

    it('should detect 2x encapsulated pointer-events:none elements', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true });
        var $elParent = $('<div>', { css: { pointerEvents: 'all' } });
        var $elTest = $('<div>', { css: { pointerEvents: 'none' } }).appendTo($elParent);
        expect(polyfill.isClickThrough($elTest)).to.be.true;
        polyfill.destroy();
    });

    it('should detect 2x encapsulated pointer-events:all elements', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true });
        var $elParent = $('<div>', { css: { pointerEvents: 'none' } });
        var $elTest = $('<div>', { css: { pointerEvents: 'all' } }).appendTo($elParent);
        expect(polyfill.isClickThrough($elTest)).to.be.false;
        polyfill.destroy();
    });

    it('should detect 3x encapsulated pointer-events:none elements', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true });
        var $elRoot = $('<div>', { css: { pointerEvents: 'all' } });
        var $elParent = $('<div>', { css: { pointerEvents: 'none' } }).appendTo($elRoot);
        var $elTest = $('<div>').appendTo($elParent);
        expect(polyfill.isClickThrough($elTest)).to.be.true;
        polyfill.destroy();
    });

    it('should detect 3x encapsulated pointer-events:all elements', function(){
        var polyfill = window.pointerEventsPolyfill({ forcePolyfill: true });
        var $elRoot = $('<div>', { css: { pointerEvents: 'none' } });
        var $elParent = $('<div>', { css: { pointerEvents: 'all' } }).appendTo($elRoot);
        var $elTest = $('<div>').appendTo($elParent);
        expect(polyfill.isClickThrough($elTest)).to.be.false;
        polyfill.destroy();
    });
});

describe('Polyfill Functionality', function(){

    it('should ')
});

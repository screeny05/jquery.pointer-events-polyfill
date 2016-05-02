# jQuery CSS Pointer-Events Polyfill

This piece of javascript is a tiny Polyfill which adds support for the css-property `pointer-events: none|all;` for browsers not supporting it.

The size of the minified script is ~1000 bytes (roughly 500 bytes gzipped).

*[`pointer-events` browser support](http://caniuse.com/#feat=pointer-events)*

## Dependencies

This Polyfill depends on jQuery `@ >1.9`.


## Usage

Include `jquery.pointer-events-polyfill.js` in your document, and call the polyfill like this:

```javascript
$(function(){
    window.pointerEventsPolyfill();
});
```

Now your page supports `pointer-events`!


## Available Options

You can call `window.pointerEventsPolyfill` with a couple of possibly useful options, namely:

* `selector` (jQuery-selector, default: `'*'`) - indicates which elements the polyfill should apply to.
* `listenOn` (Array, default: `['click', 'dblclick', 'mousedown', 'mouseup']`) - the events this plugin listens to. Excludes mouseover-events for performance, but you can add them yourself.
* `forcePolyfill` (Bool, default: `false`) - disregard the browsers support of `pointer-events` and force the polyfill to be added.
* `clickthroughClass` (String|Bool, default: `false`) - when truthy, add the polyfill to elements with this class, even when the elements css doesn't have the `pointer-events`-property set.


## Changelog

* 0.2.0 - change css-detection to use recursive traversion, detecting `pointer-events: none|all` on parent-elements
* 0.1.0 - initial version


## License

[MIT](LICENSE.md)


## Credits

Credits, where credits are due. This Polyfill is loosely based on @kmeworth's [pointer_events_polyfill](https://github.com/kmewhort/pointer_events_polyfill).

The reason for this package's existance is that the `pointer_events_polyfill` is seemingly unmaintained and no longer adheres to common jQuery-Plugin best practices. Also, this package is available on Bower & NPM.

**List of Contributors:**
* @kmeworth
* @mhmxs
* @raldred
* [Modernizr](https://github.com/Modernizr/Modernizr)
* and probably some more awesome people

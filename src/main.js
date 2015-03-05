!function() {
  'use strict';

  var bind,
      debounce,
      debug,
      embed,
      getParameter,
      main,
      memory,
      resize,
      setup,
      show,
      size;

  bind = function() {
    debug('bind');

    embed.addEventListener('load', show);

    window.addEventListener('orientationchange', debounce(resize));
    window.addEventListener('resize', debounce(resize));
  };

  debounce = function(action) {
    var timeoutId;

    return function() {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout.apply(window, [action, 1000].concat([ ].slice.call(arguments)));
    };
  };

  getParameter = function(name) {
    var pattern = new RegExp('.*(\\?|&)' + name + '=([^]*?)(&.*$|$)'),
        query = window.location.search;

    if (!pattern.test(query)) {
      return undefined;
    }

    return window.unescape(query.replace(pattern, '$2'));
  };

  main = function() {
    debug('main');

    setup();
    bind();
  };

  resize = function() {
    var scale = +Math.min(1, document.body.clientWidth / size).toPrecision(5),
        transform;

    debug('resize', arguments[0] ? 'triggered by ' + arguments[0].type : 'standalone call');
    debug('resize', 'available width', document.body.clientWidth);

    if (memory == scale) {
      debug('resize', 'skipped, still the same scale');

      return;
    }

    if (memory) {
      debug('resize', 'scale changed from ' + memory + ' to ' + scale);
    } else {
      debug('resize', 'scale set to ' + scale);
    }

    memory = scale;
    transform = 'matrix(' + scale + ', 0, 0, ' + scale + ', 0, 0)';

    embed.style.webkitTransform = transform;
    embed.style.msTransform = transform;
    embed.style.transform = transform;
  };

  setup = function() {
    var content = getParameter('content'),
        height = +getParameter('height'),
        width = +getParameter('width');

    debug('setup', 'content', content);
    debug('setup', 'height', height);
    debug('setup', 'width', width);

    if (!content) {
      throw 'third party content embed called without any url to load';
    }

    if (!height) {
      throw 'third party content embed called without a valid height';
    }

    if (!width) {
      throw 'third party content embed called without a valid width';
    }

    embed = document.createElement('iframe');
    size = width;

    embed.setAttribute('src', content);
    embed.setAttribute('width', width);
    embed.setAttribute('height', height);

    document.body.insertBefore(embed, document.body.firstElementChild);

    debug('setup', 'embed element created and inserted');
    resize();
  };

  debug = (function() {
    if (getParameter('debug') != 'true') {
      return function() { };
    }

    return function(signature) {
      console.debug.apply(console, ['third-party-content-embed::' + signature].concat([ ].slice.call(arguments, 1)));
    };
  })();

  document.addEventListener('DOMContentLoaded', main);
}();

!function() {
  'use strict';

  var bind,
      debounce,
      embed,
      getParameter,
      main,
      memory,
      resize,
      setup,
      show,
      size;

  bind = function() {
    embed.addEventListener('load', show);

    window.addEventListener('orientationchange', debounce(resize));
    window.addEventListener('resize', debounce(resize));
  };

  debounce = function(action) {
    var timeoutId;

    return function() {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(action, 100);
    };
  };

  getParameter = function(name) {
    var pattern = new RegExp('.*(\\?|&)' + name + '=([^]*?)(&.*$|$)'),
        query = window.location.search,
        value = window.unescape(query.replace(pattern, '$2'));

    return value;
  };

  main = function() {
    setup();
    bind();
  };

  resize = function() {
    var scale = +Math.min(1, document.body.clientWidth / size).toPrecision(5),
        transform;

    if (memory == scale) {
      return;
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
    embed.setAttribute('class', 'invisible');

    document.body.insertBefore(embed, document.body.firstElementChild);
    document.body.setAttribute('class', 'loading');
  };

  show = function() {
    resize();

    document.body.setAttribute('class', 'loaded');
    embed.removeAttribute('class');
  };

  document.addEventListener('DOMContentLoaded', main);
}();

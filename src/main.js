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
      size, 
      parseSearch;
      
      
      
  var TPCE_ARGS =   [
    'width', 
    'height', 
    'scrolling'
  ];
      
      
      
  parseSearch   =   function ()
  {
  
    var search  = window.location.search;
        search  =   search.split(/[?&]/);
        
    var data = {};
    
    search.forEach(function (value, index)
    {
        var tuple   =   value.split('=');
        
        if (tuple.length == 1) {
            return;
        }
        
        data[tuple[0]] = tuple[1];
    });
    
    TPCE_ARGS.forEach(function (attr)
    {
        if (data[attr]) {
            delete(data[attr])
        }
    });
    
    search = [    data.content    ];
    
    for (var i in data) {
        if (i == 'content') {
            continue;
        }
        
        search.push(i + '=' + data[i]);
    }
    
    search  =   search.join('&');
    search  =   search.replace('&', '?');
    search  =   search.replace(/%3A/i, ':');
    
    return (search);
  
  };

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

  setup = function() 
  {
    
    var referrer    =   (document.referrer || document.location.href), 
        hash        =   window.location.hash, 
        hash        =   (((hash.charAt(0) == '#') || (! hash.length)) ? (hash) : ('#' + hash)), 
        content     =   parseSearch(),
        scrolling   =   (getParameter('scrolling') || 'no'),
        height      =   +getParameter('height'),
        width       =   +getParameter('width');

    debug('setup', 'hash', content + hash);
    debug('setup', 'content', content);
    debug('setup', 'referrer', referrer);
    debug('setup', 'height', height);
    debug('setup', 'scrolling', scrolling);
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

    embed.setAttribute('src', content + hash);
    embed.setAttribute('width', width);
    embed.setAttribute('height', height);
    embed.setAttribute('scrolling', scrolling);
    embed.setAttribute('frameborder', 0);

    document.body.insertBefore(embed, document.body.firstElementChild);

    debug('setup', 'embed element created and inserted');
    resize();
  };

  debug = (function() {
    if (getParameter('debug') == 'true') {
      return function() { };
    }

    return function(signature) {
      console.debug.apply(console, ['third-party-content-embed::' + signature].concat([ ].slice.call(arguments, 1)));
    };
  })();

  document.addEventListener('DOMContentLoaded', main);
}();

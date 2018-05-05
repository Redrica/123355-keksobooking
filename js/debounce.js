'use strict';

(function () {
  var lastTimeout;

  window.debounce = function (action, debounceInt) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(action, debounceInt);
  };
})();

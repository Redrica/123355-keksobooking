'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking/data';
  window.load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.open('GET', URL);

    xhr.addEventListener('load', function () {
      onLoad(xhr.response);
    });

    xhr.send();


  }
})();

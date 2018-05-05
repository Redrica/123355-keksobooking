'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var MAX_PINS_NUMBER = 5;

  var mapPins = document.querySelector('.map__pins');
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  var createPins = function (index, data) {
    var pinElement = mapPinTemplate.cloneNode(true);
    pinElement.style = 'left: ' + (data.location.x - PIN_WIDTH / 2) + 'px; top: ' + (data.location.y - PIN_HEIGHT) + 'px;';
    pinElement.querySelector('img').alt = data.offer.title;
    pinElement.querySelector('img').src = data.author.avatar;
    pinElement.setAttribute('data-number', [index]);
    return pinElement;
  };

  var renderPins = function (data) {
    // var pinsNumber = data.length > MAX_PINS_NUMBER ? MAX_PINS_NUMBER : data.length;
    var pinsFragment = document.createDocumentFragment();
    // for (var i = 0; i < pinsNumber; i++) {

      for (var i = 0; i < data.length; i++) {


        pinsFragment.appendChild(createPins(i, data[i]));
    }
    mapPins.appendChild(pinsFragment);
  };

  window.pins = {
    mapPins: mapPins,
    renderPins: renderPins
  };
})();

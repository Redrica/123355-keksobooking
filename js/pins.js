'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var mapPins = document.querySelector('.map__pins');
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  var createPins = function (index) {
    var pinElement = mapPinTemplate.cloneNode(true);
    pinElement.style = 'left: ' + (window.data.declarationsList[index].location.x - PIN_WIDTH / 2) + 'px; top: ' + (window.data.declarationsList[index].location.y - PIN_HEIGHT) + 'px;';
    pinElement.querySelector('img').alt = window.data.declarationsList[index].offer.title;
    pinElement.querySelector('img').src = window.data.declarationsList[index].author.avatar;
    pinElement.setAttribute('data-number', [index]);
    return pinElement;
  };

  var renderPins = function () {
    var pinsFragment = document.createDocumentFragment();
    for (var i = 0; i < window.data.DECLARATIONS_QUANTITY; i++) {
      pinsFragment.appendChild(createPins(i));
    }
    mapPins.appendChild(pinsFragment);
  };

  window.pins = {
    mapPins: mapPins,
    renderPins: renderPins
  };
})();

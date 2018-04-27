'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mainPin = map.querySelector('.map__pin--main');




  window.util = {
    map: map,
    mapFiltersContainer: mapFiltersContainer,
    mainPin: mainPin
  }

})();

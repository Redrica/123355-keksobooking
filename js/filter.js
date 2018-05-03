'use strict';

(function () {
  var mapFiltersAll = window.util.mapFiltersContainer.querySelector('.map__filters');

  var dataFromServer = [];
  var filterData = {};


  var testData = function (loadedData) {
    dataFromServer = loadedData;
    window.pins.renderPins(loadedData);

    var dataFiltered = dataFromServer.filter(function (it) {
      return it.offer.type === filterData.type;
    });
    console.log('dataFiltered ' + dataFiltered);

    console.log(dataFiltered);

    var dataFiltered2 = dataFiltered.filter(function (it) {
      return it.offer.rooms === filterData.rooms;
    });

    while (window.util.mainPin.nextElementSibling) {
      window.pins.mapPins.removeChild(window.pins.mapPins.lastChild);
    }

    window.pins.renderPins(dataFiltered);
    console.log(dataFromServer);
    console.log('dataFiltered2 ' + dataFiltered2);
  };


  mapFiltersAll.addEventListener('change', function (evt) {
    var target = evt.target;
    while (target !== mapFiltersAll) {
      if (target.className === 'map__filter') {
        var formElements = mapFiltersAll.elements;
        filterData.type = formElements['housing-type'].value;
        filterData.price = formElements['housing-price'].value;
        filterData.rooms = formElements["housing-rooms"].value;
        filterData.guests = formElements['housing-guests'].value;

        console.log(filterData);
        window.backend.load(testData);
      }
      target = target.parentNode;
    }
  });

  console.log(dataFromServer);

  window.filter = {
    mapFiltersAll: mapFiltersAll
  }
})();

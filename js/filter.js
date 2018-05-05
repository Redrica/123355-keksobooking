'use strict';

(function () {
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;
  var DEBOUNCE_INT = 500;
  var SYMBOLS_TO_CROP = 7;
  var mapFiltersAll = window.util.mapFiltersContainer.querySelector('.map__filters');
  var formElements = mapFiltersAll.elements;
  var filterData = {};
  var filterFeatures = [];
  var filterFeaturesId = [];
  var FilterParam = {TYPE: 'type', ROOMS: 'rooms', GUESTS: 'guests'};


  var getFilterData = function () {
    filterFeatures = mapFiltersAll.querySelectorAll('input:checked');
    filterFeaturesId = Array.from(filterFeatures).map(function (it) {
      return it.id.substring(SYMBOLS_TO_CROP);
    });



    filterData.type = formElements['housing-type'].value;
    filterData.price = formElements['housing-price'].value;
    filterData.rooms = formElements['housing-rooms'].value;
    filterData.guests = formElements['housing-guests'].value;
    filterData.features = filterFeaturesId;

    return filterData;
  };

  var compareParam = function (it, param) {
    return filterData[param] === 'any' ? true : it.offer[param].toString() === filterData[param];
  };

  var comparePrice = function (it) {
    switch (filterData.price) {
      case 'middle':
        return it.offer.price >= LOW_PRICE && it.offer.price <= HIGH_PRICE;
      case 'low':
        return it.offer.price < LOW_PRICE;
      case 'high':
        return it.offer.price > HIGH_PRICE;
      default:
        return true;
    }
  };

  var compareFeatures = function (it) {
    var count = 0;
    for (var i = 0; i < filterFeaturesId.length; i++) {
      for (var j = 0; j < it.offer.features.length; j++) {
        if (filterFeaturesId[i] === it.offer.features[j]) {
          count++;
        }
      }
    }
    return count === filterFeaturesId.length;
  };

  var compareAll = function (it) {
    return compareParam(it, FilterParam.TYPE) && comparePrice(it) && compareParam(it, FilterParam.ROOMS) && compareParam(it, FilterParam.GUESTS) && compareFeatures(it);
  };

  var serverDataFiltered = [];

  // var renderFilteredPins = function (loadedData) {
  //   // window.dataFiltered = loadedData.filter(compareAll);
  //   serverDataFiltered = loadedData.filter(compareAll);
  //
  //   // window.pins.renderPins(window.dataFiltered);
  //   window.pins.renderPins(serverDataFiltered);
  //   console.log(serverDataFiltered);
  // };

  var renderFilteredPins = function () {

    serverDataFiltered = window.util.dataFromServer.filter(compareAll);
      window.pins.renderPins(serverDataFiltered);

      // вот здесь опять получается нулевой массив и я не понимаю, почему.
      // ведь данные уже получены и должны быть записаны в window.map.serverData

      console.log(serverDataFiltered);
      console.log(window.map.serverData);
  };

  var onFilterChange = function () {
    window.debounce(changeFilter, DEBOUNCE_INT);
  };

  var changeFilter = function () {
    console.log('Вывод изнутри функции смены фильтра filter');
    console.log(window.util.dataFromServer);


    window.card.declarationCard.classList.add('hidden');
    getFilterData();
    console.log(getFilterData());

    renderFilteredPins();


    // window.backend.load(renderFilteredPins, window.util.onErrorMessage);

    window.util.map.removeEventListener('click', window.card.onClickCardRender);
    window.util.map.addEventListener('click', window.card.onFilterCardRender);
  };

  console.log('Вывод из корня filter');
  console.log(window.util.dataFromServer);

  window.filter = {
    mapFiltersAll: mapFiltersAll,
    serverDataFiltered: serverDataFiltered,
    onFilterChange: onFilterChange
  };
})();

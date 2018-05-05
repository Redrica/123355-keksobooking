'use strict';

(function () {
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;
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

  window.filter = {
    mapFiltersAll: mapFiltersAll,
    getFilterData: getFilterData,
    compareAll: compareAll
  };
})();

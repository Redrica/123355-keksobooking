'use strict';

(function () {
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;
  var DEBOUNCE_INT = 500;
  var mapFiltersAll = window.util.mapFiltersContainer.querySelector('.map__filters');
  var formElements = mapFiltersAll.elements;
  var filterData = {};
  var filterFeatures = [];
  var filterFeaturesId = [];

  var getFilterData = function () {
    filterData.type = formElements['housing-type'].value;
    filterData.price = formElements['housing-price'].value;
    filterData.rooms = formElements['housing-rooms'].value;
    filterData.guests = formElements['housing-guests'].value;
    filterData.features = filterFeaturesId;
  };

  var compareType = function (it) {
    return filterData.type === 'any' ? true : it.offer.type === filterData.type;
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

  var compareRooms = function (it) {
    return filterData.rooms === 'any' ? true : it.offer.rooms.toString() === filterData.rooms;
  };

  var compareGuests = function (it) {
    return filterData.guests === 'any' ? true : it.offer.guests.toString() === filterData.guests;
  };

  var compareFeatures = function (it) {
    if ((it.offer.features.length === 0 && filterFeaturesId.length === 0) || filterFeaturesId.length === 0) {
      return true;
    } else if (it.offer.features.length === 0) {
      return false;
    }
    var on = 0;
    for (var i = 0; i < filterFeaturesId.length; i++) {
      for (var j = 0; j < it.offer.features.length; j++) {
        if (filterFeaturesId[i] === it.offer.features[j]) {
          on++;
        }
      }
    }
    return on === filterFeaturesId.length;
  };

  var compareAll = function (it) {
    return compareType(it) && comparePrice(it) && compareRooms(it) && compareGuests(it) && compareFeatures(it);
  };

  var renderFilteredPins = function (loadedData) {
    window.dataFiltered = loadedData.filter(compareAll);
    window.util.removePins(window.pins.mapPins);
    window.pins.renderPins(window.dataFiltered);
  };

  var onFilterChange = function () {
    window.util.debounce(changeFilter, DEBOUNCE_INT);
  };

  var changeFilter = function () {
    filterFeatures = mapFiltersAll.querySelectorAll('input:checked');
    filterFeaturesId = Array.from(filterFeatures).map(function (it) {
      return it.id.substring(7);
    });

    window.card.declarationCard.classList.add('hidden');
    getFilterData();
    window.backend.load(renderFilteredPins, window.util.onErrorMessage);

    window.util.map.removeEventListener('click', window.card.onClickCardRender);
    window.util.map.addEventListener('click', window.card.onFilterCardRender);
  };

  window.filter = {
    mapFiltersAll: mapFiltersAll,
    onFilterChange: onFilterChange
  };
})();

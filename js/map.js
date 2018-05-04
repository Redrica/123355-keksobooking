'use strict';

(function () {
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;
  var MAIN_PIN_ACTIVE_HEIGHT = 87;
  var MAIN_PIN_LEFT_COORD = 570;
  var MAIN_PIN_TOP_COORD = 375;
  var HALF_SIZE = 0.5;
  var MOVE_LIMITS = {top: 65, right: 1135, bottom: 625, left: 0};
  var mapFilter = window.util.mapFiltersContainer.querySelectorAll('.map__filter');
  var mapFeatures = window.util.mapFiltersContainer.querySelector('.map__features');
  var adForm = document.querySelector('.ad-form');
  var adFormHeader = adForm.querySelector('.ad-form-header');
  var adFormElement = adForm.querySelectorAll('.ad-form__element');
  var addressField = adForm.querySelector('[name=address]');
  var featureCheckbox = adForm.querySelectorAll('.feature__checkbox');

  var setDisabled = function () {
    Array.prototype.forEach.call(mapFilter, function (elem) {
      window.util.changeDisabledAttr(elem);
    });
    window.util.changeDisabledAttr(mapFeatures);

    Array.prototype.forEach.call(adFormElement, function (elem) {
      window.util.changeDisabledAttr(elem);
    });
    window.util.changeDisabledAttr(adFormHeader);

    Array.prototype.forEach.call(featureCheckbox, function (elem) {
      window.util.changeDisabledAttr(elem);
    });
  };
  setDisabled();

  var getMainPinStartCoord = function () {
    var mainPinCoordX = Math.round(MAIN_PIN_LEFT_COORD + MAIN_PIN_WIDTH * HALF_SIZE);
    var mainPinCoordY = Math.round(MAIN_PIN_TOP_COORD + MAIN_PIN_HEIGHT * HALF_SIZE);
    return mainPinCoordX + ', ' + mainPinCoordY;
  };
  addressField.value = getMainPinStartCoord();

  var getMainPinActiveCoord = function () {
    var mainPinCoordX = Math.round(window.util.mainPin.offsetLeft + MAIN_PIN_WIDTH * HALF_SIZE);
    var mainPinCoordY = Math.round(window.util.mainPin.offsetTop + MAIN_PIN_ACTIVE_HEIGHT);
    return mainPinCoordX + ', ' + mainPinCoordY;
  };

  var onLoadRender = function (loadedData) {
    window.pins.renderPins(loadedData);
  };

  var onClickActivatePage = function () {
    window.util.map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    setDisabled();

    window.backend.load(onLoadRender, window.util.onErrorMessage);
    window.filter.mapFiltersAll.addEventListener('change', window.filter.onFilterChange);
    window.form.title.addEventListener('invalid', window.form.onInputInvalid);
    window.form.accommodationType.addEventListener('change', window.form.onTypeChangeSetPrice);
    window.form.accommodationPrice.addEventListener('invalid', window.form.onInputInvalid);
    window.form.accommodationPrice.setAttribute('min', '1000');
    window.form.accommodationPrice.placeholder = 1000;
    window.form.capacity.selectedIndex = 2;
    window.util.map.addEventListener('click', window.card.onClickCardRender);
    window.util.mainPin.removeEventListener('mouseup', onClickActivatePage);
    window.util.mainPin.removeEventListener('keydown', onEnterActivatePage);
    window.util.synchronizeTimesFields(window.form.checkIn, window.form.checkOut);
    window.util.synchronizeTimesFields(window.form.checkOut, window.form.checkIn);
    window.util.synchronizeFields(window.form.rooms, window.form.capacity, window.form.ROOM_NUMBERS, window.form.CAPACITY);
    window.map.adForm.addEventListener('submit', window.form.onFormSubmit);
    window.form.reset.addEventListener('click', window.form.onClickResetPage);
  };

  var onEnterActivatePage = function (evt) {
    window.util.isEnterEvent(evt, onClickActivatePage);
  };

  window.util.mainPin.addEventListener('mouseup', onClickActivatePage);
  window.util.mainPin.addEventListener('keydown', onEnterActivatePage);

  var setLimitsTop = function (coord, limitMin, limitMax, element) {
    if (coord >= limitMin && coord <= limitMax) {
      element.style.top = coord + 'px';
    } else if (coord < limitMin) {
      element.style.top = limitMin + 'px';
    } else if (coord > limitMax) {
      element.style.top = limitMax + 'px';
    }
  };

  var setLimitsLeft = function (coord, limitMin, limitMax, element) {
    if (coord >= limitMin && coord <= limitMax) {
      element.style.left = coord + 'px';
    } else if (coord < limitMin) {
      element.style.left = limitMin + 'px';
    } else if (coord > limitMax) {
      element.style.left = limitMax + 'px';
    }
  };

  var onMousedownGetCoord = function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var coordTop = (window.util.mainPin.offsetTop - shift.y);
      var coordLeft = (window.util.mainPin.offsetLeft - shift.x);

      setLimitsTop(coordTop, MOVE_LIMITS.top, MOVE_LIMITS.bottom, window.util.mainPin);
      setLimitsLeft(coordLeft, MOVE_LIMITS.left, MOVE_LIMITS.right, window.util.mainPin);

      addressField.value = Math.round(window.util.mainPin.offsetLeft + MAIN_PIN_WIDTH * HALF_SIZE) + ', ' + (window.util.mainPin.offsetTop + MAIN_PIN_ACTIVE_HEIGHT);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      addressField.value = getMainPinActiveCoord();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  window.util.mainPin.addEventListener('mousedown', onMousedownGetCoord);

  window.map = {
    MAIN_PIN_LEFT_COORD: MAIN_PIN_LEFT_COORD,
    MAIN_PIN_TOP_COORD: MAIN_PIN_TOP_COORD,
    adForm: adForm,
    addressField: addressField,
    featureCheckbox: featureCheckbox,
    setDisabled: setDisabled,
    onClickActivatePage: onClickActivatePage,
    onEnterActivatePage: onEnterActivatePage,
    getMainPinStartCoord: getMainPinStartCoord,
    getMainPinActiveCoord: getMainPinActiveCoord
  };
})();

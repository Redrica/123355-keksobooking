'use strict';

(function () {
  var MIN_TITLE_LENGTH = 30;
  var MAX_TITLE_LENGTH = 100;
  var INVALID_MESSAGE_STYLE = {position: 'absolute', marginTop: '3px', marginLeft: '12px', fontSize: '10px', fontStyle: 'italic', color: '#999999'};
  var BUNGALO_MIN_PRICE = 0;
  var FLAT_MIN_PRICE = 1000;
  var HOUSE_MIN_PRICE = 5000;
  var PALACE_MIN_PRICE = 10000;
  var INVALID_MESSAGE_SHORT_FIELD = '220px';
  var ADDRESS_INVALID_MESSAGE = 'Не изменяйте это значение, оно вводится программой.';
  var CAPACITY_INVALID_MESSAGE = 'Количество гостей не соответствует выбранному количеству комнат';
  var ROOM_NUMBERS = ['1', '2', '3', '100'];
  var CAPACITY_VALUES = ['3', '2', '1', '0'];
  var POPUP_TIMEOUT = 5000;

  var inputs = window.map.adForm.elements;
  var title = window.map.adForm.querySelector('[name=title]');
  var accommodationType = window.map.adForm.querySelector('select[name="type"]');
  var accommodationPrice = window.map.adForm.querySelector('#price');
  var checkIn = window.map.adForm.querySelector('select[name="timein"]');
  var checkOut = window.map.adForm.querySelector('select[name="timeout"]');
  var rooms = window.map.adForm.querySelector('select[name="rooms"]');
  var capacity = window.map.adForm.querySelector('select[name="capacity"]');
  var reset = window.map.adForm.querySelector('.ad-form__reset');
  var success = document.querySelector('.success');
  var titleInvalidMessage = 'Введенное значение должно быть от ' + MIN_TITLE_LENGTH + ' до ' + MAX_TITLE_LENGTH + ' символов.';

  var onTypeChangeSetPrice = function (evt) {
    switch (evt.target.value) {
      case 'flat':
        accommodationPrice.setAttribute('min', '1000');
        accommodationPrice.setAttribute('placeholder', '1000');
        break;
      case 'bungalo':
        accommodationPrice.setAttribute('min', '0');
        accommodationPrice.setAttribute('placeholder', '0');
        break;
      case 'house':
        accommodationPrice.setAttribute('min', '5000');
        accommodationPrice.setAttribute('placeholder', '5000');
        break;
      case 'palace':
        accommodationPrice.setAttribute('min', '10000');
        accommodationPrice.setAttribute('placeholder', '10000');
        break;
    }
  };

  var checkTitleField = function () {
    return (!title.validity.valid || title.value.length < MIN_TITLE_LENGTH || title.value.length > MAX_TITLE_LENGTH);
  };

  var checkAddressField = function () {
    return (window.map.addressField.value === window.map.getMainPinActiveCoord());
  };

  var checkPriceField = function () {
    if (!accommodationPrice.validity.valid) {
      return true;
    }
    var room = accommodationType.value;
    switch (room) {
      case 'flat':
        return accommodationPrice.value < FLAT_MIN_PRICE;
      case 'bundalo':
        return accommodationPrice.value >= BUNGALO_MIN_PRICE;
      case 'house':
        return accommodationPrice.value < HOUSE_MIN_PRICE;
      case 'palace':
        return accommodationPrice.value < PALACE_MIN_PRICE;
    }
    return room;
  };

  var checkCapacityField = function () {
    switch (capacity.value) {
      case CAPACITY_VALUES[0]:
        return rooms.value === ROOM_NUMBERS[2];
      case CAPACITY_VALUES[1]:
        return (rooms.value === ROOM_NUMBERS[2] || rooms.value === ROOM_NUMBERS[1]);
      case CAPACITY_VALUES[2]:
        return (rooms.value === ROOM_NUMBERS[2] || rooms.value === ROOM_NUMBERS[1] || rooms.value === ROOM_NUMBERS[0]);
      case CAPACITY_VALUES[3]:
        return rooms.value === ROOM_NUMBERS[3];
    }
    return rooms.value;
  };

  var addInvalidCondition = function (elem, text) {
    if (elem.nextSibling) {
      elem.parentNode.removeChild(elem.nextSibling);
    }
    elem.classList.add('invalid-field');
    elem.placeholder = '';
    var error = document.createElement('p');
    error.textContent = text;
    error.style.position = INVALID_MESSAGE_STYLE.position;
    error.style.marginTop = INVALID_MESSAGE_STYLE.marginTop;
    error.style.marginLeft = INVALID_MESSAGE_STYLE.marginLeft;
    error.style.fontSize = INVALID_MESSAGE_STYLE.fontSize;
    error.style.fontStyle = INVALID_MESSAGE_STYLE.fontStyle;
    error.style.color = INVALID_MESSAGE_STYLE.color;
    error.classList.add('error-text');
    elem.parentNode.appendChild(error);
    return error;
  };

  var getPriceInvalidText = function (elem) {
    var itemText = elem.item(elem.selectedIndex).textContent;
    return 'Слишком мало для ' + itemText;
  };

  var onInputInvalid = function (evt) {
    var element = evt.target;
    element.classList.add('invalid-field');
    element.addEventListener('input', function () {
      element.classList.remove('invalid-field');
    });
  };

  var closeSuccessPopup = function () {
    success.classList.add('hidden');
  };

  var onSuccessUpload = function () {
    setDefaultCondition();
    success.classList.remove('hidden');
    setTimeout(closeSuccessPopup, POPUP_TIMEOUT);
  };

  var onFormSubmit = function (evt) {
    if (checkTitleField()) {
      var errorTitleCondition = addInvalidCondition(title, titleInvalidMessage);

      title.addEventListener('input', function () {
        title.classList.remove('invalid-field');
        var symbol = title.value.length;
        errorTitleCondition.textContent = ('Вы ввели ' + symbol + ' символов. Осталоcь еще ' + (MIN_TITLE_LENGTH - symbol));
        if (!checkTitleField()) {
          errorTitleCondition.textContent = '';
        } else if (title.value.length > MAX_TITLE_LENGTH) {
          errorTitleCondition.textContent = 'Пожалуйста, не больше ' + MAX_TITLE_LENGTH + ' символов.';
        }
      });
      evt.preventDefault();
    }
    if (!checkAddressField()) {
      var errorAddressCondition = addInvalidCondition(window.map.addressField, ADDRESS_INVALID_MESSAGE);
      evt.preventDefault();

      window.map.addressField.addEventListener('input', function () {
        window.map.addressField.classList.remove('invalid-field');
        if (checkAddressField()) {
          errorAddressCondition.textContent = '';
        }
      });
    }
    if (checkPriceField()) {
      var errorPriceCondition = addInvalidCondition(accommodationPrice, getPriceInvalidText(accommodationType));
      evt.preventDefault();

      accommodationPrice.addEventListener('input', function () {
        accommodationPrice.classList.remove('invalid-field');
        if (!checkPriceField()) {
          errorPriceCondition.textContent = '';
        }
      });
    }
    if (!checkCapacityField()) {
      var errorCapacityCondition = addInvalidCondition(capacity, CAPACITY_INVALID_MESSAGE);
      errorCapacityCondition.style.width = INVALID_MESSAGE_SHORT_FIELD;
      evt.preventDefault();

      capacity.addEventListener('focus', function () {
        capacity.classList.remove('invalid-field');
        errorCapacityCondition.textContent = '';
      });
    } else {
      window.backend.upload(new FormData(window.map.adForm), onSuccessUpload, window.util.onErrorMessage);
    }
  };

  var setDefaultCondition = function () {
    title.value = '';
    window.map.addressField.value = window.map.getMainPinStartCoord();
    accommodationType.selectedIndex = window.util.SelectedIndex.ZERO;
    accommodationPrice.value = '';
    checkIn.selectedIndex = window.util.SelectedIndex.ZERO;
    checkOut.selectedIndex = window.util.SelectedIndex.ZERO;
    rooms.selectedIndex = window.util.SelectedIndex.ZERO;
    capacity.selectedIndex = window.util.SelectedIndex.ZERO;
    Array.prototype.forEach.call(window.map.featureCheckbox, function (item) {
      item.checked = false;
    });
    reset.removeEventListener('click', onClickResetPage);
    window.form.title.removeEventListener('invalid', window.form.onInputInvalid);
    window.form.accommodationType.removeEventListener('change', window.form.onTypeChangeSetPrice);
    window.form.accommodationPrice.removeEventListener('invalid', window.form.onInputInvalid);
    window.map.adForm.removeEventListener('submit', onFormSubmit);
    window.card.declarationCard.classList.add('hidden');
    window.util.mainPin.style.left = window.map.MAIN_PIN_LEFT_COORD + 'px';
    window.util.mainPin.style.top = window.map.MAIN_PIN_TOP_COORD + 'px';
    window.map.setDisabled();
    window.filter.mapFiltersAll.removeEventListener('change', window.filter.onFilterChange);
    window.util.map.classList.add('map--faded');
    window.map.adForm.classList.add('ad-form--disabled');
    Array.prototype.forEach.call(inputs, function (item) {
      item.classList.remove('invalid-field');
    });
    window.util.mainPin.addEventListener('mouseup', window.map.onClickActivatePage);
    window.util.mainPin.addEventListener('keydown', window.map.onEnterActivatePage);
    window.util.removePins(window.pins.mapPins);
    removeErrors();
  };

  var onClickResetPage = function (evt) {
    evt.preventDefault();
    setDefaultCondition();
  };

  var removeErrors = function () {
    var errorText = window.map.adForm.querySelectorAll('.error-text');
    Array.prototype.forEach.call(errorText, function (item) {
      item.parentNode.removeChild(item);
    });
  };

  window.form = {
    FLAT_MIN_PRICE: FLAT_MIN_PRICE,
    CAPACITY: [[2], [1, 2], [0, 1, 2], [3]],
    ROOM_NUMBERS: ['1', '2', '3', '100'],
    title: title,
    checkIn: checkIn,
    checkOut: checkOut,
    capacity: capacity,
    rooms: rooms,
    accommodationType: accommodationType,
    accommodationPrice: accommodationPrice,
    reset: reset,
    onTypeChangeSetPrice: onTypeChangeSetPrice,
    onInputInvalid: onInputInvalid,
    onFormSubmit: onFormSubmit,
    onClickResetPage: onClickResetPage
  };
})();

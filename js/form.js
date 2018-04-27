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

  var inputs = adForm.elements;
  var title = adForm.querySelector('[name=title]');
  var accommodationType = adForm.querySelector('select[name="type"]');
  var accommodationPrice = adForm.querySelector('#price');
  var checkIn = adForm.querySelector('select[name="timein"]');
  var checkOut = adForm.querySelector('select[name="timeout"]');
  var rooms = adForm.querySelector('select[name="rooms"]');
  var capacity = adForm.querySelector('select[name="capacity"]');
  var reset = adForm.querySelector('.ad-form__reset');

// ПРОВЕРИТЬ, ЧТО НЕ ТАК С ПЛЕЙСХОЛДЕРОМ О_о
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
  accommodationType.addEventListener('change', onTypeChangeSetPrice);


  var disableFields = function (indexArray, dependentList) {
    Array.prototype.forEach.call(dependentList.options, function (option) {
      option.disabled = true;
    });
    indexArray.forEach(function (number) {
      dependentList.options[number].disabled = false;
    });
  };


  var checkTitleField = function () {
    return (!title.validity.valid || title.value.length < MIN_TITLE_LENGTH || title.value.length > MAX_TITLE_LENGTH);
  };

  var checkAddressField = function () {
    return (addressField.value === getMainPinStartCoord());
  };

  var checkPriceField = function () {
    if (!accommodationPrice.validity.valid) {
      return true;
    } else {
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

  var titleInvalidMessage = 'Введенное значение должно быть от ' + MIN_TITLE_LENGTH + ' до ' + MAX_TITLE_LENGTH + ' символов.';

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

  title.addEventListener('invalid', onInputInvalid);
  accommodationPrice.addEventListener('invalid', onInputInvalid);

  adForm.addEventListener('submit', function (evt) {
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
      var errorAddressCondition = addInvalidCondition(addressField, ADDRESS_INVALID_MESSAGE);
      evt.preventDefault();

      addressField.addEventListener('input', function () {
        addressField.classList.remove('invalid-field');
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
    }
  });

  var onClickResetPage = function (evt) {
    evt.preventDefault();
    title.value = '';
    addressField.value = getMainPinStartCoord();
    accommodationType.selectedIndex = '0';
    accommodationPrice.value = '';
    checkIn.selectedIndex = '0';
    checkOut.selectedIndex = '0';
    rooms.selectedIndex = '0';
    capacity.selectedIndex = '2';
    Array.prototype.forEach.call(featureCheckbox, function (item) {
      item.checked = false;
    });
    window.card.declarationCard.classList.add('hidden');
    mainPin.style.left = MAIN_PIN_LEFT_COORD + 'px';
    mainPin.style.top = MAIN_PIN_TOP_COORD + 'px';
    setDisabled();
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    Array.prototype.forEach.call(inputs, function (item) {
      item.classList.remove('invalid-field');
    });
    mainPin.addEventListener('mouseup', onClickActivatePage);
    mainPin.addEventListener('keydown', onEnterActivatePage);
    removePins(mapPins);
    removeErrors();
  };

  var removePins = function (element) {
    while (element.lastChild !== mainPin) {
      element.removeChild(element.lastChild);
    }
    return element;
  };

  var removeErrors = function () {
    var errorText = adForm.querySelectorAll('.error-text');
    Array.prototype.forEach.call(errorText, function (item) {
      item.parentNode.removeChild(item);
    });
  };

  reset.addEventListener('click', onClickResetPage);

  var synchronizeFields = function (primaryList, dependentList, primaryValuesArray, dependentIndexArray) {
    primaryList.addEventListener('change', function (evt) {
      var value = evt.target.value;
      var arrIndex = primaryValuesArray.indexOf(value);
      disableFields(dependentIndexArray[arrIndex], dependentList);
    });
  };

  var synchronizeTimesFields = function (primaryFields, dependantFields) {
    primaryFields.addEventListener('change', function (evt) {
      var targetField = evt.target;
      dependantFields.value = targetField.value;
    });
  };

  window.form = {
    CAPACITY: [[2], [1, 2], [0, 1, 2], [3]],
    ROOM_NUMBERS: ['1', '2', '3', '100'],

    checkIn: adForm.querySelector('select[name="timein"]'),
    checkOut: adForm.querySelector('select[name="timeout"]'),
    capacity: adForm.querySelector('select[name="capacity"]'),
    rooms: adForm.querySelector('select[name="rooms"]'),
    accommodationPrice: adForm.querySelector('#price'),

    synchronizeFields: synchronizeFields,
    synchronizeTimesFields: synchronizeTimesFields
  }
})();

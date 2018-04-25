'use strict';

var MAX_PICTURE_NUMBER = 8;
var TITLES = ['"Большая уютная квартира"', '"Маленькая неуютная квартира"', '"Огромный прекрасный дворец"', '"Маленький ужасный дворец"', '"Красивый гостевой домик"', '"Некрасивый негостеприимный домик"', '"Уютное бунгало далеко от моря"', '"Неуютное бунгало по колено в воде"'];
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ROOMS = [1, 2, 3, 4, 5];
var CHECK_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES_OPTIONS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var MIN_ARRAY_LENGTH = 1;
var PHOTOS_COLLECTION = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MIN_X = 300;
var MAX_X = 900;
var MIN_Y = 150;
var MAX_Y = 500;
var MIN_GUESTS = 1;
var MAX_GUESTS = 20;
var PICTURE_WIDTH = 45;
var PICTURE_HEIGHT = 40;
var PICTURE_ALT = 'Фотография жилья';
var DECLARATIONS_QUANTITY = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 65;
var MAIN_PIN_ACTIVE_HEIGHT = 87;
var MAIN_PIN_LEFT_COORD = 570;
var MAIN_PIN_TOP_COORD = 375;
var HALF_SIZE = 0.5;
var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;
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
var CAPACITY = [[2], [1, 2], [0, 1, 2], [3]];
var CAPACITY_VALUES = ['3', '2', '1', '0'];
var MOVE_LIMITS = {top: 65, right: 1135, bottom: 625, left: 0};

var calculateRandomIndex = function (arr) {
  return Math.round(Math.random() * (arr.length - 1));
};

var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min)) + min;
};

var getRandomUniqueElement = function (arrToSplice) {
  var indexRandom = calculateRandomIndex(arrToSplice);
  var splicedElement = arrToSplice.splice(indexRandom, 1);
  return splicedElement[0];
};

var getMixedArray = function (originalArray) {
  var mixed = [];
  var originalCopy = originalArray.slice();
  for (var j = 0; j < originalArray.length; j++) {
    var randomIndex = calculateRandomIndex(originalCopy);
    mixed[j] = originalCopy[randomIndex];
    originalCopy.splice(randomIndex, 1);
  }
  return mixed;
};

var getRandomLengthArray = function (arr) {
  var randomLengthArray = [];
  var originalArray = arr.slice();
  randomLengthArray.length = getRandomNumber(MIN_ARRAY_LENGTH, originalArray.length);
  for (var j = 0; j < randomLengthArray.length; j++) {
    var randomIndex = calculateRandomIndex(originalArray);
    randomLengthArray[j] = originalArray[randomIndex];
    originalArray.splice(randomIndex, 1);
  }
  return randomLengthArray;
};

var avatarsArray = [];
for (var j = 0; j < MAX_PICTURE_NUMBER; j++) {
  avatarsArray[j] = 'img/avatars/user0' + (j + 1) + '.png';
}

var titlesArray = TITLES.slice();

var createRandomDeclaration = function () {
  var objectLocation = {
    x: getRandomNumber(MIN_X, MAX_X),
    y: getRandomNumber(MIN_Y, MAX_Y)
  };

  return {
    author: {
      avatar: getRandomUniqueElement(avatarsArray)
    },

    offer: {
      title: getRandomUniqueElement(titlesArray),
      address: objectLocation.x + ', ' + objectLocation.y,
      price: getRandomNumber(MIN_PRICE, MAX_PRICE),
      type: TYPES[calculateRandomIndex(TYPES)],
      rooms: ROOMS[calculateRandomIndex(ROOMS)],
      guests: getRandomNumber(MIN_GUESTS, MAX_GUESTS),
      checkin: CHECK_TIMES[calculateRandomIndex(CHECK_TIMES)],
      checkout: CHECK_TIMES[calculateRandomIndex(CHECK_TIMES)],
      features: getRandomLengthArray(FEATURES_OPTIONS),
      description: '',
      photos: getMixedArray(PHOTOS_COLLECTION)
    },

    location: objectLocation
  };
};

var declarationsList = [];
for (var i = 0; i < DECLARATIONS_QUANTITY; i++) {
  declarationsList[i] = createRandomDeclaration(i);
}

var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

var createPins = function (index) {
  var pinElement = mapPinTemplate.cloneNode(true);
  pinElement.style = 'left: ' + (declarationsList[index].location.x - PIN_WIDTH / 2) + 'px; top: ' + (declarationsList[index].location.y - PIN_HEIGHT) + 'px;';
  pinElement.querySelector('img').alt = declarationsList[index].offer.title;
  pinElement.querySelector('img').src = declarationsList[index].author.avatar;
  pinElement.setAttribute('data-number', [i]);
  return pinElement;
};

var renderPins = function () {
  var pinsFragment = document.createDocumentFragment();
  for (i = 0; i < DECLARATIONS_QUANTITY; i++) {
    pinsFragment.appendChild(createPins(i));
  }
  mapPins.appendChild(pinsFragment);
};

var mapFiltersContainer = document.querySelector('.map__filters-container');
var cardTemplate = document.querySelector('template').content.querySelector('.map__card');

var deleteInner = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  return element;
};

var createElementList = function (arr, tagName, classNameTemplate, className, parent) {
  for (i = 0; i < arr.length; i++) {
    var newElement = document.createElement(tagName);
    var newComplexClass = classNameTemplate + arr[i];
    newElement.classList.add(className, newComplexClass);
    parent.appendChild(newElement);
  }
};

var createImagesList = function (arr, tagName, className, parent) {
  for (i = 0; i < arr.length; i++) {
    var newElement = document.createElement(tagName);
    newElement.classList.add(className);
    newElement.src = arr[i];
    newElement.setAttribute('width', PICTURE_WIDTH);
    newElement.setAttribute('height', PICTURE_HEIGHT);
    newElement.setAttribute('alt', PICTURE_ALT);
    parent.appendChild(newElement);
  }
};

var cardElement = cardTemplate.cloneNode(true);
var setCardData = function (elem, index) {
  elem.querySelector('.popup__avatar').src = declarationsList[index].author.avatar;
  elem.querySelector('.popup__title').textContent = declarationsList[index].offer.title;
  elem.querySelector('.popup__text--address').textContent = declarationsList[index].offer.address;
  elem.querySelector('.popup__text--price').textContent = declarationsList[index].offer.price + '₽/ночь';
  switch (declarationsList[index].offer.type) {
    case 'flat':
      elem.querySelector('.popup__type').textContent = 'Квартира';
      break;
    case 'bungalo':
      elem.querySelector('.popup__type').textContent = 'Бунгало';
      break;
    case 'house':
      elem.querySelector('.popup__type').textContent = 'Дом';
      break;
    case 'palace':
      elem.querySelector('.popup__type').textContent = 'Дворец';
      break;
  }
  elem.querySelector('.popup__text--capacity').textContent = declarationsList[index].offer.rooms + ' комнаты для ' + declarationsList[index].offer.guests + ' гостей.';
  elem.querySelector('.popup__text--time').textContent = 'Заезд после ' + declarationsList[index].offer.checkin + ', выезд до ' + declarationsList[index].offer.checkout;

  var featuresList = elem.querySelector('.popup__features');
  deleteInner(featuresList);
  var featuresAvailable = declarationsList[index].offer.features;
  createElementList(featuresAvailable, 'li', 'popup__feature--', 'popup__feature', featuresList);

  elem.querySelector('.popup__description').textContent = declarationsList[index].offer.description;

  var cardPictures = elem.querySelector('.popup__photos');
  var userPictures = declarationsList[index].offer.photos;
  deleteInner(cardPictures);
  createImagesList(userPictures, 'img', 'popup__photo', cardPictures);

  return elem;
};
map.insertBefore(cardElement, mapFiltersContainer);
var declarationCard = map.querySelector('.map__card');
declarationCard.classList.add('hidden');

var mapFilter = mapFiltersContainer.querySelectorAll('.map__filter');
var mapFeatures = mapFiltersContainer.querySelector('.map__features');
var adForm = document.querySelector('.ad-form');
var adFormHeader = adForm.querySelector('.ad-form-header');
var adFormElement = adForm.querySelectorAll('.ad-form__element');
var mainPin = map.querySelector('.map__pin--main');
var addressField = adForm.querySelector('[name=address]');
var cardCloseButton = declarationCard.querySelector('.popup__close');
var featureCheckbox = adForm.querySelectorAll('.feature__checkbox');

var changeDisabledAttr = function (elem) {
  if (elem.disabled) {
    elem.disabled = false;
  } else {
    elem.disabled = true;
  }
};

var setDisabled = function () {
  Array.prototype.forEach.call(mapFilter, function (elem) {
    changeDisabledAttr(elem);
  });
  changeDisabledAttr(mapFeatures);

  Array.prototype.forEach.call(adFormElement, function (elem) {
    changeDisabledAttr(elem);
  });
  changeDisabledAttr(adFormHeader);

  Array.prototype.forEach.call(featureCheckbox, function (elem) {
    changeDisabledAttr(elem);
  });
};
setDisabled();

var getMainPinStartCoord = function () {
  var mainPinCoordX = Math.round(mainPin.offsetLeft + MAIN_PIN_WIDTH * HALF_SIZE);
  var mainPinCoordY = Math.round(mainPin.offsetTop + MAIN_PIN_HEIGHT * HALF_SIZE);
  return mainPinCoordX + ', ' + mainPinCoordY;
};
addressField.value = getMainPinStartCoord();

var getMainPinActiveCoord = function () {
  var mainPinCoordX = Math.round(mainPin.offsetLeft + MAIN_PIN_WIDTH * HALF_SIZE);
  var mainPinCoordY = Math.round(mainPin.offsetTop + MAIN_PIN_ACTIVE_HEIGHT);
  return mainPinCoordX + ', ' + mainPinCoordY;
};

var onClickActivatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  setDisabled();
  accommodationPrice.setAttribute('min', '1000');
  accommodationPrice.placeholder = 1000;
  capacity.selectedIndex = 2;
  renderPins();
  mainPin.removeEventListener('mouseup', onClickActivatePage);
  mainPin.removeEventListener('keydown', onEnterActivatePage);
  synchronizeTimesFields(checkIn, checkOut);
  synchronizeTimesFields(checkOut, checkIn);
  synchronizeFields(rooms, capacity, ROOM_NUMBERS, CAPACITY);
};

var onEnterActivatePage = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    onClickActivatePage();
  }
};

var onClickCardRender = function (evt) {
  var target = evt.target;
  while (target !== map) {
    if (target.className === 'map__pin') {
      declarationCard.classList.remove('hidden');
      var data = target.getAttribute('data-number');
      setCardData(declarationCard, data);
    }
    target = target.parentNode;
  }
  cardCloseButton.addEventListener('click', onClickCloseCard);
  document.addEventListener('keydown', onEscClosePopup);
};

var onClickCloseCard = function () {
  declarationCard.classList.add('hidden');
  cardCloseButton.removeEventListener('click', onClickCloseCard);
  document.removeEventListener('keydown', onEscClosePopup);
};

var onEscClosePopup = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    onClickCloseCard();
  }
};

mainPin.addEventListener('mouseup', onClickActivatePage);
mainPin.addEventListener('keydown', onEnterActivatePage);
map.addEventListener('click', onClickCardRender);

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

var synchronizeTimesFields = function (primaryFields, dependantFields) {
  primaryFields.addEventListener('change', function (evt) {
    var targetField = evt.target;
    dependantFields.value = targetField.value;
  });
};

var disableFields = function (indexArray, dependentList) {
  Array.prototype.forEach.call(dependentList.options, function (option) {
    option.disabled = true;
  });
  indexArray.forEach(function (number) {
    dependentList.options[number].disabled = false;
  });
};

var synchronizeFields = function (primaryList, dependentList, primaryValuesArray, dependentIndexArray) {
  primaryList.addEventListener('change', function (evt) {
    var value = evt.target.value;
    var arrIndex = primaryValuesArray.indexOf(value);
    disableFields(dependentIndexArray[arrIndex], dependentList);
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
  declarationCard.classList.add('hidden');
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


// ПЕРЕТАСКИВАНИЕ
var startCoords = {};
var getStartCoords = function (evt) {
  startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };
  return startCoords;
};

var getObjectCoords = function (element, objectShift) {
  element.style.top = (element.offsetTop - objectShift.y) + 'px';
  element.style.left = (element.offsetLeft - objectShift.x) + 'px';
};

var onMouseMove = function (moveEvt) {
  moveEvt.preventDefault();
  var shift = {
    x: startCoords.x - moveEvt.clientX,
    y: startCoords.y - moveEvt.clientY
  };
  getStartCoords(moveEvt);

  getObjectCoords(mainPin, shift);
  addressField.value = Math.round(mainPin.offsetLeft + MAIN_PIN_WIDTH * HALF_SIZE) + ', ' + (mainPin.offsetTop + MAIN_PIN_ACTIVE_HEIGHT);
};

var onMouseUp = function (upEvt) {
  upEvt.preventDefault();
  addressField.value = getMainPinActiveCoord();

  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
};

var onMouseDownDragPin = function (evt) {
  evt.preventDefault();
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

mainPin.addEventListener('mousedown', onMouseDownDragPin);

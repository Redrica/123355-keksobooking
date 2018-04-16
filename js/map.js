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
var MAIN_PIN_ACTIVE_HEIGHT = 87;
var MAIN_PIN_LEFT_COORD = 570;
var MAIN_PIN_TOP_COORD = 375;
var HALF_SIZE = 0.5;
var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;

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

var renderPins = function (index) {
  var pinElement = mapPinTemplate.cloneNode(true);
  pinElement.style = 'left: ' + (declarationsList[index].location.x - PIN_WIDTH / 2) + 'px; top: ' + (declarationsList[index].location.y - PIN_HEIGHT) + 'px;';
  pinElement.querySelector('img').alt = declarationsList[index].offer.title;
  pinElement.querySelector('img').src = declarationsList[index].author.avatar;
  pinElement.setAttribute('data-number', [i]);
  return pinElement;
};

var pinsFragment = document.createDocumentFragment();
for (i = 0; i < DECLARATIONS_QUANTITY; i++) {
  pinsFragment.appendChild(renderPins(i));
}

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

// ПОЛЬЗОВАТЕЛЬСКИЕ СОБЫТИЯ

var mapFilter = mapFiltersContainer.querySelectorAll('.map__filter');
var mapFeatures = mapFiltersContainer.querySelector('.map__features');
var adForm = document.querySelector('.ad-form');
var adFormHeader = document.querySelector('.ad-form-header');
var adFormElement = document.querySelectorAll('.ad-form__element');
var mainPin = map.querySelector('.map__pin--main');
var addressField = document.querySelector('[name=address]');
var cardCloseButton = declarationCard.querySelector('.popup__close');

var inactivatePage = function () {
  Array.prototype.forEach.call(mapFilter, function (elem) {
    elem.disabled = true;
  });
  mapFeatures.disabled = true;

  Array.prototype.forEach.call(adFormElement, function (elem) {
    elem.disabled = true;
  });
  adFormHeader.disabled = true;
};
inactivatePage();

var setFieldsEnabled = function () {
  Array.prototype.forEach.call(mapFilter, function (elem) {
    elem.disabled = false;
  });
  mapFeatures.disabled = false;

  Array.prototype.forEach.call(adFormElement, function (elem) {
    elem.disabled = false;
  });
  adFormHeader.disabled = false;
};

var getMainPinStartCoord = function () {
  var mainPinCoordX = Math.round(MAIN_PIN_LEFT_COORD + MAIN_PIN_WIDTH * HALF_SIZE);
  var mainPinCoordY = Math.round(MAIN_PIN_TOP_COORD + MAIN_PIN_ACTIVE_HEIGHT * HALF_SIZE);
  return mainPinCoordX + ', ' + mainPinCoordY;
};

var onClickActivatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  setFieldsEnabled();
  addressField.value = getMainPinStartCoord();
  mapPins.appendChild(pinsFragment);
  mainPin.removeEventListener('mouseup', onClickActivatePage);
  mainPin.removeEventListener('keydown', onEnterActivatePage);

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
  cardCloseButton.addEventListener('keydown', onEnterCloseCard);
  document.addEventListener('keydown', onEscClosePopup);
};

var onClickCloseCard = function () {
  declarationCard.classList.add('hidden');
  cardCloseButton.removeEventListener('click', onClickCloseCard);
  cardCloseButton.removeEventListener('keydown', onEnterCloseCard);
  document.removeEventListener('keydown', onEscClosePopup);
};

var onEnterCloseCard = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    onClickCloseCard();
  }
};

var onEscClosePopup = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    onClickCloseCard();
  }
};

mainPin.addEventListener('mouseup', onClickActivatePage);
mainPin.addEventListener('keydown', onEnterActivatePage);
map.addEventListener('click', onClickCardRender);

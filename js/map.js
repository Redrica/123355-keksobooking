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
var DECLARATIONS_QUANTITY = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_ACTIVE_HEIGHT = 87;
var MAIN_PIN_LEFT_COORD = 570;
var MAIN_PIN_TOP_COORD = 375;
var HALF_SIZE = 0.5;

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
  return parent;
};

var renderCard = function (index) {
  var cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector('.popup__avatar').src = declarationsList[index].author.avatar;
  cardElement.querySelector('.popup__title').textContent = declarationsList[index].offer.title;
  cardElement.querySelector('.popup__text--address').textContent = declarationsList[index].offer.address;
  cardElement.querySelector('.popup__text--price').textContent = declarationsList[index].offer.price + '₽/ночь';
  switch (declarationsList[index].offer.type) {
    case 'flat':
      cardElement.querySelector('.popup__type').textContent = 'Квартира';
      break;
    case 'bungalo':
      cardElement.querySelector('.popup__type').textContent = 'Бунгало';
      break;
    case 'house':
      cardElement.querySelector('.popup__type').textContent = 'Дом';
      break;
    case 'palace':
      cardElement.querySelector('.popup__type').textContent = 'Дворец';
      break;
  }
  cardElement.querySelector('.popup__text--capacity').textContent = declarationsList[index].offer.rooms + ' комнаты для ' + declarationsList[index].offer.guests + ' гостей.';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + declarationsList[index].offer.checkin + ', выезд до ' + declarationsList[index].offer.checkout;

  var featuresList = cardElement.querySelector('.popup__features');
  deleteInner(featuresList);
  var featuresAvailable = declarationsList[index].offer.features;
  createElementList(featuresAvailable, 'li', 'popup__feature--', 'popup__feature', featuresList);

  cardElement.querySelector('.popup__description').textContent = declarationsList[index].offer.description;

  var cardPictures = cardElement.querySelector('.popup__photos');
  var pictureTemplate = cardElement.querySelector('.popup__photo');
  pictureTemplate.src = declarationsList[index].offer.photos[0];
  declarationsList[index].offer.photos.splice(0, 1);
  for (j = 0; j < declarationsList[index].offer.photos.length; j++) {
    var pictureElement = pictureTemplate.cloneNode();
    cardPictures.querySelector('.popup__photo').src = declarationsList[index].offer.photos[j];
    cardPictures.appendChild(pictureElement);
  }
  return cardElement;
};

map.insertBefore(renderCard(5), mapFiltersContainer);

// ПОЛЬЗОВАТЕЛЬСКИЕ СОБЫТИЯ

// !!! в неактивном состоянии меню выбора невидимое, но доступно. Тоже disadled?
var mapFilter = mapFiltersContainer.querySelectorAll('.map__filter');
var mapFeatures = mapFiltersContainer.querySelector('.map__features');
var adForm = document.querySelector('.ad-form');
var adFormHeaderInput = document.querySelector('.ad-form-header__input');
var adFormElement = document.querySelectorAll('.ad-form__element');

// фильтры почему-то активные, хоть и скрыты, поэтому добавляю disabled для неактивного сотояния
Array.prototype.forEach.call(mapFilter, function (elem) {
  elem.disabled = true;
});
mapFeatures.disabled = true;

Array.prototype.forEach.call(adFormElement, function (elem) {
  elem.disabled = true;
});
adFormHeaderInput.disabled = true;

var mainPin = map.querySelector('.map__pin--main');
var addressField = document.querySelector('[name=address]');
var mapPinElement = map.querySelectorAll('.map__pin');
var declarationCard = map.querySelector('.map__card');

var getMainPinStartCoord = function () {
  var mainPinCoordX = Math.round(MAIN_PIN_LEFT_COORD + MAIN_PIN_WIDTH * HALF_SIZE);
  var mainPinCoordY = Math.round(MAIN_PIN_TOP_COORD + MAIN_PIN_ACTIVE_HEIGHT * HALF_SIZE);
  return mainPinCoordX + ', ' + mainPinCoordY;
};

mainPin.addEventListener('mouseup', function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  mapPins.appendChild(pinsFragment);

  Array.prototype.forEach.call(mapFilter, function (elem) {
    elem.disabled = false;
  });
  mapFeatures.disabled = false;

  Array.prototype.forEach.call(adFormElement, function (elem) {
    elem.disabled = false;
  });
  adFormHeaderInput.disabled = false;

  addressField.value = getMainPinStartCoord();

  Array.prototype.forEach.call(mapPinElement, function (evt) {
    evt.preventDefault();
    declarationCard.cl

  })
});

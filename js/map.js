'use strict';

// var PICTURE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];
var MAX_PICTURE_NUMBER = 8;
var TITLES = ['"Большая уютная квартира"', '"Маленькая неуютная квартира"', '"Огромный прекрасный дворец"', '"Маленький ужасный дворец"', '"Красивый гостевой домик"', '"Некрасивый негостеприимный домик"', '"Уютное бунгало далеко от моря"', '"Неуютное бунгало по колено в воде"'];
var MIN_PRICE = 1000;
var MAX_PRICE = 10000;
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


// функция для расчета случайного индекса элемента массива
var calculateRandomIndex = function (arr) {
  return Math.round(Math.random() * (arr.length - 1));
};

// функция генерации случайного числа в интервале от min до max
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min)) + min;
};

// функция выбора случайного элемента массива без повторений
var getRandomElement = function (arr) {
  var randomIndex = calculateRandomIndex(arr);
  var arrCopy = arr.slice();
  var text = arr[randomIndex];
  arrCopy.splice(randomIndex, 1);
  return text;
};

var getRandomPictures = function (arr) {
  var photos = [];
  var photosCopy = arr.slice();
  for (var j = 0; j < arr.length; j++) {
    var randomIndex = calculateRandomIndex(photosCopy);
    photos[j] = photosCopy[randomIndex];
    photosCopy.splice(randomIndex, 1);
  }
  return photos;
};

// функция, перемешивающая массив
var getMixedArray = function (arr) {
  var mixedArray = [];
  var originalArray = arr.slice();
  mixedArray.length = getRandomNumber(MIN_ARRAY_LENGTH, originalArray.length);
  for (var j = 0; j < mixedArray.length; j++) {
    var randomIndex = calculateRandomIndex(originalArray);
    mixedArray[j] = originalArray[randomIndex];
    originalArray.splice(randomIndex, 1);
  }
  return mixedArray;
};

// генерация массива картинок с ведущим нулём
var avatarsArray = [];
for (var j = 0; j < MAX_PICTURE_NUMBER; j++) {
  avatarsArray[j] = 'img/avatars/user0' + (j + 1) + '.png';
}

// получание рандомной картинки из массива, повторение исключено
var getRandomAvatar = function (arr) {
  var randomIndex = calculateRandomIndex(arr);
  var randomAvatar = arr[randomIndex];
  arr.splice(randomIndex, 1);
  return randomAvatar;
};

// функция генерации объявления по заданным параметрам
var createRandomDeclaration = function () {
  var objectLocation = {
    x: getRandomNumber(MIN_X, MAX_X),
    y: getRandomNumber(MIN_Y, MAX_Y)
  };

  return {
    author: {
      avatar: getRandomAvatar(avatarsArray)
    },

    offer: {
      title: getRandomElement(TITLES),
      address: objectLocation.x + ', ' + objectLocation.y,
      price: getRandomNumber(MIN_PRICE, MAX_PRICE),
      type: TYPES[calculateRandomIndex(TYPES)],
      rooms: ROOMS[calculateRandomIndex(ROOMS)],
      guests: getRandomNumber(MIN_GUESTS, MAX_GUESTS),
      checkin: CHECK_TIMES[calculateRandomIndex(CHECK_TIMES)],
      checkout: CHECK_TIMES[calculateRandomIndex(CHECK_TIMES)],
      features: getMixedArray(FEATURES_OPTIONS),
      description: '',
      photos: getRandomPictures(PHOTOS_COLLECTION)
    },

    location: objectLocation
  };
};

// создание массива сгенерированных объявлений
var declarationsList = [];
for (var i = 0; i < DECLARATIONS_QUANTITY; i++) {
  declarationsList[i] = createRandomDeclaration(i);
}

// начинается работа с DOM
var map = document.querySelector('.map');
map.classList.remove('map--faded');

var mapPins = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

// функция создания шаблона метки с вставкой данных из массива объяслений
var renderPins = function (index) {
  var pinElement = mapPinTemplate.cloneNode(true);
  pinElement.style = 'left: ' + (declarationsList[index].location.x - PIN_WIDTH / 2) + 'px; top: ' + (declarationsList[index].location.y - PIN_HEIGHT) + 'px;';
  pinElement.querySelector('img').alt = declarationsList[index].offer.title;
  pinElement.querySelector('img').src = declarationsList[index].author.avatar;
  return pinElement;
};

// отрисовка меток во фрагмент и отрисовка фрагмента в DOM
var pinsFragment = document.createDocumentFragment();
for (i = 0; i < DECLARATIONS_QUANTITY; i++) {
  pinsFragment.appendChild(renderPins(i));
}
mapPins.appendChild(pinsFragment);

var mapFilters = document.querySelector('.map__filters-container');
var cardTemplate = document.querySelector('template').content.querySelector('.map__card');

var renderCard = function (index) {
  // клонирую шаблон
  var cardElement = cardTemplate.cloneNode(true);

  // прописываю текст и атрибуты для элементов в шаблоне, данные - из сгенерированного массива данных
  cardElement.querySelector('.popup__avatar').src = declarationsList[index].author.avatar;
  cardElement.querySelector('.popup__title').textContent = declarationsList[index].offer.title;
  cardElement.querySelector('.popup__text--address').textContent = declarationsList[index].offer.address;
  cardElement.querySelector('.popup__text--price').textContent = declarationsList[index].offer.price + '₽/ночь';
  // определяю тип (будет текст) в зависимости от заданного в массиве данных
  if (declarationsList[index].offer.type === 'flat') {
    cardElement.querySelector('.popup__type').textContent = 'Квартира';
  }
  if (declarationsList[index].offer.type === 'bungalo') {
    cardElement.querySelector('.popup__type').textContent = 'Бунгало';
  }
  if (declarationsList[index].offer.type === 'house') {
    cardElement.querySelector('.popup__type').textContent = 'Дом';
  }
  if (declarationsList[index].offer.type === 'palace') {
    cardElement.querySelector('.popup__type').textContent = 'Дворец';
  }
  cardElement.querySelector('.popup__text--capacity').textContent = declarationsList[index].offer.rooms + ' комнаты для ' + declarationsList[index].offer.guests + ' гостей.';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + declarationsList[index].offer.checkin + ', выезд до ' + declarationsList[index].offer.checkout;

  // блок features - удаляю имеющиеся элементы списка, создаю новые с классами в соответствии с доступными услугами
  var featuresList = cardElement.querySelector('.popup__features');
  while (featuresList.firstChild) {
    featuresList.removeChild(featuresList.firstChild);
  }
  var featuresAvailable = declarationsList[index].offer.features;
  for (i = 0; i < featuresAvailable.length; i++) {
    var featuresItem = document.createElement('li');
    var featureClass = 'popup__feature--' + featuresAvailable[i];
    featuresItem.classList.add('popup__feature', featureClass);
    featuresList.appendChild(featuresItem);
  }

  cardElement.querySelector('.popup__description').textContent = declarationsList[index].offer.description;

  var cardPictures = cardElement.querySelector('.popup__photos');
  var pictureTemplate = cardElement.querySelector('.popup__photo');

  // задаю имеющейся в разметке картинке адрес из первой строки массива с фотографиями
  pictureTemplate.src = declarationsList[index].offer.photos[0];

  // удаляю эту строку из массива
  declarationsList[index].offer.photos.splice(0, 1);

  // отрисовываю остальные фотографии из массива (за вычетом первой)
  for (j = 0; j < declarationsList[index].offer.photos.length; j++) {
    var pictureElement = pictureTemplate.cloneNode();
    cardPictures.querySelector('.popup__photo').src = declarationsList[index].offer.photos[j];
    cardPictures.appendChild(pictureElement);
  }
  return cardElement;
};

map.insertBefore(renderCard(0), mapFilters);

// неудавшаяся попытка пройти через forEach, удается выбрать только те элементы, которые _содержат_ требуемый класс. А надо - НЕ содержат.
// var featureItems = cardElement.querySelectorAll('.popup__feature');
// var featuresAvailable = declarationsList[index].offer.features;
// Array.prototype.forEach.call(featureItems, function(item) {
//   for (i = 0; i < featuresAvailable.length; i++) {
//     var className = 'popup__feature--' + featuresAvailable[i];
//     if (!item.classList.contains(className)) {
//       console.log(item.classList);
//       item.parentNode.removeChild(item);
//     }
//   }
// });

// "обычный" адрес, если без генерации
// avatar: 'img/avatars/user0' + (index + 1) + '.png'


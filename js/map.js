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
var MAX_GUESTS = 100;
var DECLARATIONS_QUANTITY = 8;


// функция для расчета случайного индекса элемента массива
var calculateRandomIndex = function (arr) {
  return Math.round(Math.random() * (arr.length - 1));
};

// функция генерации случайного числа в интервале от min до max
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min)) + min;
};

// генерация массива с адресами аватарок
var avatars = [];
for (var i = 0; i < MAX_PICTURE_NUMBER; i++) {
  avatars[i] = 'img/avatars/user0' + (i + 1) + '.png';
}

// функция генерации объявления по заданным параметрам
var createRandomDeclaration = function (titles, minX, maxX, minY, maxY, minPrice, maxPrice, type, rooms, minGuests, maxGuests, checkTime, featuresOptions, photosCollection) {
  var author = {};
  var randomIndexAvatars = calculateRandomIndex(avatars);
  author.avatar = avatars[randomIndexAvatars];
  avatars.splice(randomIndexAvatars, 1);

  // выбираем случайное название без возможности повторения
  var offer = {};
  var randomIndexTitle = calculateRandomIndex(titles);
  offer.titles = titles[randomIndexTitle];
  titles.splice(randomIndexTitle, 1);

  // вычисляем случайные координаты объекта
  var locationX = getRandomNumber(minX, maxX);
  var locationY = getRandomNumber(minY, maxY);
  offer.address = locationX + ', ' + locationY;
  // случайная цена из диапазона
  offer.price = getRandomNumber(minPrice, maxPrice);
  // выбираем тип жилья из доступных
  offer.type = type[calculateRandomIndex(type)];
  // случайное количество комнат из диапазона
  offer.rooms = rooms[calculateRandomIndex(rooms)];
  // случайное количество гостей из диапазона
  offer.guests = getRandomNumber(minGuests, maxGuests);
  // случайное время заезда/выезда из доступных
  offer.checkin = checkTime[calculateRandomIndex(checkTime)];
  offer.checkout = checkTime[calculateRandomIndex(checkTime)];

  // создание массива "дополнительных услуг" случайной длины на основе массива с доступными услугами
  var features = [];
  features.length = getRandomNumber(MIN_ARRAY_LENGTH, featuresOptions.length);
  for (i = 0; i < features.length; i++) {
    var randomIndexFeatures = calculateRandomIndex(featuresOptions);
    features[i] = featuresOptions[randomIndexFeatures];
    featuresOptions.splice(randomIndexFeatures, 1);
  }
  offer.features = features;

  offer.description = '';
  // вывод доступных фотографий объекта в случайном порядке
  var photos = [];
  var photosCopy = photosCollection.slice();
  for (i = 0; i < photosCollection.length; i++) {
    var randomIndexPhotos = calculateRandomIndex(photosCopy);
    photos[i] = photosCopy[randomIndexPhotos];
    photosCopy.splice(randomIndexPhotos, 1);
  }
  offer.photos = photos;

  var location = {};
  location.x = locationX;
  location.y = locationY;

  var declaration = {};
  declaration.author = author;
  declaration.offer = offer;
  declaration.location = location;

  return declaration;
};

// создание массива сгенерированных объявлений
var declarationsList = [];
var titles = TITLES.slice();
var featuresOptions = FEATURES_OPTIONS.slice();
var photosCollection = PHOTOS_COLLECTION.slice();
for (i = 0; i < DECLARATIONS_QUANTITY; i++) {
  declarationsList[i] = createRandomDeclaration(titles, MIN_X, MAX_X, MIN_Y, MAX_Y, MIN_PRICE, MAX_PRICE, TYPES, ROOMS, MIN_GUESTS, MAX_GUESTS, CHECK_TIMES, featuresOptions, photosCollection);
}

var map = document.querySelector('.map');
map.classList.remove('.map--faded');

'use strict';

// var PICTURE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];
var PICTURE_MAX_NUMBER = 8;
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


// функция для расчета случайного индекса элемента массива
var calculateRandomIndex = function (arr) {
  return Math.round(Math.random() * (arr.length - 1));
};

// функция генерации случайного числа в интервале от min до max
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min)) + min;
};
// функция генерации объявления по заданным параметрам
var createRandomDeclaration = function (i, titles, minX, maxX, minY, maxY, minPrice, maxPrice, type, rooms, minGuests, maxGuests, checkTime, photosCollection) {
  var author = {};

  // var pictureNumbers = PICTURE_NUMBERS.slice();
  // var randomIndexAvatars = calculateRandomIndex(pictureNumbers);
  // author.avatar = 'img/avatars/user0' + pictureNumbers[randomIndexAvatars] + '.png';
  // pictureNumbers.splice(randomIndexAvatars, 1);

  // генерация массива с адресами аватарок
  // var avatars = [];
  // for (var i = 0; i < PICTURE_MAX_NUMBER; i++) {
  //   avatars[i] = 'img/avatars/user0' + (i + 1) + '.png';
  // }
  // var randomIndexAvatars = calculateRandomIndex(avatars);
  author.avatar = 'img/avatars/user0' + (i + 1) + '.png';
  // avatars.splice(randomIndexAvatars, 1);

  // выбираем случайное название без возможности повторения
  var offer = {};
  var randomIndexTitle = calculateRandomIndex(titles);
  offer.title = titles[randomIndexTitle];
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
  var featuresOptions = FEATURES_OPTIONS.slice();
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
var photosCollection = PHOTOS_COLLECTION.slice();
for (var i = 0; i < DECLARATIONS_QUANTITY; i++) {
  declarationsList[i] = createRandomDeclaration(i, titles, MIN_X, MAX_X, MIN_Y, MAX_Y, MIN_PRICE, MAX_PRICE, TYPES, ROOMS, MIN_GUESTS, MAX_GUESTS, CHECK_TIMES, photosCollection);
}

// начинается отрисовка DOM
var map = document.querySelector('.map');
map.classList.remove('map--faded');

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
  for (var j = 0; j < declarationsList[index].offer.photos.length; j++) {
    var pictureElement = pictureTemplate.cloneNode();
    cardPictures.querySelector('.popup__photo').src = declarationsList[index].offer.photos[j];
    cardPictures.appendChild(pictureElement);
  }


  return cardElement;
};

map.insertBefore(renderCard(0), mapFilters);

// неудавшаяся попытка пройти через forEach
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

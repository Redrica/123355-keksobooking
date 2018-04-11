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


// функция для расчета случайного индекса элемента массива
var calculateRandomIndex = function (arr) {
  return Math.round(Math.random() * (arr.length - 1));
};

// функция генерации случайного числа в интервале от min до max
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min)) + min;
};

// функция генерации объявления по заданным параметрам
var createRandomDeclaration = function (titles, minX, maxX, minY, maxY, minPrice, maxPrice, type, rooms, minGuests, maxGuests, checkTime, photosCollection) {
  var author = {};
  // генерация массива с адресами аватарок
  var avatars = [];
  for (var i = 0; i < MAX_PICTURE_NUMBER; i++) {
    avatars[i] = 'img/avatars/user0' + (i + 1) + '.png';
  }
  var randomIndexAvatars = calculateRandomIndex(avatars);
  author.avatar = avatars[randomIndexAvatars];
  avatars.splice(randomIndexAvatars, 1);

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
  declarationsList[i] = createRandomDeclaration(titles, MIN_X, MAX_X, MIN_Y, MAX_Y, MIN_PRICE, MAX_PRICE, TYPES, ROOMS, MIN_GUESTS, MAX_GUESTS, CHECK_TIMES, photosCollection);
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

var fragment = document.createDocumentFragment();
for (i = 0; i < DECLARATIONS_QUANTITY; i++) {
  fragment.appendChild(renderPins(i));
}
mapPins.appendChild(fragment);

var mapFilters = document.querySelector('.map__filters-container');
var cardTemplate = document.querySelector('template').content.querySelector('.map__card');

var cardElement = cardTemplate.cloneNode(true);
cardElement.querySelector('.popup__avatar').src = declarationsList[0].author.avatar;
cardElement.querySelector('.popup__title').textContent = declarationsList[0].offer.title;
cardElement.querySelector('.popup__text--address').textContent = declarationsList[0].offer.address;
cardElement.querySelector('.popup__text--price').textContent = declarationsList[0].offer.price + '₽/ночь';
if (declarationsList[0].offer.type === 'flat') {
  cardElement.querySelector('.popup__type').textContent = 'Квартира';
}
if (declarationsList[0].offer.type === 'bungalo') {
  cardElement.querySelector('.popup__type').textContent = 'Бунгало';
}
if (declarationsList[0].offer.type === 'house') {
  cardElement.querySelector('.popup__type').textContent = 'Дом';
}
if (declarationsList[0].offer.type === 'palace') {
  cardElement.querySelector('.popup__type').textContent = 'Дворец';
}
cardElement.querySelector('.popup__text--capacity').textContent = declarationsList[0].offer.rooms + ' комнаты для ' + declarationsList[0].offer.guests + ' гостей.';
cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + declarationsList[0].offer.checkin + ', выезд до ' + declarationsList[0].offer.checkout;

// FEATURES
// cardElement.querySelector('.popup__features').textContent = 'Заезд после ' + declarationsList[0].offer.checkin + ', выезд до ' + declarationsList[0].offer.checkout;


cardElement.querySelector('.popup__description').textContent = declarationsList[0].offer.description;

var cardPictures = cardElement.querySelector('.popup__photos');
var pictureTemplate = cardElement.querySelector('.popup__photo');

// задаю имеющейся в разметке картинке адрес из первой строки массива с фотографиями
pictureTemplate.src = declarationsList[0].offer.photos[0];

// удаляю эту строку из массива
declarationsList[0].offer.photos.splice(0, 1);

// отрисовываю остальные фотографии из массива (за вычетом первой)
for (var j = 0; j < declarationsList[0].offer.photos.length; j++) {
  var pictureElement = pictureTemplate.cloneNode();
  cardPictures.querySelector('.popup__photo').src = declarationsList[0].offer.photos[j];
  cardPictures.appendChild(pictureElement);
}

var popupFeatures = map.querySelector('.popup__features');
var featureItems = map.querySelectorAll('.popup__feature');
Array.prototype.forEach.call(featureItems, function(item) {
  if (!item.classList.contains('popup__feature--' + declarationsList[0].offer.features[0] + '')) {
    popupFeatures.removeChild(li);
  }
});

// var offerFeatures = declarationsList[0].offer.features;
// for (j = 0; j < offerFeatures.length; j++) {
//   if (featureItem.classList)
// }

  // cardPictures.querySelector('.popup__photo').src = declarationsList[0].offer.photos[0];
// }
// cardPictures.appendChild(pictureElement);

map.insertBefore(cardElement, mapFilters);

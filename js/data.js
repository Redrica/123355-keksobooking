'use strict';

(function () {
  var MAX_PICTURE_NUMBER = 8;
  var TITLES = ['"Большая уютная квартира"', '"Маленькая неуютная квартира"', '"Огромный прекрасный дворец"', '"Маленький ужасный дворец"', '"Красивый гостевой домик"', '"Некрасивый негостеприимный домик"', '"Уютное бунгало далеко от моря"', '"Неуютное бунгало по колено в воде"'];
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var ROOMS = [1, 2, 3, 4, 5];
  var CHECK_TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES_OPTIONS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS_COLLECTION = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var MIN_X = 300;
  var MAX_X = 900;
  var MIN_Y = 150;
  var MAX_Y = 500;
  var MIN_GUESTS = 1;
  var MAX_GUESTS = 20;
  var DECLARATIONS_QUANTITY = 8;

  var avatarsArray = [];
  for (var j = 0; j < MAX_PICTURE_NUMBER; j++) {
    avatarsArray[j] = 'img/avatars/user0' + (j + 1) + '.png';
  }

  var titlesArray = TITLES.slice();

  var createRandomDeclaration = function () {
    var objectLocation = {
      x: window.util.getRandomNumber(MIN_X, MAX_X),
      y: window.util.getRandomNumber(MIN_Y, MAX_Y)
    };

    return {
      author: {
        avatar: window.util.getRandomUniqueElement(avatarsArray)
      },

      offer: {
        title: window.util.getRandomUniqueElement(titlesArray),
        address: objectLocation.x + ', ' + objectLocation.y,
        price: window.util.getRandomNumber(MIN_PRICE, MAX_PRICE),
        type: TYPES[window.util.calculateRandomIndex(TYPES)],
        rooms: ROOMS[window.util.calculateRandomIndex(ROOMS)],
        guests: window.util.getRandomNumber(MIN_GUESTS, MAX_GUESTS),
        checkin: CHECK_TIMES[window.util.calculateRandomIndex(CHECK_TIMES)],
        checkout: CHECK_TIMES[window.util.calculateRandomIndex(CHECK_TIMES)],
        features: window.util.getRandomLengthArray(FEATURES_OPTIONS),
        description: '',
        photos: window.util.getMixedArray(PHOTOS_COLLECTION)
      },

      location: objectLocation
    };
  };

  var declarationsList = [];
  for (var i = 0; i < DECLARATIONS_QUANTITY; i++) {
    declarationsList[i] = createRandomDeclaration(i);
  }

  window.data = {
    declarationsList: declarationsList,
    DECLARATIONS_QUANTITY: DECLARATIONS_QUANTITY
  };
})();

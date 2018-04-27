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
  var MIN_ARRAY_LENGTH = 1;
  var PHOTOS_COLLECTION = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var MIN_X = 300;
  var MAX_X = 900;
  var MIN_Y = 150;
  var MAX_Y = 500;
  var MIN_GUESTS = 1;
  var MAX_GUESTS = 20;


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

  window.data = {
    declarationsList: declarationsList
  };
})();

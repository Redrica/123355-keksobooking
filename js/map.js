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
var MIN_TITLE_LENGTH = 30;
var MAX_TITLE_LENGTH = 100;
var INVALID_FIELD_BORDER = '2px solid red';
var VALID_FIELD_BORDER = '1px solid #d9d9d3';
var INVALID_MESSAGE_STYLE = {position: 'absolute', marginTop: '3px', marginLeft: '12px', fontSize: '10px', fontStyle: 'italic', color: '#999999'};
var BUNGALO_MIN_PRICE = 0;
var FLAT_MIN_PRICE = 1000;
var HOUSE_MIN_PRICE = 5000;
var PALACE_MIN_PRICE = 10000;


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
var adFormHeader = adForm.querySelector('.ad-form-header');
var adFormElement = adForm.querySelectorAll('.ad-form__element');
var mainPin = map.querySelector('.map__pin--main');
var addressField = adForm.querySelector('[name=address]');
var cardCloseButton = declarationCard.querySelector('.popup__close');


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
};
setDisabled();

var getMainPinStartCoord = function () {
  var mainPinCoordX = Math.round(MAIN_PIN_LEFT_COORD + MAIN_PIN_WIDTH * HALF_SIZE);
  var mainPinCoordY = Math.round(MAIN_PIN_TOP_COORD + MAIN_PIN_ACTIVE_HEIGHT * HALF_SIZE);
  return mainPinCoordX + ', ' + mainPinCoordY;
};
addressField.value = getMainPinStartCoord();

var onClickActivatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  setDisabled();
  accommodationPrice.placeholder = 1000;
  capacity.selectedIndex = 2;
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

// ВАЛИДАЦИЯ ФОРМЫ – В ПРОЦЕССЕ

var title = adForm.querySelector('[name=title]');
var accommodationType = adForm.querySelector('select[name="type"]');
var accommodationPrice = adForm.querySelector('#price');
var checkIn = adForm.querySelector('select[name="timein"]');
var checkOut = adForm.querySelector('select[name="timeout"]');
// var rooms = adForm.querySelector('select[name="rooms"]');
// var capacity = adForm.querySelector('select[name="capacity"]');
// var submit = adForm.querySelector('.ad-form__submit');

var onTypeChangeSetPrice = function (evt) {
  switch (evt.target.value) {
    case 'flat':
      accommodationPrice.setAttribute('placeholder', '1000');
      break;
    case 'bungalo':
      accommodationPrice.setAttribute('placeholder', '0');
      break;
    case 'house':
      accommodationPrice.setAttribute('placeholder', '5000');
      break;
    case 'palace':
      accommodationPrice.setAttribute('placeholder', '10000');
      break;
  }
};
accommodationType.addEventListener('change', onTypeChangeSetPrice);

var onChangeSwitchTimes = function (evt) {
  switch (evt.target.value) {
    case '12:00':
      if (evt.target === checkIn) {
        checkOut.selectedIndex = 0;
      } else if (evt.target === checkOut) {
        checkIn.selectedIndex = 0;
      }
      break;
    case '13:00':
      if (evt.target === checkIn) {
        checkOut.selectedIndex = 1;
      } else if (evt.target === checkOut) {
        checkIn.selectedIndex = 1;
      }
      break;
    case '14:00':
      if (evt.target === checkIn) {
        checkOut.selectedIndex = 2;
      } else if (evt.target === checkOut) {
        checkIn.selectedIndex = 2;
      }
      break;
  }
};
checkIn.addEventListener('change', onChangeSwitchTimes);
checkOut.addEventListener('change', onChangeSwitchTimes);

// (function () {
//   window.synchronizeFields = function (primaryElement, dependentElement, primaryElementValues, dependentElementValues, synchronizeElementValues) {
//     primaryElement.addEventListener('change', function (evt) {
//       primaryElementValues.forEach(function (primaryElementValue, i) {
//         if (evt.target.value === primaryElementValue) {
//           // запуск на исполнение callback функции
//           synchronizeElementValues(dependentElement, dependentElementValues[i]);
//         }
//       });
//     });
//   };
// })();

var ROOM_NUMBERS = ['1', '2', '3', '100'];
var CAPACITY = [['1'], ['2', '1'], ['3', '2', '1'], ['0']];
var rooms = adForm.querySelector('select[name="rooms"]');
var capacity = adForm.querySelector('select[name="capacity"]');

(function () {
  window.synchronizeFields = function (rooms, capacity, ROOM_NUMBER, CAPACITY) {
  rooms.addEventListener('change', function (evt) {
    ROOM_NUMBERS.forEach(function (roomsValue, i) {
      if (evt.target.value === roomsValue) {
        var guestsAvailable = CAPACITY[i];
        for (j = 0; j < guestsAvailable.length; j++) {
          capacity[j].disabled = true;
        }
      }
    });
  });
};
})();
synchronizeFields();

//
// for (i = 0; i < ROOM_NUMBERS; i++) {
//   var guestsAvailable = CAPACITY[i];
//   for (j = 0; j < guestsAvailable.length; j++) {
//     capacity[j].disabled = true;
//   }
// }

// synchronizeFields(rooms, capacity, ROOM_NUMBER, CAPACITY, synchronizeElementValues)();

// изменение количества комнат
// var onChangeRooms = function (evt) {
//   switch (evt.target.value) {
//     case '1':
//       capacity[0].disabled = true;
//       capacity[1].disabled = true;
//       capacity[2].disabled = false;
//       capacity[2].selected = true;
//       capacity[3].disabled = true;
//       break;
//     case '2':
//       capacity[0].disabled = true;
//       capacity[1].disabled = false;
//       capacity[2].selected = true;
//       capacity[2].disabled = false;
//       capacity[3].disabled = true;
//       break;
//     case '3':
//       capacity[0].disabled = false;
//       capacity[1].disabled = false;
//       capacity[2].disabled = false;
//       capacity[3].disabled = true;
//       break;
//     case '100':
//       capacity[0].disabled = true;
//       capacity[1].disabled = true;
//       capacity[2].disabled = true;
//       capacity[3].disabled = false;
//       capacity[3].selected = true;
//       break;
//   }
// };

// изменение количества гостей
// var onChangeGuests = function (evt) {
//   switch (evt.target.value) {
//     case '3':
//       rooms[0].disabled = true;
//       rooms[1].disabled = true;
//       rooms[2].disabled = false;
//       rooms[3].disabled = true;
//       rooms[2].selected = true;
//       break;
//     case '2':
//       rooms[0].disabled = false;
//       rooms[1].disabled = false;
//       rooms[2].disabled = true;
//       rooms[3].disabled = true;
//       rooms[1].selected = true;
//       break;
//     case '1':
//       rooms[0].disabled = false;
//       rooms[1].disabled = true;
//       rooms[2].disabled = true;
//       rooms[3].disabled = true;
//       rooms[0].selected = true;
//       break;
//     case '0':
//       rooms[0].disabled = true;
//       rooms[1].disabled = true;
//       rooms[2].disabled = true;
//       rooms[3].disabled = false;
//       rooms[3].selected = true;
//       break;
//   }
// };

// rooms.addEventListener('change', onChangeRooms);
// capacity.addEventListener('change', onChangeGuests);

var checkTitleField = function () {
  return (title.value.length < MIN_TITLE_LENGTH || title.value.length > MAX_TITLE_LENGTH);
};

var checkAddressField = function () {
  return (addressField.value === getMainPinStartCoord());
};

var checkPrice = function () {
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
  return room;
};

var addInvalidCondition = function (elem, text) {
  if (elem.nextSibling) {
    elem.parentNode.removeChild(elem.nextSibling);
  }
  elem.style.border = INVALID_FIELD_BORDER;
  elem.placeholder = '';
  var error = document.createElement('p');
  error.textContent = text;
  error.style.position = INVALID_MESSAGE_STYLE.position;
  error.style.marginTop = INVALID_MESSAGE_STYLE.marginTop;
  error.style.marginLeft = INVALID_MESSAGE_STYLE.marginLeft;
  error.style.fontSize = INVALID_MESSAGE_STYLE.fontSize;
  error.style.fontStyle = INVALID_MESSAGE_STYLE.fontStyle;
  error.style.color = INVALID_MESSAGE_STYLE.color;
  elem.parentNode.appendChild(error);
  return error;
};

var titleInvalidMessage = 'Введенное значение должно быть от ' + MIN_TITLE_LENGTH + ' до ' + MAX_TITLE_LENGTH + ' символов.';
var addressInvalidMessage = 'Не изменяйте это значение, оно вводится программой.';

var getPriceInvalidText = function (elem) {
  var itemText = elem.item(elem.selectedIndex).textContent;
  return 'Слишком мало для ' + itemText;
};

adForm.addEventListener('submit', function (evt) {
  if (checkTitleField()) {
    var errorTitleCondition = addInvalidCondition(title, titleInvalidMessage);

    title.addEventListener('input', function () {
      title.style.border = VALID_FIELD_BORDER;
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
    var errorAddressCondition = addInvalidCondition(addressField, addressInvalidMessage);
    evt.preventDefault();

    addressField.addEventListener('input', function () {
      addressField.style.border = VALID_FIELD_BORDER;
      if (checkAddressField()) {
        errorAddressCondition.textContent = '';
      }
    })
  }
  if (checkPrice()) {
    var errorPriceCondition = addInvalidCondition(accommodationPrice, getPriceInvalidText(accommodationType));
    evt.preventDefault();

    accommodationPrice.addEventListener('input', function () {
      accommodationPrice.style.border = VALID_FIELD_BORDER;
      if (checkPrice()) {
        errorPriceCondition.textContent = '';
      }
    });
  }
});

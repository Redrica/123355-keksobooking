'use strict';

(function () {
  var PICTURE_WIDTH = 45;
  var PICTURE_HEIGHT = 40;
  var PICTURE_ALT = 'Фотография жилья';
  var FLAT = 'Квартира';
  var BUNGALO = 'Бунгало';
  var HOUSE = 'Дом';
  var PALACE = 'Дворец';

  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');

  var createElementList = function (arr, tagName, classNameTemplate, className, parent) {
    for (var i = 0; i < arr.length; i++) {
      var newElement = document.createElement(tagName);
      var newComplexClass = classNameTemplate + arr[i];
      newElement.classList.add(className, newComplexClass);
      parent.appendChild(newElement);
    }
  };

  var createImagesList = function (arr, tagName, className, parent) {
    for (var i = 0; i < arr.length; i++) {
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
  var setCardData = function (elem, index, data) {
    elem.querySelector('.popup__avatar').src = data[index].author.avatar;
    elem.querySelector('.popup__title').textContent = data[index].offer.title;
    elem.querySelector('.popup__text--address').textContent = data[index].offer.address;
    elem.querySelector('.popup__text--price').textContent = data[index].offer.price + '₽/ночь';
    switch (data[index].offer.type) {
      case 'flat':
        elem.querySelector('.popup__type').textContent = FLAT;
        break;
      case 'bungalo':
        elem.querySelector('.popup__type').textContent = BUNGALO;
        break;
      case 'house':
        elem.querySelector('.popup__type').textContent = HOUSE;
        break;
      case 'palace':
        elem.querySelector('.popup__type').textContent = PALACE;
        break;
    }
    elem.querySelector('.popup__text--capacity').textContent = data[index].offer.rooms + ' комнаты для ' + data[index].offer.guests + ' гостей.';
    elem.querySelector('.popup__text--time').textContent = 'Заезд после ' + data[index].offer.checkin + ', выезд до ' + data[index].offer.checkout;

    var featuresList = elem.querySelector('.popup__features');
    window.util.deleteInner(featuresList);

    var featuresAvailable = data[index].offer.features;
    createElementList(featuresAvailable, 'li', 'popup__feature--', 'popup__feature', featuresList);

    elem.querySelector('.popup__description').textContent = data[index].offer.description;

    var cardPictures = elem.querySelector('.popup__photos');
    var userPictures = data[index].offer.photos;
    window.util.deleteInner(cardPictures);
    createImagesList(userPictures, 'img', 'popup__photo', cardPictures);

    return elem;
  };

  window.util.map.insertBefore(cardElement, window.util.mapFiltersContainer);
  var declarationCard = document.querySelector('.map__card');
  declarationCard.classList.add('hidden');

  var cardCloseButton = declarationCard.querySelector('.popup__close');

  var addCardCloseListeners = function () {
    cardCloseButton.addEventListener('click', onClickCloseCard);
    document.addEventListener('keydown', onEscCloseCard);
  };

  var cardRender = function (evt, data) {
    var target = evt.target;
    while (target !== window.util.map) {
      if (target.className === 'map__pin') {
        var dataAttr = target.getAttribute('data-number');
        setCardData(window.card.declarationCard, dataAttr, data);
        declarationCard.classList.remove('hidden');
      }
      target = target.parentNode;
    }
    addCardCloseListeners();
  };

  var onClickCardRender = function (evt) {
    cardRender(evt, window.util.dataFromServer);
  };

  var onFilterCardRender = function (evt) {
    cardRender(evt, window.util.serverDataFiltered);
  };

  var onClickCloseCard = function () {
    declarationCard.classList.add('hidden');
    cardCloseButton.removeEventListener('click', onClickCloseCard);
    document.removeEventListener('keydown', onEscCloseCard);
  };

  var onEscCloseCard = function (evt) {
    window.util.isEscEvent(evt, onClickCloseCard);
  };

  window.card = {
    declarationCard: declarationCard,
    onClickCardRender: onClickCardRender,
    onFilterCardRender: onFilterCardRender
  };
})();

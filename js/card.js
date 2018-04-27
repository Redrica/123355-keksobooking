'use strict';

(function () {
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');

  var deleteInner = function (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    return element;
  };

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
  var setCardData = function (elem, index) {
    elem.querySelector('.popup__avatar').src = window.data.declarationsList[index].author.avatar;
    elem.querySelector('.popup__title').textContent = window.data.declarationsList[index].offer.title;
    elem.querySelector('.popup__text--address').textContent = window.data.declarationsList[index].offer.address;
    elem.querySelector('.popup__text--price').textContent = window.data.declarationsList[index].offer.price + '₽/ночь';
    switch (window.data.declarationsList[index].offer.type) {
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
    elem.querySelector('.popup__text--capacity').textContent = window.data.declarationsList[index].offer.rooms + ' комнаты для ' + window.data.declarationsList[index].offer.guests + ' гостей.';
    elem.querySelector('.popup__text--time').textContent = 'Заезд после ' + window.data.declarationsList[index].offer.checkin + ', выезд до ' + window.data.declarationsList[index].offer.checkout;

    var featuresList = elem.querySelector('.popup__features');
    deleteInner(featuresList);
    var featuresAvailable = window.data.declarationsList[index].offer.features;
    createElementList(featuresAvailable, 'li', 'popup__feature--', 'popup__feature', featuresList);

    elem.querySelector('.popup__description').textContent = window.data.declarationsList[index].offer.description;

    var cardPictures = elem.querySelector('.popup__photos');
    var userPictures = window.data.declarationsList[index].offer.photos;
    deleteInner(cardPictures);
    createImagesList(userPictures, 'img', 'popup__photo', cardPictures);

    return elem;
  };

  window.util.map.insertBefore(cardElement, window.util.mapFiltersContainer);
  var declarationCard = document.querySelector('.map__card');
  declarationCard.classList.add('hidden');

  var cardCloseButton = declarationCard.querySelector('.popup__close');

  var onClickCardRender = function (evt) {
    var target = evt.target;
    while (target !== window.util.map) {
      if (target.className === 'map__pin') {
        declarationCard.classList.remove('hidden');
        var data = target.getAttribute('data-number');
        setCardData(window.card.declarationCard, data);
      }
      target = target.parentNode;
    }
    cardCloseButton.addEventListener('click', onClickCloseCard);
    document.addEventListener('keydown', onEscCloseCard);
  };

  var onClickCloseCard = function () {
    declarationCard.classList.add('hidden');
    cardCloseButton.removeEventListener('click', onClickCloseCard);
    document.removeEventListener('keydown', onEscCloseCard);
  };

  var onEscCloseCard = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      onClickCloseCard();
    }
  };


  window.util.map.addEventListener('click', onClickCardRender);

  window.card = {
    declarationCard: declarationCard
  }
})();

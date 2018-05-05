'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var ERROR_MESSAGE = 'Упс… что-то пошло не так!';

  var map = document.querySelector('.map');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mainPin = map.querySelector('.map__pin--main');
  var SelectedIndex = {ZERO: '0', FIRST: '1', SECOND: '2'};

  var deleteInner = function (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    return element;
  };

  var isEscEvent = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };

  var isEnterEvent = function (evt, action) {
    if (evt.keyCode === ENTER_KEYCODE) {
      action();
    }
  };

  var changeDisabledAttr = function (elem) {
    switch (elem.disabled) {
      case true:
        elem.disabled = false;
        break;
      case false:
        elem.disabled = true;
        break;
    }
  };

  var disableFields = function (indexArray, dependentList) {
    Array.prototype.forEach.call(dependentList.options, function (option) {
      option.disabled = true;
    });
    indexArray.forEach(function (number) {
      dependentList.options[number].disabled = false;
    });
  };

  var synchronizeFields = function (primaryList, dependentList, primaryValuesArray, dependentIndexArray) {
    primaryList.addEventListener('change', function (evt) {
      var value = evt.target.value;
      var arrIndex = primaryValuesArray.indexOf(value);
      disableFields(dependentIndexArray[arrIndex], dependentList);
    });
  };

  var synchronizeTimesFields = function (primaryFields, dependantFields) {
    primaryFields.addEventListener('change', function (evt) {
      var targetField = evt.target;
      dependantFields.value = targetField.value;
    });
  };

  var removePins = function (element) {
    while (element.lastChild !== window.util.mainPin) {
      element.removeChild(element.lastChild);
    }
    return element;
  };

  var onErrorMessage = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('server-error');
    node.textContent = ERROR_MESSAGE;
    document.body.insertAdjacentElement('afterbegin', node);

    var fragment = document.createDocumentFragment();
    var someText = document.createElement('p');
    someText.textContent = errorMessage;
    someText.style.fontSize = '20px';

    var closeButton = document.createElement('button');
    closeButton.classList.add('error-close');
    closeButton.textContent = '+';

    fragment.appendChild(someText);
    fragment.appendChild(closeButton);
    node.appendChild(fragment);

    var onClickCloseError = function () {
      closeButton.removeEventListener('click', onClickCloseError);
      document.removeEventListener('keydown', onEscCloseCard);
      node.parentNode.removeChild(node);
    };

    var onEscCloseCard = function (evt) {
      window.util.isEscEvent(evt, onClickCloseError);
    };

    closeButton.addEventListener('click', onClickCloseError);
    document.addEventListener('keydown', onEscCloseCard);
  };

  var dataFromServer = [];

  window.util = {
    map: map,
    mapFiltersContainer: mapFiltersContainer,
    mainPin: mainPin,
    SelectedIndex: SelectedIndex,
    deleteInner: deleteInner,
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent,
    changeDisabledAttr: changeDisabledAttr,
    synchronizeFields: synchronizeFields,
    synchronizeTimesFields: synchronizeTimesFields,
    removePins: removePins,
    onErrorMessage: onErrorMessage,

    dataFromServer: dataFromServer
  };
})();

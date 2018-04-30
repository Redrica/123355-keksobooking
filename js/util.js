'use strict';

(function () {
  var MIN_ARRAY_LENGTH = 1;
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var map = document.querySelector('.map');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mainPin = map.querySelector('.map__pin--main');

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
    if (elem.disabled) {
      elem.disabled = false;
    } else {
      elem.disabled = true;
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

  window.util = {
    map: map,
    mapFiltersContainer: mapFiltersContainer,
    mainPin: mainPin,
    calculateRandomIndex: calculateRandomIndex,
    getRandomNumber: getRandomNumber,
    getRandomUniqueElement: getRandomUniqueElement,
    getMixedArray: getMixedArray,
    getRandomLengthArray: getRandomLengthArray,
    deleteInner: deleteInner,
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent,
    changeDisabledAttr: changeDisabledAttr,
    synchronizeFields: synchronizeFields,
    synchronizeTimesFields: synchronizeTimesFields,
  };
})();

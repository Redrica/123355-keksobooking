'use strict';

(function () {
  var URL_GET = 'https://js.dump.academy/keksobooking/data';
  var URL_POST = 'https://js.dump.academy/keksobooking';

  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 400:
          error = 'Неверный запрос';
          break;
        case 404:
          error = 'Данные не найдены';
          break;
        default:
          error = 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }
      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = 5000;

    xhr.open('GET', URL_GET);
    xhr.send();
  };

  var onErrorMessage = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('server-error');
    node.textContent = 'Упс… что-то пошло не так!';
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

  var upload = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = 5000;

    xhr.open('POST', URL_POST);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    onErrorMessage: onErrorMessage,
    upload: upload
  };
})();

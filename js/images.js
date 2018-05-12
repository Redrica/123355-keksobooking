'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var SHADOW_STYLE = '0 0 2px 2px #ff6547';
  var IMAGE_WIDTH = 55;
  var IMAGE_HEIGHT = 50;
  var IMAGE_ALT = 'Фото жилья';
  var IMAGE_MARGIN = '5px';
  var avatarField = window.map.adForm.querySelector('input[name="avatar"]');
  var avatarPreview = window.map.adForm.querySelector('.ad-form-header__upload img');
  var avatarDropZone = window.map.adForm.querySelector('.ad-form-header__drop-zone');
  var flatPicturesField = window.map.adForm.querySelector('input[name="images"]');
  var flatPicturesContainer = document.querySelector('.ad-form__photo');
  var flatPicturesDropZone = document.querySelector('.ad-form__drop-zone');
  var pictureDragged;

  var checkIfUploadImg = function (file) {
    var fileName = file.name.toLowerCase();

    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  };

  var renderImgPreview = function (preview, file) {
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      preview.src = reader.result;
    });

    reader.readAsDataURL(file);
  };

  var onChangeRenderImgPreview = function () {
    if (checkIfUploadImg(avatarField.files[0])) {
      renderImgPreview(avatarPreview, avatarField.files[0]);
    }
  };

  var createFlatPicturesFragment = function (element) {
    var fragment = document.createDocumentFragment();

    Array.from(element.files).forEach(function (file) {

      if (checkIfUploadImg(file)) {
        var pictureElement = document.createElement('img');

        renderImgPreview(pictureElement, file);

        pictureElement.width = IMAGE_WIDTH;
        pictureElement.height = IMAGE_HEIGHT;
        pictureElement.style.margin = IMAGE_MARGIN;
        pictureElement.alt = IMAGE_ALT;
        pictureElement.draggable = true;

        fragment.appendChild(pictureElement);
      }
    });
    return fragment;
  };

  avatarField.addEventListener('change', onChangeRenderImgPreview);

  avatarDropZone.addEventListener('dragenter', function (evt) {
    evt.target.style.boxShadow = SHADOW_STYLE;
    evt.preventDefault();
  });

  avatarDropZone.addEventListener('dragleave', function (evt) {
    evt.target.style.boxShadow = '';
    evt.preventDefault();
  });

  avatarDropZone.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });

  avatarDropZone.addEventListener('drop', function (evt) {
    evt.preventDefault();
    evt.target.style.boxShadow = '';
    renderImgPreview(avatarPreview, evt.dataTransfer.files[0]);
  });

  flatPicturesField.addEventListener('change', function () {
    flatPicturesContainer.appendChild(createFlatPicturesFragment(flatPicturesField));
  });

  flatPicturesDropZone.addEventListener('dragenter', function (evt) {
    evt.target.style.boxShadow = SHADOW_STYLE;
    evt.preventDefault();
  });

  flatPicturesDropZone.addEventListener('dragleave', function (evt) {
    evt.target.style.boxShadow = '';
    evt.preventDefault();
  });

  flatPicturesDropZone.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });

  flatPicturesDropZone.addEventListener('drop', function (evt) {
    evt.preventDefault();
    evt.target.style.boxShadow = '';
    var files = evt.dataTransfer;

    flatPicturesContainer.appendChild(createFlatPicturesFragment(files));
  });

  flatPicturesContainer.addEventListener('dragstart', function (evt) {
    if (evt.target.tagName === 'IMG') {
      pictureDragged = evt.target;
    }
  });

  flatPicturesContainer.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });

  flatPicturesContainer.addEventListener('drop', function (evt) {
    var target = evt.target;

    if (target.tagName === 'IMG') {
      if (target.offsetTop === pictureDragged.offsetTop) {
        if (target.offsetLeft < pictureDragged.offsetLeft) {
          target.insertAdjacentElement('beforebegin', pictureDragged);
        } else if (target.offsetLeft > pictureDragged.offsetLeft) {
          target.insertAdjacentElement('afterend', pictureDragged);
        }
      } else {
        if (target.offsetTop < pictureDragged.offsetTop) {
          target.insertAdjacentElement('beforebegin', pictureDragged);
        } else if (target.offsetTop > pictureDragged.offsetTop) {
          target.insertAdjacentElement('afterend', pictureDragged);
        }
      }
    }
    evt.preventDefault();
  });
})();

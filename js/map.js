'use strict';

var OBJECT_COUNT = 8;
var TITLES = ['"Большая уютная квартира"', '"Маленькая неуютная квартира"', '"Огромный прекрасный дворец"', '"Маленький ужасный дворец"', '"Красивый гостевой домик"', '"Некрасивый негостеприимный домик"', '"Уютное бунгало далеко от моря"', '"Неуютное бунгало по колено в воде"'];
// Значения не должны повторяться.
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var ROOMS = [1, 2, 3, 4, 5];
var CHECK_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MIN_X = 300;
var MAX_X = 900;
var MIN_Y = 150;
var MAX_Y = 500;



// Создайте массив, состоящий из 8 сгенерированных JS объектов, которые будут описывать похожие объявления неподалёку.
// Структура объектов должна быть следующей:
//
// {
//   "author": {
//   "avatar": строка, адрес изображения вида img/avatars/user{{xx}}.png, где {{xx}} это число от 1 до 8 с ведущим нулём.
// Например, 01, 02 и т. д. Адреса изображений не повторяются
// },
//
//   "offer": {
//   "title": строка, заголовок предложения, одно из фиксированных значений
// "Большая уютная квартира", // "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец",
// "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря",
// "Неуютное бунгало по колено в воде".
// Значения не должны повторяться.

//   "address": строка, адрес предложения, представляет собой запись вида
// "{{location.x}}, {{location.y}}", например, "600, 350"

//   "price": число, случайная цена от 1000 до 1 000 000

//   "type": строка с одним из четырёх фиксированных значений: palace, flat, house или bungalo

//   "rooms": число, случайное количество комнат от 1 до 5

//   "guests": число, случайное количество гостей, которое можно разместить

//   "checkin": строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00,

//     "checkout": строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00

//   "features": массив строк случайной длины из ниже предложенных: "wifi", "dishwasher", "parking", "washer",
// "elevator", "conditioner",

//     "description": пустая строка,

//     "photos": массив из строк "http://o0.github.io/assets/images/tokyo/hotel1.jpg",
// "http://o0.github.io/assets/images/tokyo/hotel2.jpg" и "http://o0.github.io/assets/images/tokyo/hotel3.jpg"
// расположенных в произвольном порядке
// },
//
//   "location": {
//   "x": случайное число, координата x метки на карте от 300 до 900,
//     "y": случайное число, координата y метки на карте от 150 до 500
// }
// }

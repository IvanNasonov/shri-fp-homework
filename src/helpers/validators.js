import {
  equals,
  allPass,
  prop,
  compose,
  count,
  values,
  curry,
  gt,
  __,
  converge,
  pickBy,
  countBy,
  any,
  all,
  anyPass,
  not,
} from "ramda";

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
const moreThan = (x) => gt(__, x);

const isGreen = equals("green");
const isWhite = equals("white");
const isRed = equals("red");
const isOrange = equals("orange");
const isBlue = equals("blue");

const getTriangle = prop("triangle");
const getCircle = prop("circle");
const getStar = prop("star");
const getSquare = prop("square");

const getColorAmount = curry((color, obj) => count(equals(color), values(obj)));
const getGreenAmount = getColorAmount("green");
const getBlueAmount = getColorAmount("blue");
const getRedAmount = getColorAmount("red");
const getOrangeAmount = getColorAmount("orange");

// 1. Красная звезда, зеленый квадрат, все остальные белые.
const isTriangleWhite = compose(isWhite, getTriangle);
const isSquareGreen = compose(isGreen, getSquare);
const isStarRed = compose(isRed, getStar);
const isCircleWhite = compose(isWhite, getCircle);

export const validateFieldN1 = allPass([
  isTriangleWhite,
  isCircleWhite,
  isStarRed,
  isSquareGreen,
]);

// 2. Как минимум две фигуры зеленые.
const isMoreThanOne = moreThan(1);

export const validateFieldN2 = compose(isMoreThanOne, getGreenAmount);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = converge(equals, [getBlueAmount, getRedAmount]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
const isCircleBlue = compose(isBlue, getCircle);
const isSquareOrange = compose(isOrange, getSquare);

export const validateFieldN4 = allPass([
  isCircleBlue,
  isStarRed,
  isSquareOrange,
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
const countColors = countBy((v) => v);
const getIsNotWhiteKey = (_, key) => !isWhite(key);
const getNonWhiteColorAmounts = compose(values, pickBy(getIsNotWhiteKey));
const isMoreThanTwo = moreThan(2);
const getIsAnyMoreThanTwo = any(isMoreThanTwo);

export const validateFieldN5 = compose(
  getIsAnyMoreThanTwo,
  getNonWhiteColorAmounts,
  countColors,
  values
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
const hasTwoGreenShapes = compose(equals(2), getGreenAmount);
const isTriangleGreen = compose(isGreen, getTriangle);
const hasOneRedShape = compose(equals(1), getRedAmount);

export const validateFieldN6 = allPass([
  hasTwoGreenShapes,
  isTriangleGreen,
  hasOneRedShape,
]);

// 7. Все фигуры оранжевые.
const areAllShapesOrange = all(isOrange);

export const validateFieldN7 = compose(areAllShapesOrange, values);

// 8. Не красная и не белая звезда, остальные – любого цвета.
const isStarWhite = compose(isWhite, getStar);
const isStarWhiteOrRed = anyPass([isStarRed, isStarWhite]);

export const validateFieldN8 = compose(not, isStarWhiteOrRed);

// 9. Все фигуры зеленые.
const areAllShapesGreen = all(isGreen);

export const validateFieldN9 = compose(areAllShapesGreen, values);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
const areTriangleAndSquareTheSameColor = converge(equals, [
  getTriangle,
  getSquare,
]);
const isTriangleNotWhite = compose(not, isTriangleWhite);

export const validateFieldN10 = allPass([
  areTriangleAndSquareTheSameColor,
  isTriangleNotWhite,
]);

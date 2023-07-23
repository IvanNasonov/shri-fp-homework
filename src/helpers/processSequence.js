import {
  prop,
  compose,
  length,
  trim,
  gte,
  __,
  allPass,
  lte,
  lt,
  test,
  ifElse,
  tap,
  partial,
  assoc,
  andThen,
  otherwise,
  modulo,
  curry,
} from "ramda";
import Api from "../tools/api";

/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

// utils
const getNumberLength = compose(length, String);
const thenGetNumberLength = andThen(getNumberLength);
const square = (n) => n ** 2;
const thenSquare = andThen(square);
const thenGetThreeModulo = andThen(modulo(__, 3));

const api = new Api();

// api requests
const getResult = prop("result");
const thenGetResult = andThen(getResult);

const convertUrl = "https://api.tech/numbers/base";
const addNumberToParams = assoc("number", __, { from: 10, to: 2 });

const animalsUrl = "https://animals.tech/";
const getAnimal = curry((__) => api.get(animalsUrl + __, {}));
const thenGetAnimal = andThen(getAnimal);

const getBinaryNumber = compose(
  thenGetResult,
  api.get(convertUrl),
  addNumberToParams
);

// validating input
const getIsCorrectLength = allPass([gte(__, 2), lte(__, 10)]);
const isValidLength = compose(getIsCorrectLength, length);

const isPositive = compose(lt(0), parseFloat);

const onlyNumbersAndDotRegex = /^[0-9.]+$/g;
const hasOnlyNumbersAndDot = test(onlyNumbersAndDotRegex);

const isValidInput = allPass([isValidLength, hasOnlyNumbersAndDot, isPositive]);

// converting input
const convertInputToNumber = compose(Math.round, parseFloat);

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const log = tap(writeLog);
  const thenLog = andThen(log);
  const catchErrors = otherwise(handleError);

  const handleInvalidInput = partial(handleError, ["ValidationError"]);

  const convertToNumberAndLog = compose(log, convertInputToNumber);

  const convertToBinaryAndLog = compose(thenLog, getBinaryNumber);

  const logNumberLength = compose(thenLog, thenGetNumberLength);

  const logSquare = compose(thenLog, thenSquare);

  const logThreeModulo = compose(thenLog, thenGetThreeModulo);

  const getAnimal = compose(thenGetResult, thenGetAnimal);

  const thenHandleSuccess = andThen(handleSuccess);

  const validInputSequence = compose(
    catchErrors,
    thenHandleSuccess,
    getAnimal,
    logThreeModulo,
    logSquare,
    logNumberLength,
    convertToBinaryAndLog,
    convertToNumberAndLog
  );

  const runWithValidInput = ifElse(
    isValidInput,
    validInputSequence,
    handleInvalidInput
  );

  const logAndRun = compose(runWithValidInput, trim, log);

  logAndRun(value);
};

export default processSequence;

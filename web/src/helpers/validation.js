const evenAndOddSum = (numbers = '') => {
  let evenNumber = 0;
  let oddNumber = 0;

  /* eslint-disable-next-line no-plusplus */
  for (let i = 0; i < numbers.length - 1; i++) {
    if (i % 2 === 0) {
      let aux = 2 * +numbers[i];
      if (aux > 9) {
        aux -= 9;
      }
      evenNumber += aux;
    } else {
      oddNumber += +numbers[i];
    }
  }

  return [evenNumber, oddNumber];
};

export const validateIdCard = (idCard = '') => {
  if (idCard.length === 10) {
    const region = +idCard.substring(0, 2);
    if (region >= 1 && region <= 24) {
      const [evenNumber, oddNumber] = evenAndOddSum(idCard);
      const total = evenNumber + oddNumber;
      const verifier = total % 10 !== 0 ? 10 - (total % 10) : 0;
      return verifier === +idCard[9];
    }
  }
  return false;
};

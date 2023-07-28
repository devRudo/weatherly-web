export const convertTemp = (temp, currentUnit, requiredUnit) => {
  if (currentUnit === 'C' && requiredUnit === 'F') {
    return ((temp * 9) / 5 + 32).toFixed(0);
  }
};

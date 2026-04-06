export const calculateBMR = (
  gender: 'male' | 'female',
  weight: number,
  height: number,
  age: number
): number => {
  if (gender === 'male') {
    return Math.trunc((10 * weight) + (6.25 * height) - (5 * age) + 5);
  } else {
    return Math.trunc((10 * weight) + (6.25 * height) - (5 * age) - 161);
  }
};

export const calculateTDEE = (
  bmr: number,
  activityFactor: number
): number => {
  const activityMultipliers: Record<number, number> = {
    1: 1.2,
    2: 1.375,
    3: 1.55,
    4: 1.725,
    5: 1.9,
  };
  return Math.trunc(bmr * (activityMultipliers[activityFactor] || 1.2));
};

function sinc(x) {
  if (x === 0) return 1;
  return Math.sin(Math.PI * x) / (Math.PI * x);
}

function lanczosWindow(x, a) {
  return Math.abs(x) > a ? 0 : sinc(x / a);
}

export function createFilterCache() {
  return new Map();
}

export function getFilterCoefficients(cache, fraction, cutoff, filterWindow) {
  const cacheKey = fraction.toString();
  let coefficients = cache.get(cacheKey);
  if (coefficients) return { coefficients, hit: true };

  coefficients = [];
  let weightSum = 0;
  for (let offset = -filterWindow + 1; offset <= filterWindow; offset++) {
    const x = fraction - offset;
    const weight = cutoff * sinc(cutoff * x) * lanczosWindow(x, filterWindow);
    coefficients.push([offset, weight]);
    weightSum += weight;
  }
  coefficients.weightSum = weightSum;
  if (cache.size < 4096) cache.set(cacheKey, coefficients);
  return { coefficients, hit: false };
}

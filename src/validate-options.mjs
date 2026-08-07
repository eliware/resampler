const MAX_SAMPLE_RATE = 1_000_000;
const MAX_FILTER_WINDOW = 4096;

export function validateOptions({ inRate, outRate, inChannels, outChannels, filterWindow, volume }) {
  if (!Number.isFinite(inRate) || inRate <= 0 || inRate > MAX_SAMPLE_RATE) {
    throw new TypeError('inRate must be a finite number greater than 0 and at most 1000000');
  }
  if (!Number.isFinite(outRate) || outRate <= 0 || outRate > MAX_SAMPLE_RATE) {
    throw new TypeError('outRate must be a finite number greater than 0 and at most 1000000');
  }
  if (!Number.isInteger(inChannels) || ![1, 2].includes(inChannels)) {
    throw new TypeError('inChannels must be 1 or 2');
  }
  if (!Number.isInteger(outChannels) || ![1, 2].includes(outChannels)) {
    throw new TypeError('outChannels must be 1 or 2');
  }
  if (!Number.isInteger(filterWindow) || filterWindow <= 0 || filterWindow > MAX_FILTER_WINDOW) {
    throw new TypeError('filterWindow must be a positive integer at most 4096');
  }
  if (!Number.isFinite(volume)) {
    throw new TypeError('volume must be a finite number');
  }
}

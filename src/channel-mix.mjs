export function mapChannels(channelValues, inChannels, outChannels) {
  if (inChannels === 2 && outChannels === 1) {
    return [(channelValues[0] + channelValues[1]) / 2];
  }
  if (inChannels === 1 && outChannels === 2) {
    return [channelValues[0], channelValues[0]];
  }
  return channelValues.slice(0, outChannels);
}

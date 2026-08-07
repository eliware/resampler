import { Resampler } from '@eliware/resampler';

new Resampler({ inRate: 48_000, outRate: 24_000, inChannels: 1, outChannels: 2 });

// @ts-expect-error channel counts are limited to mono/stereo
new Resampler({ inRate: 48_000, outRate: 24_000, inChannels: 3 });

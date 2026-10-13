# API

## Resampler

Create a `Resampler` Transform stream with an options object:

```js
import { Resampler } from "@eliware/resampler";

const stream = new Resampler({ inRate: 48000, outRate: 24000 });
```

Pipe signed 16-bit little-endian PCM data into the stream. Read PCM output from the stream.

## Options

| Option         | Required | Default | Rules                                                     |
| -------------- | -------- | ------- | --------------------------------------------------------- |
| `inRate`       | Yes      | None    | Finite number greater than 0 and at most 1,000,000.       |
| `outRate`      | Yes      | None    | Finite number greater than 0 and at most 1,000,000.       |
| `inChannels`   | No       | `1`     | `1` for mono or `2` for stereo.                           |
| `outChannels`  | No       | `1`     | `1` for mono or `2` for stereo.                           |
| `filterWindow` | No       | `8`     | Integer from `1` to `4096`. A larger value uses more CPU. |
| `volume`       | No       | `1`     | Any finite number. Negative values reverse polarity.      |

The constructor throws `TypeError` when an option has an invalid value.

## Channel maps

Mono-to-mono output keeps one channel. Mono-to-stereo output copies one sample to both channels.
Stereo-to-mono output averages the left and right samples. Stereo-to-stereo output keeps both channels.

## Frames and chunks

Each input frame contains one sample per input channel. Each sample uses two bytes. A mono frame uses two bytes. A stereo frame uses four bytes.

The stream buffers incomplete frames across chunks. It emits an error if the final input does not contain a complete frame.

## Filter delay and output size

The windowed-sinc filter waits for enough input before it writes output. At stream end, it adds `filterWindow` zero samples to write the available tail.

This edge behavior can change the output length. Use the emitted stream length as the exact output size. Do not rely on a simple rate ratio for exact frame counts.

## Output level

The stream scales each sample by `volume`. It rounds output and clips values to the signed 16-bit range. A negative `volume` reverses polarity. A value above `1` raises the level until clipping occurs.

Read the [PCM format guide](pcm-format.md) for byte order and frame layout.

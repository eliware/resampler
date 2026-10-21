# API

## Resampler

Create a `Resampler` Transform stream with an options object. The stream accepts `Buffer` input and writes `Buffer` output.

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
| `volume`       | No       | `1`     | Finite number. Negative values change signal polarity.    |
| `logger`       | No       | Silent  | Logger from `@eliware/log` or a compatible logger.        |

The constructor throws `TypeError` when a required rate is missing or an option has an invalid value. Rates must be finite numbers above `0` and at most `1,000,000`. The channel counts must be `1` or `2`. The filter window must be an integer from `1` to `4096`. The volume must be finite.

## Logging

Pass a logger from `@eliware/log` with the `logger` option to receive structured records. The default logger writes no records. A compatible logger must provide the `error`, `warn`, `info`, `verbose`, `debug`, and `silly` methods.

The resampler uses these levels for creation, input, cache, and stream events:

- `debug`: resampler creation.
- `verbose`: processed input.
- `silly`: pending input and filter cache status.
- `info`: completed flush.
- `warn`: incomplete final frame.
- `error`: flush failure.

The logger also supports the `http` level, but the resampler does not write HTTP records. Each record includes a stable `event` field and safe operation details. The resampler does not log audio data, credentials, tokens, or error messages.

## Channel maps

Mono-to-mono output keeps one channel. Mono-to-stereo output copies one sample to both channels.
Stereo-to-mono output averages the left and right samples. Stereo-to-stereo output keeps both channels.

## Frames and chunks

Each input frame contains one sample for each input channel. Each sample uses two bytes. A mono frame uses two bytes. A stereo frame uses four bytes.

The stream buffers incomplete frames across chunks. It reports an error if the final input does not contain a complete frame.

## Filter wait and output length

The windowed-sinc filter waits until it has sufficient input before it writes output. It can produce no output before it receives sufficient input. It does not add output padding when the stream ends.

The filter window affects the output frame count. Use the stream output length for the exact frame count. Do not use a rate ratio to calculate an exact frame count.

## Output level

The stream scales each sample by `volume`. It rounds output and clips values to the signed 16-bit range. A negative `volume` reverses polarity. A value above `1` raises the level until clipping occurs.

Read the [PCM format guide](pcm-format.md) for byte order and frame layout.

## Stream errors

The stream reports input and processing errors through its `error` event. Use Node.js `pipeline` to pass errors to the caller and to close connected streams. The [usage guide](usage.md#convert-audio) shows a `pipeline` example.

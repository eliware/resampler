# PCM format

The resampler accepts signed 16-bit little-endian PCM, also called s16le. Store each sample in two bytes. Store the low byte first.

## Mono frames

Each mono frame contains one sample:

| Byte | Value                   |
| ---- | ----------------------- |
| 0    | Low byte of the sample  |
| 1    | High byte of the sample |

## Stereo frames

Each stereo frame contains the left sample, then the right sample. Each sample uses two bytes.

| Byte | Value                   |
| ---- | ----------------------- |
| 0    | Left sample, low byte   |
| 1    | Left sample, high byte  |
| 2    | Right sample, low byte  |
| 3    | Right sample, high byte |

## Stream chunks

A chunk can end in the middle of a frame. The resampler keeps those bytes and joins them to the next chunk. The final input must contain complete frames. The stream emits an error when the final frame is incomplete.

Set `inChannels` to match the input layout. Set `outChannels` to the required output layout. Read the [API guide](api.md) for channel maps and output behavior.

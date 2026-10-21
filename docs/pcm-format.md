# PCM format

The resampler accepts raw signed 16-bit little-endian PCM, also called s16le. The data has no file header. Store each sample in two bytes. Store the low byte first.

Each sample represents a signed integer from `-32768` through `32767`. The input rate and channel layout do not appear in the byte stream. Supply them with the `inRate` and `inChannels` options.

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

A chunk can end in the middle of a frame. The resampler keeps those bytes and joins them to a later chunk. The final input must contain complete frames. The stream reports an error when the final frame is incomplete.

Set `inChannels` to match the input layout. Set `outChannels` to the required output layout. Read the [API guide](api.md) for channel maps and output behavior.

## Create a sample

Use `writeInt16LE` to create a sample buffer in Node.js:

```js
const input = Buffer.alloc(4);
input.writeInt16LE(12000, 0); // left sample
input.writeInt16LE(-12000, 2); // right sample
```

This buffer contains one stereo frame. Pass `inChannels: 2` to the resampler.

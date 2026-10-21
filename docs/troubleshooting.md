# Troubleshooting

## The stream emits no output

The filter needs sufficient input before it can write output. Input shorter than `filterWindow` frames can produce no output. Empty input produces no output.

## The stream reports an incomplete PCM frame

Check the input data and channel count. Mono input needs complete two-byte frames. Stereo input needs complete four-byte frames.
Keep incomplete bytes between chunks. Remove an incomplete final frame or provide the missing bytes before the stream ends.

## The output length differs from the rate estimate

The filter waits for input before it writes output. It does not add output padding at stream end. Use the stream output length for the exact frame count. Read [filter wait and output length](api.md#filter-wait-and-output-length).

## The output sounds distorted

Check that `inRate` matches the input rate. Check that `inChannels` matches the input layout.
Keep `volume` from `0` to `1` to prevent output distortion. Negative values change signal polarity. Values above `1` can cause output distortion.

Confirm that the input is signed 16-bit little-endian PCM. The package does not convert sample formats. It clips output values to the signed 16-bit range.

## Stereo output has an incorrect channel map

Set `inChannels` and `outChannels` to `1` or `2`. Stereo-to-mono output uses the average of both channels. Mono-to-stereo output copies the mono sample to both channels.

## The constructor throws `TypeError`

Check that both rates are finite values above `0` and at most `1,000,000`. Check that channel counts are `1` or `2`. Check that `filterWindow` is an integer from `1` to `4096`. Check that `volume` is finite.

Pass both `inRate` and `outRate`. Check that each option uses a number and that the rate is not zero.

## The logger option causes an error

Pass a logger that provides `error`, `warn`, `info`, `verbose`, `debug`, and `silly` methods. Install `@eliware/log` if your application needs the `createLogger` function.

## Repository checks fail

Use Node.js 26 or later. Run `npm ci`. Then run `npm test`.
Read the first reported error. Correct that item.

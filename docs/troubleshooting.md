# Troubleshooting

## The stream emits no output

The filter needs sufficient input before it can write output. Input shorter than `filterWindow` frames can produce no output. Empty input produces no output.

## The stream reports an incomplete PCM frame

Check the input byte count. Mono input needs a byte count divisible by two. Stereo input needs a byte count divisible by four.
Keep incomplete frames between chunks. Remove an incomplete final frame.

## The output length differs from the rate estimate

The filter waits before it writes output and adds zero samples at stream end. Use the emitted stream length for the exact frame count. Read [filter wait and output length](api.md#filter-wait-and-output-length).

## The output sounds distorted

Check that `inRate` matches the input rate. Check that `inChannels` matches the input layout.
Keep `volume` from `0` to `1` to prevent output distortion. Negative values change signal polarity. Values above `1` can cause output distortion.

## Stereo output has an incorrect channel map

Set `inChannels` and `outChannels` to `1` or `2`. Stereo-to-mono output uses the average of both channels. Mono-to-stereo output copies the mono sample to both channels.

## The constructor throws `TypeError`

Check that both rates are finite values above `0` and at most `1,000,000`. Check that channel counts are `1` or `2`. Check that `filterWindow` is an integer from `1` to `4096`. Check that `volume` is finite.

## Repository checks fail

Use Node.js 26 or later. Run `npm ci`. Then run `npm test`.
Read the first reported error. Correct that item.

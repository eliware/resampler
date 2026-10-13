# Troubleshooting

## The stream emits no output

The filter needs enough input before it can write output. Input shorter than `filterWindow` frames can produce no output. Empty input always produces no output.

## The stream reports an incomplete PCM frame

Check the input byte count. Mono input needs an even number of bytes. Stereo input needs a byte count divisible by four.
Keep partial frames between chunks. Remove an incomplete final frame.

## The output length differs from the rate estimate

The filter delays output and adds zero samples at stream end. Use the emitted stream length as the exact size. Read [filter delay and output size](api.md#filter-delay-and-output-size).

## The output sounds distorted

Check that `inRate` matches the input rate. Check that `inChannels` matches the input layout.
Keep `volume` within a suitable range. Values above `1` can clip the output.

## Stereo output has the wrong channel map

Set `inChannels` and `outChannels` to `1` or `2`. Stereo-to-mono output uses the average of both channels. Mono-to-stereo output copies the mono sample to both channels.

## The constructor throws `TypeError`

Check that both rates are finite values above `0` and at most `1,000,000`. Check that channel counts are `1` or `2`. Check that `filterWindow` is an integer from `1` to `4096`. Check that `volume` is finite.

## Repository checks fail

Use Node.js 26 or later. Run `npm ci`. Then run `npm test`.
Read the first reported error. Correct that item.

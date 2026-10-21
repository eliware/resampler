# Examples

- [Stream conversion](example.mjs)
- [Benchmark](benchmark.mjs)

Use Node.js 26 or later. Run `node examples/example.mjs` from the repository root to run the conversion examples. The program creates sample PCM data in memory. It does not need input files.

The program creates `resampler-example-output/` in the current directory. It writes three output files there. Use the first argument to name the output directory.

Run the packaged example from a consumer project with `node node_modules/@eliware/resampler/examples/example.mjs`. The program creates the output directory in the consumer project, not in the installed package.

Run `node examples/benchmark.mjs` to measure conversion speed. The command writes no files.

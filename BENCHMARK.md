# Benchmark

Command:

```sh
npm run benchmark -- 48000 5
```

Five-run median timings with cached coefficients, on the local development host:

| Conversion | Window | Median | Min | Max | Output unchanged |
|---|---:|---:|---:|---:|:---:|
| 48k -> 44.1k | 4 | 44.44 ms | 31.97 ms | 46.13 ms | yes |
| 48k -> 44.1k | 8 | 34.49 ms | 31.95 ms | 39.94 ms | yes |
| 48k -> 44.1k | 16 | 46.76 ms | 45.07 ms | 48.52 ms | yes |
| 48k -> 24k | 8 | 13.87 ms | 12.67 ms | 48.54 ms | yes |
| 24k -> 48k | 8 | 51.79 ms | 50.70 ms | 52.69 ms | yes |

Results are host-dependent. Re-run before making performance decisions.

Decision: keep the bounded cache. It improves the common `filterWindow: 8` and larger-window cases in these runs; `filterWindow: 4` is noisier and may be slower. Revisit if profiling shows small-window workloads dominate.

Polyphase filtering is deferred. The bounded fractional-phase coefficient cache provides part of the same reuse without changing filter output or adding a fixed phase quantization error. Reconsider if profiling identifies coefficient generation as the dominant cost.

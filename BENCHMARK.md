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

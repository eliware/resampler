# Benchmark

Command:

```sh
npm run benchmark -- 48000
```

Comparison uses 48,000 mono input frames, with cached coefficients compared against the parent revision. Timings are single-run wall-clock measurements and are environment-dependent.

| Conversion | Window | Before | After | Output unchanged |
|---|---:|---:|---:|:---:|
| 48k -> 44.1k | 4 | 38.68 ms | 46.17 ms | yes |
| 48k -> 44.1k | 8 | 54.44 ms | 79.56 ms | yes |
| 48k -> 44.1k | 16 | 73.16 ms | 55.00 ms | yes |
| 48k -> 24k | 8 | 26.71 ms | 22.87 ms | yes |
| 24k -> 48k | 8 | 80.81 ms | 80.55 ms | yes |

Results are noisy across runs; caching improves some cases but does not consistently improve total runtime. Use repeated runs before further optimization decisions.

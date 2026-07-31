# Self-hosted fonts

Both files are subsetted variable fonts, built with `fonttools` from the
Google Fonts latin-only source files.

| File                      | Source            | Axes kept | Weight range | Notes                                                                                                                                            |
| ------------------------- | ----------------- | --------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `fraunces-variable.woff2` | Fraunces (Google) | `wght`    | 300–700      | `opsz` pinned at 72 to cut the interpolation dimension; this font is only used for headings, so a fixed optical size is an acceptable trade-off. |
| `inter-variable.woff2`    | Inter (Google)    | `wght`    | 400–700      | Weights outside 400–700 are not used by the design system.                                                                                       |

Total size: ~68 KB (budget: ≤ 90 KB for both files combined, see `CLAUDE.md`).

## Regenerating

```bash
pip install fonttools brotli

# Fraunces: pin opsz, keep wght variable, subset to Latin
python -m fontTools.varLib.instancer fraunces-src.woff2 opsz=72 wght=300:400:700 -o fraunces-instanced.woff2
python -m fontTools.subset fraunces-instanced.woff2 \
  --output-file=fraunces-variable.woff2 --flavor=woff2 --no-hinting \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215"

# Inter: keep wght variable, subset to Latin
python -m fontTools.varLib.instancer inter-src.woff2 wght=400:400:700 -o inter-instanced.woff2
python -m fontTools.subset inter-instanced.woff2 \
  --output-file=inter-variable.woff2 --flavor=woff2 --no-hinting \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215"
```

The `*-src.woff2` files are the latin-only variable fonts served by
`fonts.googleapis.com/css2` for a Chrome user agent.

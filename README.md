# MRT v3 Stress Test

A React 18 + Material React Table v3 stress test with:

- **3,000 rows × 20 columns** of realistic fake data
- **Per-column text filters** (inline subheader row)
- **Row virtualisation** — only visible rows are rendered in the DOM
- **Column virtualisation** — only visible columns are rendered
- **Filter timing badge** — shows how long the last filter operation took
- Compact density + sticky header for maximum data density
- Global filter disabled (per-column only, faster for large datasets)
- Pagination disabled (all rows virtualised instead)

## Setup

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Performance Notes

The key settings for maximum filter speed:

| Setting | Value | Why |
|---|---|---|
| `enableRowVirtualization` | `true` | Only ~30–50 DOM rows at a time |
| `enableColumnVirtualization` | `true` | Only ~8–10 DOM cells per row |
| `enablePagination` | `false` | No paginator overhead; virtual scroller handles it |
| `columnFilterDisplayMode` | `'subheader'` | Inline row avoids popover re-render cost |
| `filterFn` | `'contains'` | Fastest built-in string filter in TanStack Table |
| `enableGlobalFilter` | `false` | Eliminates the global filter pass |
| `rowVirtualizerOptions.overscan` | `20` | Smoother scroll without thrashing |

## Tuning

- **Increase overscan** (`rowVirtualizerOptions.overscan`) if you see blank rows during fast scrolling
- **Switch filterFn to `'startsWith'`** if you want faster filter (fewer comparisons)
- **Add `autoResetPageIndex: false`** if you add pagination back, to prevent page jumps on filter

## Dependencies

- `material-react-table` ^3.0
- `@tanstack/react-virtual` ^3.0
- `@mui/material` ^5.x
- `react` 18

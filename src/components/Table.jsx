import React, { useState, useCallback, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Chip, Typography } from "@mui/material";
import { COLUMN_SCHEMA } from "../data/generateData.js";

function StatsBar({ filteredCount, totalCount, filterTime }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 1.5,
        alignItems: "center",
        flexWrap: "wrap",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Typography variant="caption" sx={{ color: "#666" }}>
        MRT v3 Stress Test
      </Typography>
      <Chip
        label={`${filteredCount.toLocaleString()} / ${totalCount.toLocaleString()} rows`}
        size="small"
        color={filteredCount < totalCount ? "primary" : "default"}
      />
      <Chip label={`${COLUMN_SCHEMA.length} columns`} size="small" />
      <Chip label="Virtualized ✓" size="small" color="success" />
      {filterTime !== null && (
        <Chip
          label={`Last filter: ${filterTime}ms`}
          size="small"
          color={
            filterTime < 50 ? "success" : filterTime < 150 ? "warning" : "error"
          }
        />
      )}
    </Box>
  );
}

// Derives MRT column definitions from a schema — the same pattern you'd use
// when columns arrive dynamically from an API response.
function buildColumnsFromSchema(schema) {
  return schema.map((col) => ({
    accessorKey: col.key,
    header: col.label,
    size: col.width,
    enableColumnFilter: true,
    filterFn: "contains",
    muiFilterTextFieldProps: {
      placeholder: "Filter…",
      variant: "outlined",
      size: "small",
      sx: { "& input": { fontSize: "0.7rem", py: 0.5 } },
    },
    ...(col.type === "link" && {
      Cell: ({ cell }) => (
        <Link
          to={col.href(cell.getValue())}
          style={{ color: "#1976d2", textDecoration: "none", fontWeight: 500 }}
          onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
          onMouseOut={(e) => (e.target.style.textDecoration = "none")}
        >
          {cell.getValue()}
        </Link>
      ),
    }),
  }));
}

export default function Table({ data }) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [filteredCount, setFilteredCount] = useState(data.length);
  const [filterTime, setFilterTime] = useState(null);
  const filterStartRef = useRef(null);

  // useMemo here - we only want to rebuild column defs when
  // the schema actually changes — not on every render.
  const columns = useMemo(() => buildColumnsFromSchema(COLUMN_SCHEMA), []);

  const handleColumnFiltersChange = useCallback((updaterOrValue) => {
    filterStartRef.current = performance.now();
    setColumnFilters(updaterOrValue);
  }, []);

  const table = useMaterialReactTable({
    columns,
    data,

    // ── Controlled state ───────────────────────────────────────────────────
    state: { columnFilters, showColumnFilters: true },
    onColumnFiltersChange: handleColumnFiltersChange,

    // ── Filtering ──────────────────────────────────────────────────────────
    columnFilterDisplayMode: "subheader",
    enableColumnFilters: true,
    enableGlobalFilter: false,
    enableFilterMatchHighlighting: false,

    // ── Sorting ────────────────────────────────────────────────────────────
    enableSorting: true,

    // ── Virtualization ─────────────────────────────────────────────────────
    enablePagination: false,
    enableRowVirtualization: true,
    rowVirtualizerOptions: { overscan: 20 },
    enableColumnVirtualization: true,
    columnVirtualizerOptions: { overscan: 5 },

    // ── UI features ────────────────────────────────────────────────────────
    enableStickyHeader: true,
    enableColumnResizing: true,
    enableGrouping: false,
    enableRowSelection: false,
    enableColumnOrdering: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,

    initialState: { density: "compact" },

    // ── Styling ────────────────────────────────────────────────────────────
    muiTableContainerProps: {
      sx: { maxHeight: "calc(100vh - 140px)" },
    },
    muiTablePaperProps: {
      elevation: 1,
      sx: { borderRadius: 0 },
    },
    muiTableHeadCellProps: {
      sx: {
        bgcolor: "#f5f5f5",
        borderBottom: "2px solid #e0e0e0",
        fontSize: "0.75rem",
        fontWeight: 700,
        color: "#111",
        py: 1,
      },
    },
    muiTableBodyCellProps: {
      sx: {
        borderBottom: "1px solid #f0f0f0",
        fontSize: "0.72rem",
        color: "#222",
        py: 0.4,
        px: 1,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        bgcolor: row.index % 2 === 0 ? "#fff" : "#fafafa",
        "&:hover td": { bgcolor: "#f0f7ff" },
        transition: "background 0.1s",
      },
    }),

    // ── Toolbars ───────────────────────────────────────────────────────────
    renderTopToolbar: ({ table }) => {
      const count = table.getFilteredRowModel().rows.length;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      React.useEffect(() => {
        setFilteredCount(count);
        if (filterStartRef.current !== null) {
          setFilterTime(Math.round(performance.now() - filterStartRef.current));
          filterStartRef.current = null;
        }
      }, [count]);

      return (
        <StatsBar
          filteredCount={count}
          totalCount={data.length}
          filterTime={filterTime}
        />
      );
    },
    renderBottomToolbar: () => null,
  });

  return <MaterialReactTable table={table} />;
}

import { Box, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Table from "./components/Table.jsx";
import { generateData } from "./data/generateData.js";

// Font set once here — all MUI components inherit it automatically,
// no need to pass fontFamily into individual sx props.
const theme = createTheme({
  typography: {
    fontFamily:
      '"ui-monospace", "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace',
  },
});

const DATA = generateData(3000);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ p: 1.5, borderBottom: "1px solid #e0e0e0" }}>
          <Typography
            variant="h6"
            sx={{ fontSize: "0.9rem", letterSpacing: 1 }}
          >
            Material React Table v3 — Stress Test
          </Typography>
          <Typography variant="caption" sx={{ color: "#666" }}>
            3,000 rows × 20 columns · Row + Column Virtualisation · Type in the
            filter inputs below each column header
          </Typography>
        </Box>
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <Table data={DATA} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

import { useCallback, useState } from "react";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export default function ReportActions({
  selectedCount,
  onOpenReportDialog,
  disabled,
}) {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);

  const closeMenus = useCallback(() => {
    setExportAnchorEl(null);
    setMenuAnchorEl(null);
  }, []);

  const handleOpenMenu = useCallback((event) => {
    setMenuAnchorEl(event.currentTarget);
  }, []);

  const handleOpenExportMenu = useCallback((event) => {
    setExportAnchorEl(event.currentTarget);
  }, []);

  const handleCloseExportMenu = useCallback(() => {
    setExportAnchorEl(null);
  }, []);

  const handleReportRowError = useCallback(() => {
    closeMenus();
    onOpenReportDialog();
  }, [closeMenus, onOpenReportDialog]);

  return (
    <>
      <Button
        variant="contained"
        size="small"
        onClick={handleOpenMenu}
        sx={{ ml: "auto", textTransform: "none" }}
      >
        Row Actions ({selectedCount})
      </Button>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={closeMenus}
      >
        <MenuItem disabled={disabled} onClick={handleReportRowError}>
          Report Row Error
        </MenuItem>
        <MenuItem onClick={handleOpenExportMenu}>
          <Box
            sx={{ display: "flex", width: "100%", alignItems: "center", gap: 1 }}
          >
            <Typography variant="inherit" sx={{ flex: 1 }}>
              Export
            </Typography>
            <KeyboardArrowRightIcon fontSize="small" />
          </Box>
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        onClose={handleCloseExportMenu}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem disabled onClick={handleCloseExportMenu}>
          CSV
        </MenuItem>
        <MenuItem disabled onClick={handleCloseExportMenu}>
          XLS
        </MenuItem>
      </Menu>
    </>
  );
}

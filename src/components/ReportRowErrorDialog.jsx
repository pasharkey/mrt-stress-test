import { useCallback, useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Radio,
  Typography,
} from "@mui/material";
import { useReportRowDetails } from "../hooks/useReportRowDetails.js";

export default function ReportRowErrorDialog({
  open,
  onClose,
  selectedRows,
  primaryRowId,
  onPrimaryRowChange,
  reportPayload,
  onSave,
  isSaving,
  saveError,
}) {
  const hasSelectedRows = selectedRows.length > 0;
  const {
    detailQueries,
    isFetchingDetails,
    hasDetailErrors,
    rowDetailsById,
  } = useReportRowDetails(selectedRows, open);

  const hydratedReportPayload = useMemo(
    () => ({
      ...reportPayload,
      rowDetailsById,
    }),
    [reportPayload, rowDetailsById],
  );

  const handleSave = useCallback(async () => {
    if (isFetchingDetails || hasDetailErrors || !hasSelectedRows) return;
    await onSave(hydratedReportPayload);
  }, [
    hasDetailErrors,
    hasSelectedRows,
    hydratedReportPayload,
    isFetchingDetails,
    onSave,
  ]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Report Row Error</DialogTitle>
      <DialogContent dividers>
        {!hasSelectedRows ? (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Select at least one row before reporting an error.
          </Typography>
        ) : (
          <>
            <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
              Choose the primary row for this report. All other selected rows
              will be treated as related records.
            </Typography>
            <Typography
              variant="caption"
              sx={{ mb: 1.5, display: "block", color: "#666" }}
            >
              Use the radio button on the right to set a row as the primary
              record.
            </Typography>
            {isFetchingDetails && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.5,
                  color: "text.secondary",
                }}
              >
                <CircularProgress size={16} />
                <Typography variant="caption">
                  Fetching additional row details before save can be enabled.
                </Typography>
              </Box>
            )}
            {hasDetailErrors && (
              <Alert severity="error" sx={{ mb: 1.5 }}>
                One or more row detail requests failed. Save stays disabled until
                all detail requests succeed.
              </Alert>
            )}
            {saveError && (
              <Alert severity="error" sx={{ mb: 1.5 }}>
                {saveError.message || "Unable to save entity feedback."}
              </Alert>
            )}
            <List dense sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}>
              {selectedRows.map((row, index) => {
                const isPrimary = row.id === primaryRowId;
                const query = detailQueries[index];
                const detailText = query?.data
                  ? `Audit ${query.data.auditId} · ${query.data.sourceSystem} · ${query.data.reviewerHint}`
                  : query?.isError
                    ? "Unable to load additional details"
                    : "Fetching additional details...";

                return (
                  <ListItem
                    key={row.id}
                    secondaryAction={
                      <Radio
                        edge="end"
                        checked={isPrimary}
                        onChange={() => onPrimaryRowChange(row.id)}
                        value={row.id}
                        inputProps={{
                          "aria-label": `Mark ${row.firstName} ${row.lastName} as primary`,
                        }}
                      />
                    }
                  >
                    <ListItemText
                      primary={`${row.firstName} ${row.lastName}`}
                      secondary={
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <Box component="span">{`${row.country} · ${row.status}`}</Box>
                            {isPrimary && (
                              <Chip
                                label="Primary"
                                size="small"
                                color="primary"
                                sx={{ height: 20 }}
                              />
                            )}
                          </Box>
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 1,
                              color: query?.isError
                                ? "error.main"
                                : "text.secondary",
                            }}
                          >
                            {(query?.isPending || query?.isFetching) && (
                              <CircularProgress size={12} />
                            )}
                            <Typography component="span" variant="caption">
                              {detailText}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
            <Typography
              variant="caption"
              sx={{ mt: 2, display: "block", color: "#666" }}
            >
              Payload ready for persistence:{" "}
              {hydratedReportPayload.primaryRowId ?? "none"} as primary,{" "}
              {hydratedReportPayload.relatedRowIds.length} related row
              {hydratedReportPayload.relatedRowIds.length === 1 ? "" : "s"},{" "}
              {Object.keys(hydratedReportPayload.rowDetailsById).length} detail
              payload
              {Object.keys(hydratedReportPayload.rowDetailsById).length === 1
                ? ""
                : "s"}{" "}
              loaded.
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={
            !hasSelectedRows || isFetchingDetails || hasDetailErrors || isSaving
          }
          startIcon={
            isFetchingDetails || isSaving ? (
              <CircularProgress size={14} color="inherit" />
            ) : null
          }
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

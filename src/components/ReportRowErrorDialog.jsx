import { useCallback, useEffect, useMemo, useState } from "react";
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
  TextField,
  Typography,
} from "@mui/material";
import { useReportRowDetails } from "../hooks/useReportRowDetails.js";

export default function ReportRowErrorDialog({
  open,
  onClose,
  selectedRows,
  reportPayload,
  onSave,
  isSaving,
  saveError,
}) {
  const hasSelectedRows = selectedRows.length > 0;
  const [primaryRowId, setPrimaryRowId] = useState(null);
  const [comments, setComments] = useState("");
  const {
    detailQueries,
    isFetchingDetails,
    hasDetailErrors,
    rowDetailsById,
  } = useReportRowDetails(selectedRows, open);

  useEffect(() => {
    if (!open || selectedRows.length === 0) {
      setPrimaryRowId(null);
      setComments("");
      return;
    }

    if (!primaryRowId || !selectedRows.some((row) => row.id === primaryRowId)) {
      setPrimaryRowId(selectedRows[0].id);
    }
  }, [open, primaryRowId, selectedRows]);

  const hydratedReportPayload = useMemo(
    () => {
      const primaryRow = selectedRows.find((row) => row.id === primaryRowId);
      const relatedRows = selectedRows.filter((row) => row.id !== primaryRowId);

      if (!primaryRow) {
        return {
          ...reportPayload,
          primaryRowId: null,
          relatedRowIds: [],
          comments,
          metadata: {
            entitiesToMerge: [],
          },
          rowDetailsById,
        };
      }

      const buildEntityPayload = (row) => {
        const details = rowDetailsById[row.id];

        return {
          name: `${row.firstName} ${row.lastName}`,
          dob: row.dob,
          country: row.country,
          eid: row.id,
          qids: details?.qids ?? [],
        };
      };

      return {
        userId: "user-123",
        ...buildEntityPayload(primaryRow),
        type: "merge",
        comments,
        metadata: {
          entitiesToMerge: relatedRows.map(buildEntityPayload),
        },
      };
    },
    [comments, primaryRowId, reportPayload, rowDetailsById, selectedRows],
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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      PaperProps={{
        sx: {
          height: "min(720px, calc(100vh - 64px))",
          display: "flex",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle>Report Row Error</DialogTitle>
      <DialogContent
        dividers
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflow: "hidden",
        }}
      >
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
            <Typography variant="caption" sx={{ display: "block", color: "#666" }}>
              Total entities selected: {selectedRows.length}
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
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflow: "auto",
                border: "1px solid #e0e0e0",
                borderRadius: 1,
              }}
            >
              <List dense disablePadding>
                {selectedRows.map((row, index) => {
                  const isPrimary = row.id === primaryRowId;
                  const query = detailQueries[index];
                  const detailText = query?.data
                    ? `${query.data.qids.length} qids · ${query.data.sourceSystem} · ${query.data.reviewerHint}`
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
                          onChange={() => setPrimaryRowId(row.id)}
                          value={row.id}
                          inputProps={{
                            "aria-label": `Mark ${row.firstName} ${row.lastName} as primary`,
                          }}
                        />
                      }
                    >
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              minWidth: 0,
                              pr: 4,
                            }}
                          >
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                minWidth: 0,
                              }}
                              title={`${row.firstName} ${row.lastName}`}
                            >
                              {`${row.firstName} ${row.lastName}`}
                            </Typography>
                            {isPrimary && (
                              <Chip
                                label="Primary"
                                size="small"
                                color="primary"
                                sx={{ height: 20, flexShrink: 0 }}
                              />
                            )}
                          </Box>
                        }
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
            </Box>
            <TextField
              label="Comments"
              multiline
              minRows={3}
              fullWidth
              value={comments}
              onChange={(event) => setComments(event.target.value)}
              placeholder="Add merge notes for the backend save payload"
            />
            <Typography
              variant="caption"
              sx={{ mt: 2, display: "block", color: "#666" }}
            >
              Payload ready for persistence:{" "}
              {hydratedReportPayload.eid ?? "none"} as primary,{" "}
              {hydratedReportPayload.metadata?.entitiesToMerge.length ?? 0} merge
              candidate
              {(hydratedReportPayload.metadata?.entitiesToMerge.length ?? 0) === 1
                ? ""
                : "s"}{" "}
              attached.
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

import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";

function simulateFetchRowDetails(row) {
  const delay = 450 + Number(row.id) % 5 * 180;

  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({
        qids: [
          `q${Number(row.id) * 2 - 1}`,
          `q${Number(row.id) * 2}`,
        ],
        sourceSystem: `System ${((Number(row.id) % 3) + 1).toString()}`,
        reviewerHint: `${row.country} desk`,
      });
    }, delay);
  });
}

export function useReportRowDetails(selectedRows, open) {
  const detailQueries = useQueries({
    queries: selectedRows.map((row) => ({
      queryKey: ["report-row-details", row.id],
      queryFn: () => simulateFetchRowDetails(row),
      enabled: open,
      staleTime: 60_000,
    })),
  });

  const isFetchingDetails = detailQueries.some(
    (query) => query.isPending || query.isFetching,
  );
  const hasDetailErrors = detailQueries.some((query) => query.isError);

  const rowDetailsById = useMemo(
    () =>
      Object.fromEntries(
        detailQueries.flatMap((query, index) =>
          query.data ? [[selectedRows[index].id, query.data]] : [],
        ),
      ),
    [detailQueries, selectedRows],
  );

  return {
    detailQueries,
    isFetchingDetails,
    hasDetailErrors,
    rowDetailsById,
  };
}

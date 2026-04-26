import { useMutation } from "@tanstack/react-query";

async function saveEntityFeedback(payload) {
  const response = await fetch("/saveEntityFeedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to save entity feedback.");
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return null;
}

export function useSaveEntityFeedback(options = {}) {
  return useMutation({
    mutationFn: saveEntityFeedback,
    ...options,
  });
}

import { apiFetch } from "./client";
import type { GatewayPromptRequest, GatewayPromptResponse } from "./types";

export const processPrompt = (payload: GatewayPromptRequest) =>
  apiFetch<GatewayPromptResponse>("/gateway/prompt", {
    method: "POST",
    body: JSON.stringify(payload),
  });

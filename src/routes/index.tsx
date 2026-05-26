import { createFileRoute } from "@tanstack/react-router";
import RecallOS from "../RecallOS.jsx";

export const Route = createFileRoute("/")({
  component: RecallOS,
});

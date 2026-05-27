import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error - JSX file without types
import RecallOS from "../RecallOS.jsx";

export const Route = createFileRoute("/")({
  component: RecallOS,
});

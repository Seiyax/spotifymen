import { createFileRoute } from "@tanstack/react-router";
import App from "@/spotifyman/App";

export const Route = createFileRoute("/")({
  component: App,
});

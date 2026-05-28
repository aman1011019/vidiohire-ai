import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/recruiter")({
  head: () => ({ meta: [{ title: "Recruiter Workspace · VidioHire AI" }] }),
  component: () => <Outlet />,
});

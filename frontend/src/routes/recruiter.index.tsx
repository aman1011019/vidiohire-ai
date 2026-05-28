import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/recruiter/")({
  component: () => <Navigate to="/recruiter/dashboard" />,
});

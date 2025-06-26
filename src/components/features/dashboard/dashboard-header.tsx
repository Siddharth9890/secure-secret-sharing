import { Box, Typography } from "@mui/material";
import { Dashboard } from "@mui/icons-material";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <Box sx={{ p: 4, mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Dashboard color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user.name || user.email}! Manage your secure secrets
            below.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

"use client";

import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  IconButton,
  Grid,
} from "@mui/material";
import {
  Add,
  Delete,
  Security,
  Timer,
  Visibility,
  Lock,
} from "@mui/icons-material";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function SecretsList() {
  const router = useRouter();

  const { data: secrets, refetch } = api.secrets.list.useQuery();

  const deleteSecret = api.secrets.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this secret?")) {
      deleteSecret.mutate({ id });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "viewed":
        return "warning";
      case "expired":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "viewed":
        return "Viewed";
      case "expired":
        return "Expired";
      default:
        return "Unknown";
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Your Secrets ({secrets?.length || 0})
        </Typography>
      </Box>

      {!secrets || secrets.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Security sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No secrets found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first secure secret to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push("/")}
          >
            Create Your First Secret
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {secrets.map((secret) => (
            <Grid size={{ xs: 4, md: 4 }} key={secret.id}>
              <Card
                sx={{
                  height: "100%",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontFamily: "monospace" }}>
                      {secret.id.slice(0, 8)}...
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(secret.id)}
                      disabled={deleteSecret.isPending}
                    >
                      <Delete />
                    </IconButton>
                  </Box>

                  <Stack spacing={2}>
                    <Box>
                      <Chip
                        label={getStatusLabel(secret.status)}
                        color={getStatusColor(secret.status)}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    </Box>

                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {secret.isOneTime && (
                        <Chip
                          icon={<Visibility />}
                          label="One-Time"
                          size="small"
                          variant="outlined"
                          color="warning"
                        />
                      )}
                      {secret.isPassword && (
                        <Chip
                          icon={<Lock />}
                          label="Password"
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      )}
                      {secret.expiresAt && (
                        <Chip
                          icon={<Timer />}
                          label="Expires"
                          size="small"
                          variant="outlined"
                          color="info"
                        />
                      )}
                    </Stack>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Created: {dayjs(secret.createdAt).fromNow()}
                      </Typography>
                      {secret.expiresAt && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Expires: {dayjs(secret.expiresAt).fromNow()}
                        </Typography>
                      )}
                    </Box>

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        const url = `${window.location.origin}/secret/${secret.id}`;
                        navigator.clipboard.writeText(url);
                      }}
                      disabled={secret.status !== "active"}
                    >
                      Copy Link
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Typography,
  Alert,
  Stack,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Security,
  Timer,
  Lock,
  Visibility,
  CheckCircle,
  ContentCopy,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/trpc/react";

const secretSchema = z.object({
  content: z
    .string()
    .min(1, "Secret content is required")
    .max(10000, "Secret too long"),
  isOneTime: z.boolean().default(false),
  expiresIn: z.string(),
  customExpiry: z.any().optional(),
  password: z.string().optional(),
});

type SecretForm = z.infer<typeof secretSchema>;

export function CreateSecretForm() {
  const [secretUrl, setSecretUrl] = useState<string | null>(null);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SecretForm>({
    resolver: zodResolver(secretSchema as any),
    defaultValues: {
      content: "",
      isOneTime: false,
      expiresIn: "24h",
      password: "",
    },
  });
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const expiresIn = watch("expiresIn");
  const isOneTime = watch("isOneTime");
  const password = watch("password");

  const createSecret = api.secrets.create.useMutation({
    onSuccess: (data) => {
      const url = `${window.location.origin}/secret/${data.id}`;
      setSecretUrl(url);
      reset();
    },
  });

  const onSubmit = (data: SecretForm) => {
    let expiresAt: Date | undefined;

    if (data.expiresIn !== "never") {
      const now = dayjs();
      switch (data.expiresIn) {
        case "1h":
          expiresAt = now.add(1, "hour").toDate();
          break;
        case "24h":
          expiresAt = now.add(24, "hour").toDate();
          break;
        case "7d":
          expiresAt = now.add(7, "day").toDate();
          break;
        case "custom":
          expiresAt = data.customExpiry?.toDate();
          break;
      }
    }

    createSecret.mutate({
      content: data.content,
      isOneTime: data.isOneTime,
      expiresAt,
      password: data.password || undefined,
    });
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: "auto" }} elevation={3}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          color="primary"
          sx={{ fontWeight: 700 }}
        >
          Create Secure Secret
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Share sensitive information securely with automatic expiration and
          optional password protection
        </Typography>
      </Box>

      {secretUrl && (
        <Alert sx={{ mb: 3, borderRadius: 2 }} icon={<CheckCircle />}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Secret created successfully!
          </Typography>
          <Box
            component="code"
            sx={{
              display: "block",
              p: 2,
              bgcolor: "rgba(46, 125, 50, 0.1)",
              borderRadius: 1,
              fontSize: "0.875rem",
              wordBreak: "break-all",
              fontFamily: "monospace",
              border: "1px solid rgba(46, 125, 50, 0.2)",
            }}
          >
            {secretUrl}
            <IconButton
              onClick={() => navigator.clipboard.writeText(secretUrl)}
              size="small"
              sx={{ ml: 1 }}
            >
              <ContentCopy />
            </IconButton>
          </Box>
        </Alert>
      )}

      {createSecret.error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {createSecret.error.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={6}
                label="Secret Message"
                placeholder="Enter your secret message here..."
                error={!!errors.content}
                helperText={
                  errors.content?.message ||
                  `${field.value.length}/10,000 characters`
                }
              />
            )}
          />

          <Divider />

          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Security color="primary" />
              Security Options
            </Typography>

            <Stack spacing={3}>
              <Controller
                name="isOneTime"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        {...field}
                        checked={field.value}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Destroy after first view
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Secret will be permanently deleted after being viewed
                          once
                        </Typography>
                      </Box>
                    }
                  />
                )}
              />

              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 2,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Timer color="primary" />
                  Expiration Time
                </Typography>
                <Controller
                  name="expiresIn"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Expiration</InputLabel>
                      <Select {...field} label="Expiration">
                        <MenuItem value="1h">1 Hour</MenuItem>
                        <MenuItem value="24h">24 Hours</MenuItem>
                        <MenuItem value="7d">7 Days</MenuItem>
                        <MenuItem value="custom">Custom Date</MenuItem>
                        <MenuItem value="never">Never</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />

                {expiresIn === "custom" && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      name="customExpiry"
                      control={control}
                      render={({ field }) => (
                        <DateTimePicker
                          {...field}
                          label="Custom Expiry Date"
                          minDateTime={dayjs()}
                          sx={{ mt: 2, width: "100%" }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              </Box>

              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 2,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Lock color="primary" />
                  Password Protection (Optional)
                </Typography>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="password"
                      label="Password (optional)"
                      placeholder="Add extra protection with a password"
                      helperText="Recipients will need this password to view the secret"
                    />
                  )}
                />
              </Box>
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Security Summary:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                icon={<Security />}
                label="End-to-End Encrypted"
                color="primary"
                variant="outlined"
                size="small"
              />
              {isOneTime && (
                <Chip
                  icon={<Visibility />}
                  label="One-Time View"
                  color="warning"
                  variant="outlined"
                  size="small"
                />
              )}
              {expiresIn !== "never" && (
                <Chip
                  icon={<Timer />}
                  label="Auto-Expires"
                  color="info"
                  variant="outlined"
                  size="small"
                />
              )}
              {password && (
                <Chip
                  icon={<Lock />}
                  label="Password Protected"
                  color="secondary"
                  variant="outlined"
                  size="small"
                />
              )}
            </Stack>
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={createSecret.isPending}
            sx={{
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            {createSecret.isPending
              ? "Creating Secret..."
              : "Create Secure Secret"}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}

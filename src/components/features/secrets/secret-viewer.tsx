"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  Stack,
  Card,
  CardContent,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Lock,
  Visibility,
  Warning,
  CheckCircle,
  Security,
  Timer,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/trpc/react";

const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type PasswordForm = z.infer<typeof passwordSchema>;

interface SecretViewerProps {
  secretId: string;
}

export function SecretViewer({ secretId }: SecretViewerProps) {
  const [needsPassword, setNeedsPassword] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const password = watch("password");

  const {
    data: secret,
    error,
    refetch,
    isFetching,
  } = api.secrets.get.useQuery(
    {
      id: secretId,
      password: needsPassword ? password : undefined,
    },
    {
      enabled: false,
      retry: false,
    }
  );

  useEffect(() => {
    if (error) {
      if (error.message === "Password required") {
        setNeedsPassword(true);
      }
    }
  }, [error]);

  useEffect(() => {
    if (secret && !error) {
      setRevealed(true);
    }
  }, [secret, error]);

  const handleReveal = async () => {
    try {
      await refetch();
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async () => {
    try {
      await refetch();
    } catch (err) {
      console.log(err);
    }
  };

  if (error && error.message !== "Password required") {
    return (
      <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }} elevation={3}>
        <Alert severity="error" icon={<Warning />} sx={{ borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Secret Not Available
          </Typography>
          <Typography variant="body2">{error.message}</Typography>
        </Alert>
      </Paper>
    );
  }

  if (secret && revealed) {
    return (
      <Paper sx={{ p: 4, maxWidth: 700, mx: "auto", mt: 4 }} elevation={3}>
        <Stack spacing={3}>
          <Box sx={{ textAlign: "center" }}>
            <CheckCircle color="success" sx={{ fontSize: 48, mb: 2 }} />
            <Typography
              variant="h4"
              gutterBottom
              color="success.main"
              sx={{ fontWeight: 700 }}
            >
              Secret Revealed
            </Typography>
          </Box>

          <Alert severity="warning" icon={<Timer />} sx={{ borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>Important:</strong> This secret might be marked as view
              only once and may be automatically deleted. Save this information
              now if you need it later.
            </Typography>
          </Alert>

          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Security color="primary" />
                Secret Message
              </Typography>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  border: "2px solid",
                  borderColor: "success.light",
                  minHeight: 100,
                }}
              >
                {secret.content}
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }} elevation={3}>
      <Stack spacing={4}>
        <Box sx={{ textAlign: "center" }}>
          <Security color="primary" sx={{ fontSize: 48, mb: 2 }} />
          <Typography
            variant="h4"
            gutterBottom
            color="primary"
            sx={{ fontWeight: 700 }}
          >
            Secure Secret
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You`re about to view a secure secret message
          </Typography>
        </Box>

        <Alert severity="info" sx={{ borderRadius: 2 }}>
          <Stack spacing={1}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Security Notice:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              <li>This secret is encrypted and secure</li>
              <li>It may be destroyed after viewing</li>
              <li>Make sure you`re in a private location</li>
            </Box>
          </Stack>
        </Alert>

        {needsPassword && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Lock color="secondary" />
                <Typography variant="h6" color="secondary">
                  Password Required
                </Typography>
              </Box>

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    label="Enter password to view secret"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    placeholder="Password"
                  />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isFetching || !password}
                startIcon={
                  isFetching ? <CircularProgress size={20} /> : <Visibility />
                }
                sx={{ py: 1.5 }}
              >
                {isFetching ? "Revealing Secret..." : "Reveal Secret"}
              </Button>
            </Stack>
          </form>
        )}

        {!needsPassword && (
          <Button
            variant="contained"
            size="large"
            onClick={handleReveal}
            disabled={isFetching}
            startIcon={
              isFetching ? <CircularProgress size={20} /> : <Visibility />
            }
            sx={{ py: 1.5 }}
          >
            {isFetching ? "Revealing Secret..." : "Reveal Secret"}
          </Button>
        )}

        <Box sx={{ textAlign: "center" }}>
          <Chip
            icon={<Security />}
            label="End-to-End Encrypted"
            color="primary"
            variant="outlined"
          />
        </Box>
      </Stack>
    </Paper>
  );
}

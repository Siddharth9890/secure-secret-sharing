import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Chip,
  Alert,
} from "@mui/material";
import { Shield, Timer, Key, Lock, Info } from "@mui/icons-material";
import { CreateSecretForm } from "@/components/features/secrets/create-secret-form";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main>
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid size={{ xs: 2, lg: 7 }}>
            <Box sx={{ textAlign: { xs: "center", lg: "left" }, mb: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", lg: "flex-start" },
                  mb: 3,
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Shield sx={{ fontSize: 48, color: "primary.main" }} />
                  <Box
                    sx={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      width: 16,
                      height: 16,
                      bgcolor: "success.main",
                      borderRadius: "50%",
                      animation: "pulse 2s infinite",
                      "@keyframes pulse": {
                        "0%": { transform: "scale(1)", opacity: 1 },
                        "50%": { transform: "scale(1.1)", opacity: 0.7 },
                        "100%": { transform: "scale(1)", opacity: 1 },
                      },
                    }}
                  />
                </Box>
              </Box>

              <Typography
                variant="h1"
                gutterBottom
                sx={{
                  background: "linear-gradient(45deg, #ffffff, #bb86fc)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                }}
              >
                Share a Secret{" "}
                <Typography
                  component="span"
                  variant="h1"
                  sx={{
                    background: "linear-gradient(45deg, #9c4dcc, #bb86fc)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Securely
                </Typography>
              </Typography>

              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 600 }}
              >
                Secure, ephemeral sharing for sensitive information
              </Typography>

              <Alert
                icon={<Info />}
                severity="info"
                sx={{
                  mb: 4,
                  maxWidth: 600,
                  mx: { xs: "auto", lg: 0 },
                  background: "rgba(33, 150, 243, 0.1)",
                  border: "1px solid rgba(33, 150, 243, 0.3)",
                  "& .MuiAlert-icon": { color: "info.main" },
                  "& .MuiAlert-message": { color: "text.primary" },
                }}
              >
                <Typography variant="body2">
                  <strong>Guest Mode:</strong> You can create secrets without an
                  account, but you won't be able to manage them later.
                  <strong> Register for full features!</strong>
                </Typography>
              </Alert>
            </Box>

            <CreateSecretForm />
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Stack spacing={4}>
              <Card>
                <CardHeader>
                  <Typography
                    variant="h6"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "text.primary",
                    }}
                  >
                    <Lock sx={{ color: "primary.main" }} />
                    Platform Features
                  </Typography>
                </CardHeader>
                <CardContent>
                  <Stack spacing={3}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        One-time access control
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Timer sx={{ color: "info.main", fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Automatic expiration
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Key sx={{ color: "warning.main", fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Password protection
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Shield sx={{ color: "primary.main", fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        End-to-end encryption
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ background: "rgba(255, 255, 255, 0.05)" }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: "italic",
                      color: "text.secondary",
                      lineHeight: 1.6,
                    }}
                  >
                    "In an era of constant digital sharing, control your
                    confidentiality with temporary, secure transmission of
                    sensitive information."
                  </Typography>
                </CardContent>
              </Card>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Chip
                  icon={<Shield />}
                  label="End-to-End Encrypted"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  icon={<Timer />}
                  label="Auto-Expire"
                  color="secondary"
                  variant="outlined"
                />
                
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}

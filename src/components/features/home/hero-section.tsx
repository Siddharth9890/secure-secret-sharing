import { Box, Typography, Container, Stack, Chip } from "@mui/material";
import { Shield, AutoDelete, VpnKey, RemoveRedEye } from "@mui/icons-material";

export function HeroSection() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
          <Chip
            icon={<Shield />}
            label="Secure • Private • Temporary"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Stack>

        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #1976d2, #42a5f5)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          Share Secrets Securely
        </Typography>

        <Typography
          variant="h5"
          color="text.secondary"
          sx={{
            mb: 4,
            maxWidth: "800px",
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          Send sensitive information with confidence. Your secrets are
          encrypted, automatically expire, and can be viewed only once.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          sx={{ mb: 6 }}
        >
          <Chip icon={<AutoDelete />} label="Auto-Delete" color="error" />
          <Chip icon={<VpnKey />} label="Encrypted" color="success" />
          <Chip icon={<RemoveRedEye />} label="One-Time View" color="warning" />
        </Stack>
      </Box>
    </Container>
  );
}

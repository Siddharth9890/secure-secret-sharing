import { Box, Card, CardContent } from "@mui/material";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>{children}</CardContent>
      </Card>
    </Box>
  );
}

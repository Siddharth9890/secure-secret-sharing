"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9c4dcc", // Purple-400
      light: "#bb86fc",
      dark: "#7b1fa2",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#64b5f6", // Blue-400
      light: "#90caf9",
      dark: "#1976d2",
    },
    background: {
      default: "transparent", // Let the gradient background show through
      paper: "rgba(255, 255, 255, 0.1)", // Glass effect
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
    success: {
      main: "#4caf50",
      light: "#81c784",
    },
    warning: {
      main: "#ffc107",
      light: "#ffecb3",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
    },
    info: {
      main: "#2196f3",
      light: "#64b5f6",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    h4: {
      fontWeight: 700,
      fontSize: "1.5rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)",
          minHeight: "100vh",
          position: "relative",
          "&::before": {
            content: '""',
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.2,
            pointerEvents: "none",
            zIndex: -1,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            "& fieldset": {
              border: "none",
            },
            "&:hover": {
              background: "rgba(255, 255, 255, 0.08)",
            },
            "&.Mui-focused": {
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid #9c4dcc",
            },
          },
          "& .MuiInputLabel-root": {
            color: "rgba(255, 255, 255, 0.7)",
          },
          "& .MuiOutlinedInput-input": {
            color: "#ffffff",
            "&::placeholder": {
              color: "rgba(255, 255, 255, 0.5)",
              opacity: 1,
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
        },
        contained: {
          background: "linear-gradient(45deg, #7c3aed, #a855f7)",
          boxShadow: "0 4px 15px rgba(124, 58, 237, 0.4)",
          "&:hover": {
            background: "linear-gradient(45deg, #6d28d9, #9333ea)",
            boxShadow: "0 6px 20px rgba(124, 58, 237, 0.6)",
          },
        },
        outlined: {
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#ffffff",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
        outlined: {
          border: "1px solid rgba(255, 255, 255, 0.3)",
          color: "#ffffff",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "none",
        },
      },
    },
  },
});

interface ThemeProviderWrapperProps {
  children: React.ReactNode;
}

export function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

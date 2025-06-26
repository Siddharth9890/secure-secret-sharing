"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Shield,
  AccountCircle,
  Dashboard,
  Add,
  Logout,
  Login,
  PersonAdd,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

interface NavbarProps {
  session: Session | null;
}

export function Navbar({ session }: NavbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    handleClose();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 0,
      }}
    >
      <Toolbar
        sx={{ maxWidth: "xl", width: "100%", mx: "auto", px: { xs: 2, sm: 3 } }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
            flexGrow: { xs: 1, sm: 0 },
          }}
          onClick={() => router.push(session ? "/dashboard" : "/")}
        >
          <Box sx={{ position: "relative" }}>
            <Shield sx={{ fontSize: 32, color: "primary.main" }} />
            <Box
              sx={{
                position: "absolute",
                top: -2,
                right: -2,
                width: 8,
                height: 8,
                bgcolor: "success.main",
                borderRadius: "50%",
                animation: "pulse 2s infinite",
              }}
            />
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #ffffff, #bb86fc)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SecureShare
          </Typography>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", sm: "flex" },
            justifyContent: "center",
            gap: 2,
          }}
        >
          {session && (
            <>
              <Button
                startIcon={<Dashboard />}
                onClick={() => router.push("/dashboard")}
                sx={{
                  color: "text.primary",
                  "&:hover": { background: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                Dashboard
              </Button>
              <Button
                startIcon={<Add />}
                onClick={() => router.push("/dashboard/create")}
                sx={{
                  color: "text.primary",
                  "&:hover": { background: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                Create Secret
              </Button>
            </>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {session ? (
            <>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Chip
                  avatar={
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {session.user?.name?.[0]}
                    </Avatar>
                  }
                  label={session.user?.name || session.user?.email}
                  variant="outlined"
                  sx={{
                    color: "text.primary",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                />
                <div onClick={handleSignOut}>
                  <Logout fontSize="small" />
                  Sign Out
                </div>
              </Box>
            </>
          ) : (
            <>
              <Button
                startIcon={<Login />}
                onClick={() => router.push("/auth/login")}
                sx={{
                  color: "text.primary",
                  display: { xs: "none", sm: "flex" },
                  "&:hover": { background: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => router.push("/auth/register")}
                sx={{
                  background: "linear-gradient(45deg, #7c3aed, #a855f7)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #6d28d9, #9333ea)",
                  },
                }}
              >
                Get Started
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

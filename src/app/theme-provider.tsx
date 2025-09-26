"use client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6",
    },
    secondary: {
      main: "#9e9e9e",
      contrastText: "#ffffff",
    },
    background: {
      default: "#1f2937",
      paper: "#374151",
    },
    text: {
      primary: "#f9fafb",
      secondary: "#ffffff",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            color: "#f9fafb",
            "& fieldset": {
              borderColor: "#6b7280",
            },
            "&:hover fieldset": {
              borderColor: "#9ca3af",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#3b82f6",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#9ca3af",
            "&.Mui-focused": {
              color: "#3b82f6",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // Only apply blue background to primary buttons
          "&.MuiButton-contained": {
            backgroundColor: "#3b82f6",
            "&:hover": {
              backgroundColor: "#2563eb",
            },
          },
          // Secondary buttons should use the secondary color
          "&.MuiButton-contained.MuiButton-colorSecondary": {
            backgroundColor: "#9e9e9e",
            "&:hover": {
              backgroundColor: "#757575",
            },
          },
          // Outlined buttons should be transparent with colored borders
          "&.MuiButton-outlined": {
            backgroundColor: "transparent",
            borderColor: "#6b7280",
            color: "#f9fafb",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              borderColor: "#9ca3af",
            },
          },
          "&.MuiButton-outlined.MuiButton-colorSecondary": {
            borderColor: "#9e9e9e",
            color: "#9e9e9e",
            "&:hover": {
              backgroundColor: "rgba(158, 158, 158, 0.08)",
              borderColor: "#bdbdbd",
            },
          },
        },
      },
    },
  },
});

export function CustomThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

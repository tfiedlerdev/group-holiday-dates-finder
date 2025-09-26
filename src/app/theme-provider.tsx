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
      main: "#f59e0b",
    },
    background: {
      default: "#1f2937",
      paper: "#374151",
    },
    text: {
      primary: "#f9fafb",
      secondary: "#d1d5db",
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
          backgroundColor: "#3b82f6",
          "&:hover": {
            backgroundColor: "#2563eb",
          },
        },
      },
    },
  },
});

export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

"use client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6",
      dark: "#2563eb",
      light: "#60a5fa",
    },
    secondary: {
      main: "#9e9e9e",
      dark: "#757575",
      light: "#bdbdbd",
      contrastText: "#ffffff",
    },
    background: {
      default: "#1f2937",
      paper: "#374151",
    },
    text: {
      primary: "#f9fafb",
      secondary: "#d1d5db",
    },
    // Add error, warning, success colors for consistency
    error: {
      main: "#ef4444",
      light: "#fecaca",
      dark: "#dc2626",
    },
    warning: {
      main: "#f59e0b",
      light: "#fde68a",
      dark: "#d97706",
    },
    success: {
      main: "#10b981",
      light: "#a7f3d0",
      dark: "#059669",
    },
  },
  typography: {
    fontFamily: [
      "var(--font-geist-sans)",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  components: {
    // Global styles to replace globals.css functionality
    MuiCssBaseline: {
      styleOverrides: {
        // Replace the body styles from globals.css
        body: {
          backgroundColor: "#1f2937", // dark background
          color: "#f9fafb", // light text
          fontFamily: [
            "var(--font-geist-sans)",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
          ].join(","),
          margin: 0,
          padding: 0,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        // Global box-sizing
        "*": {
          boxSizing: "border-box",
        },
        // Ensure proper font rendering
        html: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        // Support for CSS custom properties from globals.css
        ":root": {
          "--background": "#1f2937",
          "--foreground": "#f9fafb",
          "--color-background": "#1f2937",
          "--color-foreground": "#f9fafb",
        },
        // Dark mode support (since we're using dark theme by default)
        "@media (prefers-color-scheme: dark)": {
          ":root": {
            "--background": "#1f2937",
            "--foreground": "#f9fafb",
          },
        },
      },
    },
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
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
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
    // Ensure Typography components use theme colors
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "inherit", // Let parent components control color
        },
      },
    },
    // Style links consistently
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#3b82f6",
          textDecoration: "none",
          "&:hover": {
            color: "#2563eb",
            textDecoration: "underline",
          },
        },
      },
    },
    // Ensure containers are transparent by default
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
    // Style Paper components consistently
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#374151",
          color: "#f9fafb",
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

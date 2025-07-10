// "use client";

// import { createContext, useContext, useMemo, useState } from "react";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import { PaletteMode } from "@mui/material";

// interface ThemeContextType {
//   mode: PaletteMode;
//   toggleMode: () => void;
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export const useMuiTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) throw new Error("useMuiTheme must be used inside MuiThemeProvider");
//   return context;
// };

// export const MuiThemeProvider = ({ children }: { children: React.ReactNode }) => {
//   const [mode, setMode] = useState<PaletteMode>("dark");

//   const toggleMode = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

//   const theme = useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode,
//         },
//       }),
//     [mode]
//   );

//   return (
//     <ThemeContext.Provider value={{ mode, toggleMode }}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         {children}
//       </ThemeProvider>
//     </ThemeContext.Provider>
//   );
// };

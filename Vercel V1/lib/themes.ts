export interface Theme {
  name: string
  background: string
  foreground: string
  primary: string
  secondary: string
  accent: string
  border: string
  gradient: string
  buttonBg: string
  buttonHover: string
}

export const blueTheme: Theme = {
  name: "blue",
  background: "#0A1120",
  foreground: "#ffffff",
  primary: "#0EA5E9",
  secondary: "#1E293B",
  accent: "#60A5FA",
  border: "#334155",
  gradient: "linear-gradient(180deg, rgba(12, 74, 110, 0.9) 0%, rgba(3, 27, 52, 0.95) 100%)",
  buttonBg: "rgb(25, 62, 97)",
  buttonHover: "rgb(37, 99, 155)",
}

export const redTheme: Theme = {
  name: "red",
  background: "#0A0A0F",
  foreground: "#ffffff",
  primary: "#ef4444",
  secondary: "#1a1b26",
  accent: "#3b82f6",
  border: "#1f2937",
  gradient: "linear-gradient(180deg, rgba(69, 0, 24, 0.9) 0%, rgba(20, 8, 0, 0.95) 100%)",
  buttonBg: "#ef4444",
  buttonHover: "#dc2626",
}

export const waveTheme: Theme = {
  name: "wave",
  background: "#0F172A",
  foreground: "#ffffff",
  primary: "#38BDF8",
  secondary: "#1E293B",
  accent: "#7DD3FC",
  border: "#334155",
  gradient: "linear-gradient(180deg, rgba(12, 74, 110, 0.9) 0%, rgba(3, 27, 52, 0.95) 100%)",
  buttonBg: "#0284C7",
  buttonHover: "#0369A1",
}

import { HomeIcon, SettingsIcon } from "lucide-react";
import Home from "./pages/Home.jsx";
import OptionsSelection from "./pages/OptionsSelection.jsx";
import Results from "./pages/Results.jsx";
import Settings from "./pages/Settings.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Home />,
  },
  {
    title: "Options",
    to: "/options",
    icon: <SettingsIcon className="h-4 w-4" />,
    page: <OptionsSelection />,
  },
  {
    title: "Results",
    to: "/results",
    icon: <SettingsIcon className="h-4 w-4" />,
    page: <Results />,
  },
  {
    title: "Settings",
    to: "/settings",
    icon: <SettingsIcon className="h-4 w-4" />,
    page: <Settings />,
  },
];
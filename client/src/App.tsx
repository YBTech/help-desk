import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { router } from "./app/router";

export function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

import ProtectedRoute from "@/guards/ProtectedRoute";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Welcome to Starpost!</h1>
      </div>
    </ProtectedRoute>
  );
}

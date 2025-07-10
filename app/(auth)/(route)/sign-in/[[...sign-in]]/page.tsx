import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <SignIn
        appearance={{
          elements: {
            card: "shadow-lg rounded-xl p-6 bg-white",
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
            headerTitle: "text-2xl font-bold text-center",
            headerSubtitle: "text-sm text-gray-500 mb-4 text-center",
          },
        }}
      />
    </div>
  );
}

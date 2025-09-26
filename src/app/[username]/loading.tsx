// app/loading.tsx

export default function Loading() {
  //   await delay(3000);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="size-6 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
        {/* Text */}
        <p className="mt-4 text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  );
}

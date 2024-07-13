const LoadingPage = () => {
  return (
    <div className="absolute top-0 left-0 h-screen w-screen flex  items-center justify-center bg-gray-100 text-zinc-900">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2  border-zinc-900"></div>
    </div>
  );
};

export default LoadingPage;

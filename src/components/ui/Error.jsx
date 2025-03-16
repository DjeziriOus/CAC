function Error({ errorMessage }) {
  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center gap-2 bg-[#9bcdd8]">
      <div className="flex flex-col items-center justify-center gap-4">
        <img src="/images/robot-error.png" alt="error" />
        <h1 className="text-2xl font-bold text-primary">
          UNE ERREUR EST SURVENUE QUELQUE PART...
        </h1>
      </div>
      <span>{errorMessage}</span>
    </div>
  );
}

export default Error;

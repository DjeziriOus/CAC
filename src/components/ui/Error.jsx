function Error({ errorMessage }) {
  return (
    <div>
      <h1 className="font-bold text-red-500">ERROR ELEMENT</h1>
      <span>{errorMessage}</span>
    </div>
  );
}

export default Error;

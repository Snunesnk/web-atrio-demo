const Swagger = () => {
  const apiURL = process.env.REACT_APP_API_URL || "http://localhost:5042";
  return (
    <div>
      <h1>Swagger</h1>
      <iframe
        title="Swagger"
        src={`${apiURL}/swagger`}
        width="100%"
        height="800"
      />
    </div>
  );
};

export default Swagger;

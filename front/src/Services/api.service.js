class ApiService {
  static init = () => {
    this.apiURL = process.env.REACT_APP_API_URL || "http://localhost:5042";
  };

  static callApi = async (path, options) => {
    if (!this.apiURL) {
      this.init();
    }
    return fetch(`${this.apiURL}${path}`, options).then(async (response) => {
      if (response.ok) {
        return response.json();
      } else {
        const error = new Error(response.statusText || "An error occured");
        error.status = response.status;
        error.response = response;

        throw error;
      }
    });
  };

  static get = async (path) => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    return this.callApi(path, options);
  };

  static post = async (path, data = {}) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    return this.callApi(path, options);
  };
}

export default ApiService;

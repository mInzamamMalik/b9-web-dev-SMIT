import "./login.css";
const Login = () => {
  return (
    <div>
      <h1>Login</h1>

      <form id="loginForm">
        <label for="emailInput">email:</label>
        <input type="email" name="emailInput" id="emailInput" required />

        <br />
        <label for="passwordInput">password:</label>
        <input type="text" name="passwordInput" id="passwordInput" />

        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

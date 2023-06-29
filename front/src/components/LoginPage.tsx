import { Navigate } from "react-router-dom";
import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";

const LOGIN = gql`
  query Query($password: String!, $email: String!) {
    login(password: $password, email: $email)
  }
`;

const LoginPage = () => {
  const [email, setEmail] = useState("alice@gmail.com");
  const [password, setPassword] = useState("test");
  const [login, { data, error }] = useLazyQuery(LOGIN, {
    variables: { email, password },
  });
  if (data) {
    console.log("data from query", data.login);
    localStorage.setItem("token", data.login);
    return <Navigate to="/" />;
  }
  if (error) {
    console.log("error", error);
  }
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        console.log("email", email);
        console.log("password", password);
        login();
      }}
    >
      <h3>Login</h3>
      <label>Email </label>
      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <br />
      <label>Password </label>
      <input
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <br />
      <button>Log me in</button>
    </form>
  );
};

export default LoginPage;

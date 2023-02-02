import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Alerts from "../Common/Alerts";
import userContext from "./userContext";
import { toast } from "react-toastify";
import TOAST_DEFAULTS from "../Helpers/toastSettings";

/** Render login form and navigate to homepage on successful login
 * else show errors
 *
 *
 * Context
 * - currUser - obj with user info
 *
 * Props
 * - handleLogin() - from app
 *
 * State
 * - formData - {username, password}
 * - err - null or array of msgs
 *
 * RoutesList -> LoginForm -> Errors
 */
function Login({ handleLogin }) {
  const navigate = useNavigate();
  const { currUser } = useContext(userContext);

  const initialState = {
    username: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [err, setErr] = useState(null);

  function handleChange(evt) {
    const { name, value } = evt.target;

    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      await handleLogin(formData);
      navigate("/")
      toast("🚀 Login Successful!", TOAST_DEFAULTS);
    } catch (err) {
      setErr(err);
    }
    setFormData(initialState);
  }

  console.log("err", err)
  return (
    <div className="Login d-flex justify-content-center p-3">
      <div className="col-lg-4 col-12">
        <h1 className="Login-form-header">Log In</h1>
        <form onSubmit={handleSubmit} className="Login-form bg-light rounded p-3">
          <div className="form-group">
            {err && <Alerts err={err} />}
            <label className="d-flex float-left m-2" htmlFor="username">
              <b>Username</b>
            </label>
            <input
              onChange={handleChange}
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
            />
            <label className="d-flex float-left m-2" htmlFor="password">
              <b>Password</b>
            </label>
            <input
              onChange={handleChange}
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
            />
          </div>
          <button type="submit" className="Login-submit btn btn-primary mt-3">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

import React, { Suspense, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ForgotPassword, LoginPage } from "./components/login-page";
import DashboardModel from "./components/dashboard";
import Cookies from "js-cookie";
import { LoginContext } from "./components/private-routes/context";
import { PrivateRoute } from "./components/private-routes";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(Cookies.get("loggedIn") || "false")
  );

  const setLogin = (data: boolean) => {
    const status = data.toString();
    Cookies.set("loggedIn", status);
    setIsLoggedIn(data);
  };
  return (
    <>
      <Suspense fallback="Loading...">
        <LoginContext.Provider
          value={{
            isLoggedIn,
            setIsLoggedIn,
            loading,
            setLoading,
          }}
        >
          <Switch>
            <PrivateRoute
              exact={true}
              path="/dashboard"
              component={DashboardModel}
            />
            <Route exact={true} path="/">
              {isLoggedIn ? (
                <Redirect to="/dashboard" />
              ) : (
                <LoginPage loginStatus={setLogin} />
              )}
            </Route>
            <Route path="/forgetpassword">
              <ForgotPassword />
            </Route>
          </Switch>
        </LoginContext.Provider>
      </Suspense>
    </>
  );
};

export default App;

import React, { useEffect, useState, useRef, Suspense } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  useHistory,
  useLocation,
  Redirect,
} from "react-router-dom";
import { observer } from "mobx-react";
import { useStore } from "./store/mobx";

//Layouts
import MainLayout from "./component/Layout/MainLayout";
import LoginLayout from "./component/Layout/LoginLayout";

//pages
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import LineLogin from "./pages/LineLogin/LineLogin";
import ForgetPassword from "./pages/ForgetPassword";
import Logout from "./pages/Logout";
import { getRoutes, getMainMenu } from "./menu";
import { getAllRoutes } from "./otherRoutes";
import { useTranslation } from "react-i18next";

const AuthRoute = observer(({ component: Component, ...rest }) => {
  //access to store
  const { authStore, layoutStore } = useStore();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();

  //Find Main Page
  let mainMenu = getMainMenu(t);

  const publicRoutes = JSON.parse(process.env.PUBLIC_ROUTE) || [];

  let props = { ...rest };
  let { layout, path } = props;

  const permissions = publicRoutes.concat(authStore.session.permissions || []);
  const access =
    permissions.includes("*") ||
    permissions.includes(path) ||
    permissions.includes(path.toLowerCase());

  let LayoutComponent;

  switch (layout) {
    case "main":
      LayoutComponent = MainLayout;
      break;
    case "login":
      LayoutComponent = LoginLayout;
      break;
    default:
      LayoutComponent = MainLayout;
  }

  //only on update not on mount
  const didMountRef = useRef(false);
  useEffect(() => {
    if (layout === "login") {
      if (authStore.isAuthenticated && location.pathname) {
        if (
          authStore.isAuthenticated.permissions &&
          authStore.isAuthenticated.permissions[0] !== "R_6"
        ) {
          console.log("init master value");
          // masterStore.setParameter();
        }

        //Check user can go to main menu
        if (
          authStore.session.permissions.includes(mainMenu) ||
          authStore.session.permissions.includes("*")
        ) {
          history.push(mainMenu);
        } else {
          let userMain = authStore.session.permissions[0];
          history.push(userMain);
        }
      }
    }
    if (didMountRef.current) {
      if (
        authStore.session.permissions &&
        authStore.session.permissions.includes("/otp-session")
      ) {
        history.push("/otp-session");
      } else if (authStore.isAuthenticated && location.pathname) {
        if (
          authStore.session.permissions.includes(mainMenu) ||
          authStore.session.permissions.includes("*")
        ) {
          history.push(mainMenu);
        } else {
          let userPath = authStore.session.permissions[0];
          history.push(userPath);
        }
        if (authStore.isAuthenticated && authStore.session.permissions.length) {
          console.log("init master value");
          // masterStore.setParameter();
        }
      }
    } else {
      if (layout === "login") {
        layoutStore.setPageTitle(t("LogIn"));
      } else {
        layoutStore.setPageTitle(props.label);
      }
      didMountRef.current = true;
    }
  }, [authStore.isAuthenticated]);

  //do not render if Browser is refreshing
  return (
    <Route
      {...rest}
      render={(props) => (
        <LayoutComponent>
          {/* {access ? (
            <Component {...props} />
          ) : (
            <Redirect from="/" to="/unauthorize" exact />
          )} */}
          {access ? (
            Array.isArray(Component) ? (
              Component.map((E, i) => <E key={"mainLayout" + i} {...props} />)
            ) : (
              <Component {...props} />
            )
          ) : (
            <Redirect from="/" to="/unauthorize" exact />
          )}
        </LayoutComponent>
      )}
    />
  );
});

const Routes = () => {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <Switch>
        <Redirect from="/" to="/login" exact />
        <AuthRoute path="/login" component={Login} layout={"login"} />
        <AuthRoute path="/line/callback" component={LineLogin} layout={"login"} />
        <AuthRoute path="/logout" component={Logout} />
        <AuthRoute
          path="/forget-password"
          component={ForgetPassword}
          layout={"login"}
        />
        <AuthRoute path="/logout" component={Logout} />
        {getRoutes(t).map((route, i) => {
          return (
            <AuthRoute
              exact
              path={route.path}
              component={route.component}
              key={route.path}
              label={route.label}
            />
          );
        })}
        {getAllRoutes(t).map((route, i) => {
          return (
            <AuthRoute
              exact
              path={route.path}
              component={route.component}
              key={route.path}
              label={route.label}
            />
          );
        })}
        <Route
          path="/unauthorize"
          component={() => <ErrorPage status={403} />}
        />
        <Route component={() => <ErrorPage status={404} />} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;

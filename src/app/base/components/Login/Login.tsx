import { useEffect } from "react";

import {
  Button,
  Card,
  Code,
  Col,
  Notification,
  Row,
  Strip,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { useWindowTitle } from "app/base/hooks";
import { actions as statusActions } from "app/store/status";
import statusSelectors from "app/store/status/selectors";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

export type LoginValues = {
  password: string;
  username: string;
};

export enum Labels {
  APILoginForm = "API login form",
  ExternalLoginButton = "Go to login page",
  NoUsers = "No admin user has been created yet",
  Password = "Password",
  Submit = "Login",
  Username = "Username",
  NoOIDC = "OIDC integration has not been configured yet",
}

export enum TestIds {
  NoUsers = "no-users-warning",
  SectionHeaderTitle = "section-header-title",
}

export const Login = (): JSX.Element => {
  const dispatch = useDispatch();
  const authenticated = useSelector(statusSelectors.authenticated);
  const authenticating = useSelector(statusSelectors.authenticating);
  const externalAuthURL = useSelector(statusSelectors.externalAuthURL);
  const oidcAuthURL = useSelector(statusSelectors.oidcAuthURL);
  const error = useSelector(statusSelectors.authenticationError);

  useWindowTitle("Login");

  useEffect(() => {
    if (externalAuthURL) {
      dispatch(statusActions.externalLogin());
    }
  }, [dispatch, externalAuthURL]);

  return (
    <Strip>
      <Row>
        <Col emptyLarge={4} size={6}>
          {oidcAuthURL && error && (
            <Notification severity="negative" title="Error:">
              {error}
            </Notification>
          )}
          {!oidcAuthURL ? (
            <Card title={Labels.NoOIDC}>
              <p>Use the following command to configure OIDC:</p>
              <Code copyable>sudo maas config-oidc</Code>
              <Button
                className="u-no-margin--bottom"
                onClick={() => dispatch(statusActions.checkAuthenticated())}
              >
                Retry
              </Button>
            </Card>
          ) : (
            <Card>
              <h1
                className="p-card__title p-heading--3"
                data-testid={TestIds.SectionHeaderTitle}
              >
                Login
              </h1>
              {oidcAuthURL ? (
                <Button
                  appearance="positive"
                  className="login__external"
                  element="a"
                  href={oidcAuthURL}
                  rel="noopener noreferrer"
                >
                  {Labels.ExternalLoginButton}
                </Button>
              ) : (
                <FormikForm<LoginValues>
                  aria-label={Labels.APILoginForm}
                  errors={error}
                  initialValues={{
                    password: "",
                    username: "",
                  }}
                  onSubmit={(values) => {
                    dispatch(statusActions.login(values));
                  }}
                  saved={authenticated}
                  saving={authenticating}
                  submitLabel={Labels.Submit}
                  validationSchema={LoginSchema}
                >
                  <FormikField
                    label={Labels.Username}
                    name="username"
                    required={true}
                    takeFocus
                    type="text"
                  />
                  <FormikField
                    label={Labels.Password}
                    name="password"
                    required={true}
                    type="password"
                  />
                </FormikForm>
              )}
            </Card>
          )}
        </Col>
      </Row>
    </Strip>
  );
};

export default Login;

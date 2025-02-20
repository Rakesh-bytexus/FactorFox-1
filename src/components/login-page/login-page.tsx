import React, { useReducer } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import CompanyLogo from "../../common-components/company-logo";
import { validation } from "../validation/validation";
import { LoginApi } from "../../packages/factorfox-api/login-api";
import { AccessToken } from "../../packages/auth";

interface LoginPageProps {
  loginStatus: (data: any) => void;
}
const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "setFormData":
      return {
        ...state,
        formdata: action.payload,
      };
    case "setErrorData":
      return {
        ...state,
        errordata: action.payload,
      };
    case "setSpinnerData":
      return {
        ...state,
        spinner: action.payload,
      };
    default:
      return state;
  }
};
const LoginPage = ({ loginStatus }: LoginPageProps) => {
  const [state, dispatch] = useReducer(reducer, {
    errordata: { email: "", password: "" },
    formdata: { email: "", password: "" },
    spinner: false,
  });

  const handleLogin = async (event: any) => {
    event.preventDefault();
    const errorData = validation(state.formdata);
    if (Object.keys(errorData).length == 0) {
      dispatch({ type: "setSpinnerData", payload: true });
      LoginApi(state.formdata).then((res) => {
        if (res?.status === 200) {
          loginStatus(true);
          localStorage.setItem("user", state.formdata.email);
          AccessToken(res.token);
         
        } else {
          dispatch({
            type: "setErrorData",
            payload: {
              email: "Invalid Credentials",
              password: "Invalid Credentials",
            },
          });
          dispatch({ type: "setSpinnerData", payload: false });
        }
      });
    } else {
      dispatch({ type: "setErrorData", payload: errorData });
    }
  };

  return (
    <>
      <div className="login">
        <Container>
          <Row>
            <Col
              xl={5}
              lg={6}
              md={8}
              sm={12}
              className="vh-100 mx-auto d-flex align-items-center"
            >
              <Container className="login-form py-4 shadow rounded">
                <Row>
                  <Col className="border-bottom">
                    <div className="logo-section text-center my-3 ">
                      <CompanyLogo height={40} />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={10} className="mx-auto">
                    <div className="text-center my-4">
                      <h3 className="fw-bold">Welcome</h3>
                      <p className="small text-black-50 fw-semibold ">
                        Please Sign In to your Account
                      </p>
                    </div>
                    <Form className="mt-5" onSubmit={handleLogin}>
                      <FormGroup>
                        <Label for="email" className="d-block d-sm-none">
                          Username
                        </Label>
                        <InputGroup>
                          <InputGroupText className="d-none d-sm-inline">
                            <i className="bi bi-person-fill pe-2 "></i>
                            Username
                          </InputGroupText>
                          <Input
                            type="email"
                            name="email"
                            value={state.formdata.email}
                            onChange={(e) =>
                              dispatch({
                                type: "setFormData",
                                payload: {
                                  ...state.formdata,
                                  email: e.target.value,
                                },
                              })
                            }
                            placeholder={`${"Enter email Address "}`}
                          />
                        </InputGroup>
                        {state.errordata.email && (
                          <label className="error">
                            {state.errordata.email}
                          </label>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label for="password" className="d-block d-sm-none">
                          Password
                        </Label>
                        <InputGroup>
                          <InputGroupText className="d-none d-sm-inline">
                            <i className="bi bi-key-fill pe-2 "></i>
                            Password&nbsp;
                          </InputGroupText>
                          <Input
                            type="password"
                            name="password"
                            value={state.formdata.password}
                            onChange={(e) =>
                              dispatch({
                                type: "setFormData",
                                payload: {
                                  ...state.formdata,
                                  password: e.target.value,
                                },
                              })
                            }
                            placeholder={`${"Enter Password "}`}
                          />
                        </InputGroup>
                        {state.errordata.password && (
                          <label className="error">
                            {state.errordata.password}
                          </label>
                        )}
                      </FormGroup>
                      <FormGroup className="text-end">
                        <Link
                          to={"/forgetpassword"}
                          className="px-0 btn btn-link"
                        >
                          Forgot Password?
                        </Link>
                      </FormGroup>
                      <FormGroup className="text-center">
                        <Button
                          color="primary"
                          className="px-5 py-2 shadow"
                          type="submit"
                          disabled={state.spinner}
                        >
                          {state.spinner ? (
                            <>
                              <Spinner size="sm"> Loading...</Spinner> Logging
                              In
                            </>
                          ) : (
                            "Login"
                          )}
                        </Button>
                      </FormGroup>
                    </Form>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default LoginPage;

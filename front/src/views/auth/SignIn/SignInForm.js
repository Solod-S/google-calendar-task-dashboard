import React from "react";
import { Button as AntButton, Divider } from "antd";
import { GoogleSVG, FacebookSVG } from "assets/svg/icon";
import CustomIcon from "components/util-components/CustomIcon";
import {
  Input,
  Button,
  Checkbox,
  FormItem,
  FormContainer,
  Alert,
} from "components/ui";
import { PasswordInput, ActionLink } from "components/shared";
import useTimeOutMessage from "utils/hooks/useTimeOutMessage";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import useAuth from "utils/hooks/useAuth";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Please enter your email"),
  password: Yup.string().required("Please enter your password"),
  rememberMe: Yup.bool(),
});

const SignInForm = props => {
  const {
    disableSubmit = false,
    className,
    forgotPasswordUrl = "/forgot-password",
    signUpUrl = "/sign-up",
  } = props;

  const [message, setMessage] = useTimeOutMessage();

  const { signIn } = useAuth();

  const onSignIn = async (values, setSubmitting) => {
    const { email, password } = values;
    setSubmitting(true);

    const result = await signIn({ email, password });

    if (result?.status === "failed") {
      setMessage(result.message);
    }
    setMessage(result?.message);
    setSubmitting(false);
  };

  return (
    <div className={className}>
      {message && (
        <Alert className="mb-4" type="danger" showIcon>
          {message}
        </Alert>
      )}
      <Formik
        // Remove this initial value
        initialValues={{
          email: "",
          password: "",
          rememberMe: true,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSignIn(values, setSubmitting);
          } else {
            setSubmitting(false);
          }
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <FormItem
                label="Email"
                invalid={errors.email && touched.email}
                errorMessage={errors.email}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="email"
                  placeholder="Email"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="Password"
                invalid={errors.password && touched.password}
                errorMessage={errors.password}
              >
                <Field
                  autoComplete="off"
                  name="password"
                  placeholder="Password"
                  component={PasswordInput}
                />
              </FormItem>
              <div className="flex justify-between mb-6">
                <Field
                  className="mb-0"
                  name="rememberMe"
                  component={Checkbox}
                  children="Remember Me"
                />
                <ActionLink to={forgotPasswordUrl}>Forgot Password?</ActionLink>
              </div>

              <Button
                block
                loading={isSubmitting}
                variant="solid"
                type="submit"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
              <div className="mt-4 text-center">
                <span>Don't have an account yet? </span>
                <ActionLink to={signUpUrl}>Sign up</ActionLink>
              </div>
              <RenderOtherSignIn isSubmitting={isSubmitting} />
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const RenderOtherSignIn = ({ isSubmitting }) => (
  <div style={{ width: "100%" }}>
    <Divider>
      <span className="text-muted font-size-base font-weight-normal">
        or connect with
      </span>
    </Divider>
    <div className="flex justify-around mb-3">
      <AntButton
        // onClick={() => onGoogleLogin()}
        className="mr-2"
        disabled={isSubmitting}
        icon={<CustomIcon svg={GoogleSVG} />}
      >
        Google
      </AntButton>
      <AntButton
        // onClick={() => onFacebookLogin()}
        icon={<CustomIcon svg={FacebookSVG} />}
        disabled={isSubmitting}
      >
        Facebook
      </AntButton>
    </div>
  </div>
);

export default SignInForm;

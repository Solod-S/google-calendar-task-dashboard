import React from "react";
import SignUpForm from "./SignUpForm";

const SignUp = () => {
  return (
    <>
      <div className="mb-8">
        <h3 className="mb-1">Sign Up</h3>
        <p>And lets get started with armorstandart auth service</p>
      </div>
      <SignUpForm disableSubmit={false} />
    </>
  );
};

export default SignUp;

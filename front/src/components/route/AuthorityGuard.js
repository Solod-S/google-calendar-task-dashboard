import React from "react";
import { Navigate } from "react-router-dom";
import useAuthority from "utils/hooks/useAuthority";

const AuthorityGuard = props => {
  const { userAuthority = [], authority = [], children } = props;
  console.log(`userAuthority`, userAuthority);
  console.log(`route.authority`, authority);

  const roleMatched = useAuthority(userAuthority, authority);

  return roleMatched ? children : <Navigate to="/access-denied" />;
};

export default AuthorityGuard;

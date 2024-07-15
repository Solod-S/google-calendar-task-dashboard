import {
  db,
  auth,
  signInWithEmailAndPassword,
  signOut,
  googleAuthProvider,
  facebookAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "utils/Firebase";

import uniqid from "uniqid";

import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { USER } from "constants/roles.constant";

const BASE_FRONT_URL = process.env.REACT_APP_BASE_FRONT_URL;

const FirebaseAouthService = {};

FirebaseAouthService.signInEmailRequest = async data => {
  const { email, password } = data;

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    if (user.emailVerified === false) {
      throw Error(`Email not verified`);
    }

    const savedToken = user.accessToken;

    const userDoc = await FirebaseAouthService.findUserByEmail(email);
    const userData = userDoc.data();
    return { user: userData, token: savedToken };
  } catch (error) {
    throw Error(error);
  }
};

FirebaseAouthService.signOutRequest = async () =>
  await signOut(auth)
    .then(user => user)
    .catch(err => err);

FirebaseAouthService.signInGoogleRequest = async () => {
  try {
    const { user } = await signInWithPopup(auth, googleAuthProvider);

    const { email, displayName, photoURL, uid, accessToken } = user;
    const savedToken = accessToken;

    const userDoc = await FirebaseAouthService.findUserByEmail(email);
    if (userDoc) {
      let userData = userDoc.data();
      return { user: userData, token: savedToken };
    } else {
      const userData = await FirebaseAouthService.handleNewUser({
        email,
        password: uniqid(),
        userPhotoURL: photoURL,
        name: displayName,
        uid,
      });
      return { user: userData, token: savedToken };
    }
  } catch (error) {
    throw new Error(error);
  }
};

FirebaseAouthService.signInFacebookRequest = async () => {
  try {
    const { user, _tokenResponse } = await signInWithPopup(
      auth,
      facebookAuthProvider
    );

    const { uid, accessToken } = user;
    const { photoUrl, email, displayName } = _tokenResponse;

    const savedToken = accessToken;

    const userDoc = await FirebaseAouthService.findUserByEmail(email);
    if (userDoc) {
      let userData = userDoc.data();
      return { user: userData, token: savedToken };
    } else {
      const userData = await FirebaseAouthService.handleNewUser({
        email,
        password: uniqid(),
        userPhotoURL: photoUrl,
        name: displayName,
        uid,
      });
      return { user: userData, token: savedToken };
    }
  } catch (error) {
    throw new Error(error);
  }
};

FirebaseAouthService.passwordRestore = async email => {
  try {
    return await sendPasswordResetEmail(auth, email, {
      url: `${BASE_FRONT_URL}/sign-in`,
      // show btn with redirect in firebase ui
    });
  } catch (error) {
    throw new Error(error);
  }
};

FirebaseAouthService.signUpEmailRequest = async data => {
  const { email, password, userName } = data;

  try {
    const newUser = await FirebaseAouthService.handleNewUser({
      email,
      password,
      name: userName,
    });

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
};

FirebaseAouthService.findUserByEmail = async email => {
  try {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0];
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

FirebaseAouthService.handleNewUser = async ({
  email,
  password,
  userPhotoURL,
  name,
  uid,
}) => {
  try {
    if (uid) {
      const newUser = {
        owner_uid: uid,
        email: email,
        displayName: name ? name : "",
        photoURL: userPhotoURL ? userPhotoURL : null,
        authority: [USER],
      };

      await setDoc(doc(db, "users", uid), newUser);
      return newUser;
    } else {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const { user } = userCredential;

      await sendEmailVerification(user);

      await updateProfile(user, {
        photoURL: userPhotoURL ? userPhotoURL : null,
        displayName: name ? name : "",
      });
      const { uid, displayName, photoURL, accessToken } = user;

      const newUser = {
        owner_uid: uid,
        email: email,
        displayName: displayName ? displayName : "",
        photoURL,
        authority: [USER],
      };

      await setDoc(doc(db, "users", uid), newUser);
      return { user: newUser, token: accessToken };
    }
  } catch (error) {
    throw error;
  }
};

export default FirebaseAouthService;

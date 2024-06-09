import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  deleteDoc,
} from "firebase/firestore";

import { AUTH_USER_DATA } from "constants/app.constant";
import { db, auth } from "utils/Firebase";

const FirebaseMyProjectsService = {};

FirebaseMyProjectsService.fetchProjects = async () => {
  try {
    const { owner_uid } = JSON.parse(localStorage.getItem(AUTH_USER_DATA));

    const projectsDataCollectionRef = collection(
      db,
      `users/${owner_uid}/projectsData`
    );
    const querySnapshot = await getDocs(
      query(
        projectsDataCollectionRef,
        orderBy("dateCreated", "desc") // Sort by creation date in descending order
      )
    );

    const projectsData = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      projectsData.push(data);
    });
    return { data: projectsData, total: projectsData?.length || 0 };
  } catch (error) {
    throw error;
  }
};

FirebaseMyProjectsService.getProjectById = async projectId => {
  try {
    const { owner_uid } = JSON.parse(localStorage.getItem(AUTH_USER_DATA));
    const projectDataDocRef = doc(
      db,
      `users/${owner_uid}/projectsData`,
      projectId
    );
    const projectDataSnapshot = await getDoc(projectDataDocRef);

    if (projectDataSnapshot.exists()) {
      const projectData = projectDataSnapshot.data();
      return projectData;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

FirebaseMyProjectsService.addProject = async data => {
  try {
    const userUid = auth.currentUser.uid;

    const projectsDataCollectionRef = collection(
      db,
      `users/${userUid}/projectsData`
    );
    const currentDate = new Date();

    const newData = {
      ...data,
      socialNetworks: data.socialNetworks ? data.socialNetworks : [],
      dateCreated: currentDate,
      dateUpdated: currentDate,
    };
    const projectDataRef = await addDoc(projectsDataCollectionRef, newData);
    const projectId = projectDataRef.id;

    await updateDoc(projectDataRef, {
      projectId: projectId,
    });

    return projectDataRef;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

FirebaseMyProjectsService.edditProject = async data => {
  try {
    const userUid = auth.currentUser.uid;
    const projectId = data.projectId;

    const projectsDataCollectionRef = doc(
      db,
      `users/${userUid}/projectsData/${projectId}`
    );

    const newData = {
      ...data,
      dateUpdated: new Date(),
    };

    const projectDataRef = await updateDoc(projectsDataCollectionRef, newData);
    return projectDataRef;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

FirebaseMyProjectsService.deleteProject = async projectId => {
  try {
    const userUid = auth.currentUser.uid;

    const projectDataDocRef = doc(
      db,
      `users/${userUid}/projectsData`,
      projectId
    );

    await deleteDoc(projectDataDocRef);
    return projectId;
  } catch (error) {
    throw error;
  }
};

export default FirebaseMyProjectsService;

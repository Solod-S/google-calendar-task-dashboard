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

FirebaseMyProjectsService.fetchProjects = async ({
  pageIndex,
  pageSize,
  sort,
  query: searchTerm,
  filterData,
}) => {
  try {
    const { owner_uid } = JSON.parse(localStorage.getItem(AUTH_USER_DATA));

    const projectsDataCollectionRef = collection(
      db,
      `users/${owner_uid}/projectsData`
    );

    // Определяем порядок сортировки
    const orderByField = sort.key || "dateCreated"; // Сортируем по "dateCreated" по умолчанию, если ключ не указан
    const orderByDirection = sort.order || "desc"; // Направление сортировки, по умолчанию "desc"

    // Создаем запрос с сортировкой
    const queryConstraints = [orderBy(orderByField, orderByDirection)];

    const querySnapshot = await getDocs(
      query(projectsDataCollectionRef, ...queryConstraints)
    );

    let projectsData = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      projectsData.push(data);
    });

    // Фильтрация на стороне клиента
    if (searchTerm) {
      projectsData = projectsData.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Сортировка на стороне клиента
    if (sort.key) {
      projectsData.sort((a, b) => {
        if (sort.key === "dateCreated" || sort.key === "dateUpdated") {
          return sort.order === "asc"
            ? a[sort.key].seconds - b[sort.key].seconds
            : b[sort.key].seconds - a[sort.key].seconds;
        } else if (sort.key === "active") {
          return sort.order === "asc"
            ? a[sort.key] === b[sort.key]
              ? 0
              : a[sort.key]
              ? -1
              : 1
            : a[sort.key] === b[sort.key]
            ? 0
            : a[sort.key]
            ? 1
            : -1;
        } else {
          return sort.order === "asc"
            ? a[sort.key].localeCompare(b[sort.key])
            : b[sort.key].localeCompare(a[sort.key]);
        }
      });
    }

    return { data: projectsData, total: projectsData.length };
  } catch (error) {
    throw error;
  }
};

FirebaseMyProjectsService.fetchProjectsCategories = async () => {
  try {
    const { owner_uid } = JSON.parse(localStorage.getItem(AUTH_USER_DATA));

    const categoriesDataCollectionRef = collection(
      db,
      `users/${owner_uid}/project-categories`
    );
    const querySnapshot = await getDocs(
      query(
        categoriesDataCollectionRef,
        orderBy("dateCreated", "desc") // Sort by creation date in descending order
      )
    );

    const categories = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      categories.push(data);
    });
    return { data: categories, total: categories?.length || 0 };
  } catch (error) {
    throw error;
  }
};

FirebaseMyProjectsService.addCategory = async data => {
  try {
    const userUid = auth.currentUser.uid;

    const categoriesDataCollectionRef = collection(
      db,
      `users/${userUid}/project-categories`
    );
    const currentDate = new Date();

    const newCategory = {
      ...data,
      dateCreated: currentDate,
      dateUpdated: currentDate,
    };

    const categoryRef = await addDoc(categoriesDataCollectionRef, newCategory);
    const categoryId = categoryRef.id;

    await updateDoc(categoryRef, {
      id: categoryId,
    });

    return { ...newCategory, id: categoryId };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

FirebaseMyProjectsService.deleteCategory = async categoryId => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User is not authenticated");
    }

    const owner_uid = user.uid;
    console.log(`owner_uid`, owner_uid);
    const categoryDocRef = doc(
      db,
      `users/${owner_uid}/project-categories`,
      categoryId
    );
    console.log("Attempting to delete category with ID:", categoryId);
    await deleteDoc(categoryDocRef);
    console.log("Category successfully deleted!");
  } catch (error) {
    console.error("Error deleting category:", error);
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
  console.log(`data`, data);
  try {
    const userUid = auth.currentUser.uid;

    const projectsDataCollectionRef = collection(
      db,
      `users/${userUid}/projectsData`
    );
    const currentDate = new Date();

    const newData = {
      ...data,
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
  console.log(`data`, data);
  try {
    const userUid = auth.currentUser.uid;
    const projectId = data.projectId;

    const projectsDataCollectionRef = doc(
      db,
      `users/${userUid}/projectsData/${projectId}`
    );
    console.log(`users/${userUid}/projectsData/${projectId}`);
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

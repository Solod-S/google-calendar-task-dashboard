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
import GoogleCalendarService from "./GoogleCalendarService";

const {
  getGoogleCalendarEvents,
  refreshGoogleCalendarTokens,
  getGoogleCalendarTasks,
} = GoogleCalendarService;

const getWeekDates = () => {
  const weekDates = [];
  const today = new Date();

  const options = { day: "2-digit", month: "short" };
  const formatter = new Intl.DateTimeFormat("en-US", options);

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    const parts = formatter.formatToParts(date);
    const day = parts.find(part => part.type === "day").value;
    const month = parts.find(part => part.type === "month").value;
    const formattedDate = `${day} ${month}`;

    weekDates.push(formattedDate);
  }

  return weekDates;
};

const FirebaseDashboardService = {};

FirebaseDashboardService.fetchTaskOverview = async () => {
  try {
    const { owner_uid } = JSON.parse(localStorage.getItem(AUTH_USER_DATA));

    const projectsDataCollectionRef = collection(
      db,
      `users/${owner_uid}/projectsData`
    );

    // Определяем порядок сортировки
    const orderByField = "dateCreated"; // Сортируем по "dateCreated" по умолчанию, если ключ не указан
    const orderByDirection = "desc"; // Направление сортировки, по умолчанию "desc"

    // Создаем запрос с сортировкой
    const queryConstraints = [orderBy(orderByField, orderByDirection)];

    const querySnapshot = await getDocs(
      query(projectsDataCollectionRef, ...queryConstraints)
    );

    let projectsData = [];
    for (const doc of querySnapshot.docs) {
      const project = doc.data();
      console.log(`project`, project.name);
      if (!project.active) return;
      const googleCalendarIntegration = project.integrations.find(
        integration => integration.name === "Google Calendar"
      );
      if (
        googleCalendarIntegration ||
        googleCalendarIntegration.refresh_token ||
        googleCalendarIntegration.tgSelectors > 0 ||
        googleCalendarIntegration.active
      ) {
        const updatedCredentials = await refreshGoogleCalendarTokens(
          googleCalendarIntegration
        );

        if (!updatedCredentials.access_token) return;

        const events = await getGoogleCalendarEvents({
          ...updatedCredentials,
          tgSelectors: googleCalendarIntegration.tgSelectors,
        });

        if (events.length <= 0) return;

        const activeEvents = events.filter(
          event => event.eventColor === "blue"
        );

        if (activeEvents.length <= 0) return;

        console.log(`events`, activeEvents.slice(0, 2));

        const range = getWeekDates();
        console.log(`range`, range);
        projectsData.push(project);
      }
    }

    return { data: projectsData, total: projectsData.length };
  } catch (error) {
    throw error;
  }
};

export default FirebaseDashboardService;

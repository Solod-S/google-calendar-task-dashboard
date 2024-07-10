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
    // Получаем данные о пользователе из localStorage
    const { owner_uid } = JSON.parse(localStorage.getItem(AUTH_USER_DATA));

    // Ссылка на коллекцию данных проектов пользователя
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
    // Проходим по каждому документу в коллекции
    for (const doc of querySnapshot.docs) {
      const project = doc.data();
      // Проверяем, активен ли проект
      if (!project.active) continue;
      const googleCalendarIntegration = project.integrations.find(
        integration => integration.name === "Google Calendar"
      );

      // Проверяем, активна ли интеграция с Google Calendar
      console.log(
        `googleCalendarIntegration`,
        googleCalendarIntegration.tgSelectors.length <= 0
      );

      if (
        !googleCalendarIntegration ||
        !googleCalendarIntegration.refresh_token ||
        googleCalendarIntegration.tgSelectors.length <= 0 ||
        !googleCalendarIntegration.active
      )
        continue;

      // Обновляем токены Google Calendar
      const updatedCredentials = await refreshGoogleCalendarTokens(
        googleCalendarIntegration
      );

      if (!updatedCredentials.access_token) continue;

      // Получаем события из Google Calendar
      const events = await getGoogleCalendarEvents({
        ...updatedCredentials,
        tgSelectors: googleCalendarIntegration.tgSelectors,
      });
      console.log(`events`, events);
      if (events.length <= 0) continue;

      // Фильтруем активные события
      const activeEvents = events.filter(event => event.eventColor === "blue");
      console.log(`activeEvents`, activeEvents);
      if (activeEvents.length <= 0) continue;

      const range = getWeekDates();
      const taskCounts = new Array(7).fill(0);

      // Подсчитываем количество событий на каждый день недели
      for (const event of activeEvents) {
        const eventDate = new Date(event.start);
        const today = new Date();

        const dayDifference = Math.floor(
          (eventDate - today) / (1000 * 60 * 60 * 24)
        );

        if (dayDifference >= 0 && dayDifference < 7) {
          taskCounts[dayDifference]++;
        }
      }

      // Добавляем данные проекта в массив
      projectsData.push({
        name: project.name,
        data: taskCounts,
      });
    }

    return { data: projectsData, total: projectsData.length };
  } catch (error) {
    throw error;
  }
};

export default FirebaseDashboardService;

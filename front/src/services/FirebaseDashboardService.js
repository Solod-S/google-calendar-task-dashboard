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

import {
  addDays,
  format,
  differenceInCalendarDays,
  startOfDay,
} from "date-fns";

const {
  getGoogleCalendarEvents,
  refreshGoogleCalendarTokens,
  getGoogleCalendarTasks,
  initGoogleCalendar,
} = GoogleCalendarService;

const getWeekDates = () => {
  const weekDates = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    const formattedDate = format(date, "dd MMM");
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
    const userDocRef = doc(db, `users/${owner_uid}`);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();

    // Определяем порядок сортировки
    const orderByField = "dateCreated"; // Сортируем по "dateCreated" по умолчанию, если ключ не указан
    const orderByDirection = "desc"; // Направление сортировки, по умолчанию "desc"

    // Создаем запрос с сортировкой
    const queryConstraints = [orderBy(orderByField, orderByDirection)];

    const querySnapshot = await getDocs(
      query(projectsDataCollectionRef, ...queryConstraints)
    );

    const projectsData = [];
    const range = getWeekDates();
    // Проходим по каждому документу в коллекции
    for (const doc of querySnapshot.docs) {
      const project = doc.data();

      // Проверяем, активен ли проект и есть ли тг группа
      if (!project.active && !project?.tgGroup?.length <= 0) continue;
      const googleCalendarIntegration = project.integrations.find(
        integration => integration.name === "Google Calendar"
      );

      // Проверяем, активна ли интеграция с Google Calendar
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

      await initGoogleCalendar();
      // Получаем события из Google Calendar
      const events = await getGoogleCalendarEvents({
        ...updatedCredentials,
        tgSelectors: googleCalendarIntegration.tgSelectors,
      });

      if (events.length <= 0) continue;

      // Фильтруем активные события
      const activeEvents = events.filter(event => event.eventColor === "blue");

      if (activeEvents.length <= 0) continue;

      const taskCounts = new Array(7).fill(0);

      // Подсчитываем количество событий на каждый день недели
      // Подсчитываем количество событий на каждый день недели
      for (const event of activeEvents) {
        const eventDate = startOfDay(new Date(event.start));
        const today = startOfDay(new Date());

        const dayDifference = differenceInCalendarDays(eventDate, today);

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
    const total = projectsData.reduce((total, project) => {
      return total + project.data.reduce((sum, value) => sum + value, 0);
    }, 0);
    const result = {
      displayName:
        userData?.displayName?.length > 0 ? userData.displayName : "User",
      weekly: { series: projectsData, total, range },
    };
    return result;
  } catch (error) {
    throw error;
  }
};

export default FirebaseDashboardService;

import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import { AUTH_USER_DATA } from "constants/app.constant";
import { db } from "utils/Firebase";
import GoogleCalendarService from "./GoogleCalendarService";

import {
  addDays,
  format,
  differenceInCalendarDays,
  startOfDay,
} from "date-fns";
import FirebaseMyProjectsService from "./FirebaseMyProjectsService";
import dayjs from "dayjs";

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

const generateEvents = ({
  startDate,
  generationIntervalType,
  endDate,
  data,
}) => {
  let result = [];
  let maxDays = 110;
  let start = dayjs(startDate); // Преобразуем стартовую дату в dayjs объект
  let today = dayjs(); // Получаем сегодняшнюю дату
  let finalDate = endDate && endDate !== "" ? dayjs(endDate) : null; // Преобразуем конечную дату, если она не пустая

  // Если стартовая дата в будущем, начинаем с сегодняшней даты
  if (start.isAfter(today)) {
    start = today;
  }

  switch (generationIntervalType) {
    case "oncePerDays":
      // 1. Если сегодняшняя дата больше конечной, возвращаем пустой массив
      if (finalDate && today.isAfter(finalDate)) {
        return [];
      }

      // 2. Генерация массива с объектами по дням
      let currentDay = today;
      let count = 0;

      while (count < maxDays) {
        // Формируем объект события
        result.push({
          start: currentDay.format("YYYY-MM-DD"), // Дата в формате строки
          id: uuidv4(), // Уникальный идентификатор
          ...data, // Вставляем дополнительные данные
        });

        currentDay = currentDay.add(1, "day"); // Переходим к следующему дню
        count++;

        // Если достигли конечной даты, выходим из цикла
        if (finalDate && currentDay.isAfter(finalDate)) {
          break;
        }
      }
      break;

    case "weekly":
      const startDayOfWeek = start.day(); // Определяем день недели стартовой даты (0 - воскресенье, 1 - понедельник, ..., 6 - суббота)
      let currentWeekday = start.clone().day(startDayOfWeek); // Получаем первую дату соответствующего дня недели
      if (currentWeekday.isBefore(today)) {
        currentWeekday = currentWeekday.add(1, "week"); // Если первая неделя уже прошла, переходим на следующую
      }
      let counter = 0;

      // Включаем стартовую дату, если она меньше или равна сегодняшней
      if (start.isSame(today, "day") || start.isBefore(today)) {
        result.push({
          start: start.format("YYYY-MM-DD"), // Дата в формате строки
          id: uuidv4(), // Уникальный идентификатор
          ...data, // Вставляем дополнительные данные
        });
        counter++;
      }

      while (counter < maxDays) {
        // Формируем объект события
        result.push({
          start: currentWeekday.format("YYYY-MM-DD"), // Дата в формате строки
          id: uuidv4(), // Уникальный идентификатор
          ...data, // Вставляем дополнительные данные
        });

        currentWeekday = currentWeekday.add(1, "week"); // Переходим к следующему соответствующему дню недели
        counter++;

        // Если достигли конечной даты, выходим из цикла
        if (finalDate && currentWeekday.isAfter(finalDate)) {
          break;
        }
      }
      break;

    case "monthly":
      // Определяем день месяца из стартовой даты
      let startDayOfMonth = start.date(); // Получаем день месяца стартовой даты
      let currentMonthDate = start.clone().date(startDayOfMonth); // Получаем первую дату этого дня месяца
      if (currentMonthDate.isBefore(today)) {
        currentMonthDate = currentMonthDate.add(1, "month"); // Если этот месяц уже прошёл, переходим к следующему
      }
      let monthCounter = 0;

      // Включаем стартовую дату, если она меньше или равна сегодняшней
      if (start.isSame(today, "day") || start.isBefore(today)) {
        result.push({
          start: start.format("YYYY-MM-DD"), // Дата в формате строки
          id: uuidv4(), // Уникальный идентификатор
          ...data, // Вставляем дополнительные данные
        });
        monthCounter++;
      }

      while (monthCounter < maxDays) {
        // Формируем объект события
        result.push({
          start: currentMonthDate.format("YYYY-MM-DD"), // Дата в формате строки
          id: uuidv4(), // Уникальный идентификатор
          ...data, // Вставляем дополнительные данные
        });

        currentMonthDate = currentMonthDate.add(1, "month"); // Переходим к следующему месяцу
        monthCounter++;

        // Если достигли конечной даты, выходим из цикла
        if (finalDate && currentMonthDate.isAfter(finalDate)) {
          break;
        }
      }
      break;
    default:
      return [];
  }

  return result;
};

const FirebaseDashboardService = {};

FirebaseDashboardService.fetchGoogleCalendarTaskOverview = async () => {
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
    const activeEventsData = [];
    const range = getWeekDates();
    // Проходим по каждому документу в коллекции
    for (const doc of querySnapshot.docs) {
      const project = doc.data();

      // Проверяем, активен ли проект и есть ли тг группа
      if (!project.active || !project.tgGroup) continue;
      const googleCalendarIntegration = project.integrations.find(
        integration => integration.name === "Google Calendar"
      );

      // Проверяем, активна ли интеграция с Google Calendar
      if (
        !googleCalendarIntegration ||
        !googleCalendarIntegration.credentials.refresh_token ||
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
      console.log(`fetchGoogleCalendarTaskOverview events`, events);
      if (events.length <= 0) continue;

      // Фильтруем активные события
      const activeEvents = events.filter(event => event.eventColor === "blue");

      if (activeEvents.length <= 0) continue;

      activeEventsData.push(
        ...activeEvents.map(event => ({ ...event, name: project.name }))
      );

      const taskCounts = new Array(7).fill(0);

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
      activeEventsData,
      weekly: { series: projectsData, total, range },
    };
    return result;
  } catch (error) {
    throw error;
  }
};

FirebaseDashboardService.fetchProjectsData = async () => {
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

    // Определяем порядок сортировки
    const orderByField = "dateCreated"; // Сортируем по "dateCreated" по умолчанию, если ключ не указан
    const orderByDirection = "desc"; // Направление сортировки, по умолчанию "desc"

    // Создаем запрос с сортировкой
    const queryConstraints = [orderBy(orderByField, orderByDirection)];

    const querySnapshot = await getDocs(
      query(projectsDataCollectionRef, ...queryConstraints)
    );
    const projectsData = [];

    // Проходим по каждому документу в коллекции
    for (const doc of querySnapshot.docs) {
      const project = doc.data();
      const result = {
        tgGroup: "",
        tgGroupId: "",
        img: project.img,
        projectName: project.name,
        active: project.active,
        integrations: [],
      };

      const googleCalendarIntegration = project.integrations.find(
        integration =>
          integration.name === "Google Calendar" && integration.active
      );

      const firebaseIntegration = project.integrations.find(
        integration =>
          integration.name === "Firebase Schedule" && integration.active
      );

      const googleSheetsIntegration = project.integrations.find(
        integration =>
          integration.name === "Google Sheets" && integration.active
      );

      if (googleCalendarIntegration) {
        result.integrations.push({
          id: "google calendar",
          name: "Google Calendar",
          img: "/img/thumbs/google-calendar.png",
        });
      }

      if (firebaseIntegration) {
        result.integrations.push({
          id: "firebase schedule",
          name: "Firebase Schedule",
          img: "/img/thumbs/firebase-schedule.png",
        });
      }

      if (googleSheetsIntegration) {
        result.integrations.push({
          id: "google sheets",
          name: "Google Sheets",
          img: "/img/thumbs/google-sheets.png",
        });
      }
      const tgGroups = await FirebaseMyProjectsService.fetchTelegramGroups();
      // // project.tgGroup

      const tgGroup = await tgGroups.data.find(
        group => group.id === project.tgGroup
      );

      if (tgGroup && tgGroup.label) {
        result.tgGroup = tgGroup.label;
        result.tgGroupId = tgGroup.chatId;
      }

      projectsData.push(result);
    }

    return projectsData;
  } catch (error) {
    throw error;
  }
};

FirebaseDashboardService.fetchFirebaseTaskOverview = async () => {
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
    const activeEventsData = [];
    const range = getWeekDates();
    // Проходим по каждому документу в коллекции
    for (const doc of querySnapshot.docs) {
      const project = doc.data();

      // Проверяем, активен ли проект и есть ли тг группа
      if (!project.active || !project.tgGroup) continue;

      const tgGroups = await FirebaseMyProjectsService.fetchTelegramGroups();

      const fireBaseIntegration = project.integrations.find(
        integration => integration.name === "Firebase Schedule"
      );

      // Проверяем, активна ли интеграция с Firebase Schedule
      if (
        !fireBaseIntegration ||
        !fireBaseIntegration.active ||
        !fireBaseIntegration.scheduleData ||
        fireBaseIntegration.scheduleData.length <= 0
      )
        continue;

      // Получаем события из Firebase Schedule
      const scheduleData = fireBaseIntegration.scheduleData;

      // Фильтруем активные события
      const activeScheduleData = scheduleData.filter(({ status }) => status);

      if (activeScheduleData.length <= 0) continue;
      let activeEvents = [];

      for (const schedule of activeScheduleData) {
        const endDate =
          schedule.repeatEndType !== "never" ? schedule.endDate : "";

        const formatedEvents = generateEvents({
          startDate: schedule.startDate,
          generationIntervalType: schedule.generationIntervalType,
          endDate,
          data: {
            title: schedule.name,
            description: schedule.message,
            time: schedule.selectedTime,
            end: endDate,
            img: schedule.img,
            video: schedule.video,
            tgData: await tgGroups.data.find(
              group => group.id === project.tgGroup
            ),
          },
        });
        activeEvents.push(...formatedEvents);
      }

      if (activeEvents.length <= 0) continue;
      activeEventsData.push(
        ...activeEvents.map(event => ({ ...event, name: project.name }))
      );

      const taskCounts = new Array(7).fill(0);

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
      activeEventsData,
      weekly: { series: projectsData, total, range },
    };

    return result;
  } catch (error) {
    console.log(`error in fetchFirebaseTaskOverview`, error);
    throw error;
  }
};

export default FirebaseDashboardService;

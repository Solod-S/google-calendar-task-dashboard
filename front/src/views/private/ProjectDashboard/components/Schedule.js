import React, { useEffect, useState } from "react";
import { format, parseISO, isToday } from "date-fns";
import classNames from "classnames";
import { Card, Calendar, Badge, Dialog } from "components/ui";
import useThemeClass from "utils/hooks/useThemeClass";
import { HiVideoCamera, HiDocumentText, HiChatAlt2 } from "react-icons/hi";

const todayIsToday = someDate => {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

// const formatText = text => {
//   // Обработка текста с переносами строк
//   return text.split("\n").map((item, index) => (
//     <React.Fragment key={index}>
//       {item}
//       <br />
//     </React.Fragment>
//   ));
// };

const EventIcon = ({ type }) => {
  const baseClass =
    "rounded-lg h-10 w-10 text-lg flex items-center justify-center";

  switch (type) {
    case "meeting":
      return (
        <div
          className={classNames(
            baseClass,
            "text-indigo-600 bg-indigo-100 dark:text-indigo-100 dark:bg-indigo-500/20"
          )}
        >
          <HiVideoCamera />
        </div>
      );
    case "task":
      return (
        <div
          className={classNames(
            baseClass,
            "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100"
          )}
        >
          <HiDocumentText />
        </div>
      );
    case "workshop":
      return (
        <div
          className={classNames(
            baseClass,
            "text-amber-600 bg-amber-100 dark:text-amber-100 dark:bg-amber-500/20"
          )}
        >
          <HiChatAlt2 />
        </div>
      );
    default:
      return null;
  }
};

const Schedule = ({ activeEventsData = [] }) => {
  const [value, setValue] = useState();
  const [allEvents, setallEvents] = useState([]);
  const [activeEvents, setactiveEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");

  const { textTheme } = useThemeClass();

  const handleCalendar = value => {
    setValue(value);
    if (allEvents.length > 0) {
      const parsedDate = new Date(value);
      const formattedValue = format(parsedDate, "yyyy-MM-dd");
      const filteredData = allEvents.filter(event => {
        return event.date === formattedValue;
      });
      setactiveEvents(filteredData);
    }
  };

  const handleClickOpen = event => {
    setSelectedEvent(event.description); // Предположим, что description - это строка
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent("");
  };

  useEffect(() => {
    if (activeEventsData.length > 0) {
      const formatedData = activeEventsData.map(event => ({
        id: event.id,
        title: event.title,
        date: event.start,
        time: event.time,
        eventName: event.name,
        description: event.description,
        type: "task",
      }));

      const filteredData = formatedData.filter(event => {
        const eventDate = parseISO(event.date);
        return isToday(eventDate);
      });

      setactiveEvents(filteredData.slice(0, 10));
      setallEvents(formatedData);
    }
  }, [activeEventsData]);

  return (
    <Card className="mb-4">
      <div className="mx-auto max-w-[420px]">
        <Calendar
          value={value}
          onChange={a => handleCalendar(a)}
          dayClassName={(date, { selected }) => {
            const defaultClass = "text-base";

            if (todayIsToday(date) && !selected) {
              return classNames(defaultClass, textTheme);
            }

            if (selected) {
              return classNames(defaultClass, "text-white");
            }

            return defaultClass;
          }}
          dayStyle={() => {
            return { height: 48 };
          }}
          renderDay={date => {
            const day = date.getDate();
            let useBadge = false;
            if (allEvents.length > 0) {
              const parsedDate = new Date(date);
              const formattedValue = format(parsedDate, "yyyy-MM-dd");
              const isSameDate = allEvents.find(event => {
                return event.date === formattedValue;
              });

              if (isSameDate) useBadge = true;
            }
            return (
              <span className="relative flex justify-center items-center w-full h-full">
                {day}
                {useBadge && (
                  <Badge className="absolute bottom-1" innerClass="h-1 w-1" />
                )}
              </span>
            );
          }}
        />
      </div>
      <hr className="my-6" />
      <h5 className="mb-4">Current day task(s)</h5>
      {activeEvents.map(event => (
        <div
          key={event.id}
          className="flex items-center justify-between rounded-md mb-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-600/40 cursor-pointer user-select"
          onClick={() => handleClickOpen(event)}
        >
          <div className="flex items-center gap-3">
            <EventIcon type={event.type} />
            <div>
              <h6 className="text-sm font-bold">{event.title}</h6>
              <p>{event.eventName}</p>
            </div>
          </div>
          <span>{event.time}</span>
        </div>
      ))}

      <Dialog isOpen={open} closable={false} onRequestClose={handleClose}>
        <h5 className="mb-4 text-center">Current task description</h5>

        <div className="max-h-64 overflow-y-auto mb-4 overflow-x-hidden">
          {/* Отображаем HTML-контент */}
          <div dangerouslySetInnerHTML={{ __html: selectedEvent }} />
        </div>
      </Dialog>
    </Card>
  );
};

export default Schedule;

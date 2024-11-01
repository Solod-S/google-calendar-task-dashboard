import React, { useEffect, useState } from "react";
import { format, parseISO, isToday } from "date-fns";
import classNames from "classnames";
import { Card, Calendar, Badge, Dialog } from "components/ui";
import useThemeClass from "utils/hooks/useThemeClass";
import { HiVideoCamera, HiDocumentText, HiChatAlt2 } from "react-icons/hi";

const getYoutubeId = url => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
  const matches = url.match(regex);
  return matches ? matches[1] : null;
};

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
  const [allEvents, setAllEvents] = useState([]);
  const [activeEvents, setActiveEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { textTheme } = useThemeClass();

  const handleCalendar = value => {
    setValue(value);
    if (allEvents.length > 0) {
      const parsedDate = new Date(value);
      const formattedValue = format(parsedDate, "yyyy-MM-dd");
      const filteredData = allEvents.filter(event => {
        return event.date === formattedValue;
      });
      setActiveEvents(filteredData);
    }
  };

  const handleClickOpen = event => {
    console.log(`event`, event);
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  useEffect(() => {
    if (activeEventsData.length > 0) {
      const formatedData = activeEventsData.map(event => ({
        img: event.img ? event.img : [],
        video: event.video ? event.video : "",
        tgData: event.tgData ? event.tgData : null,
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

      setActiveEvents(filteredData.slice(0, 10));
      setAllEvents(formatedData);
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

      <Dialog
        height="80%"
        isOpen={open}
        closable={false}
        onRequestClose={handleClose}
      >
        <h6 className="mb-4 text-center">Details</h6>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto mb-4 overflow-x-hidden">
            <div>
              <div className="flex mb-4">
                <h6 className="text-sm font-bold mr-1">Project:</h6>
                <p className="text-sm">{selectedEvent?.eventName}</p>
              </div>
              <div className="flex mb-4">
                <h6 className="text-sm font-bold mr-1">Telegram Group Name:</h6>
                <p className="text-sm">{selectedEvent?.tgData?.label}</p>
              </div>
              <div className="flex mb-4">
                <h6 className="text-sm font-bold mr-1">Telegram Group ID:</h6>
                <p className="text-sm">{selectedEvent?.tgData?.chatId}</p>
              </div>
              <div className="flex mb-4">
                <h6 className="text-sm font-bold mr-1">Schedule Name:</h6>
                <p className="text-sm">{selectedEvent?.title}</p>
              </div>
              <div className="flex mb-4">
                <h6 className="text-sm font-bold mr-1">Date:</h6>
                <p className="text-sm">{selectedEvent?.date}</p>
              </div>
              <div className="flex mb-3">
                <h6 className="text-sm font-bold mr-1">Time:</h6>
                <p className="text-sm">{selectedEvent?.time}</p>
              </div>
            </div>

            <h6 className="mb-4 text-center">Description</h6>
            <div
              dangerouslySetInnerHTML={{ __html: selectedEvent?.description }}
            />

            {selectedEvent?.img && selectedEvent.img.length > 0 && (
              <div className="mb-4">
                <h6 className="mb-2 text-center">Images</h6>
                <div className="flex flex-wrap justify-center">
                  {selectedEvent.img.map((image, index) => (
                    <div key={index} className="m-2">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedEvent?.video && (
              <div className="mb-4">
                <h6 className="mb-2 text-center">YouTube Video</h6>
                <div className="flex justify-center">
                  <iframe
                    width="100%"
                    height="440"
                    src={`https://www.youtube.com/embed/${getYoutubeId(
                      selectedEvent.video
                    )}`}
                    title="YouTube Video"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </Card>
  );
};

export default Schedule;

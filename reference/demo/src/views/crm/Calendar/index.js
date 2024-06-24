import React, { useEffect } from "react";
import { CalendarView, Container } from "components/shared";
import EventDialog from "./components/EventDialog";
import reducer from "./store";
import { injectReducer } from "store/index";
import { getEvents, updateEvent } from "./store/dataSlice";
import { setSelected, openDialog } from "./store/stateSlice";
import { useDispatch, useSelector } from "react-redux";
import cloneDeep from "lodash/cloneDeep";

injectReducer("crmCalendar", reducer);

const Calendar = () => {
  const dispatch = useDispatch();
  const events = useSelector(state => state.crmCalendar.data.eventList);

  useEffect(() => {
    dispatch(getEvents());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    console.log(`events`, events);
    // [
    //   {
    //     id: "0",
    //     title: "All Day Event",
    //     start: "2024-06-01",
    //     eventColor: "orange",
    //   },
    //   {
    //     id: "1",
    //     title: "Long Event",
    //     start: "2024-06-07",
    //     end: "2024-06-10",
    //     eventColor: "red",
    //   },
    //   {
    //     id: "2",
    //     groupId: "999",
    //     title: "Repeating Event",
    //     start: "2024-06-09T16:00:00+00:00",
    //     eventColor: "blue",
    //   },
    //   {
    //     id: "3",
    //     groupId: "999",
    //     title: "Repeating Event",
    //     start: "2024-06-16T16:00:00+00:00",
    //     eventColor: "blue",
    //   },
    //   {
    //     id: "4",
    //     title: "Conference",
    //     start: "YEAR-MONTH-17",
    //     end: "2024-06-19",
    //     eventColor: "blue",
    //   },
    //   {
    //     id: "5",
    //     title: "Meeting",
    //     start: "2024-06-18T10:30:00+00:00",
    //     end: "2024-06-18T12:30:00+00:00",
    //     eventColor: "blue",
    //   },
    //   {
    //     id: "6",
    //     title: "Lunch",
    //     start: "2024-06-18T12:00:00+00:00",
    //     eventColor: "emerald",
    //   },
    //   {
    //     id: "7",
    //     title: "Birthday Party",
    //     start: "2024-06-19T07:00:00+00:00",
    //     eventColor: "purple",
    //   },
    //   {
    //     id: "8",
    //     title: "Meeting",
    //     start: "2024-06-18T14:30:00+00:00",
    //     eventColor: "blue",
    //   },
    //   {
    //     id: "9",
    //     title: "Happy Hour",
    //     start: "2024-06-18T17:30:00+00:00",
    //     eventColor: "cyan",
    //   },
    //   {
    //     id: "10",
    //     title: "Dinner",
    //     start: "2024-06-18T20:00:00+00:00",
    //     eventColor: "emerald",
    //   },
    // ];
  }, [events]);
  const onCellSelect = event => {
    const { start, end } = event;
    dispatch(
      setSelected({
        type: "NEW",
        start,
        end,
      })
    );
    dispatch(openDialog());
  };

  const onEventClick = arg => {
    const { start, end, id, title, extendedProps } = arg.event;

    dispatch(
      setSelected({
        type: "EDIT",
        eventColor: extendedProps.eventColor,
        title,
        start,
        end,
        id,
      })
    );
    dispatch(openDialog());
  };

  const onSubmit = (data, type) => {
    let newEvents = cloneDeep(events);

    if (type === "NEW") {
      newEvents.push(data);
    }

    if (type === "EDIT") {
      newEvents = newEvents.map(event => {
        if (data.id === event.id) {
          event = data;
        }
        return event;
      });
    }
    dispatch(updateEvent(newEvents));
  };

  const onEventChange = arg => {
    const newEvents = cloneDeep(events).map(event => {
      if (arg.event.id === event.id) {
        const { id, extendedProps, start, end, title } = arg.event;
        event = {
          id,
          start,
          end,
          title,
          eventColor: extendedProps.eventColor,
        };
      }
      return event;
    });
    dispatch(updateEvent(newEvents));
  };

  return (
    <Container className="h-full">
      <CalendarView
        events={events}
        eventClick={onEventClick}
        select={onCellSelect}
        editable
        selectable
        eventDrop={onEventChange}
      />
      <EventDialog submit={onSubmit} />
    </Container>
  );
};

export default Calendar;

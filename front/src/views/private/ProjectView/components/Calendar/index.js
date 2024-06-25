import React, { useEffect, useState, useRef } from "react";
import { CalendarView, Container } from "components/shared";
import EventDialog from "./components/EventDialog";
import reducer from "./store";
import { injectReducer } from "store/index";
import { getEvents, updateEvent } from "./store/dataSlice";
import { setSelected, openDialog } from "./store/stateSlice";
import { useDispatch, useSelector } from "react-redux";
import cloneDeep from "lodash/cloneDeep";
import GoogleCalendarService from "services/GoogleCalendarService";

const {
  exchangeCodeForTokens,
  initGoogleCalendar,
  getGoogleCalendarEvents,
  refreshGoogleCalendarTokens,
  getGoogleCalendarTasks,
} = GoogleCalendarService;

injectReducer("crmCalendar", reducer);

const Calendar = ({ show, generalData, setGeneralDatas }) => {
  const dispatch = useDispatch();
  const storeEvents = useSelector(state => state.crmCalendar.data.eventList);
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);

  useEffect(() => {
    const getGoogleEvents = async () => {
      const updatedCredentials = await refreshGoogleCalendarTokens(
        googleCalendarCredentials
      );
      dispatch(
        getEvents({
          ...googleCalendarCredentials,
          ...updatedCredentials,
        })
      );
    };
    const googleCalendarCredentials = generalData?.integrations?.find(
      integration => integration.key === "google_calendar"
    );

    if (googleCalendarCredentials) {
      setTimeout(() => {
        getGoogleEvents(googleCalendarCredentials);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, generalData]);

  useEffect(() => {
    initGoogleCalendar().catch(error => {
      console.error("Error initializing Google API:", error);
    });
  }, []);

  useEffect(() => {
    setEvents(storeEvents);
  }, [storeEvents]);

  useEffect(() => {
    if (show && calendarRef.current) {
      calendarRef.current.getApi().updateSize();
    }
  }, [show]);

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
    <div
      style={{
        visibility: show ? "visible" : "hidden",
        position: show ? "" : "absolute",
      }}
    >
      <Container className="h-full">
        <CalendarView
          ref={calendarRef}
          events={events}
          eventClick={onEventClick}
          select={onCellSelect}
          editable
          selectable
          eventDrop={onEventChange}
        />
        <EventDialog submit={onSubmit} />
      </Container>
    </div>
  );
};

export default Calendar;

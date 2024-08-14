import React, { useEffect, useState, useRef } from "react";
import { HiClipboardList } from "react-icons/hi";
import { CalendarView, Container } from "components/shared";
import EventDialog from "./components/EventDialog";
import reducer from "./store";
import { injectReducer } from "store/index";
import { getEvents, updateEvent } from "./store/dataSlice";
import { setSelected, openDialog } from "./store/stateSlice";
import { useDispatch, useSelector } from "react-redux";
import cloneDeep from "lodash/cloneDeep";
import GoogleCalendarService from "services/GoogleCalendarService";
import Button from "../../../../../components/ui/Buttons";
import { Modal } from "antd";

const {
  exchangeCodeForTokens,
  initGoogleCalendar,
  getGoogleCalendarEvents,
  refreshGoogleCalendarTokens,
  getGoogleCalendarTasks,
} = GoogleCalendarService;

injectReducer("crmCalendar", reducer);

const ManageSelectorsModal = ({ selectors, onSelect, onClose, open }) => {
  return (
    <Modal
      title="Choose the selector you want to remove"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <div className="flex flex-wrap">
        {selectors.map((word, index) => (
          <Button
            variant="solid"
            color="red-600"
            key={index}
            className="m-1"
            onClick={() => onSelect(word)}
          >
            {word}
          </Button>
        ))}
      </div>
    </Modal>
  );
};

const Calendar = ({ show, generalData, setGeneralData }) => {
  const dispatch = useDispatch();
  const storeEvents = useSelector(state => state.crmCalendar.data.eventList);
  const [manageSelectorsModalOpen, setManageSelectorsModalOpen] =
    useState(false);
  const [selectors, setSelectors] = useState([]);
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);

  const handleRemoveSelector = word => {
    setGeneralData(prevState => {
      const updatedIntegrations = prevState.integrations.map(integration => {
        if (integration.key === "google_calendar") {
          const isWordInSelectors = integration.tgSelectors.includes(word);
          return {
            ...integration,
            tgSelectors: isWordInSelectors
              ? integration.tgSelectors.filter(w => w !== word)
              : [...integration.tgSelectors, word],
          };
        }
        return integration;
      });
      return {
        ...prevState,
        integrations: updatedIntegrations,
      };
    });
  };
  const getGoogleEvents = async googleCalendarCredentials => {
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

  useEffect(() => {
    try {
      const googleCalendarCredentials = generalData?.integrations?.find(
        integration => integration.key === "google_calendar"
      );

      if (googleCalendarCredentials) {
        if (googleCalendarCredentials?.tgSelectors)
          setSelectors(googleCalendarCredentials.tgSelectors);
        console.log(`googleCalendarCredentials`, googleCalendarCredentials);
        setTimeout(() => {
          getGoogleEvents(googleCalendarCredentials);
        }, 1000);
      }
    } catch (error) {
      console.log(`error in fetching events: ${error}`);
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
    const { start, end, id, title, extendedProps, time, description } =
      arg.event;

    dispatch(
      setSelected({
        type: "EDIT",
        eventColor: extendedProps.eventColor,
        title,
        start,
        end,
        id,
        description: extendedProps.description,
        time: extendedProps.time,
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
        <ManageSelectorsModal
          open={manageSelectorsModalOpen}
          selectors={selectors}
          onSelect={handleRemoveSelector}
          onClose={() => setManageSelectorsModalOpen(false)}
        />

        <CalendarView
          ref={calendarRef}
          events={events}
          eventClick={onEventClick}
          setManageSelectorsModalOpen={setManageSelectorsModalOpen}
          onRefresh={getGoogleEvents}
          generalData={generalData}
          select={onCellSelect}
          editable
          selectable
          eventDrop={onEventChange}
        />
        <EventDialog
          generalData={generalData}
          setGeneralData={setGeneralData}
          submit={onSubmit}
        />
      </Container>
    </div>
  );
};

export default Calendar;

import React, { forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Notification } from "components/ui";
import { setCustomerList, putCustomer } from "../store/dataSlice";
import { setDrawerClose, setSelectedCustomer } from "../store/stateSlice";
import cloneDeep from "lodash/cloneDeep";

import CustomerForm from "./CustomerForm";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

const CustomerEditContent = forwardRef(({ setGeneralData }, ref) => {
  const dispatch = useDispatch();

  const customer = useSelector(
    state => state.crmCustomers.state.selectedCustomer
  );
  const data = useSelector(state => state.crmCustomers.data.customerList);
  const { id } = customer;

  const projectId = id ? id : uuidv4();

  const onFormSubmit = values => {
    try {
      const {
        name,
        message,
        img,
        status,
        generationIntervalType,
        monthlyIntervalLastDay,
        repeatEndType,
        selectedTime,
        startDate,
        endDate,
      } = values;

      const basicInfo = { name, img, message, status };
      const scheduleInfo = {
        generationIntervalType,
        monthlyIntervalLastDay,
        repeatEndType,
        selectedTime,
        startDate,
        endDate,
      };
      let newData = cloneDeep(data);

      setGeneralData(prevState => {
        const updatedIntegrations = prevState.integrations.map(integration => {
          if (integration.key === "firebase_schedule") {
            newData = integration.scheduleData;
            const isNewSchedule = newData.find(
              schedule => schedule.id === projectId
            );
            if (isNewSchedule) {
              newData = newData.map(elm => {
                if (elm.id === projectId) {
                  elm = {
                    ...elm,
                    ...basicInfo,
                    ...scheduleInfo,
                    updated: dayjs().format("YYYY-MM-DD HH:mm"),
                    updatedUnix: dayjs().unix(),
                  };
                }
                return elm;
              });
            } else {
              newData = [
                ...newData,
                {
                  id: projectId,
                  ...basicInfo,
                  ...scheduleInfo,
                  created: dayjs().format("YYYY-MM-DD HH:mm"),
                  createdUnix: dayjs().unix(),
                  updated: dayjs().format("YYYY-MM-DD HH:mm"),
                  updatedUnix: dayjs().unix(),
                },
              ];
            }

            return {
              ...integration,
              scheduleData: newData,
            };
          }
          return integration;
        });

        return {
          ...prevState,
          integrations: updatedIntegrations,
        };
      });
      dispatch(setDrawerClose());
      // dispatch(setCustomerList(newData));
      dispatch(setSelectedCustomer({}));
      toast.push(
        <Notification
          title={"Firebase schedule event has been successfully created"}
          type="success"
        />,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      toast.push(
        <Notification title={"Oops, something went wrong"} type="danger" />,
        {
          placement: "top-center",
        }
      );
    }
  };

  return (
    <CustomerForm ref={ref} onFormSubmit={onFormSubmit} customer={customer} />
  );
});

export default CustomerEditContent;

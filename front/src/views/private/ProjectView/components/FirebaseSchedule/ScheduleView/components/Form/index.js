import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";

import { Tabs, FormContainer } from "components/ui";
import { Form, Formik } from "formik";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import * as Yup from "yup";
import InfoForm from "./InfoForm";
import FirebaseScheduleForm from "./FirebaseScheduleForm";

dayjs.extend(customParseFormat);

const validationSchema = Yup.object().shape({
  name: Yup.string().required("User Name Required"),
  message: Yup.string()
    .required("Message Required")
    .max(1024, "Message cannot be longer than 1024 characters"),
  img: Yup.array()
    .of(Yup.string().url("Invalid URL"))
    .max(5, "Cannot have more than 5 images"),
});

const { TabNav, TabList, TabContent } = Tabs;

const ScheduleForm = forwardRef((props, ref) => {
  const { schedule, onFormSubmit } = props;

  const [generationIntervalType, setGenerationIntervalType] =
    useState("oncePerDays");
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [repeatEndType, setRepeatEndType] = useState("never");
  const [endDate, setEndDate] = useState(
    dayjs().add(1, "day").format("YYYY-MM-DD")
  );
  const [monthlyIntervalLastDay, setMonthlyIntervalLastDay] =
    useState("disable");

  const [activeTab, setActiveTab] = useState("generalInfo");
  const [name, setName] = useState(schedule?.name || "");
  const [message, setMessage] = useState(schedule?.message || "");
  const [status, setStatus] = useState(schedule?.status || false);

  const [formikMediaValues, setFormikMediaValues] = useState({
    img: schedule?.img || [],
  });

  useEffect(() => {
    const {
      generationIntervalType = "oncePerDays",
      startDate = dayjs().format("YYYY-MM-DD"),
      selectedTime = "10:00",
      repeatEndType = "never",
      endDate = dayjs().add(1, "day").format("YYYY-MM-DD"),
      monthlyIntervalLastDay = "disable",
    } = schedule;

    setGenerationIntervalType(generationIntervalType);
    setStartDate(startDate);
    setSelectedTime(selectedTime);
    setRepeatEndType(repeatEndType);
    setEndDate(endDate);
    setMonthlyIntervalLastDay(monthlyIntervalLastDay);
  }, [schedule]);

  const handleScheduleData = () => {
    return {
      generationIntervalType,
      startDate,
      selectedTime,
      repeatEndType,
      endDate,
      monthlyIntervalLastDay,
    };
  };

  const formikRef = React.useRef();
  // TODO REF USE 2
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      try {
        console.log(`Form`);
        setActiveTab("generalInfo");
        setTimeout(() => {
          if (formikRef.current) {
            console.log(`Form 2`);
            formikRef.current.submitForm();
          }
        }, 0);
      } catch (error) {
        console.log(`error in submitForm`, error);
      }
    },
    getScheduleFormData: () => {
      try {
        const scheduleData = handleScheduleData();
        return {
          ...schedule,
          ...formikMediaValues,
          ...scheduleData,
          name,
          message,
          status,
        };
      } catch (error) {
        console.log(`error in getScheduleFormData`, error);
      }
    },
  }));

  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <TabList>
        <TabNav value="generalInfo">General Info</TabNav>
        <TabNav value="schedule">Schedule</TabNav>
      </TabList>
      <div className="p-6">
        <TabContent value="generalInfo">
          <Formik
            innerRef={formikRef}
            initialValues={{ ...formikMediaValues, name, message, status }}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={(values, { setSubmitting }) => {
              try {
                // Clean up values.img by trimming and removing empty URLs
                const cleanedImg = values.img
                  .map(url => url.trim())
                  .filter(url => url.length > 0);

                const updatedValues = {
                  ...values,
                  img: cleanedImg,
                };

                const scheduleData = handleScheduleData();
                onFormSubmit?.({ ...updatedValues, ...scheduleData });

                setSubmitting(false);
              } catch (error) {
                console.log(`error in onSubmit`, error);
              }
            }}
          >
            {({ values, touched, errors, handleBlur }) => (
              <Form className="test">
                <FormContainer>
                  <InfoForm
                    values={values}
                    touched={touched}
                    errors={errors}
                    handleBlur={handleBlur}
                    setFormikMediaValues={setFormikMediaValues}
                    name={name}
                    setName={setName}
                    message={message}
                    setMessage={setMessage}
                    status={status}
                    setStatus={setStatus}
                  />
                </FormContainer>
              </Form>
            )}
          </Formik>
        </TabContent>
        <TabContent value="schedule">
          <FirebaseScheduleForm
            generationIntervalType={generationIntervalType}
            setGenerationIntervalType={setGenerationIntervalType}
            startDate={startDate}
            setStartDate={setStartDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            repeatEndType={repeatEndType}
            setRepeatEndType={setRepeatEndType}
            endDate={endDate}
            setEndDate={setEndDate}
            monthlyIntervalLastDay={monthlyIntervalLastDay}
            setMonthlyIntervalLastDay={setMonthlyIntervalLastDay}
          />
        </TabContent>
      </div>
    </Tabs>
  );
});

export default ScheduleForm;

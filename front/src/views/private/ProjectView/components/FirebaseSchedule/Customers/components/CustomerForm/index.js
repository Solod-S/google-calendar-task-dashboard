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
  message: Yup.string().required("Message Required"),
  img: Yup.string().url("Invalid URL"),
});

const { TabNav, TabList, TabContent } = Tabs;

const CustomerForm = forwardRef((props, ref) => {
  const { customer, onFormSubmit } = props;
  console.log("customer", customer);
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
  const [formikValues, setFormikValues] = useState({
    name: customer?.name || "",
    status: customer?.status || false,
    message: customer?.message || "",
    img: customer?.img || "",
  });

  useEffect(() => {
    const {
      generationIntervalType = "oncePerDays",
      startDate = dayjs().format("YYYY-MM-DD"),
      selectedTime = "10:00",
      repeatEndType = "never",
      endDate = dayjs().add(1, "day").format("YYYY-MM-DD"),
      monthlyIntervalLastDay = "disable",
    } = customer;

    setGenerationIntervalType(generationIntervalType);
    setStartDate(startDate);
    setSelectedTime(selectedTime);
    setRepeatEndType(repeatEndType);
    setEndDate(endDate);
    setMonthlyIntervalLastDay(monthlyIntervalLastDay);
  }, [customer]);

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
      setActiveTab("generalInfo");
      setTimeout(() => {
        if (formikRef.current) {
          formikRef.current.submitForm();
        }
      }, 0);
    },
    getScheduleFormData: () => {
      const scheduleData = handleScheduleData();
      return { ...customer, ...formikValues, ...scheduleData };
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
            initialValues={formikValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={(values, { setSubmitting }) => {
              const scheduleData = handleScheduleData();
              onFormSubmit?.({ ...values, ...scheduleData });
              setSubmitting(false);
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
                    setFormikValues={setFormikValues}
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

export default CustomerForm;

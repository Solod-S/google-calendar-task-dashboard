import React, { forwardRef } from "react";
import { Tabs, FormContainer } from "components/ui";
import { Form, Formik } from "formik";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import * as Yup from "yup";
import InfoForm from "./InfoForm";
import ScheduleForm from "./ScheduleForm";
import FirebaseScheduleForm from "./FirebaseScheduleForm";

dayjs.extend(customParseFormat);

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email Required"),
  name: Yup.string().required("User Name Required"),
  location: Yup.string(),
  title: Yup.string(),
  phoneNumber: Yup.string().matches(
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
    "Phone number is not valid"
  ),
  birthday: Yup.string(),
  facebook: Yup.string(),
  twitter: Yup.string(),
  pinterest: Yup.string(),
  linkedIn: Yup.string(),
  img: Yup.string(),
});

const { TabNav, TabList, TabContent } = Tabs;

const CustomerForm = forwardRef((props, ref) => {
  const { customer, onFormSubmit } = props;

  return (
    <Formik
      innerRef={ref}
      initialValues={{
        name: customer.name || "",
        status: customer?.status || false,
        message: customer?.message || "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onFormSubmit?.(values);
        setSubmitting(false);
      }}
    >
      {({ touched, errors, resetForm }) => (
        <Form className="test">
          <FormContainer>
            <Tabs defaultValue="generalInfo">
              <TabList>
                <TabNav value="generalInfo">General Info</TabNav>
                <TabNav value="schedule">Schedule</TabNav>
              </TabList>
              <div className="p-6">
                <TabContent value="generalInfo">
                  <InfoForm touched={touched} errors={errors} />
                </TabContent>
                <TabContent value="schedule">
                  <FirebaseScheduleForm />
                </TabContent>
              </div>
            </Tabs>
          </FormContainer>
        </Form>
      )}
    </Formik>
  );
});

export default CustomerForm;

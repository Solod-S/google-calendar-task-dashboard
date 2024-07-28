import React from "react";
import { Input, FormItem, Switcher } from "components/ui";
import { HiUserCircle } from "react-icons/hi";
import { Field } from "formik";

const InfoForm = ({ values, touched, errors, handleBlur, setFormikValues }) => {
  return (
    <>
      <FormItem
        label="Name"
        invalid={errors.name && touched.name}
        errorMessage={errors.name}
      >
        <Input
          type="text"
          autoComplete="off"
          name="name"
          placeholder="Name"
          value={values.name}
          onChange={e => {
            setFormikValues(prevValues => ({
              ...prevValues,
              name: e.target.value,
            }));
            // handleChange(e);
          }}
          onBlur={handleBlur}
          prefix={<HiUserCircle className="text-xl" />}
        />
      </FormItem>
      <FormItem
        label="Active"
        invalid={errors.status && touched.status}
        errorMessage={errors.status}
      >
        <Switcher
          name="status"
          checked={values.status}
          onChange={e => {
            setFormikValues(prevValues => ({
              ...prevValues,
              status: !e,
            }));
          }}
        />
        {/* <Field
          checked={values.status}
          component={Switcher}
          name="status"
          onChange={e => {
            console.log(e.target.value);
            setFormikValues(prevValues => ({
              ...prevValues,
              status: e.target.value,
            }));
            handleChange(e);
          }}
        /> */}
      </FormItem>
      <FormItem
        label="Message"
        invalid={errors.message && touched.message}
        errorMessage={errors.message}
      >
        <textarea
          name="message"
          placeholder="Enter your message here"
          rows="5"
          className="w-full h-40 p-2 border border-gray-300 rounded resize-y"
          value={values.message}
          onChange={e => {
            setFormikValues(prevValues => ({
              ...prevValues,
              message: e.target.value,
            }));
            // handleChange(e);
          }}
          onBlur={handleBlur}
        />
      </FormItem>
    </>
  );
};

export default InfoForm;

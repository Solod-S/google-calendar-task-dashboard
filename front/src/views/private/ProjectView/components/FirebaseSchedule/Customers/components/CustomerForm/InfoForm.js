import React from "react";
import { Input, FormItem, Switcher } from "components/ui";
import { HiOutlineUser, HiUserCircle } from "react-icons/hi";
import { MdOutlineNoPhotography } from "react-icons/md";

import { Field } from "formik";
import { Avatar } from "antd";

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
      </FormItem>
      <FormItem
        invalid={errors.img && touched.img}
        errorMessage={errors.img}
        name="img"
        label="Message Image URL 🖼️ "
      >
        <Field
          type="text"
          autoComplete="off"
          name="img"
          placeholder="Image URL"
          component={Input}
          onChange={e => {
            setFormikValues(prevValues => ({
              ...prevValues,
              img: e.target.value,
            }));
          }}
        />
        {values.img && (
          <Avatar
            className="border-2 border-white dark:border-gray-800 shadow-lg mt-4"
            size={60}
            shape="circle"
            src={values.img}
            icon={<MdOutlineNoPhotography />}
          />
        )}
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

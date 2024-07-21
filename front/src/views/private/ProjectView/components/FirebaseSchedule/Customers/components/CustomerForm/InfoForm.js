import React from "react";
import {
  DatePicker,
  Input,
  FormItem,
  Avatar,
  Upload,
  Switcher,
} from "components/ui";
import {
  HiUserCircle,
  HiMail,
  HiLocationMarker,
  HiPhone,
  HiCake,
  HiOutlineUser,
} from "react-icons/hi";
import { Field } from "formik";

// tgName: "General",
//         created: 1623430400,
//         updated: 1632393600,

const InfoForm = props => {
  const { touched, errors } = props;

  const onSetFormFile = (form, field, file) => {
    form.setFieldValue(field.name, URL.createObjectURL(file[0]));
  };

  return (
    <>
      <FormItem
        label="Name"
        invalid={errors.name && touched.name}
        errorMessage={errors.name}
      >
        <Field
          type="text"
          autoComplete="off"
          name="name"
          placeholder="Name"
          component={Input}
          prefix={<HiUserCircle className="text-xl" />}
        />
      </FormItem>
      <FormItem
        label="Active"
        invalid={errors.status && touched.status}
        errorMessage={errors.status}
      >
        <Field component={Switcher} name="status" />
      </FormItem>
      <FormItem
        label="Message"
        invalid={errors.message && touched.message}
        errorMessage={errors.message}
      >
        <Field
          name="message"
          as="textarea"
          placeholder="Enter your message here"
          rows="5"
          className="w-full h-40 p-2 border border-gray-300 rounded resize-y"
          prefix={<HiUserCircle className="text-xl" />}
        />
      </FormItem>
    </>
  );
};

export default InfoForm;

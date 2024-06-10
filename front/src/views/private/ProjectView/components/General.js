import React, { useEffect } from "react";
import {
  Input,
  Avatar,
  Upload,
  Button,
  Select,
  Switcher,
  Notification,
  toast,
  FormContainer,
} from "components/ui";
import FormDesription from "./FormDesription";
import FormRow from "./FormRow";
import { Field, Form, Formik } from "formik";
import { HiOutlineBriefcase, HiOutlineUser } from "react-icons/hi";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Too Short!")
    .max(12, "Too Long!")
    .required("User Name Required"),
  lang: Yup.string().required("Language is required"),
  description: Yup.string(),
  text: Yup.string().required("Text is required"),
  active: Yup.bool(),
});

const langOptions = [
  { value: "English", id: "1", label: "English" },
  { value: "French", id: "2", label: "French" },
];

const General = ({ data }) => {
  useEffect(() => {
    console.log(`data`, data);
  }, [data]);

  const onSetFormFile = (form, field, file) => {
    form.setFieldValue(field.name, URL.createObjectURL(file[0]));
  };

  const onFormSubmit = (values, setSubmitting) => {
    toast.push(<Notification title={"Profile updated"} type="success" />, {
      placement: "top-center",
    });
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        name: data.name || "",
        lang: data.lang.value || langOptions[0].value,
        description: data.description || "",
        text: data.text || "",
        active: data.active || false,
        avatar: data.avatar || "",
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        setTimeout(() => {
          onFormSubmit(values, setSubmitting);
        }, 1000);
      }}
    >
      {({
        values,
        touched,
        errors,
        isSubmitting,
        resetForm,
        setFieldValue,
      }) => {
        const validatorProps = { touched, errors };
        return (
          <Form>
            <FormContainer>
              <FormDesription
                title="General"
                desc="Basic info, like your name and address that will be displayed in public"
              />
              <FormRow
                name="active"
                label="Active"
                {...validatorProps}
                border={false}
              >
                <Field name="active" component={Switcher} />
              </FormRow>
              <FormRow name="name" label="Name" {...validatorProps}>
                <Field
                  type="text"
                  autoComplete="off"
                  name="name"
                  placeholder="Name"
                  component={Input}
                  prefix={<HiOutlineBriefcase className="text-xl" />}
                />
              </FormRow>
              <FormRow name="avatar" label="Avatar" {...validatorProps}>
                <Field name="avatar">
                  {({ field, form }) => {
                    const avatarProps = field.value ? { src: field.value } : {};
                    return (
                      <Upload
                        className="cursor-pointer"
                        onChange={files => onSetFormFile(form, field, files)}
                        onFileRemove={files =>
                          onSetFormFile(form, field, files)
                        }
                        showList={false}
                        uploadLimit={1}
                      >
                        <Avatar
                          className="border-2 border-white dark:border-gray-800 shadow-lg"
                          size={60}
                          shape="circle"
                          icon={<HiOutlineUser />}
                          {...avatarProps}
                        />
                      </Upload>
                    );
                  }}
                </Field>
              </FormRow>
              <FormDesription
                className="mt-8"
                title="Preferences"
                desc="Your personalized preference displayed in your account"
              />
              <FormRow name="lang" label="Language" {...validatorProps}>
                <Field name="lang">
                  {({ field, form }) => (
                    <Select
                      {...field}
                      options={langOptions}
                      value={langOptions.find(
                        option => option.value === field.value
                      )}
                      onChange={option =>
                        form.setFieldValue(field.name, option.value)
                      }
                    />
                  )}
                </Field>
              </FormRow>
              <FormRow
                name="description"
                label="Description"
                {...validatorProps}
              >
                <Field name="description">
                  {({ field }) => (
                    <textarea
                      {...field}
                      placeholder="Description"
                      className="w-full p-2 border rounded-md"
                      rows={4}
                    />
                  )}
                </Field>
              </FormRow>
              <FormRow name="text" label="Text" {...validatorProps}>
                <Field name="text">
                  {({ field }) => (
                    <textarea
                      {...field}
                      placeholder="Text"
                      className="w-full p-2 border rounded-md"
                      rows={4}
                    />
                  )}
                </Field>
              </FormRow>
              <div className="mt-4 ltr:text-right">
                <Button
                  className="ltr:mr-2 rtl:ml-2"
                  type="button"
                  onClick={resetForm}
                >
                  Reset
                </Button>
                <Button variant="solid" loading={isSubmitting} type="submit">
                  {isSubmitting ? "Saving" : "Save"}
                </Button>
              </div>
            </FormContainer>
          </Form>
        );
      }}
    </Formik>
  );
};

export default General;

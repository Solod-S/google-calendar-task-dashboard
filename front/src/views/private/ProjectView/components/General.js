import React, { useEffect, useState } from "react";
import {
  Input,
  Avatar,
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
import FirebaseMyProjectsService from "services/FirebaseMyProjectsService";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "store/projects/projectDataSlice";

const validationSchema = Yup.object().shape({
  name: Yup.string().min(3, "Too Short!").required("Name is Required"),
  category: Yup.string(),
  description: Yup.string(),
  active: Yup.bool(),
  img: Yup.string().url("Invalid URL"),
});

const General = ({ handleOk, handleCancel, currentProjectData }) => {
  const dispatch = useDispatch();

  const { pageIndex, pageSize, sort, query, total } = useSelector(
    state => state.projects.data.tableData
  );
  const filterData = useSelector(state => state.projects.data.filterData);

  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const result = await FirebaseMyProjectsService.fetchProjectsCategories();

      if (result.data.length > 0) setCategoriesList(result.data);
    };
    getCategories();
  }, []);

  const onFormSubmit = async (values, setSubmitting) => {
    try {
      if (!currentProjectData) {
        await FirebaseMyProjectsService.addProject(values);
      } else {
        await FirebaseMyProjectsService.edditProject({
          ...values,
          projectId: currentProjectData.projectId,
        });
      }

      dispatch(fetchProjects({ pageIndex, pageSize, sort, query, filterData }));
      toast.push(<Notification title={"Profile updated"} type="success" />, {
        placement: "top-center",
      });

      setSubmitting(false);
      handleOk();
    } catch (error) {
      console.log(`error`, error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        name: currentProjectData?.name || "",
        category: currentProjectData?.category || "",
        description: currentProjectData?.description || "",
        active: currentProjectData?.active || false,
        img: currentProjectData?.img || "",
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

        // Find selected category by ID
        const selectedCategory = categoriesList.find(
          category => category.id === values.category
        );

        const categoryOptions = [
          { value: "", label: "None" },
          ...categoriesList.map(({ id, label }) => ({
            value: id,
            label: label,
          })),
        ];

        return (
          <Form>
            <FormContainer>
              <FormDesription
                title="General"
                desc="Basic info, like project name, short description and categories"
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
              <FormRow name="img" label="Image URL" {...validatorProps}>
                <Field
                  type="text"
                  autoComplete="off"
                  name="img"
                  placeholder="Image URL"
                  component={Input}
                />
                {values.img && (
                  <Avatar
                    className="border-2 border-white dark:border-gray-800 shadow-lg mt-4"
                    size={60}
                    shape="circle"
                    src={values.img}
                    icon={<HiOutlineUser />}
                  />
                )}
              </FormRow>
              <FormDesription
                className="mt-8"
                title="Additional Information"
                desc="Additional information that helps to group your projects"
              />
              <FormRow name="category" label="Category" {...validatorProps}>
                <Field name="category">
                  {({ field, form }) => (
                    <Select
                      {...field}
                      options={categoryOptions}
                      value={
                        selectedCategory
                          ? {
                              value: selectedCategory.id,
                              label: selectedCategory.label,
                            }
                          : { value: "", label: "None" }
                      }
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

              <div className="mt-4 ltr:text-right">
                <Button
                  className="ltr:mr-2 rtl:ml-2"
                  color="red"
                  type="button"
                  onClick={() => handleCancel()}
                >
                  Cancel
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

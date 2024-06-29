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

const capitalizeFirstLetter = string => {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const General = ({ handleOk, generalData, setGeneralData, show }) => {
  const dispatch = useDispatch();

  const { pageIndex, pageSize, sort, query, total } = useSelector(
    state => state.projects.data.tableData
  );
  const filterData = useSelector(state => state.projects.data.filterData);

  const [categoriesList, setCategoriesList] = useState([]);
  const [tgGroupsList, setTgGroupsList] = useState([]);

  const fetchCategories = async () => {
    const result = await FirebaseMyProjectsService.fetchProjectsCategories();
    if (result.data.length > 0) setCategoriesList(result.data);
  };
  const fetchTgGroups = async () => {
    const result = await FirebaseMyProjectsService.fetchTelegramGroups();
    if (result.data.length > 0) setTgGroupsList(result.data);
  };

  useState(() => {
    fetchCategories();
    fetchTgGroups();
  }, []);

  const onFormSubmit = async (values, setSubmitting) => {
    try {
      if (!generalData) {
        await FirebaseMyProjectsService.addProject(values);
      } else {
        await FirebaseMyProjectsService.edditProject({
          ...values,
          projectId: generalData.projectId,
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

  const handleDeleteCategory = async categoryId => {
    try {
      await FirebaseMyProjectsService.deleteCategory(categoryId);
      setCategoriesList(prevList =>
        prevList.filter(cat => cat.id !== categoryId)
      );
      toast.push(<Notification title={"Category deleted"} type="success" />, {
        placement: "top-center",
      });
    } catch (error) {
      toast.push(
        <Notification title={"Failed to delete category"} type="error" />,
        {
          placement: "top-center",
        }
      );
    }
  };
  const handleDeleteTgGroup = async categoryId => {
    try {
      await FirebaseMyProjectsService.deleteTelegramGroup(categoryId);
      setTgGroupsList(prevList =>
        prevList.filter(tgGroup => tgGroup.id !== categoryId)
      );
      toast.push(
        <Notification title={"Telegram group deleted"} type="success" />,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      toast.push(
        <Notification title={"Failed to delete telegram group"} type="error" />,
        {
          placement: "top-center",
        }
      );
    }
  };

  const handleAddCategory = async (categoryName, setSubmitting) => {
    try {
      const newCategory = await FirebaseMyProjectsService.addCategory({
        value: capitalizeFirstLetter(categoryName),
        label: capitalizeFirstLetter(categoryName),
      });
      setCategoriesList(prevList => [...prevList, newCategory]);
      toast.push(<Notification title={"Category added"} type="success" />, {
        placement: "top-center",
      });
    } catch (error) {
      toast.push(
        <Notification title={"Failed to add category"} type="error" />,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSubmitting(false);
    }
  };
  const handleAddTgGroup = async (categoryName, setSubmitting) => {
    try {
      const newTgGroup = await FirebaseMyProjectsService.addTelegramGroup({
        value: capitalizeFirstLetter(categoryName),
        label: capitalizeFirstLetter(categoryName),
      });
      setTgGroupsList(prevList => [...prevList, newTgGroup]);

      toast.push(
        <Notification title={"Telegram group added"} type="success" />,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      toast.push(
        <Notification title={"Failed to add telegram group"} type="error" />,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFieldChange = (name, value) => {
    setGeneralData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Formik
      initialValues={{
        name: generalData?.name || "",
        category: generalData?.category || "",
        tgGroup: generalData?.tgGroup || "",
        description: generalData?.description || "",
        active: generalData?.active || false,
        img: generalData?.img || "",
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

        const selectedTgGroup = tgGroupsList.find(
          tgGroup => tgGroup.id === values.tgGroup
        );

        const tgGroupOptions = [
          { value: "", label: "None" },
          ...tgGroupsList.map(({ id, label }) => ({
            value: id,
            label: label,
          })),
        ];

        return (
          <div
            style={{
              visibility: show ? "visible" : "hidden",
              position: show ? "" : "absolute",
            }}
          >
            <Form>
              <FormContainer>
                <FormDesription
                  title="General"
                  desc="Basic info, like name, avatar and status."
                />
                <FormRow
                  name="active"
                  label="🔌 Active"
                  {...validatorProps}
                  border={false}
                >
                  <Field
                    name="active"
                    component={Switcher}
                    onClick={e =>
                      handleFieldChange("active", e.target.value !== "true")
                    }
                  />
                </FormRow>
                <FormRow name="name" label="🔤 Name" {...validatorProps}>
                  <Field
                    type="text"
                    autoComplete="off"
                    name="name"
                    placeholder="Name"
                    component={Input}
                    prefix={<HiOutlineBriefcase className="text-xl" />}
                    onChange={e => handleFieldChange("name", e.target.value)}
                  />
                </FormRow>
                <FormRow name="img" label="🖼️ Image URL" {...validatorProps}>
                  <Field
                    type="text"
                    autoComplete="off"
                    name="img"
                    placeholder="Image URL"
                    component={Input}
                    onChange={e => handleFieldChange("img", e.target.value)}
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
                  desc="Additional information that helps to group and describe your projects"
                />
                <FormRow
                  name="category"
                  label={
                    <span style={{ color: "#181B23" }}>🗂️ Select Category</span>
                  }
                  {...validatorProps}
                >
                  <Field name="category">
                    {({ field, form }) => (
                      <div className="flex items-center gap-2">
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
                            handleFieldChange("category", option.value)
                          }
                        />
                        {selectedCategory && (
                          <Button
                            color="red"
                            type="button"
                            onClick={() =>
                              handleDeleteCategory(selectedCategory.id)
                            }
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    )}
                  </Field>
                </FormRow>
                <FormRow
                  name="newCategory"
                  label={
                    <span style={{ color: "#181B23" }}>🗂️ Add New Categor</span>
                  }
                  {...validatorProps}
                >
                  <Field name="newCategory">
                    {({ field, form }) => (
                      <div className="flex items-center gap-2">
                        <Input {...field} placeholder="New Category Name" />
                        <Button
                          type="button"
                          onClick={() => {
                            const categoryName = field.value;
                            if (categoryName) {
                              handleAddCategory(
                                categoryName,
                                form.setSubmitting
                              );
                              form.setFieldValue(field.name, "");
                            }
                          }}
                          disabled={isSubmitting}
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </Field>
                </FormRow>
                {/* ! */}
                <FormRow
                  name="tgGroup"
                  label={
                    <span style={{ color: "black" }}>📲 Select Group</span>
                  }
                  {...validatorProps}
                >
                  <Field name="tgGroup">
                    {({ field, form }) => (
                      <div className="flex items-center gap-2">
                        <Select
                          {...field}
                          options={tgGroupOptions}
                          value={
                            selectedTgGroup
                              ? {
                                  value: selectedTgGroup.id,
                                  label: selectedTgGroup.label,
                                }
                              : { value: "", label: "None" }
                          }
                          onChange={option =>
                            handleFieldChange("tgGroup", option.value)
                          }
                        />
                        {selectedTgGroup && (
                          <Button
                            color="red"
                            type="button"
                            onClick={() =>
                              handleDeleteTgGroup(selectedTgGroup.id)
                            }
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    )}
                  </Field>
                </FormRow>
                <FormRow
                  name="newTgGroup"
                  label={
                    <span style={{ color: "black" }}>
                      📲 Add New Telegram Group
                    </span>
                  }
                  {...validatorProps}
                >
                  <Field name="newTgGroup">
                    {({ field, form }) => (
                      <div className="flex items-center gap-2">
                        <Input
                          {...field}
                          placeholder="New Telegram Group Name"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            const tgGroupName = field.value;
                            if (tgGroupName) {
                              handleAddTgGroup(tgGroupName, form.setSubmitting);
                              form.setFieldValue(field.name, "");
                            }
                          }}
                          disabled={isSubmitting}
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </Field>
                </FormRow>
                <FormRow
                  name="description"
                  label="📜 Description"
                  {...validatorProps}
                >
                  <Field name="description">
                    {({ field }) => (
                      <textarea
                        {...field}
                        placeholder="Description"
                        className="w-full p-2 border rounded-md"
                        rows={4}
                        onChange={e =>
                          handleFieldChange("description", e.target.value)
                        }
                      />
                    )}
                  </Field>
                </FormRow>

                {/* <div className="mt-4 ltr:text-right">
                  <Button
                    className="ltr:mr-2 rtl:ml-2"
                    color="red"
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button variant="solid" loading={isSubmitting} type="submit">
                    {isSubmitting ? "Saving" : "Save"}
                  </Button>
                </div> */}
              </FormContainer>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};

export default General;

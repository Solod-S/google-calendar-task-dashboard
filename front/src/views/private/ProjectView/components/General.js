import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Modal } from "antd";
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

import {
  HiOutlineBriefcase,
  HiOutlineUser,
  HiPaperAirplane,
} from "react-icons/hi";
import * as Yup from "yup";
import isEmpty from "lodash/isEmpty"; // Добавьте этот импорт
import FirebaseMyProjectsService from "services/FirebaseMyProjectsService";

const validationSchema = Yup.object().shape({
  name: Yup.string().min(3, "Too Short!").required("Name is Required"),
  category: Yup.string(),
  description: Yup.string(),
  active: Yup.bool(),
  img: Yup.string().url("Invalid URL"),
  // newTgGroupName: Yup.string().required("Name is Required"),
  // newTgGroupId: Yup.string().required("ID is Required"),
});

const capitalizeFirstLetter = string => {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const General = forwardRef(
  ({ handleOk, generalData, setGeneralData, show }, ref) => {
    const [categoriesList, setCategoriesList] = useState([]);
    const [tgGroupsList, setTgGroupsList] = useState([]);
    const [isWarningVisible, setisWarningVisible] = useState(false);
    const [deleteOptions, setDeleteOptions] = useState(null);

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

    const handleDeleteCategory = async categoryId => {
      try {
        await FirebaseMyProjectsService.deleteCategory(categoryId);
        setCategoriesList(prevList =>
          prevList.filter(cat => cat.id !== categoryId)
        );
        handleFieldChange("category", "");
        toast.push(<Notification title={"Category deleted"} type="success" />, {
          placement: "top-center",
        });
      } catch (error) {
        toast.push(
          <Notification title={"Failed to delete category"} type="danger" />,
          {
            placement: "top-center",
          }
        );
      } finally {
        setDeleteOptions(null);
      }
    };

    const handleDeleteTgGroup = async categoryId => {
      try {
        await FirebaseMyProjectsService.deleteTelegramGroup(categoryId);
        setTgGroupsList(prevList =>
          prevList.filter(tgGroup => tgGroup.id !== categoryId)
        );
        handleFieldChange("tgGroup", "");
        toast.push(
          <Notification title={"Telegram group deleted"} type="success" />,
          {
            placement: "top-center",
          }
        );
      } catch (error) {
        toast.push(
          <Notification
            title={"Failed to delete telegram group"}
            type="danger"
          />,
          {
            placement: "top-center",
          }
        );
      } finally {
        setDeleteOptions(null);
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
          <Notification title={"Failed to add category"} type="danger" />,
          {
            placement: "top-center",
          }
        );
      } finally {
        setSubmitting(false);
      }
    };

    const handleAddTgGroup = async (tgGroupName, tgGroupId, setSubmitting) => {
      try {
        const newTgGroup = await FirebaseMyProjectsService.addTelegramGroup({
          value: capitalizeFirstLetter(tgGroupName),
          label: capitalizeFirstLetter(tgGroupName),
          chatId: tgGroupId,
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
          <Notification title={"Failed to add telegram group"} type="danger" />,
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

    const closeAndReset = async () => {
      setDeleteOptions(null);
      setisWarningVisible(false);
    };

    const formikRef = useRef();

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        formikRef.current.submitForm();
      },
      validateForm: async () => {
        const errors = await formikRef.current.validateForm();
        formikRef.current.setTouched({
          name: true,
          category: true,
          description: true,
          active: true,
          img: true,
          newTgGroupName: true,
          newTgGroupId: true,
        });
        return isEmpty(errors);
      },
    }));

    return (
      <Formik
        innerRef={formikRef}
        initialValues={{
          name: generalData?.name || "",
          category: generalData?.category || "",
          tgGroup: generalData?.tgGroup || "",
          description: generalData?.description || "",
          active: generalData?.active || false,
          img: generalData?.img || "",
          newTgGroupName: "",
          newTgGroupId: "",
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
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
                  <FormRow
                    name="name"
                    label="🔤 Name"
                    {...validatorProps}
                    required={true}
                  >
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
                      <span style={{ color: "#181B23" }}>
                        🗂️ Select Category
                      </span>
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
                              onClick={() => {
                                setisWarningVisible(true);
                                setDeleteOptions({
                                  id: selectedCategory.id,
                                  type: "group",
                                });
                              }}
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
                      <span style={{ color: "#181B23" }}>
                        🗂️ Add New Category
                      </span>
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
                  <FormRow
                    name="tgGroup"
                    label={
                      <span style={{ color: "black" }}>
                        📲 Select Telegram Group
                      </span>
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
                          {selectedTgGroup?.chatId && (
                            <Field
                              type="text"
                              autoComplete="off"
                              value={selectedTgGroup?.chatId}
                              disabled={true}
                              component={Input}
                              className="inline-flex w-auto"
                              prefix={
                                <HiPaperAirplane className="text-xl rotate-90" />
                              }
                            />
                          )}

                          {selectedTgGroup && (
                            <Button
                              color="red"
                              type="button"
                              // onClick={() =>
                              //   handleDeleteTgGroup(selectedTgGroup.id)
                              // }
                              onClick={() => {
                                setisWarningVisible(true);
                                setDeleteOptions({
                                  id: selectedTgGroup.id,
                                  type: "telegram",
                                });
                              }}
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
                    <div style={{ display: "flex" }}>
                      <Field name="newTgGroupName">
                        {({ field, form }) => (
                          <div className="flex items-center gap-2 mr-2">
                            <Input
                              {...field}
                              placeholder="Telegram Group Name"
                            />
                          </div>
                        )}
                      </Field>
                      <Field name="newTgGroupId">
                        {({ field, form }) => (
                          <div className="flex items-center gap-2 ">
                            <Input
                              {...field}
                              placeholder="Telegram Group ID"
                              type="number"
                            />
                            <Button
                              type="button"
                              onClick={() => {
                                const tgGroupName = form.values.newTgGroupName;
                                const tgGroupId = form.values.newTgGroupId;
                                if (tgGroupName && tgGroupId) {
                                  handleAddTgGroup(
                                    tgGroupName,
                                    tgGroupId,
                                    form.setSubmitting
                                  );
                                  form.setFieldValue("newTgGroupName", "");
                                  form.setFieldValue("newTgGroupId", "");
                                } else {
                                  toast.push(
                                    <Notification
                                      title={"Two fields are required"}
                                      type="warning"
                                    />,
                                    {
                                      placement: "top-center",
                                    }
                                  );
                                }
                              }}
                              disabled={isSubmitting}
                            >
                              Add
                            </Button>
                          </div>
                        )}
                      </Field>
                    </div>
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
                </FormContainer>
              </Form>

              <Modal
                title="Warning..."
                okButtonProps={{
                  style: { backgroundColor: "#4F46E5" },
                }}
                open={isWarningVisible}
                onOk={() => {
                  switch (true) {
                    case deleteOptions?.type === "group":
                      handleDeleteCategory(deleteOptions.id);
                      closeAndReset();
                      break;

                    case deleteOptions?.type === "telegram":
                      handleDeleteTgGroup(deleteOptions.id);
                      closeAndReset();
                      break;

                    default:
                      closeAndReset();
                      break;
                  }
                }}
                onCancel={() => closeAndReset()}
              >
                <p>Are you sure you want to delete this?</p>
              </Modal>
            </div>
          );
        }}
      </Formik>
    );
  }
);

export default General;

import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Select,
  DatePicker,
  FormContainer,
  FormItem,
  Badge,
  hooks,
} from "components/ui";
import { eventColors } from "components/shared/CalendarView";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "../store/stateSlice";
import { Field, Form, Formik } from "formik";
import { HiCheck } from "react-icons/hi";
import { components } from "react-select";
import * as Yup from "yup";
import Modal from "antd/es/modal/Modal";

const { Control } = components;
const { useUniqueId } = hooks;

const colorKeys = Object.keys(eventColors);
const colorOptions = colorKeys.map(color => {
  return { value: color, label: color, color: eventColors[color].dot };
});

const CustomSelectOption = ({ innerProps, label, data, isSelected }) => {
  return (
    <div
      className={`flex items-center justify-between p-2 ${
        isSelected
          ? "bg-gray-100 dark:bg-gray-500"
          : "hover:bg-gray-50 dark:hover:bg-gray-600"
      }`}
      {...innerProps}
    >
      <div className="flex items-center">
        <Badge className={data.color} />
        <span className="ml-2 rtl:mr-2 capitalize">{label}</span>
      </div>
      {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
    </div>
  );
};

const CustomControl = ({ children, ...props }) => {
  const selected = props.getValue()[0];
  return (
    <Control className="capitalize" {...props}>
      {selected && <Badge className={`${selected.color} ltr:ml-4 rtl:mr-4`} />}
      {children}
    </Control>
  );
};

const stripHtmlTags = str => {
  if (!str) return "";
  return str
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ");
};

const validationSchema = Yup.object().shape({
  // Add your validation schema here as needed
});

const SelectWordModal = ({ title, onSelect, onClose, open, selectedWords }) => {
  const words = title.split(" ").filter(word => word.length > 2);

  return (
    <Modal title="Select Word" open={open} onCancel={onClose} footer={null}>
      <div className="flex flex-wrap">
        {words.map((word, index) => (
          <Button
            key={index}
            className={`m-1 ${
              selectedWords.includes(word) ? "border border-green-500" : ""
            }`}
            onClick={() => onSelect(word)}
          >
            {word}
          </Button>
        ))}
      </div>
    </Modal>
  );
};

const EventDialog = ({ submit, generalData, setGeneralData }) => {
  const dispatch = useDispatch();
  const open = useSelector(state => state.crmCalendar.state.dialogOpen);
  const selected = useSelector(state => state.crmCalendar.state.selected);
  const newId = useUniqueId("event-");
  const [selectWordModalOpen, setSelectWordModalOpen] = useState(false);

  const handleDialogClose = () => {
    dispatch(closeDialog());
  };

  const handleSubmit = (values, setSubmitting) => {
    setSubmitting(false);
    const eventData = {
      id: selected.id || newId,
      title: values.title,
      start: values.startDate,
      eventColor: values.color,
    };
    if (values.endDate) {
      eventData.end = values.endDate;
    }
    if (values.description) {
      eventData.description = values.description;
    }
    submit?.(eventData, selected.type);
    // dispatch(closeDialog());
  };

  const handleWordSelect = word => {
    setGeneralData(prevState => {
      const updatedIntegrations = prevState.integrations.map(integration => {
        if (integration.key === "google_calendar") {
          const isWordInSelectors = integration.tgSelectors.includes(word);
          return {
            ...integration,
            tgSelectors: isWordInSelectors
              ? integration.tgSelectors.filter(w => w !== word)
              : [...integration.tgSelectors, word],
          };
        }
        return integration;
      });
      return {
        ...prevState,
        integrations: updatedIntegrations,
      };
    });
  };

  if (selected.type === "NEW") {
    return null;
  }

  const googleCalendarIntegration = generalData.integrations.find(
    integration => integration.key === "google_calendar"
  );
  const selectedWords = googleCalendarIntegration
    ? googleCalendarIntegration.tgSelectors
    : [];

  return (
    <>
      <Modal
        footer={null}
        open={open}
        onOk={handleDialogClose}
        onCancel={handleDialogClose}
      >
        <h5 className="mb-4">Event settings</h5>
        <div>
          <Formik
            enableReinitialize
            initialValues={{
              title: selected.title || "",
              startDate: selected.start || "",
              endDate: selected.end || "",
              color: selected.eventColor || colorOptions[0].value,
              description: stripHtmlTags(selected.description) || "",
              time: selected.time || "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit(values, setSubmitting);
            }}
          >
            {({ values, touched, errors, resetForm }) => (
              <Form>
                <FormContainer>
                  <FormItem
                    label="🏷️ Title"
                    invalid={errors.title && touched.title}
                    errorMessage={errors.title}
                  >
                    <div className="flex items-center">
                      <Field
                        disabled={true}
                        type="text"
                        autoComplete="off"
                        name="title"
                        placeholder="Please enter title"
                        component={Input}
                      />
                      <Button
                        className="ml-2"
                        onClick={() => setSelectWordModalOpen(true)}
                      >
                        Choose selector
                      </Button>
                    </div>
                  </FormItem>
                  {/* Display selected words */}
                  {selectedWords.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        🎯 Selector(s):
                      </label>
                      <div className="flex flex-wrap mt-2">
                        {selectedWords
                          .filter(word => selected.title.includes(word))
                          .map((word, index) => (
                            <Badge
                              key={index}
                              className="mr-2 mb-2 bg-blue-100 text-blue-800"
                            >
                              {word}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                  <FormItem
                    label="🏁 Start Date"
                    invalid={errors.startDate && touched.startDate}
                    errorMessage={errors.startDate}
                  >
                    <Field disabled={true} name="startDate" placeholder="Date">
                      {({ field, form }) => (
                        <DatePicker
                          disabled={true}
                          open={false}
                          allowClear={false}
                          field={field}
                          form={form}
                          value={field.value}
                          onChange={date => {
                            form.setFieldValue(field.name, date);
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label="⏰ Time"
                    invalid={errors.time && touched.time}
                    errorMessage={errors.time}
                  >
                    <Field
                      disabled={true}
                      type="text"
                      autoComplete="off"
                      name="time"
                      placeholder="Please enter time"
                      component={Input}
                    />
                  </FormItem>
                  {selected.end && (
                    <FormItem
                      label="🔚 End Date"
                      invalid={errors.endDate && touched.endDate}
                      errorMessage={errors.endDate}
                    >
                      <Field disabled={true} name="endDate" placeholder="Date">
                        {({ field, form }) => (
                          <DatePicker
                            disabled={true}
                            open={false}
                            field={field}
                            form={form}
                            value={field.value}
                            onChange={date => {
                              form.setFieldValue(field.name, date);
                            }}
                          />
                        )}
                      </Field>
                    </FormItem>
                  )}
                  {selected.description && (
                    <FormItem
                      label="📝 Description"
                      invalid={errors.description && touched.description}
                      errorMessage={errors.description}
                    >
                      <Field
                        as="textarea"
                        disabled={true}
                        name="description"
                        placeholder="Please enter description"
                        className="form-textarea"
                        style={{
                          resize: "none",
                          width: "100%",
                          padding: "8px 11px",
                          backgroundColor: "#F3F4F6",
                          border: "1px solid #d1d5db",
                          borderRadius: "5px",
                          height: "150px",
                        }}
                      />
                    </FormItem>
                  )}
                  <FormItem
                    label="🌈 Color"
                    invalid={errors.color && touched.color}
                    errorMessage={errors.color}
                  >
                    <Field disabled={true} name="color">
                      {({ field, form }) => (
                        <Select
                          isDisabled={true}
                          field={field}
                          form={form}
                          options={colorOptions}
                          value={colorOptions.filter(
                            option => option.value === values.color
                          )}
                          onChange={option =>
                            form.setFieldValue(field.name, option.value)
                          }
                          components={{
                            Option: CustomSelectOption,
                            Control: CustomControl,
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem className="mb-0 text-right rtl:text-left">
                    {/* Additional buttons or actions can be placed here if needed */}
                  </FormItem>
                </FormContainer>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>

      <SelectWordModal
        open={selectWordModalOpen}
        title={selected.title || ""}
        onSelect={handleWordSelect}
        onClose={() => setSelectWordModalOpen(false)}
        selectedWords={selectedWords}
      />
    </>
  );
};

export default EventDialog;

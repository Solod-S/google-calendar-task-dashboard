import React from "react";
import { Input, FormItem, Switcher, toast, Notification } from "components/ui";
import { debounce } from "lodash";
import { HiOutlineTrash, HiUserCircle } from "react-icons/hi";
import { MdOutlineNoPhotography } from "react-icons/md";
import { Field } from "formik";
import { Avatar, Button, Input as AntInput } from "antd";

async function transformGoogleDriveLink(url) {
  const driveLinkPattern =
    /https:\/\/(drive\.google\.com|lh3\.googleusercontent\.com)\/(?:.*\/d\/|.*\/file\/d\/|d\/)?([a-zA-Z0-9_-]+)(?:[?&]|\/view)/;

  const match = url.match(driveLinkPattern);

  if (match && match[2]) {
    const fileId = match[2];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  } else {
    return url;
  }
}

const InfoForm = ({ values, touched, errors, handleBlur, setFormikValues }) => {
  const handleAddImage = () => {
    if (
      values.img.length < 5 &&
      !values.img.some(value => value.trim() === "")
    ) {
      setFormikValues(prevValues => ({
        ...prevValues,
        img: [...prevValues.img, ""],
      }));
    }
  };

  const handleRemoveImage = index => {
    setFormikValues(prevValues => ({
      ...prevValues,
      img: prevValues.img.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = async (index, event) => {
    const url = event.target.value.trim();
    if (url === "") {
      setFormikValues(prevValues => ({
        ...prevValues,
        img: prevValues.img.filter((_, i) => i !== index),
      }));
    } else {
      const link = await transformGoogleDriveLink(url);

      // Check for duplicate URLs
      const isDuplicate = values.img.some(
        (imgUrl, imgIndex) => imgIndex !== index && imgUrl === link
      );
      if (isDuplicate) {
        toast.push(
          <Notification
            title={"This image URL is already in the list."}
            type="danger"
          />,
          {
            placement: "top-center",
          }
        );

        return;
      }

      setFormikValues(prevValues => {
        const newImg = [...prevValues.img];
        newImg[index] = link;
        return {
          ...prevValues,
          img: newImg,
        };
      });
    }
  };

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
        label="Message Images 🖼️"
        invalid={errors.img && touched.img}
        errorMessage={errors.img}
      >
        {values.img &&
          values.img.map((image, index) => (
            <div key={index} className="mb-4 flex items-center">
              <span className="mr-2 text-gray-600">№{index + 1}</span>
              <Field
                type="text"
                autoComplete="off"
                name={`img[${index}]`}
                placeholder={`Image URL ${index + 1}`}
                component={AntInput}
                value={image}
                onChange={e => handleImageChange(index, e)}
              />

              <Button
                type="link"
                danger
                onClick={() => handleRemoveImage(index)}
                className="ml-2"
              >
                <HiOutlineTrash />
              </Button>
            </div>
          ))}
        {values.img.length < 5 && (
          <Button type="dashed" onClick={handleAddImage}>
            Add Image
          </Button>
        )}
      </FormItem>

      {values.img && values.img.length > 0 && (
        <div className="mt-4 flex flex-wrap">
          {values.img.map((image, index) => (
            <div key={index} className="mr-4 mb-4">
              <a href={image} target="_blank" rel="noopener noreferrer">
                <Avatar
                  className="border-2 border-white dark:border-gray-800 shadow-lg"
                  size={60}
                  shape="circle"
                  src={image}
                  icon={<MdOutlineNoPhotography />}
                />
              </a>
              <div className="text-center mt-2 text-gray-600">№{index + 1}</div>
            </div>
          ))}
        </div>
      )}
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
          }}
          onBlur={handleBlur}
        />
      </FormItem>
    </>
  );
};

export default InfoForm;

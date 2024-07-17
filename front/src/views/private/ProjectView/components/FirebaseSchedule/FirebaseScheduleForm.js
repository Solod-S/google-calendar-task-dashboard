import { DatePicker, Form, InputNumber, Radio, Select, TimePicker } from "antd";
import { format } from "date-fns";
import dayjs from "dayjs";
import React, { useState } from "react";

const { Option } = Select;

const FirebaseSchedule = ({ show, generalData, setGeneralData }) => {
  const [subjectTotalArticlesLength, setSubjectTotalArticlesLength] =
    useState(0);

  const [generationIntervalType, setGenerationIntervalType] =
    useState("oncePerDays");
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [repeatEndType, setRepeatEndType] = useState("never");
  const [repeatEndAttempts, setRepeatEndAttempts] = useState(1);
  const [endDate, setEndDate] = useState(
    dayjs().add(1, "day").format("YYYY-MM-DD")
  );
  const [monthlyIntervalLastDay, setMonthlyIntervalLastDay] =
    useState("disable");

  const getDayOfMonth = dateString => {
    return dayjs(dateString, "YYYY-MM-DD").date();
  };

  const getDayOfWeekNumber = dateString => {
    const dayjsDate = dayjs(dateString, "YYYY-MM-DD");
    return dayjsDate.day();
  };

  const disabledStartDate = current => {
    return current && current < dayjs().startOf("day");
  };

  const isLastDayOfMonth =
    dayjs(startDate).date() === dayjs(startDate).endOf("month").date();

  const disabledEndDate = current => {
    const currentDate = dayjs();
    return (
      current &&
      (current < currentDate || current < dayjs(startDate).startOf("day"))
    );
  };

  return (
    <div
      style={{
        visibility: show ? "visible" : "hidden",
        position: show ? "" : "absolute",
      }}
    >
      <h1>Firebase Schedule</h1>
      <>
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
          }}
        >
          <div style={{ marginRight: "25px" }}>
            <p style={{ color: "#455560", fontSize: "14px" }}>
              Select start date:
            </p>
            <DatePicker
              cellRender={current => {
                const style = {
                  // borderBottom: "2px solid #3e79f7",
                  // padding: "5px",
                  backgroundColor: "#3e79f7",
                  color: "white",
                  borderRadius: "7px",
                  width: "26px",
                };
                if (current.isSame(startDate)) {
                  style.color = "yellow";
                }

                switch (true) {
                  case monthlyIntervalLastDay === "lastDay":
                    const lastDayOfMonth = dayjs(current).endOf("month").date();

                    if (
                      !dayjs(current).isBefore(dayjs(startDate)) &&
                      current.date() === lastDayOfMonth
                    ) {
                      return <div style={style}>{current.date()}</div>;
                    } else {
                      return current.date();
                    }

                  case monthlyIntervalLastDay === "lastSunday":
                    const lastDayOfTheMonth = dayjs(current).endOf("month");
                    const lastSundayOfMonth = lastDayOfTheMonth.day(0);
                    if (
                      !dayjs(current).isBefore(dayjs(startDate)) &&
                      current.isSame(lastSundayOfMonth, "day")
                    ) {
                      return <div style={style}>{current.date()}</div>;
                    } else {
                      return current.date();
                    }

                  case generationIntervalType === "monthly":
                    if (
                      !dayjs(current).isBefore(dayjs(startDate)) &&
                      current.date() === getDayOfMonth(startDate)
                    ) {
                      return <div style={style}>{current.date()}</div>;
                    } else {
                      return current.date();
                    }

                  case generationIntervalType === "weekly":
                    if (
                      !dayjs(current).isBefore(dayjs(startDate)) &&
                      current.day() === getDayOfWeekNumber(startDate)
                    ) {
                      return <div style={style}>{current.date()}</div>;
                    } else {
                      return current.date();
                    }

                  default:
                    if (dayjs(current).isSame(dayjs(startDate), "day")) {
                      return <div style={style}>{current.date()}</div>;
                    } else {
                      return current.date();
                    }
                }
              }}
              allowClear={false}
              showTime={false}
              disabledDate={disabledStartDate}
              value={dayjs(startDate, "YYYY-MM-DD")}
              onChange={(_, dateString) => {
                const newEndDate = dayjs(dateString)
                  .add(1, "day")
                  .format("YYYY-MM-DD");

                const isCurrentDayLastDayOfMonth =
                  dayjs(dateString).date() ===
                  dayjs(dateString).endOf("month").date();
                if (
                  !isCurrentDayLastDayOfMonth &&
                  generationIntervalType === "monthly"
                ) {
                  setMonthlyIntervalLastDay("disable");
                }
                if (
                  dayjs(endDate).isBefore(dateString)
                  // ||
                  // dayjs(endDate).isSame(startDate, "day")
                ) {
                  setEndDate(newEndDate);
                }
                setStartDate(dateString);
              }}
              format="YYYY-MM-DD"
            />
          </div>

          {generationIntervalType === "monthly" &&
            dayjs(startDate).date() ===
              dayjs(startDate).endOf("month").date() && (
              <div>
                <p style={{ color: "#455560", fontSize: "14px" }}>Repeat:</p>
                <Radio.Group
                  style={{
                    paddingLeft: "10px",
                    borderRadius: "10px",
                    height: "40px",
                    alignItems: "center",
                    display: "flex",
                    border: "1px solid #e6ebf1",
                  }}
                  defaultValue="disable"
                  value={monthlyIntervalLastDay}
                  onChange={e => setMonthlyIntervalLastDay(e.target.value)}
                >
                  <Radio value="disable" disabled={!isLastDayOfMonth}>
                    {dayjs(startDate).date()}st
                  </Radio>
                  <Radio value="lastSunday" disabled={!isLastDayOfMonth}>
                    last Sunday
                  </Radio>
                  <Radio value="lastDay" disabled={!isLastDayOfMonth}>
                    last day
                  </Radio>
                </Radio.Group>
              </div>
            )}
        </div>
        <div>
          <p style={{ color: "#455560", fontSize: "14px" }}>
            Select publication time:
          </p>
          <TimePicker
            allowClear={false}
            defaultValue={dayjs(selectedTime, "HH:mm")}
            format="HH:mm"
            onChange={(value, dateString) => {
              setSelectedTime(dateString);
            }}
            minuteStep={60}
            style={{ marginBottom: "24px" }}
          />
        </div>

        <Form.Item
          name="generationIntervalType"
          label="Select repeat interval:"
          initialValue="oncePerDays"
        >
          <Select
            onChange={value => {
              if (value !== "monthly") {
                setMonthlyIntervalLastDay("disable");
              }
              setGenerationIntervalType(value);
            }}
          >
            <Option value="oncePerDays">Every day</Option>
            <Option value="weekly">Every week</Option>
            <Option value="monthly">Every month</Option>
          </Select>
        </Form.Item>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <p
              style={{
                color: "#455560",
                fontSize: "14px",
              }}
            >
              Select end of reps:
            </p>
            <div
            // style={{ display: "flex", alignItems: "center" }}
            >
              <Select
                initialvalue="never"
                value={repeatEndType}
                onChange={value => {
                  setRepeatEndType(value);
                  const newEndDate = dayjs(startDate)
                    .add(1, "day")
                    .format("YYYY-MM-DD");
                  if (
                    dayjs(endDate).isBefore(startDate)
                    // ||
                    // dayjs(endDate).isSame(startDate, "day")
                  ) {
                    setEndDate(newEndDate);
                  }

                  if (
                    value === "attempts" &&
                    repeatEndAttempts <= subjectTotalArticlesLength
                  ) {
                    setRepeatEndAttempts(subjectTotalArticlesLength + 1);
                  }
                }}
                style={{ minWidth: "100px" }}
              >
                <Option value="never">Never</Option>
                <Option value="date">After date</Option>
                <Option value="attempts">After a set count</Option>
              </Select>
            </div>
          </div>
          {repeatEndType === "date" && (
            <div style={{ marginLeft: "15px" }}>
              <p
                style={{
                  color: "#455560",
                  fontSize: "14px",
                }}
              >
                Select date:
              </p>
              <DatePicker
                dateRender={current => {
                  const style = {
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "7px",
                    width: "35px",
                  };
                  if (dayjs(current).isSame(dayjs(endDate), "day")) {
                    return <div style={style}>{current.date()}</div>;
                  } else {
                    return current.date();
                  }
                }}
                allowClear={false}
                // value={endDate}
                value={dayjs(endDate, "YYYY-MM-DD")}
                onChange={(_, dateString) => setEndDate(dateString)}
                disabledDate={disabledEndDate}
                format="YYYY-MM-DD"
                // style={{ marginLeft: "10px" }}
              />
            </div>
          )}
          {repeatEndType === "attempts" && (
            <>
              <div style={{ marginLeft: "15px" }}>
                <p
                  style={{
                    color: "#455560",
                    fontSize: "14px",
                  }}
                >
                  Article Limit:
                </p>

                <InputNumber
                  // value={111}
                  value={repeatEndAttempts}
                  onChange={setRepeatEndAttempts}
                  min={subjectTotalArticlesLength + 1}
                  // max={999}
                />
              </div>
              <div style={{ marginLeft: "15px" }}>
                <p
                  style={{
                    color: "#455560",
                    fontSize: "14px",
                  }}
                >
                  Current articles length:
                </p>
                <InputNumber
                  value={subjectTotalArticlesLength}
                  onChange={setRepeatEndAttempts}
                  disabled
                />
              </div>
            </>
          )}
        </div>
      </>
    </div>
  );
};

export default FirebaseSchedule;
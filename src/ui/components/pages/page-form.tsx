import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

export function PageForm() {
  const [birthDate, setBirthDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  return (
    <div className={"page"}>
      <div className={"page-title"}>Form</div>
      <div className={"page-body flex-col flex max-w-3xl"}>
        <div className={"flex flex-row justify-start items-center flex-wrap"}>
          <div className={"flex flex-col flex-1 mr-2"}>
            <div className={"form-label"}>Firstname</div>
            <input type={"text"} className={"flex form-input min-w-[150px]"} />
          </div>
          <div className={"flex flex-col flex-1"}>
            <div className={"form-label"}>Lastname</div>
            <input type={"text"} className={"flex form-input min-w-[150px]"} />
          </div>
        </div>

        <div className={"form-label mt-4"}>Password</div>
        <input type={"text"} className={"flex form-input"} />

        <div className={"form-label mt-4"}>Birth date</div>
        <DatePicker
          selected={birthDate}
          onChange={(date) => !!date && setBirthDate(date)}
          customInput={
            <div className={"form-value"}>{birthDate.toLocaleDateString()}</div>
          }
        />

        <div className={"form-label mt-4"}>Time picker</div>
        <DatePicker
          showTimeSelect
          showTimeSelectOnly
          selected={time}
          onChange={(time) => !!time && setTime(time)}
          customInput={
            <div className={"form-value"}>{time.toLocaleTimeString()}</div>
          }
        />

        <div className={"form-label mt-4"}>Select picker</div>
        <Select options={options} />
      </div>
    </div>
  );
}

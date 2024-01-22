import React from "react";
import {DatePicker as AntDatePicker} from "antd";
import {useTranslation} from "react-i18next";
import DateFormat from "../../component/DateFormat";

const DatePicker = () => {
  const {t} = useTranslation();
  return (
    <div>
        <h1>{t('Date Picker Example')}</h1>
        <AntDatePicker format={'DD/MMM/BB'}/>
        <DateFormat/>
    </div>
  );
};
export default DatePicker;

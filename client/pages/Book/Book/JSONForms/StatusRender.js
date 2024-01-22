import * as React from "react";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { rankWith, scopeEndsWith } from "@jsonforms/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useTranslation } from "react-i18next";
import InputLabel from "@material-ui/core/InputLabel";
import StatusManager from "@manager/StatusManager.js";

export const statusTester = rankWith(
  3, //increase rank as needed
  scopeEndsWith("status")
);

// const statusList = ['PENDING', 'APPROVED', 'REJECTED', 'RECHECK', 'ERROR']

const StatusSelector = ({ data, handleChange, path }) => {
  const { t } = useTranslation();
  return (
    <div>
      <InputLabel shrink id="status" style={{ width: "100%" }}>
        {t("status")}
      </InputLabel>
      <Select
        style={{ width: "100%" }}
        labelId="status"
        id="status"
        value={data}
        onChange={(e) => handleChange(path, e.target.value)}
      >
        {StatusManager.basicStatus.map((e) => (
          <MenuItem key={e} value={e}>
            {t(e)}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export const StatusForm = withJsonFormsControlProps(StatusSelector);

import React from 'react';
import ThaiAdminDivisions from "../../component/ThaiAdminDivisions/ThaiAdminDivisions";
import {Form, Row, Button} from "antd";
import {useTranslation} from "react-i18next";

const CascadingSelect = () => {
  const {t} = useTranslation();
  const [form] = Form.useForm();

  const submit = () => {
    alert('submitted');
  };

  return (
    <div>
      <p>ThaiAdminDivisions</p>
      <Form form={form}
            onFinish={submit}>
        <ThaiAdminDivisions form={form}
                            labels={{province: t('My Province')}}
                            rules={{postcode:[]}}
                            placeholders={{district: t('Please choose a district')}}
        />
        <Row type="flex" justify="end">
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t("Submit")}
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  );
};

export default CascadingSelect;

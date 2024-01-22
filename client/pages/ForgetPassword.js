import React from 'react';
import {Form, Input, Button, Row, Modal, Spin, Card, Typography, Col} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {useHistory} from "react-router-dom";
import {observer} from 'mobx-react'
import {useStore} from "../store/mobx";
import {useTranslation} from "react-i18next";

const {Title} = Typography;

const ForgetPassword = observer(() => {
    const history = useHistory();
    const {authStore} = useStore();
    const {t} = useTranslation();
    const [form] = Form.useForm();

    const onFinish = async values => {
        alert("comming soon")
    };

    return (
        <Row justify="center" align="middle" style={{height: "100vh"}}>
            <Col span={24}>
                <Row gutter={[0, 0]} justify="center">
                    <Col span={6}>
                        <div className={'logo-large'}></div>
                    </Col>
                </Row>
                <Row gutter={[0, 0]} justify="center">
                    <Col span={6}>
                        <Card className="login-form">

                            <Spin tip="Loading..." spinning={authStore.state === 'pending'}>
                                <Title level={2} type="secondary">{t('Request Password')}</Title>
                                <Form
                                    name="request_password"
                                    onFinish={onFinish}
                                    form={form}
                                >
                                    <Form.Item
                                        name="phone_no"
                                        rules={[{required: true, message: t('Please input your mobile number!')}]}
                                    >
                                        <Input prefix={<UserOutlined/>} placeholder={t("Mobile No.")}/>
                                    </Form.Item>

                                    <Row justify={'end'} gutter={[8,8]}>
                                        <Col>
                                            <Form.Item>
                                                <Button type="secondary" htmlType="reset" onClick={() => history.push('/login')}>
                                                    {t('cancel')}
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                        <Col>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit">
                                                    {t('Next')}
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                </Form>
                            </Spin>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
});
export default ForgetPassword

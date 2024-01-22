import React, {useEffect, useState} from "react";
import DataTable from "../../component/DataTable/DataTable";
import {authApi} from '../../api';
import {Form, Input, Button, Row} from "antd";
import {DeleteFilled, SaveOutlined} from '@ant-design/icons'
import {useTranslation} from 'react-i18next';
import {useStore} from "../../store/mobx";
import Ajv from 'ajv';
import {JsonEditor as Editor} from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

const ajv = new Ajv({allErrors: true, verbose: true});

import {Select} from 'antd';

const {Option} = Select;

const DeleteForm = ({mode, key, close, saveHandler, getHandler}) => {
    const {t} = useTranslation();
    const [form] = Form.useForm();

    useEffect(() => {
        (async () => {
            await getHandler(key);
        })()

    }, [key]);

    return (
        <Form
            form={form}
            onFinish={saveHandler}
            layout="vertical"
            name="client_form"
        >
            <div>t{'Would you like delete this record'}</div>
            <Row type="flex" justify="end">
                <Form.Item>
                    <Button
                        danger
                        type="primary"
                        htmlType="submit"
                        icon={<DeleteFilled/>}
                    >
                        {t("Delete")}
                    </Button>
                    <Button
                        type="primary"
                        htmlType="button"
                        icon={<SaveOutlined/>}
                        onClick={close}
                    >
                        {t("Cancel")}
                    </Button>
                </Form.Item>
            </Row>
        </Form>
    );
};

const EditForm = ({mode, key, close, saveHandler, getHandler}) => {
    const {t} = useTranslation();
    const [form] = Form.useForm();
    const [entities, setEntities] = useState([]);
    const [payload, setPayload] = useState(null);

    const getEntities = async () => {
        const {data} = await authApi().get(`/v1/entity`);
        return data.data
    };

    useEffect(() => {
        (async () => {

            let entityList = await getEntities();
            if (mode === 'edit') {
                let data = await getHandler(key);
                data.entity = data.entity.map(entity => {
                    return {
                        value: entity,
                        label: entityList.find(e => e.name === entity).title,
                    }
                });

                form.setFieldsValue(data);
                setPayload(data.payload);
            }
            setEntities(entityList);

        })()


    }, [key]);

    const handleChangeJsonEditor = (value) => {
        form.setFieldsValue({payload: value});
        //setPayload(value)
    };

    let isDisabled = mode === 'edit';

    return !!entities.length && (
        <Form
            form={form}
            onFinish={saveHandler}
            layout="vertical"
            name="client_form"
        >
            <Form.Item
                name="client_id"
                label={t('Client Id')}
                rules={[{required: !isDisabled, message: t('Please input client_id')}]}
            >
                <Input disabled={isDisabled}/>
            </Form.Item>
            <Form.Item
                name="name"
                label="Name"
                rules={[{required: true, message: t('Please input the client name!')}]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                name={'entity'}
                label={t('Entity')}
                rules={[{required: true, message: 'Please select one or more !', type: 'array'}]}
            >
                <Select
                    mode="multiple"
                    style={{width: '100%'}}
                    placeholder={t('Please select a entity')}
                    labelInValue
                >
                    {entities.map(entity => (<Option key={entity.name} value={entity.name}>{entity.title}</Option>))}
                </Select>
            </Form.Item>

            <Form.Item
                name="type"
                label={t('Type')}
                rules={[{required: !isDisabled, message: 'Please select a type!'}]}
            >
                <Input disabled={isDisabled}/>
            </Form.Item>
            <Form.Item
                name="client_secret"
                label={t('Client secret')}
                rules={[{required: !isDisabled, message: 'Please select a client secret!'}]}
            >
                <Input disabled={isDisabled}/>
            </Form.Item>
            <Form.Item label={t('Payload')} name={'payload'}>
                <Editor value={payload}
                        search={false}
                        onChange={handleChangeJsonEditor}
                        ajv={ajv}
                        statusBar={false}
                    //schema={yourSchema}
                />
            </Form.Item>
            <Row type="flex" justify="end">
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined/>}
                    >
                        {t("Save")}
                    </Button>
                    <Button
                        type="primary"
                        htmlType="button"
                        icon={<SaveOutlined/>}
                        onClick={close}
                    >
                        {t("Cancel")}
                    </Button>
                </Form.Item>
            </Row>
        </Form>
    );
};

const Datatable = () => {
    const {notificationStore} = useStore();
    const [entities, setEntities] = useState([]);

    const getEntities = async () => {
        const {data} = await authApi().get(`/v1/entity`);
        return data.data.map(entity => {
            return {
                value: entity.name,
                label: entity.title,
            }
        })
    };

    useEffect(() => {
        (async () => {
            let entityList = await getEntities();
            setEntities(entityList);
        })()

    }, []);

    const fetchData = async (pageState = null, fetchSize = 70, params = {}) => {
        params.page_state = pageState;
        params.page_count = fetchSize;
        const {data} = await authApi().get(`/v1/clients`, {params: params});
        return {
            data: data.data,
            pageState: data.page_state
        };
    };

    const getRecordHandler = async (key) => {
        const {data} = await authApi().get(`/v1/clients`, {params: {client_id: key.client_id}});
        const [record] = data.data;
        return record;
    };

    const createRecordHandler = async (record) => {
        record.entity = record.entity.map(e => e.value);
        await authApi().post(`/v1/clients`, record);
        return record;
    };

    const updateRecordHandler = async (record) => {
        record.entity = record.entity.map(e => e.value);
        await authApi().put(`/v1/clients`, record);
        return record;
    };

    const deleteRecordHandler = async (record) => {
        await authApi().delete(`/v1/clients`, {params: {client_id: record.client_id}});
        return record;
    };

    return entities.length && (
        <div>
            <DataTable
                errorHandler={error => notificationStore.setError(error)}
                pageSize={15}
                fetchSize={50}
                fetchData={fetchData}
                createRecordHandler={createRecordHandler}
                updateRecordHandler={updateRecordHandler}
                deleteRecordHandler={deleteRecordHandler}
                getRecordHandler={getRecordHandler}
                actionComponent={'dropdown'}
                dropdownText={'Actions'}
                filter={[
                    {type: 'options', placeholder: 'Please select a entity', filter: 'entity', options: entities},
                    {
                        type: 'options',
                        placeholder: 'Please select a type',
                        filter: 'type',
                        options: [{value: 'person', label: 'Person'}, {value: 'device', label: 'Device'}, {value: 'site', label: 'Site'}]
                    },
                    {type: 'search', placeholder: 'Please enter a client id', filter: ['client_id']},
                ]}
                columns={[
                    {
                        title: 'Client Id',
                        dataIndex: 'client_id',
                    },
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        editable: {type: 'text'},
                    },
                    {
                        title: 'Type',
                        dataIndex: 'type',
                    },
                    {
                        title: 'Entity',
                        dataIndex: 'entity',
                        editable: {
                            type: 'options',
                            multiple: true,
                            options: entities
                        }
                    },
                    {
                        title: 'Options',
                        width: '120px',
                        action: [
                            {type: 'edit', text: 'Edit', component: <EditForm mode={'edit'}/>, view: 'drawer', title: 'Edit Client'},
                            {type: 'view', text: 'View', component: (<div><b>View</b></div>), view: 'modal'},
                            {type: 'delete', text: 'Delete', component: (<DeleteForm mode={'delete'}/>), view: 'modal', title: 'Delete Client'},
                            {type: 'inlineEdit', text: 'Inline Edit', setDisable: (record) => record.type === 'device'},
                        ]
                    }
                ]}
                toolbar={{
                    actions: [
                        {type: 'create', text: 'Create', icon: <SaveOutlined/>, component: <EditForm mode={'create'}/>, view: 'drawer', title: 'Create Client', button: {type: 'primary'}}
                    ]
                }}
                rowKey={(record) => {
                    const {client_id} = record;
                    return client_id; //must return a string
                }}
                primaryKey={(record) => {
                    const {client_id} = record;
                    return {client_id};
                }}
                inlineEdit={{
                    saveText: 'Save',
                    cancelText: 'Cancel',
                }}
            />
        </div>
    )
};

export default Datatable;

import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, message, Modal } from 'antd';
import { useRef, useState } from 'react';
import { userApi } from '../../../api';
import type { User, UserAddRequest, UserUpdateRequest, UserQueryRequest } from '../../../../generated_new/user';

const UserManager: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
    const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
    const [currentRow, setCurrentRow] = useState<User>();

    /**
     * 添加用户
     * @param fields
     */
    const handleAdd = async (fields: UserAddRequest) => {
        const hide = message.loading('正在添加');
        try {
            await userApi.addUser(fields);
            hide();
            message.success('添加成功');
            actionRef.current?.reload();
            return true;
        } catch (error: any) {
            hide();
            message.error('添加失败请重试！');
            return false;
        }
    };

    /**
     * 更新用户
     * @param fields
     */
    const handleUpdate = async (fields: UserUpdateRequest) => {
        const hide = message.loading('正在配置');
        try {
            await userApi.updateUser(fields);
            hide();
            message.success('配置成功');
            actionRef.current?.reload();
            return true;
        } catch (error: any) {
            hide();
            message.error('配置失败请重试！');
            return false;
        }
    };

    /**
     * 删除用户
     * @param row
     */
    const handleRemove = async (row: User) => {
        const hide = message.loading('正在删除');
        if (!row) return true;
        try {
            await userApi.deleteUser({
                id: row.id as any,
            });
            hide();
            message.success('删除成功');
            actionRef.current?.reload();
            return true;
        } catch (error: any) {
            hide();
            message.error('删除失败，请重试');
            return false;
        }
    };

    const columns: ProColumns<User>[] = [
        {
            title: 'id',
            dataIndex: 'id',
            valueType: 'text',
            copyable: true,
        },
        {
            title: '账号',
            dataIndex: 'userAccount',
            valueType: 'text',
            copyable: true,
            hideInSearch: true,
        },
        {
            title: '用户名',
            dataIndex: 'userName',
            valueType: 'text',
            copyable: true,
        },
        {
            title: '头像',
            dataIndex: 'userAvatar',
            valueType: 'image',
            fieldProps: {
                width: 64,
            },
            hideInSearch: true,
        },
        {
            title: '简介',
            dataIndex: 'userProfile',
            valueType: 'textarea',
            hideInSearch: true,
        },
        {
            title: '角色',
            dataIndex: 'userRole',
            valueType: 'select',
            valueEnum: {
                user: {
                    text: '普通用户',
                    status: 'Default',
                },
                admin: {
                    text: '管理员',
                    status: 'Success',
                },
                ban: {
                    text: '被封号',
                    status: 'Error',
                },
            },
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            valueType: 'dateTime',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <a
                    key="config"
                    onClick={() => {
                        setUpdateModalVisible(true);
                        setCurrentRow(record);
                    }}
                >
                    修改
                </a>,
                <a
                    key="delete"
                    style={{ color: 'red' }}
                    onClick={() => {
                        Modal.confirm({
                            title: '确认删除？',
                            content: '删除后不可恢复',
                            onOk: async () => {
                                await handleRemove(record);
                            },
                        });
                    }}
                >
                    删除
                </a>,
            ],
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <ProTable<User>
                headerTitle="用户管理"
                actionRef={actionRef}
                rowKey="id"
                search={{
                    labelWidth: 120,
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            setCreateModalVisible(true);
                        }}
                    >
                        <PlusOutlined /> 新建
                    </Button>,
                ]}
                request={async (params, sort, filter) => {
                    const sortField = Object.keys(sort)?.[0];
                    const sortOrder = sortField ? sort[sortField] as string : undefined;

                    const requestParams: UserQueryRequest = {
                        current: params.current,
                        pageSize: params.pageSize,
                        userName: params.userName,
                        userProfile: params.userProfile,
                        userRole: params.userRole,
                        id: params.id, // Add ID search
                        sortField: sortField,
                        sortOrder: sortOrder,
                        ...filter,
                    };

                    const { data } = await userApi.listUserByPage(requestParams);
                    const userList = data?.data?.records || [];
                    const total = data?.data?.total || 0;

                    return {
                        data: userList,
                        success: data?.code === 0,
                        // @ts-ignore
                        total: Number(total),
                    };
                }}
                columns={columns}
            />
            <ModalForm
                title="新建用户"
                width="400px"
                visible={createModalVisible}
                onVisibleChange={setCreateModalVisible}
                onFinish={async (value) => {
                    const success = await handleAdd(value as UserAddRequest);
                    if (success) {
                        setCreateModalVisible(false);
                    }
                }}
            >
                <ProFormText
                    label="账号"
                    name="userAccount"
                    rules={[
                        { required: true, message: '请输入账号!' },
                        { min: 4, message: '账号长度不能小于4位' },
                    ]}
                />
                <ProFormText.Password
                    label="密码"
                    name="userPassword"
                    rules={[
                        { required: true, message: '请输入密码!' },
                        { min: 8, message: '密码长度不能小于8位' },
                    ]}
                />
            </ModalForm>
            <ModalForm
                title="修改用户"
                width="400px"
                visible={updateModalVisible}
                onVisibleChange={setUpdateModalVisible}
                initialValues={currentRow}
                onFinish={async (value) => {
                    const success = await handleUpdate({
                        ...value,
                        id: currentRow?.id,
                    } as UserUpdateRequest);
                    if (success) {
                        setUpdateModalVisible(false);
                    }
                }}
            >
                <ProFormText
                    label="用户名"
                    name="userName"
                />
                <ProFormText
                    label="用户头像"
                    name="userAvatar"
                />
                <ProFormTextArea
                    label="简介"
                    name="userProfile"
                />
                <ProFormText
                    label="角色"
                    name="userRole"
                    placeholder="请输入 admin / user / ban"
                />
            </ModalForm>
        </div>
    );
};

export default UserManager;

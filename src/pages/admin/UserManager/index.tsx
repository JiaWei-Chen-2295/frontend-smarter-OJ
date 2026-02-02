import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Descriptions, message, Modal, Space, Tag, Typography } from 'antd';
import { useRef, useState } from 'react';
import { userApi } from '../../../api';
import type { User, UserAddRequest, UserUpdateRequest, UserQueryRequest } from '../../../../generated_new/user';

const UserManager: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
    const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
    const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
    const [currentRow, setCurrentRow] = useState<User>();

    const getSafeUserDetail = (user?: User) => {
        if (!user) return undefined;
        const { userPassword, ...rest } = user;
        return {
            ...rest,
            userPassword: userPassword ? '******' : undefined,
        } as User;
    };

    const handleSetRole = async (row: User, userRole: string) => {
        if (!row?.id) return false;
        const hide = message.loading('正在更新角色');
        try {
            await userApi.updateUser({
                id: row.id,
                userRole,
            });
            hide();
            message.success('更新成功');
            actionRef.current?.reload();
            return true;
        } catch (error: any) {
            hide();
            message.error('更新失败请重试！');
            return false;
        }
    };

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
        },
        {
            title: '用户名',
            dataIndex: 'userName',
            valueType: 'text',
            copyable: true,
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            valueType: 'text',
            copyable: true,
            hideInTable: true,
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
            hideInTable: true,
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
            title: 'unionId',
            dataIndex: 'unionId',
            valueType: 'text',
            copyable: true,
            hideInTable: true,
        },
        {
            title: 'mpOpenId',
            dataIndex: 'mpOpenId',
            valueType: 'text',
            copyable: true,
            hideInTable: true,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            valueType: 'dateTime',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            valueType: 'dateTime',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: '是否删除',
            dataIndex: 'isDelete',
            valueType: 'select',
            valueEnum: {
                0: { text: '否', status: 'Success' },
                1: { text: '是', status: 'Error' },
            },
            hideInSearch: true,
            hideInTable: true,
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
                    key="detail"
                    onClick={() => {
                        setCurrentRow(record);
                        setDetailModalVisible(true);
                    }}
                >
                    详情
                </a>,
                <a
                    key="profile"
                    onClick={() => {
                        if (!record.id) return;
                        window.open(`/profile?userId=${record.id}`, '_blank');
                    }}
                >
                    主页
                </a>,
                <a
                    key="submits"
                    onClick={() => {
                        if (!record.id) return;
                        window.open(`/admin/user-submit-manager?userId=${record.id}`, '_blank');
                    }}
                >
                    提交
                </a>,
                <a
                    key="ban"
                    style={{ color: record.userRole === 'ban' ? undefined : '#fa541c' }}
                    onClick={() => {
                        const nextRole = record.userRole === 'ban' ? 'user' : 'ban';
                        Modal.confirm({
                            title: nextRole === 'ban' ? '确认封禁该用户？' : '确认解封该用户？',
                            content: nextRole === 'ban' ? '封禁后用户将无法正常使用系统' : '解封后用户将恢复正常权限',
                            onOk: async () => {
                                await handleSetRole(record, nextRole);
                            },
                        });
                    }}
                >
                    {record.userRole === 'ban' ? '解封' : '封禁'}
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
                        userAccount: params.userAccount,
                        userName: params.userName,
                        userProfile: params.userProfile,
                        userRole: params.userRole,
                        id: params.id, // Add ID search
                        phone: params.phone,
                        unionId: params.unionId,
                        mpOpenId: params.mpOpenId,
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
                <ProFormText
                    label="用户名"
                    name="userName"
                />
                <ProFormText
                    label="手机号"
                    name="phone"
                />
                <ProFormSelect
                    label="角色"
                    name="userRole"
                    options={[
                        { label: '普通用户', value: 'user' },
                        { label: '管理员', value: 'admin' },
                        { label: '被封号', value: 'ban' },
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
                <ProFormSelect
                    label="角色"
                    name="userRole"
                    options={[
                        { label: '普通用户', value: 'user' },
                        { label: '管理员', value: 'admin' },
                        { label: '被封号', value: 'ban' },
                    ]}
                />
            </ModalForm>
            <Modal
                title="用户详情"
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={
                    <Space>
                        <Button onClick={() => setDetailModalVisible(false)}>关闭</Button>
                    </Space>
                }
                width={760}
            >
                {(() => {
                    const user = getSafeUserDetail(currentRow);
                    if (!user) return null;
                    return (
                        <>
                            <Descriptions bordered size="small" column={2}>
                                <Descriptions.Item label="ID">
                                    <Typography.Text copyable>{user.id}</Typography.Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="账号">
                                    <Typography.Text copyable>{user.userAccount}</Typography.Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="用户名">{user.userName || '-'}</Descriptions.Item>
                                <Descriptions.Item label="手机号">
                                    <Typography.Text copyable>{user.phone || '-'}</Typography.Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="角色">
                                    {user.userRole ? (
                                        <Tag
                                            color={
                                                user.userRole === 'admin'
                                                    ? 'green'
                                                    : user.userRole === 'ban'
                                                        ? 'red'
                                                        : 'default'
                                            }
                                        >
                                            {user.userRole}
                                        </Tag>
                                    ) : (
                                        '-'
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label="unionId">
                                    <Typography.Text copyable>{user.unionId || '-'}</Typography.Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="mpOpenId">
                                    <Typography.Text copyable>{user.mpOpenId || '-'}</Typography.Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="头像" span={2}>
                                    <Typography.Text copyable>{user.userAvatar || '-'}</Typography.Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="简介" span={2}>
                                    <Typography.Paragraph style={{ marginBottom: 0 }}>
                                        {user.userProfile || '-'}
                                    </Typography.Paragraph>
                                </Descriptions.Item>
                                <Descriptions.Item label="密码" span={2}>
                                    {user.userPassword || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item label="创建时间">{user.createTime || '-'}</Descriptions.Item>
                                <Descriptions.Item label="更新时间">{user.updateTime || '-'}</Descriptions.Item>
                            </Descriptions>
                            <Typography.Title level={5} style={{ marginTop: 16 }}>
                                原始数据
                            </Typography.Title>
                            <pre style={{ maxHeight: 260, overflow: 'auto', marginBottom: 0 }}>
                                {JSON.stringify(user, null, 2)}
                            </pre>
                        </>
                    );
                })()}
            </Modal>
        </div>
    );
};

export default UserManager;

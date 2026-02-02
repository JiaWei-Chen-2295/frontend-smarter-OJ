
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, ModalForm, ProFormText, ProFormTextArea, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import { Button, Descriptions, message, Modal, Space, Tag, Typography } from 'antd';
import { useRef, useState } from 'react';
import { roomApi } from '../../../api';
import type { Room, RoomAddRequest, RoomUpdateRequest, RoomQueryRequest } from '../../../../generated_new/room';

const RoomManager: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
    const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
    const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
    const [currentRow, setCurrentRow] = useState<Room>();

    const getSafeRoomDetail = (room?: Room) => {
        if (!room) return undefined;
        return {
            ...room,
            password: room.password ? '******' : undefined,
        };
    };

    /**
     * 添加房间
     * @param fields
     */
    const handleAdd = async (fields: RoomAddRequest) => {
        const hide = message.loading('正在添加');
        try {
            await roomApi.addRoom(fields);
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
     * 更新房间
     * @param fields
     */
    const handleUpdate = async (fields: RoomUpdateRequest) => {
        const hide = message.loading('正在配置');
        try {
            await roomApi.updateRoom(fields);
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
     * 删除房间
     * @param row
     */
    const handleRemove = async (row: Room) => {
        const hide = message.loading('正在删除');
        if (!row) return true;
        try {
            await roomApi.deleteRoom({
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

    const columns: ProColumns<Room>[] = [
        {
            title: 'id',
            dataIndex: 'id',
            valueType: 'text',
            copyable: true,
        },
        {
            title: '房间名称',
            dataIndex: 'name',
            valueType: 'text',
        },
        {
            title: '描述',
            dataIndex: 'description',
            valueType: 'textarea',
            hideInSearch: true,
        },
        {
            title: '最大人数',
            dataIndex: 'mateNum',
            valueType: 'digit',
            hideInSearch: true,
        },
        {
            title: '房主ID',
            dataIndex: 'userId',
            valueType: 'text',
        },
        {
            title: '密码',
            dataIndex: 'password',
            valueType: 'text',
            hideInSearch: true,
            render: (_, record) => (record.password ? <Tag color="orange">有</Tag> : <Tag>无</Tag>),
        },
        {
            title: '状态',
            dataIndex: 'status',
            valueType: 'select',
            valueEnum: {
                0: {
                    text: '未开始',
                    status: 'Default',
                },
                1: {
                    text: '进行中',
                    status: 'Processing',
                },
                2: {
                    text: '已结束',
                    status: 'Success',
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
            title: '更新时间',
            dataIndex: 'updateTime',
            valueType: 'dateTime',
            sorter: true,
            hideInSearch: true,
            hideInTable: true,
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
            <ProTable<Room>
                headerTitle="房间管理"
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

                    const requestParams: RoomQueryRequest = {
                        current: params.current,
                        pageSize: params.pageSize,
                        name: params.name,
                        description: params.description,
                        userId: params.userId,
                        status: params.status ? Number(params.status) : undefined,
                        id: params.id,
                        sortField: sortField,
                        sortOrder: sortOrder,
                        ...filter,
                    };

                    const { data } = await roomApi.listRoomByPage(requestParams);
                    const roomList = data?.data?.records || [];
                    const total = data?.data?.total || 0;

                    return {
                        data: roomList,
                        success: data?.code === 0,
                        // @ts-ignore
                        total: Number(total),
                    };
                }}
                columns={columns}
            />
            <ModalForm
                title="新建房间"
                width="400px"
                visible={createModalVisible}
                onVisibleChange={setCreateModalVisible}
                onFinish={async (value) => {
                    const success = await handleAdd(value as RoomAddRequest);
                    if (success) {
                        setCreateModalVisible(false);
                    }
                }}
            >
                <ProFormText
                    label="房间名称"
                    name="name"
                    rules={[{ required: true, message: '请输入房间名称!' }]}
                />
                <ProFormTextArea
                    label="描述"
                    name="description"
                />
                <ProFormDigit
                    label="最大人数"
                    name="mateNum"
                    min={1}
                />
                <ProFormSelect
                    label="状态"
                    name="status"
                    options={[
                        { label: '未开始', value: 0 },
                        { label: '进行中', value: 1 },
                        { label: '已结束', value: 2 },
                    ]}
                />
                <ProFormText.Password
                    label="房间密码"
                    name="password"
                    placeholder="不填则无密码"
                />
            </ModalForm>
            <ModalForm
                title="修改房间"
                width="400px"
                visible={updateModalVisible}
                onVisibleChange={setUpdateModalVisible}
                initialValues={currentRow}
                onFinish={async (value) => {
                    const success = await handleUpdate({
                        ...value,
                        id: currentRow?.id,
                    } as RoomUpdateRequest);
                    if (success) {
                        setUpdateModalVisible(false);
                    }
                }}
            >
                <ProFormText
                    label="房间名称"
                    name="name"
                />
                <ProFormTextArea
                    label="描述"
                    name="description"
                />
                <ProFormDigit
                    label="最大人数"
                    name="mateNum"
                    min={1}
                />
                <ProFormText
                    label="房主ID"
                    name="userId"
                />
                <ProFormSelect
                    label="状态"
                    name="status"
                    options={[
                        { label: '未开始', value: 0 },
                        { label: '进行中', value: 1 },
                        { label: '已结束', value: 2 },
                    ]}
                />
                <ProFormText.Password
                    label="房间密码"
                    name="password"
                    placeholder="不填则不修改"
                />
            </ModalForm>
            <Modal
                title="房间详情"
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
                    const room = getSafeRoomDetail(currentRow);
                    if (!room) return null;
                    return (
                        <>
                            <Descriptions bordered size="small" column={2}>
                                <Descriptions.Item label="ID">
                                    <Typography.Text copyable>{room.id}</Typography.Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="房间名称">{room.name || '-'}</Descriptions.Item>
                                <Descriptions.Item label="房主ID">
                                    <Typography.Text copyable>{room.userId || '-'}</Typography.Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="最大人数">{room.mateNum ?? '-'}</Descriptions.Item>
                                <Descriptions.Item label="状态">
                                    {room.status === 0 ? '未开始' : room.status === 1 ? '进行中' : room.status === 2 ? '已结束' : '-'}
                                </Descriptions.Item>
                                <Descriptions.Item label="密码">{room.password || '-'}</Descriptions.Item>
                                <Descriptions.Item label="描述" span={2}>
                                    <Typography.Paragraph style={{ marginBottom: 0 }}>
                                        {room.description || '-'}
                                    </Typography.Paragraph>
                                </Descriptions.Item>
                                <Descriptions.Item label="创建时间">{room.createTime || '-'}</Descriptions.Item>
                                <Descriptions.Item label="更新时间">{room.updateTime || '-'}</Descriptions.Item>
                            </Descriptions>
                            <Typography.Title level={5} style={{ marginTop: 16 }}>
                                原始数据
                            </Typography.Title>
                            <pre style={{ maxHeight: 260, overflow: 'auto', marginBottom: 0 }}>
                                {JSON.stringify(room, null, 2)}
                            </pre>
                        </>
                    );
                })()}
            </Modal>
        </div>
    );
};

export default RoomManager;

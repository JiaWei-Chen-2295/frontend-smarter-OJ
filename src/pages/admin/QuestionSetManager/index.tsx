
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, ModalForm, ProFormText, ProFormTextArea, ProFormSelect } from '@ant-design/pro-components';
import { Button, message, Modal, Tag } from 'antd';
import { useRef, useState } from 'react';
import { questionSetApi } from '../../../api';
import type { QuestionSet, QuestionSetAddRequest, QuestionSetUpdateRequest, QuestionSetQueryRequest } from '../../../../generated_new/question';

const QuestionSetManager: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
    const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
    const [currentRow, setCurrentRow] = useState<QuestionSet>();

    /**
     * 添加题目单
     * @param fields
     */
    const handleAdd = async (fields: QuestionSetAddRequest) => {
        const hide = message.loading('正在添加');
        try {
            await questionSetApi.addQuestionSet({
                ...fields,
                tags: fields.tags ? fields.tags : [],
            });
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
     * 更新题目单
     * @param fields
     */
    const handleUpdate = async (fields: QuestionSetUpdateRequest) => {
        const hide = message.loading('正在配置');
        try {
            // Check if tags might be a string (from initialValues) or array (from multiselect)
            // Ideally ProFormSelect handles this, but backend expects array or string depending on model.
            // The Update Request expects Array<string>.
            await questionSetApi.updateQuestionSet(fields);
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
     * 删除题目单
     * @param row
     */
    const handleRemove = async (row: QuestionSet) => {
        const hide = message.loading('正在删除');
        if (!row) return true;
        try {
            await questionSetApi.deleteQuestionSet({
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

    const columns: ProColumns<QuestionSet>[] = [
        {
            title: 'id',
            dataIndex: 'id',
            valueType: 'text',
            copyable: true,
        },
        {
            title: '标题',
            dataIndex: 'title',
            valueType: 'text',
        },
        {
            title: '描述',
            dataIndex: 'description',
            valueType: 'textarea',
            hideInSearch: true,
        },
        {
            title: '标签',
            dataIndex: 'tags',
            valueType: 'text',
            hideInSearch: true,
            render: (_, record) => {
                try {
                    const tags = JSON.parse(record.tags as string || '[]');
                    if (!Array.isArray(tags)) return <></>;
                    return (
                        <>
                            {tags.map((tag: string) => (
                                <Tag key={tag} color="blue">
                                    {tag}
                                </Tag>
                            ))}
                        </>
                    );
                } catch (e) {
                    return <></>;
                }
            },
        },
        {
            title: '创建人ID',
            dataIndex: 'userId',
            valueType: 'text',
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
                        let parsedTags: string[] = [];
                        try {
                            parsedTags = JSON.parse(record.tags as string || '[]');
                        } catch (e) {
                            parsedTags = [];
                        }
                        setCurrentRow({ ...record, tags: parsedTags as any }); // Cast for initial value compatibility
                        setUpdateModalVisible(true);
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
            <ProTable<QuestionSet>
                headerTitle="题目单管理"
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

                    const requestParams: QuestionSetQueryRequest = {
                        current: params.current,
                        pageSize: params.pageSize,
                        title: params.title,
                        description: params.description,
                        userId: params.userId,
                        id: params.id,
                        sortField: sortField,
                        sortOrder: sortOrder,
                        ...filter,
                    };

                    const { data } = await questionSetApi.listQuestionSetByPage(requestParams);
                    const questionSetList = data?.data?.records || [];
                    const total = data?.data?.total || 0;

                    return {
                        data: questionSetList,
                        success: data?.code === 0,
                        // @ts-ignore
                        total: Number(total),
                    };
                }}
                columns={columns}
            />
            <ModalForm
                title="新建题目单"
                width="400px"
                visible={createModalVisible}
                onVisibleChange={setCreateModalVisible}
                onFinish={async (value) => {
                    const success = await handleAdd(value as QuestionSetAddRequest);
                    if (success) {
                        setCreateModalVisible(false);
                    }
                }}
            >
                <ProFormText
                    label="标题"
                    name="title"
                    rules={[{ required: true, message: '请输入标题!' }]}
                />
                <ProFormTextArea
                    label="描述"
                    name="description"
                />
                <ProFormSelect
                    label="标签"
                    name="tags"
                    mode="tags"
                    placeholder="请输入标签"
                />
            </ModalForm>
            <ModalForm
                title="修改题目单"
                width="400px"
                visible={updateModalVisible}
                onVisibleChange={setUpdateModalVisible}
                initialValues={currentRow}
                onFinish={async (value) => {
                    const success = await handleUpdate({
                        ...value,
                        id: currentRow?.id,
                    } as QuestionSetUpdateRequest);
                    if (success) {
                        setUpdateModalVisible(false);
                    }
                }}
            >
                <ProFormText
                    label="标题"
                    name="title"
                />
                <ProFormTextArea
                    label="描述"
                    name="description"
                />
                <ProFormSelect
                    label="标签"
                    name="tags"
                    mode="tags"
                    placeholder="请输入标签"
                />
            </ModalForm>
        </div>
    );
};

export default QuestionSetManager;

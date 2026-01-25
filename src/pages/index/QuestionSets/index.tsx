import { useState, useEffect } from 'react';
import { Modal, message, Spin, Tag, Input, Form, Button, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, BookOutlined, UserOutlined, ClockCircleOutlined, HeartOutlined, FolderOpenOutlined, SearchOutlined } from '@ant-design/icons';
import { createQuestionSet, getMyQuestionSets, getAllQuestionSets, deleteQuestionSet } from '../../../services/questionSetService';
import type { QuestionSetVO } from '../../../../generated_new/question';
import './QuestionSets.css';

const { TextArea } = Input;

const QuestionSets: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [questionSets, setQuestionSets] = useState<QuestionSetVO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'my' | 'all'>('my');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');

  // 表单状态
  const [form] = Form.useForm();
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const fetchQuestionSets = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const params = {
        current: page,
        pageSize: 10,
        title: search || undefined,
        sortField: 'createTime',
        sortOrder: 'descend'
      };

      const resp = viewMode === 'my'
        ? await getMyQuestionSets(params)
        : await getAllQuestionSets(params);

      if (resp && resp.code === 0) {
        const pageData = resp.data as any; // Bypass type for debug

        const records = pageData?.records || pageData?.data?.records || [];
        const total = pageData?.total || pageData?.data?.total || 0;



        setQuestionSets(records);
        setTotal(Number(total));
      } else { }
    } catch (error) {
      message.error('获取题单列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionSets(currentPage, searchText);
  }, [viewMode, currentPage, searchText]); // Added searchText here

  const handleSearch = () => {
    setCurrentPage(1);
    fetchQuestionSets(1, searchText);
  };

  const handleCreateQuestionSet = async (values: any) => {
    try {
      await createQuestionSet({
        title: values.title,
        description: values.description,
        tags: tags
      });
      message.success('创建成功');
      setIsModalOpen(false);
      form.resetFields();
      setTags([]);
      fetchQuestionSets(1, searchText);
    } catch (error: any) {
      if (error?.status === 403) {
        message.error('无权限创建题单');
      } else {
        message.error('创建失败');
      }
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteQuestionSet(id);
      message.success('删除成功');
      setDeleteConfirmOpen(null);
      fetchQuestionSets(currentPage, searchText);
    } catch (error: any) {
      if (error?.status === 403) {
        message.error('无权限删除');
      } else {
        message.error('删除失败');
      }
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const resetModal = () => {
    form.resetFields();
    setTags([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      {/* 头部 */}
      <div className="qs-header">
        <div className="qs-tabs">
          <button
            className={`qs-tab ${viewMode === 'my' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('my');
              setCurrentPage(1);
            }}
          >
            我的题单
          </button>
          <button
            className={`qs-tab ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('all');
              setCurrentPage(1);
            }}
          >
            全部题单
          </button>
        </div>

        <div className="qs-header-actions">
          <div className="qs-search">
            <input
              placeholder="搜索题单标题"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="search-btn">
              <SearchOutlined />
            </button>
          </div>
          <button className="qs-create-btn" onClick={() => { resetModal(); setIsModalOpen(true); }}>
            <PlusOutlined /> 创建题单
          </button>
        </div>
      </div>

      {/* 列表 */}
      <div className="qs-container">
        {loading ? (
          <div className="qs-loading">
            <Spin size="large" />
          </div>
        ) : questionSets.length === 0 ? (
          <div className="qs-empty">
            <div className="qs-empty-icon">📚</div>
            <div className="qs-empty-text">暂无题单（当前 {viewMode} 模式，共 {total} 条）</div>
          </div>
        ) : (
          <>
            <div className="qs-list">
              {questionSets.map((qs) => (
                <div key={qs.id} className="qs-card">
                  <div className="qs-card-header">
                    <div className="qs-card-title-wrapper">
                      <h3
                        className="qs-card-title"
                        onClick={() => navigate(`/question-set/${qs.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <BookOutlined className="title-icon" />
                        {qs.title}
                      </h3>
                      <span className="qs-question-num">
                        <FolderOpenOutlined /> {qs.questionNum || 0} 题
                      </span>
                    </div>
                    <div className="qs-card-meta">
                      <span className="qs-author">
                        <UserOutlined /> {qs.userVO?.userName || '匿名'}
                      </span>
                      <span className="qs-time">
                        <ClockCircleOutlined /> {new Date(qs.createTime || '').toLocaleDateString()}
                      </span>
                      <span className="qs-favor">
                        <HeartOutlined /> {qs.favourNum || 0}
                      </span>
                    </div>
                  </div>

                  {qs.description && (
                    <div className="qs-description">{qs.description}</div>
                  )}

                  {qs.tags && qs.tags.length > 0 && (
                    <div className="qs-tags">
                      {qs.tags.map((tag, index) => (
                        <Tag key={index} color="blue">{tag}</Tag>
                      ))}
                    </div>
                  )}

                  <div className="qs-actions">
                    <button
                      className="qs-action-btn view-btn"
                      onClick={() => navigate(`/question-set/${qs.id}`)}
                    >
                      查看详情
                    </button>
                    {(viewMode === 'my') && qs.id && (
                      <div className="qs-manage-actions">
                        <button
                          className="qs-action-btn edit-btn"
                          onClick={() => navigate(`/question-set/edit/${qs.id}`)}
                        >
                          编辑
                        </button>
                        <button
                          className="qs-action-btn delete-btn"
                          onClick={() => {
                            if (qs.id) setDeleteConfirmOpen(qs.id);
                          }}
                        >
                          删除
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {total > 10 && (
              <div className="qs-pagination">
                <Pagination
                  current={currentPage}
                  pageSize={10}
                  total={total}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* 创建题单模态框 */}
      <Modal
        title="创建新题单"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            创建
          </Button>
        ]}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateQuestionSet}
          autoComplete="off"
        >
          <Form.Item
            label="题单标题"
            name="title"
            rules={[{ required: true, message: '请输入题单标题' }, { max: 80, message: '标题不能超过80个字符' }]}
          >
            <Input placeholder="输入题单标题（例如：算法基础题集）" />
          </Form.Item>

          <Form.Item
            label="题单描述"
            name="description"
            rules={[{ max: 1024, message: '描述不能超过1024个字符' }]}
          >
            <TextArea
              placeholder="简要描述这个题单的内容（选填）"
              rows={3}
            />
          </Form.Item>

          <Form.Item label="标签">
            <div className="qs-tags-input">
              <input
                placeholder="添加标签（按回车）"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
              />
              <button type="button" onClick={addTag}>添加</button>
            </div>

            {tags.length > 0 && (
              <div className="qs-tags-preview" style={{ marginTop: 12 }}>
                {tags.map(tag => (
                  <Tag
                    key={tag}
                    closable
                    onClose={() => removeTag(tag)}
                    color="blue"
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>

      {/* 删除确认模态框 */}
      <Modal
        title="确认删除"
        open={deleteConfirmOpen !== null}
        onCancel={() => setDeleteConfirmOpen(null)}
        onOk={() => handleDelete(deleteConfirmOpen!)}
        okText="删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除这个题单吗？此操作无法撤销。</p>
      </Modal>
    </div>
  );
};

export default QuestionSets;

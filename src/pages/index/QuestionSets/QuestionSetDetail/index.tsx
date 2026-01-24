import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Tag, message, Modal, Input, Select, Button, Empty } from 'antd';
import { ArrowLeftOutlined, UserOutlined, ClockCircleOutlined, HeartOutlined, FolderOpenOutlined, PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import {
  getQuestionSetDetail,
  addQuestionToSet,
  removeQuestionFromSet,
  deleteQuestionSet
} from '../../../../services/questionSetService';

import './QuestionSetDetail.css';
import {
    BaseResponse_Page_QuestionVO_,
    Page_QuestionVO_,
    QuestionControllerService,
    QuestionSetVO,
    QuestionVO
} from "../../../../../generated";

const QuestionSetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [questionSet, setQuestionSet] = useState<QuestionSetVO | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<QuestionVO[]>([]);
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionLoading, setQuestionLoading] = useState(false);

  // 存储当前用户的ID（从localStorage或store获取，这里简化处理）
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    // 从localStorage获取用户信息（实际项目中应该使用Redux状态）
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        const userInfo = JSON.parse(storedUser);
        setCurrentUserId(userInfo.id);
      } catch (e) {
        // 忽略解析错误
      }
    }
    fetchQuestionSetDetail();
  }, [id]);

  const fetchQuestionSetDetail = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const resp = await getQuestionSetDetail(id);
      if (resp.code === 0 && resp.data) {
        setQuestionSet(resp.data);
      } else {
        message.error('获取题单详情失败');
      }
    } catch (error) {
      message.error('获取题单详情失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableQuestions = async (search = '') => {
    setQuestionLoading(true);
    try {
      const resp = await QuestionControllerService.listQuestionVoByPageUsingPost({
        current: 1,
        pageSize: 20,
        title: search || undefined
      });
      if (resp.code === 0 && resp.data) {
        // resp.data 是 BaseResponse_Page_QuestionVO_ 类型
        // 其 data 属性是 Page_QuestionVO_ 类型，包含 records
        const pageData = resp.data as BaseResponse_Page_QuestionVO_;
        const questions = pageData.data?.records || [];
        // 过滤掉已存在的题目
        const existingIds = new Set(questionSet?.questions?.map(q => q.id) || []);
        const filtered = questions.filter(q => !existingIds.has(q.id));
        setAvailableQuestions(filtered);
      }
    } catch (error) {
      message.error('获取题目列表失败');
    } finally {
      setQuestionLoading(false);
    }
  };

  useEffect(() => {
    if (isAddModalOpen) {
      fetchAvailableQuestions();
    }
  }, [isAddModalOpen, questionSet?.questions]);

  const handleAddQuestion = async () => {
    if (!questionSet?.id || selectedQuestionIds.length === 0) {
      message.warning('请选择要添加的题目');
      return;
    }

    try {
      const promises = selectedQuestionIds.map(qid =>
        addQuestionToSet({ questionSetId: questionSet.id!, questionId: qid })
      );
      await Promise.all(promises);
      message.success('添加成功');
      setIsAddModalOpen(false);
      setSelectedQuestionIds([]);
      fetchQuestionSetDetail();
    } catch (error) {
      message.error('添加失败');
    }
  };

  const handleRemoveQuestion = async (questionId?: number) => {
    if (!questionSet?.id || !questionId) return;

    try {
      await removeQuestionFromSet({ questionSetId: questionSet.id, questionId });
      message.success('移除成功');
      fetchQuestionSetDetail();
    } catch (error: any) {
      if (error?.status === 403) {
        message.error('无权限操作');
      } else {
        message.error('移除失败');
      }
    }
  };

  const handleDeleteQuestionSet = async () => {
    if (!questionSet?.id) return;
    try {
      await deleteQuestionSet(questionSet.id);
      message.success('删除成功');
      navigate('/question-sets');
    } catch (error: any) {
      if (error?.status === 403) {
        message.error('无权限删除');
      } else {
        message.error('删除失败');
      }
    }
  };

  const isOwner = useMemo(() => {
    return currentUserId && questionSet?.userId && currentUserId === questionSet.userId;
  }, [currentUserId, questionSet?.userId]);

  if (loading) {
    return (
      <div className="qs-detail-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!questionSet) {
    return (
      <div className="qs-detail-error">
        <h2>题单不存在</h2>
        <button onClick={() => navigate('/question-sets')}>返回题单列表</button>
      </div>
    );
  }

  return (
    <div className="qs-detail-container">
      <div className="qs-detail-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeftOutlined /> 返回
          </button>
        </div>
        <div className="header-actions">
          {isOwner && (
            <>
              <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
                <PlusOutlined /> 添加题目
              </button>
              <button className="delete-btn" onClick={() => setIsDeleteModalOpen(true)}>
                <DeleteOutlined /> 删除题单
              </button>
            </>
          )}
        </div>
      </div>

      <div className="qs-detail-main">
        <div className="qs-detail-content">
          <h1 className="qs-detail-title">{questionSet.title}</h1>

          <div className="qs-detail-meta">
            <div className="qs-detail-author">
              <div className="author-avatar">
                {questionSet.userVO?.userAvatar ? (
                  <img src={questionSet.userVO.userAvatar} alt={questionSet.userVO.userName} />
                ) : (
                  <UserOutlined />
                )}
              </div>
              <div className="author-info">
                <div className="author-name">{questionSet.userVO?.userName || '匿名用户'}</div>
                <div className="qs-time">
                  <ClockCircleOutlined /> {new Date(questionSet.createTime || '').toLocaleString()}
                </div>
              </div>
            </div>

            <div className="qs-stats">
              <span className="stat-item">
                <FolderOpenOutlined /> {questionSet.questionNum || 0} 题
              </span>
              <span className="stat-item">
                <HeartOutlined /> {questionSet.favourNum || 0}
              </span>
            </div>
          </div>

          {questionSet.tags && questionSet.tags.length > 0 && (
            <div className="qs-detail-tags">
              {questionSet.tags.map((tag, index) => (
                <Tag key={index} color="blue">{tag}</Tag>
              ))}
            </div>
          )}

          {questionSet.description && (
            <>
              <div className="qs-detail-divider"></div>
              <div className="qs-detail-description">
                <h3>题单描述</h3>
                <p>{questionSet.description}</p>
              </div>
            </>
          )}

          <div className="qs-detail-divider"></div>

          <div className="qs-detail-questions">
            <div className="questions-header">
              <h3>题目列表 ({questionSet.questions?.length || 0})</h3>
            </div>

            {questionSet.questions && questionSet.questions.length > 0 ? (
              <div className="questions-list">
                {questionSet.questions.map((question, index) => (
                  <div key={question.id} className="question-item">
                    <div className="question-info">
                      <span className="question-index">{index + 1}.</span>
                      <div className="question-title-wrapper">
                        <div
                          className="question-title"
                          onClick={() => navigate(`/oj/${question.id}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          {question.title}
                        </div>
                        {question.tags && question.tags.length > 0 && (
                          <div className="question-tags">
                            {question.tags.slice(0, 3).map((tag, idx) => (
                              <Tag key={idx} color="default" style={{ fontSize: '12px', margin: '0 4px 0 0' }}>
                                {tag}
                              </Tag>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="question-stats">
                      <span className="stat-badge">
                        提交: {question.submitNum || 0}
                      </span>
                      <span className="stat-badge accepted">
                        通过: {question.acceptedNum || 0}
                      </span>
                      {isOwner && (
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveQuestion(question.id)}
                          title="从题单中移除"
                        >
                          移除
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="qs-empty-questions">
                <Empty description="暂无题目" />
              </div>
            )}
          </div>
        </div>

        <div className="qs-detail-sidebar">
          <div className="sidebar-card">
            <h3>题单信息</h3>
            <div className="sidebar-info">
              <div className="info-item">
                <span className="info-label">创建时间</span>
                <span className="info-value">{new Date(questionSet.createTime || '').toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">更新时间</span>
                <span className="info-value">{new Date(questionSet.updateTime || '').toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">题目数量</span>
                <span className="info-value">{questionSet.questionNum || 0}</span>
              </div>
              <div className="info-item">
                <span className="info-label">收藏数</span>
                <span className="info-value">{questionSet.favourNum || 0}</span>
              </div>
            </div>
          </div>

          {questionSet.userVO && (
            <div className="sidebar-card">
              <h3>创建者信息</h3>
              <div className="sidebar-author">
                <div className="sidebar-author-avatar">
                  {questionSet.userVO.userAvatar ? (
                    <img src={questionSet.userVO.userAvatar} alt={questionSet.userVO.userName} />
                  ) : (
                    <div className="default-avatar"><UserOutlined /></div>
                  )}
                </div>
                <div className="sidebar-author-name">{questionSet.userVO.userName}</div>
                {questionSet.userVO.userProfile && (
                  <div className="sidebar-author-bio">{questionSet.userVO.userProfile}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 添加题目模态框 */}
      <Modal
        title="添加题目到题单"
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
          setSelectedQuestionIds([]);
        }}
        onOk={handleAddQuestion}
        okText="确认添加"
        cancelText="取消"
        width={700}
        okButtonProps={{ disabled: selectedQuestionIds.length === 0 }}
      >
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索题目标题"
            value={questionSearch}
            onChange={(e) => setQuestionSearch(e.target.value)}
            prefix={<SearchOutlined />}
            onPressEnter={() => fetchAvailableQuestions(questionSearch)}
            suffix={
              <Button type="link" onClick={() => fetchAvailableQuestions(questionSearch)}>
                搜索
              </Button>
            }
          />
        </div>

        {questionLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin />
          </div>
        ) : availableQuestions.length === 0 ? (
          <Empty description="暂无可用题目" />
        ) : (
          <div className="question-select-list">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="选择要添加的题目（可多选）"
              value={selectedQuestionIds}
              onChange={(value) => setSelectedQuestionIds(value)}
              optionLabelProp="label"
            >
              {availableQuestions.map((q) => (
                <Select.Option
                  key={q.id}
                  value={q.id!}
                  label={q.title}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>{q.title}</span>
                    <span style={{ color: '#888', fontSize: '12px' }}>
                      提交: {q.submitNum || 0} | 通过: {q.acceptedNum || 0}
                    </span>
                  </div>
                </Select.Option>
              ))}
            </Select>
            <div style={{ marginTop: 12, color: '#666', fontSize: '13px' }}>
              已选择 {selectedQuestionIds.length} 道题目
            </div>
          </div>
        )}
      </Modal>

      {/* 删除确认模态框 */}
      <Modal
        title="确认删除题单"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={() => {
          handleDeleteQuestionSet();
          setIsDeleteModalOpen(false);
        }}
        okText="删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除题单 <strong>{questionSet.title}</strong> 吗？</p>
        <p style={{ color: '#ff4d4f' }}>此操作将永久删除，无法恢复！</p>
      </Modal>
    </div>
  );
};

export default QuestionSetDetail;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Spin, Tag, Breadcrumb } from 'antd';
import { SaveOutlined, RollbackOutlined } from '@ant-design/icons';
import { getQuestionSetDetail, editQuestionSet } from '../../../../services/questionSetService';
import type { QuestionSetVO } from '../../../../generated/models/QuestionSetVO';
import '../../../../styles/uiuxpro.css';
import './QuestionSetEdit.css';

const { TextArea } = Input;

const QuestionSetEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questionSet, setQuestionSet] = useState<QuestionSetVO | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (id) {
      fetchQuestionSetDetail();
    }
  }, [id]);

  const fetchQuestionSetDetail = async () => {
    setLoading(true);
    try {
      const resp = await getQuestionSetDetail(id!);
      if (resp.code === 0 && resp.data) {
        const data = resp.data;
        setQuestionSet(data);
        setTags(data.tags || []);
        form.setFieldsValue({
          title: data.title,
          description: data.description
        });
      } else {
        message.error('获取题单信息失败');
      }
    } catch (error) {
      message.error('获取题单信息失败');
    } finally {
      setLoading(false);
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

  const handleSubmit = async (values: any) => {
    if (!id) return;
    setSubmitting(true);
    try {
      await editQuestionSet({
        id: parseInt(id),
        title: values.title,
        description: values.description,
        tags: tags
      });
      message.success('修改成功');
      navigate(`/question-set/${id}`);
    } catch (error: any) {
      if (error?.status === 403) {
        message.error('无权限修改');
      } else {
        message.error('修改失败');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="uiux-scope uiux-page qs-edit-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!questionSet) {
    return (
      <div className="uiux-scope uiux-page qs-edit-error">
        <h2>题单不存在</h2>
        <Button type="primary" onClick={() => navigate('/question-sets')}>
          返回题单列表
        </Button>
      </div>
    );
  }

  return (
    <div className="uiux-scope uiux-page qs-edit-container">
      <div className="qs-edit-header">
        <Breadcrumb items={[
          { title: <span onClick={() => navigate('/question-sets')} style={{ cursor: 'pointer' }}>题单列表</span> },
          { title: <span onClick={() => navigate(`/question-set/${id}`)} style={{ cursor: 'pointer' }}>{questionSet.title}</span> },
          { title: '编辑' }
        ]} />
        <div className="header-actions">
          <Button icon={<RollbackOutlined />} onClick={() => navigate(`/question-set/${id}`)} disabled={submitting}>
            返回详情
          </Button>
        </div>
      </div>

      <div className="qs-edit-content">
        <div className="edit-form-container uiux-card">
          <h2 className="form-title">编辑题单</h2>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              label="题单标题"
              name="title"
              rules={[
                { required: true, message: '请输入题单标题' },
                { max: 80, message: '标题不能超过80个字符' }
              ]}
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
                rows={4}
              />
            </Form.Item>

            <Form.Item label="标签">
              <div className="qs-tags-input">
                <Input
                  placeholder="添加标签（按回车）"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  maxLength={24}
                />
                <Button type="primary" onClick={addTag} disabled={!tagInput.trim()}>
                  添加
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="qs-tags-preview" style={{ marginTop: 12 }}>
                  {tags.map(tag => (
                    <Tag
                      key={tag}
                      closable
                      onClose={() => removeTag(tag)}
                      color="green"
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: '14px' }}>
                总长度限制: 8192字符（当前: {JSON.stringify(tags).length}）
              </div>
            </Form.Item>

            <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
              <div className="form-actions">
                <Button
                  type="default"
                  onClick={() => navigate(`/question-set/${id}`)}
                  disabled={submitting}
                  size="large"
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  icon={<SaveOutlined />}
                  size="large"
                >
                  保存修改
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>

        <div className="edit-tips">
          <div className="tips-card uiux-card">
            <h4>编辑提示</h4>
            <ul>
              <li>标题最多80个字符</li>
              <li>描述最多1024个字符</li>
              <li>标签按回车添加，点击×移除</li>
              <li>标签总长度不能超过8192字符</li>
              <li>修改后立即生效</li>
            </ul>
          </div>

          <div className="tips-card uiux-card">
            <h4>当前信息</h4>
            <div className="info-list">
              <div className="info-row">
                <span>题目数:</span>
                <strong>{questionSet.questionNum || 0}</strong>
              </div>
              <div className="info-row">
                <span>收藏数:</span>
                <strong>{questionSet.favourNum || 0}</strong>
              </div>
              <div className="info-row">
                <span>创建时间:</span>
                <strong>{new Date(questionSet.createTime || '').toLocaleDateString()}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionSetEdit;

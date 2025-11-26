import { useState, useEffect, useRef } from 'react';
import { QuestionControllerService } from '../../../../generated';
import type { QuestionVO } from '../../../../generated';
import { Link } from 'react-router-dom';
import { Spin } from 'antd';
import { SearchOutlined, SortAscendingOutlined, FilterOutlined, EyeOutlined, CommentOutlined, StarOutlined } from '@ant-design/icons';
import './Questions.css';

const Questions: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionVO[]>([]);
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [hasMore, setHasMore] = useState(true);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);
  const currentPageRef = useRef(1);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const fetchQuestions = async (pageNum = 1) => {
    setLoading(true);
    try {
      const resp = await QuestionControllerService.listQuestionVoByPageUsingPost({
        current: pageNum,
        pageSize: 20
      });
      if (resp.code === 0 && resp.data) {
        const records = resp.data.records || [];
        if (pageNum === 1) {
          setQuestions(records);
          // 提取所有标签
          const tagSet = new Set<string>();
          records.forEach(q => {
            q.tags?.forEach(tag => {
              if (!['简单', '中等', '困难'].includes(tag)) {
                tagSet.add(tag);
              }
            });
          });
          setAllTags(Array.from(tagSet));
        } else {
          setQuestions(prev => [...prev, ...records]);
        }
        
        const total = Number(resp.data.total) || 0;
        const size = Number(resp.data.size) || 20;
        const hasMore = pageNum * size < total;
        setHasMore(hasMore);
      }
    } catch (error) {
      console.error('获取题目列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    currentPageRef.current += 1;
    fetchQuestions(currentPageRef.current);
  };

  useEffect(() => {
    fetchQuestions(1);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          if (!loadingRef.current && hasMoreRef.current) {
            loadMore();
          }
        }
      },
      {
        root: null,
        rootMargin: '200px 0px',
        threshold: 0,
      }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const getDifficulty = (tags?: string[]): string => {
    if (!tags) return '简单';
    return tags.find(tag => ['简单', '中等', '困难'].includes(tag)) || '简单';
  };

  const getDifficultyClass = (difficulty: string): string => {
    const map: Record<string, string> = {
      '简单': 'qs-diff-easy',
      '中等': 'qs-diff-medium',
      '困难': 'qs-diff-hard'
    };
    return map[difficulty] || 'qs-diff-easy';
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = !searchText || q.title?.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = activeCategory === '全部' || q.tags?.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  const getAcceptRate = (q: QuestionVO): string => {
    if (!q.submitNum || q.submitNum === 0) return '0%';
    return `${((q.acceptedNum || 0) / q.submitNum * 100).toFixed(1)}%`;
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="qs-filter-section">
        <div className="qs-stat-row">
          <div className="qs-stat-item"><span className="qs-badge-dot"></span><strong>题目总数</strong> {questions.length}</div>
          <div className="qs-stat-item"><strong>已筛选</strong> {filteredQuestions.length}</div>
        </div>
        <div className="qs-chips">
          <div 
            className={`qs-chip ${activeCategory === '全部' ? 'qs-active' : ''}`}
            onClick={() => setActiveCategory('全部')}
          >
            全部
          </div>
          {allTags.slice(0, 15).map(tag => (
            <div 
              key={tag}
              className={`qs-chip ${activeCategory === tag ? 'qs-active' : ''}`}
              onClick={() => setActiveCategory(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div className="qs-question-panel">
        <div className="qs-question-toolbar">
          <div className="qs-toolbar-search">
            <SearchOutlined style={{color:'#8c8c8c', fontSize: 14}} />
            <input 
              type="text" 
              placeholder="搜索题目"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
          <div className="qs-toolbar-actions">
            <button className="qs-ghost-btn"><SortAscendingOutlined style={{fontSize: 14}} /></button>
            <button className="qs-filter-btn"><FilterOutlined style={{fontSize: 14, marginRight: 6}} />筛选</button>
          </div>
          <div className="qs-stat-item" style={{marginLeft:'auto'}}>
            {questions.filter(q => q.acceptedNum && q.acceptedNum > 0).length}/{questions.length} 已解答
          </div>
        </div>

        <div className="qs-question-list">
          {filteredQuestions.length === 0 && !loading ? (
            <div className="qs-empty-state">
              <div className="qs-empty-icon">📋</div>
              <div className="qs-empty-text">暂无符合条件的题目</div>
            </div>
          ) : (
            filteredQuestions.map((question) => {
              const difficulty = getDifficulty(question.tags);
              return (
                <Link 
                  key={question.id} 
                  to={`/oj/${question.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="qs-question">
                    <div className="qs-question-title">
                      <span className="qs-number">{question.id}.</span> {question.title}
                    </div>
                    <div className="qs-progress">{getAcceptRate(question)}</div>
                    <div className={`qs-difficulty ${getDifficultyClass(difficulty)}`}>
                      {difficulty}
                    </div>
                    <div className="qs-meta">
                      <span className="qs-bubble"><EyeOutlined style={{fontSize: 12}} /> {question.submitNum || 0}</span>
                      <span className="qs-bubble"><CommentOutlined style={{fontSize: 12}} /> {question.favourNum || 0}</span>
                      <div className="qs-star"><StarOutlined style={{fontSize: 14}} /></div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      <div ref={loadMoreRef} style={{ padding: '24px 0', textAlign: 'center' }}>
        {loading && <Spin size="large" tip="加载中..." />}
        {!loading && hasMore && <div style={{ color: '#bfbfbf', fontSize: 14 }}>上滑加载更多</div>}
        {!loading && !hasMore && filteredQuestions.length > 0 && <div style={{ color: '#bfbfbf', fontSize: 14 }}>已经到底啦</div>}
      </div>
    </div>
  );
};

export default Questions;

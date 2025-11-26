import { useState, useEffect } from 'react';
import { Input, Tag, Space } from 'antd';
import { Link } from 'react-router-dom';
import { QuestionControllerService } from '../../../generated';
import type { QuestionVO } from '../../../generated';
import './QuestionList.css';

interface QuestionListProps {}

const QuestionList: React.FC<QuestionListProps> = () => {
  const [questions, setQuestions] = useState<QuestionVO[]>([]);
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部题目');
  const [activeTab, setActiveTab] = useState('题库');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const resp = await QuestionControllerService.listQuestionVoByPageUsingPost({
        current: 1,
        pageSize: 50
      });
      if (resp.code === 0 && resp.data) {
        setQuestions(resp.data.records || []);
      }
    } catch (error) {
      console.error('获取题目列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficulty = (tags?: string[]): string => {
    if (!tags) return '简单';
    return tags.find(tag => ['简单', '中等', '困难'].includes(tag)) || '简单';
  };

  const getDifficultyClass = (difficulty: string): string => {
    const map: Record<string, string> = {
      '简单': 'diff-easy',
      '中等': 'diff-medium',
      '困难': 'diff-hard'
    };
    return map[difficulty] || 'diff-easy';
  };

  const filteredQuestions = questions.filter(q => 
    !searchText || q.title?.toLowerCase().includes(searchText.toLowerCase())
  );

  const getAcceptRate = (q: QuestionVO): string => {
    if (!q.submitNum || q.submitNum === 0) return '0%';
    return `${((q.acceptedNum || 0) / q.submitNum * 100).toFixed(1)}%`;
  };

  return (
    <div className="app-shell">
      <aside className="sidebar panel">
        <div className="brand">
          <div className="brand-icon">力</div>
          <span>题库</span>
        </div>

        <div className="nav-group">
          <div className="nav-label">导航</div>
          <div className="nav-item active">
            <div className="dot"></div>
            <span>题目</span>
          </div>
          <div className="nav-item">
            <div className="ico">⚡</div>
            <span>探险模式</span>
          </div>
          <div className="nav-item">
            <div className="ico">📚</div>
            <span>学习计划</span>
          </div>
        </div>

        <div className="nav-divider"></div>

        <div className="nav-group">
          <div className="nav-label">我的清单</div>
          <div className="nav-item">
            <div className="ico">★</div>
            <span>我的收藏</span>
          </div>
          <div className="nav-item">
            <div className="ico">⏳</div>
            <span>need think twice</span>
          </div>
          <div className="nav-item">
            <div className="ico">☑</div>
            <span>TODO</span>
          </div>
        </div>
        <div className="footer-note">暗色主题 · 题目列表</div>
      </aside>

      <div className="main">
        <div className="topbar panel">
          <div className="tabs">
            {['学习', '题库', '竞赛', '讨论', '求职', '商城'].map(tab => (
              <div 
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
          <div className="search-box">
            <span style={{color:'#7f90ab'}}>🔍</span>
            <input type="text" placeholder="搜索" />
            <span style={{color:'#7f90ab'}}>⏻</span>
            <span style={{color:'#7f90ab'}}>⚙</span>
          </div>
        </div>

        <div className="hero-row">
          <div className="hero-card" style={{background: 'linear-gradient(135deg, #0c2738, #12304a)'}}>
            <div className="flag">NEW</div>
            <div className="title">算法探险 · 解锁一场史诗级的冒险</div>
            <div className="desc">提升解题实力，收集宝箱奖励，迈向算法达人。每日签到即可领积分。</div>
            <span className="pill ghost">立即体验</span>
            <div className="accent-squares"></div>
          </div>
          <div className="hero-card" style={{background: 'linear-gradient(135deg, #0f1022, #1b1f36)'}}>
            <div className="flag" style={{background:'#6bd2ff', color:'#0b0e14'}}>专题</div>
            <div className="title">7 周算法特训</div>
            <div className="desc">提升竞争力｜精讲提升能力｜冲刺求职面试。每日一练，建立节奏。</div>
            <span className="pill ghost">开练</span>
            <div className="accent-squares"></div>
          </div>
          <div className="hero-card" style={{background: 'linear-gradient(135deg, #271330, #3b1b3f)'}}>
            <div className="flag" style={{background:'#ff9aca', color:'#231020'}}>Java</div>
            <div className="title">从 BUG 入手：Java 基础修炼</div>
            <div className="desc">实战视角快速掌握基础语法与调试技巧，专为校招和转岗场景设计。</div>
            <span className="pill ghost">加入学习</span>
            <div className="accent-squares"></div>
          </div>
        </div>

        <div className="panel filter-panel">
          <div className="stat"><span className="badge-dot"></span><strong>数量</strong> {questions.length}</div>
          <div className="stat"><span className="badge-dot" style={{background:'#6bd2ff', boxShadow:'0 0 0 4px rgba(107,210,255,0.12)'}}></span><strong>字符串</strong> 904</div>
          <div className="stat"><span className="badge-dot" style={{background:'#ff8c8c', boxShadow:'0 0 0 4px rgba(255,140,140,0.12)'}}></span><strong>哈希表</strong> 825</div>
          <div className="stat"><span className="badge-dot" style={{background:'#7ce7b7', boxShadow:'0 0 0 4px rgba(124,231,183,0.12)'}}></span><strong>动态规划</strong> 700</div>
          <div className="chips">
            {['全部题目', '算法', '数据库', 'Shell', '多线程', 'JavaScript', 'pandas'].map(cat => (
              <div 
                key={cat}
                className={`chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        <div className="question-panel">
          <div className="question-toolbar">
            <div className="toolbar-search">
              <span style={{color:'#7d8ba7'}}>🔍</span>
              <input 
                type="text" 
                placeholder="搜索题目"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
            </div>
            <div className="toolbar-actions">
              <button className="ghost-btn">↑↓</button>
              <button className="filter-btn">⚙ 筛选</button>
            </div>
            <div className="stat" style={{marginLeft:'auto'}}>
              {questions.filter(q => q.acceptedNum && q.acceptedNum > 0).length}/{questions.length} 已解答
            </div>
          </div>

          <div className="question-list">
            {filteredQuestions.map((question, index) => {
              const difficulty = getDifficulty(question.tags);
              return (
                <Link 
                  key={question.id || index} 
                  to={`/oj/${question.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="question">
                    <div className="title">
                      <span className="number">{question.id}.</span> {question.title}
                    </div>
                    <div className="progress">{getAcceptRate(question)}</div>
                    <div className={`difficulty ${getDifficultyClass(difficulty)}`}>
                      {difficulty}
                    </div>
                    <div className="meta">
                      <span className="bubble">👁 {question.submitNum || 0}</span>
                      <span className="bubble">💬 {question.favourNum || 0}</span>
                      <div className="star">★</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="right-rail">
        <div className="calendar panel">
          <header>
            <div>每日一题</div>
            <div>本月</div>
          </header>
          <div className="calendar-grid weekdays">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>
          <div className="calendar-grid">
            <div className="day muted">30</div><div className="day">1</div><div className="day">2</div><div className="day">3</div><div className="day">4</div><div className="day">5</div><div className="day">6</div>
            <div className="day">7</div><div className="day">8</div><div className="day">9</div><div className="day">10</div><div className="day">11</div><div className="day">12</div><div className="day">13</div>
            <div className="day">14</div><div className="day">15</div><div className="day">16</div><div className="day">17</div><div className="day">18</div><div className="day">19</div><div className="day">20</div>
            <div className="day">21</div><div className="day">22</div><div className="day active">25</div><div className="day">26</div><div className="day">27</div><div className="day">28</div><div className="day">29</div>
          </div>
        </div>

        <div className="challenge panel">
          <div className="badge">Plus 会员挑战</div>
          <div className="timeline">
            <div className="step">W1</div>
            <div className="step">W2</div>
            <div className="step">W3</div>
            <div className="step active">W4</div>
            <div className="step">W5</div>
          </div>
        </div>

        <div className="trending panel">
          <div className="stat" style={{justifyContent: 'space-between', width: '100%'}}>
            <strong>热门企业题库</strong>
            <span style={{color: 'var(--muted)'}}>⇅</span>
          </div>
          <div className="trend-input">
            <span style={{color:'#7f90ab'}}>🔍</span>
            <input type="text" placeholder="输入企业名称" />
          </div>
          <div className="trend-tags">
            <div className="trend">微软 Microsoft <span className="count">722</span></div>
            <div className="trend">字节跳动 <span className="count">1455</span></div>
            <div className="trend">谷歌 Google <span className="count">1248</span></div>
            <div className="trend">Meta <span className="count">666</span></div>
            <div className="trend">华为 <span className="count">321</span></div>
            <div className="trend">亚马逊 <span className="count">761</span></div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default QuestionList;

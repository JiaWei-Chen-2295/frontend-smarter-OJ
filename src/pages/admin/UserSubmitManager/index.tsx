import { useRef } from "react";
import { ProTable, ProColumns, ActionType } from "@ant-design/pro-components";
import { QuestionControllerService, QuestionSubmit, QuestionSubmitQueryRequest } from "../../../../generated";
import { Tag, Tooltip, Button, message } from "antd";
import { EyeOutlined } from "@ant-design/icons";

// 定义提交状态对应的文字和颜色
const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: "待判题", color: "default" },
  1: { text: "判题中", color: "processing" },
  2: { text: "判题成功", color: "success" },
  3: { text: "判题失败", color: "error" },
};

// 定义 judgeInfo message 对应的文字和颜色
const judgeMessageMap: Record<string, { text: string; color: string }> = {
  "成功": { text: "通过", color: "success" },
  "Accepted": { text: "通过", color: "success" },
  "答案错误": { text: "答案错误", color: "error" },
  "Wrong Answer": { text: "答案错误", color: "error" },
  "内存超限": { text: "内存超限", color: "warning" },
  "Memory Limit Exceeded": { text: "内存超限", color: "warning" },
  "时间超限": { text: "超时", color: "warning" },
  "Time Limit Exceeded": { text: "超时", color: "warning" },
  "编译错误": { text: "编译错误", color: "error" },
  "Compilation Error": { text: "编译错误", color: "error" },
  "运行时错误": { text: "运行错误", color: "error" },
  "Runtime Error": { text: "运行错误", color: "error" },
};

function UserSubmitManager() {
  const actionRef = useRef<ActionType>();

  // 格式化编程语言显示
  const formatLanguage = (language?: string) => {
    if (!language) return "-";
    const languageMap: Record<string, string> = {
      java: "Java",
      cpp: "C++",
      python: "Python",
      javascript: "JavaScript",
      typescript: "TypeScript",
      go: "Go",
      rust: "Rust",
    };
    return languageMap[language.toLowerCase()] || language;
  };

  // 解析 judgeInfo 字符串为对象
  const parseJudgeInfo = (judgeInfoStr?: string) => {
    if (!judgeInfoStr) return null;
    try {
      return JSON.parse(judgeInfoStr);
    } catch (e) {
      console.error("解析判题信息失败:", e);
      return null;
    }
  };

  // 渲染判题结果标签
  const renderJudgeMessage = (judgeInfoStr?: string) => {
    const judgeInfo = parseJudgeInfo(judgeInfoStr);
    if (!judgeInfo || !judgeInfo.message) return <Tag>未知</Tag>;

    const message = judgeInfo.message;
    const mapInfo = judgeMessageMap[message] || { text: message, color: "default" };

    return (
      <Tag color={mapInfo.color}>
        {mapInfo.text}
      </Tag>
    );
  };

  // 格式化时间和内存显示
  const formatPerformance = (judgeInfoStr?: string) => {
    const judgeInfo = parseJudgeInfo(judgeInfoStr);
    if (!judgeInfo) return "-";

    const { time, memory } = judgeInfo;
    if (!time && !memory) return "-";

    const timeStr = time !== undefined ? `${time} ms` : "-";
    const memoryStr = memory !== undefined ? `${Math.round(memory / 1024)} MB` : "-";

    return `${timeStr} / ${memoryStr}`;
  };

  // 定义 ProTable 列
  const columns: ProColumns<QuestionSubmit>[] = [
    { 
      title: "提交ID", 
      dataIndex: "id", 
      width: 80,
      search: true,
      sorter: true
    },
    { 
      title: "题目ID",  
      dataIndex: "questionId", 
      width: 80,
      search: true,
      sorter: true
    },
    { 
      title: "用户ID", 
      dataIndex: "userId", 
      width: 80,
      search: true,
      sorter: true
    },
    {
      title: "编程语言",
      dataIndex: "language",
      width: 100,
      search: true,
      sorter: true,
      render: (_, record) => formatLanguage(record.language),
      valueEnum: {
        java: { text: "Java" },
        cpp: { text: "C++" },
        python: { text: "Python" },
        javascript: { text: "JavaScript" },
        typescript: { text: "TypeScript" },
        go: { text: "Go" },
        rust: { text: "Rust" },
      }
    },
    {
      title: "提交状态",
      dataIndex: "status",
      width: 100,
      search: true,
      sorter: true,
      valueEnum: {
        0: { text: "待判题", status: "default" },
        1: { text: "判题中", status: "processing" },
        2: { text: "判题成功", status: "success" },
        3: { text: "判题失败", status: "error" },
      },
      render: (_, record) => {
        const status = record.status || 0;
        const mapInfo = statusMap[status];
        return <Tag color={mapInfo.color}>{mapInfo.text}</Tag>;
      },
    },
    {
      title: "判题结果",
      dataIndex: "judgeInfo",
      width: 120,
      search: true,
      render: (_, record) => renderJudgeMessage(record.judgeInfo),
    },
    {
      title: "执行性能",
      dataIndex: "performance",
      width: 150,
      search: false,
      render: (_, record) => formatPerformance(record.judgeInfo),
      renderText: (_, record) => formatPerformance(record.judgeInfo),
    },
    {
      title: "提交时间",
      dataIndex: "createTime",
      width: 180,
      valueType: "dateTime",
      search: true,
      sorter: true,
    },
    {
      title: "操作",
      valueType: "option",
      width: 100,
      render: (_, record) => [
        <Tooltip title="查看代码" key="view">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              // 实现代码查看逻辑
              message.info(`查看提交ID: ${record.id} 的代码`);
            }}
          >
            查看
          </Button>
        </Tooltip>,
      ],
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <ProTable<QuestionSubmit>
        headerTitle="用户提交管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        request={async (params, sorter, filter) => {
          console.log('查询参数:', params, sorter, filter);
          try {
            // 构建查询参数
            const queryParams: QuestionSubmitQueryRequest = {
              current: params.current,
              pageSize: params.pageSize,
              questionId: params.questionId,
              userId: params.userId,
              language: params.language,
              status: params.status,
              sortField: Object.keys(sorter)[0],
              sortOrder: Object.values(sorter)[0] === 'ascend' ? 'asc' : 'desc',
            };

            // 调用获取所有提交的接口
            const resp = await QuestionControllerService.listQuestionSubmitByPageUsingPost(queryParams);
            
            if (resp.code === 0 && resp.data) {
              return {
                data: resp.data.records || [],
                success: true,
                total: resp.data.total || 0,
              };
            }
            return {
              data: [],
              success: false,
              total: 0,
            };
          } catch (error) {
            console.error("获取提交列表失败:", error);
            message.error("获取提交列表失败");
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
      />
    </div>
  );
}

export default UserSubmitManager;

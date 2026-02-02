import { useRef, useState } from "react";
import { ProTable, ProColumns, ActionType } from "@ant-design/pro-components";
import { QuestionControllerService, QuestionSubmit, QuestionSubmitQueryRequest } from "../../../../generated";
import { Button, Descriptions, message, Modal, Space, Tabs, Tag, Tooltip, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

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
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<QuestionSubmit>();
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get("userId");

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

  const getMonacoLanguage = (language?: string) => {
    if (!language) return "plaintext";
    const normalized = language.toLowerCase();
    if (normalized === "c++") return "cpp";
    if (normalized === "golang") return "go";
    return normalized;
  };

  const parseNumberLike = (value: unknown) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
    return undefined;
  };

  const toPrettyText = (value: unknown) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "string") return value;
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  };

  const parseJudgeInfo = (judgeInfo: unknown) => {
    if (judgeInfo === null || judgeInfo === undefined) return null;
    if (typeof judgeInfo === "string") {
      try {
        return JSON.parse(judgeInfo);
      } catch (e) {
        console.error("解析判题信息失败:", e);
        return null;
      }
    }
    if (typeof judgeInfo === "object") return judgeInfo as any;
    return null;
  };

  const normalizeJudgeInfo = (judgeInfo: unknown) => {
    const parsed: any = parseJudgeInfo(judgeInfo);
    if (!parsed) return null;

    const rawMessage = parsed.message;
    const message =
      typeof rawMessage === "string"
        ? rawMessage
        : rawMessage && typeof rawMessage === "object" && typeof rawMessage.message === "string"
          ? rawMessage.message
          : undefined;

    const time =
      parseNumberLike(parsed.time) ??
      (rawMessage && typeof rawMessage === "object" ? parseNumberLike((rawMessage as any).time) : undefined);

    const memory =
      parseNumberLike(parsed.memory) ??
      (rawMessage && typeof rawMessage === "object" ? parseNumberLike((rawMessage as any).memory) : undefined);

    return {
      message,
      time,
      memory,
      raw: parsed,
    };
  };

  const mapJudgeMessage = (messageText: string) => {
    const trimmed = messageText.trim();
    for (const key of Object.keys(judgeMessageMap)) {
      if (trimmed === key || trimmed.startsWith(key) || trimmed.includes(key)) {
        return judgeMessageMap[key];
      }
    }
    if (/compilation\s*error/i.test(trimmed)) return { text: "编译错误", color: "error" };
    if (/wrong\s*answer/i.test(trimmed)) return { text: "答案错误", color: "error" };
    if (/time\s*limit/i.test(trimmed)) return { text: "超时", color: "warning" };
    if (/memory\s*limit/i.test(trimmed)) return { text: "内存超限", color: "warning" };
    if (/runtime\s*error/i.test(trimmed)) return { text: "运行错误", color: "error" };
    if (/accepted/i.test(trimmed)) return { text: "通过", color: "success" };
    return { text: trimmed, color: "default" };
  };

  // 渲染判题结果标签
  const renderJudgeMessage = (judgeInfo?: unknown) => {
    const info = normalizeJudgeInfo(judgeInfo);
    const messageText = info?.message;
    if (!messageText) return <Tag>未知</Tag>;

    const mapInfo = mapJudgeMessage(messageText);

    return (
      <Tag color={mapInfo.color}>
        {typeof mapInfo.text === "string" ? mapInfo.text : toPrettyText(mapInfo.text)}
      </Tag>
    );
  };

  // 格式化时间和内存显示
  const formatPerformance = (judgeInfo?: unknown) => {
    const info = normalizeJudgeInfo(judgeInfo);
    if (!info) return "-";
    const { time, memory } = info;
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
      sorter: true,
      render: (text) => <Button type="link" onClick={() => (window.location.href = `/oj/${text}`)}>{text}</Button>
    },
    {
      title: "用户ID",
      dataIndex: "userId",
      width: 80,
      search: true,
      sorter: true,
      render: (text) => <Button type="link" onClick={() => (window.location.href = `/profile?userId=${text}`)}>{text}</Button>
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
              setCurrentRow(record);
              setDetailModalVisible(true);
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
        params={{
          userId: initialUserId ? Number(initialUserId) : undefined,
        }}
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
      <Modal
        title="提交详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setDetailModalVisible(false)}>关闭</Button>
          </Space>
        }
        width={900}
      >
        {(() => {
          if (!currentRow) return null;
          const judgeInfo = normalizeJudgeInfo(currentRow.judgeInfo);
          const codeText = typeof currentRow.code === "string" ? currentRow.code : toPrettyText(currentRow.code);
          const outputText = typeof currentRow.outputResult === "string" ? currentRow.outputResult : toPrettyText(currentRow.outputResult);
          const judgeMessageText = judgeInfo?.message || "";
          const judgeJsonText = judgeInfo?.raw ? toPrettyText(judgeInfo.raw) : toPrettyText(currentRow.judgeInfo);
          const editorOptions = {
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on" as const,
            scrollBeyondLastLine: false,
            wordWrap: "on" as const,
            automaticLayout: true,
          };
          return (
            <>
              <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="提交ID">
                  <Typography.Text copyable>{currentRow.id}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="题目ID">
                  <Typography.Text copyable>{currentRow.questionId}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="用户ID">
                  <Typography.Text copyable>{currentRow.userId}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="语言">{currentRow.language || "-"}</Descriptions.Item>
                <Descriptions.Item label="状态">{currentRow.status ?? "-"}</Descriptions.Item>
                <Descriptions.Item label="是否删除">{currentRow.isDelete ?? "-"}</Descriptions.Item>
                <Descriptions.Item label="创建时间">{currentRow.createTime || "-"}</Descriptions.Item>
                <Descriptions.Item label="更新时间">{currentRow.updateTime || "-"}</Descriptions.Item>
                <Descriptions.Item label="判题结果">
                  {renderJudgeMessage(currentRow.judgeInfo)}
                </Descriptions.Item>
                <Descriptions.Item label="性能">
                  {formatPerformance(currentRow.judgeInfo)}
                </Descriptions.Item>
                <Descriptions.Item label="详情" span={2}>
                  <Tabs
                    defaultActiveKey="code"
                    items={[
                      {
                        key: "code",
                        label: "代码",
                        children: (
                          <div style={{ border: "1px solid #f0f0f0", borderRadius: 8, overflow: "hidden" }}>
                            <Editor
                              height="320px"
                              language={getMonacoLanguage(currentRow.language)}
                              value={codeText}
                              options={editorOptions}
                            />
                          </div>
                        ),
                      },
                      {
                        key: "judge-message",
                        label: "判题信息",
                        children: (
                          <div style={{ border: "1px solid #f0f0f0", borderRadius: 8, overflow: "hidden" }}>
                            <Editor
                              height="220px"
                              language="plaintext"
                              value={judgeMessageText || "-"}
                              options={editorOptions}
                            />
                          </div>
                        ),
                      },
                      {
                        key: "judge-json",
                        label: "判题 JSON",
                        children: (
                          <div style={{ border: "1px solid #f0f0f0", borderRadius: 8, overflow: "hidden" }}>
                            <Editor
                              height="220px"
                              language="json"
                              value={judgeJsonText}
                              options={editorOptions}
                            />
                          </div>
                        ),
                      },
                      {
                        key: "output",
                        label: "输出结果",
                        children: (
                          <div style={{ border: "1px solid #f0f0f0", borderRadius: 8, overflow: "hidden" }}>
                            <Editor
                              height="220px"
                              language="json"
                              value={outputText}
                              options={editorOptions}
                            />
                          </div>
                        ),
                      },
                      {
                        key: "raw",
                        label: "原始数据",
                        children: (
                          <div style={{ border: "1px solid #f0f0f0", borderRadius: 8, overflow: "hidden" }}>
                            <Editor
                              height="260px"
                              language="json"
                              value={toPrettyText(currentRow)}
                              options={editorOptions}
                            />
                          </div>
                        ),
                      },
                    ]}
                  />
                </Descriptions.Item>
              </Descriptions>
            </>
          );
        })()}
      </Modal>
    </div>
  );
}

export default UserSubmitManager;

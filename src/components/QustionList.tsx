import React from "react";
import { ProTable } from "@ant-design/pro-components";
import { QuestionControllerService } from "../../generated";
import { Tag } from "antd";

// Define the type for the data records
type DataType = {
  id: number;
  title: string;
  content: string;
  submitNum: number;
  acceptedNum: number;
  tags: string[];
  userId: number;
  favourNum: number;
  judgeConfig: {
    timeLimit: number;
    memoryLimit: number;
    stackLimit: number;
  };
  createTime: string;
};

export default function QuestionList() {
  // Define columns for ProTable
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "题目标题", dataIndex: "title", key: "title" },
    { title: "内容", dataIndex: "content", key: "content" },
    { title: "提交次数", dataIndex: "submitNum", key: "submitNum" },
    { title: "通过次数", dataIndex: "acceptedNum", key: "acceptedNum" },
    { title: "标签", dataIndex: "tags", key: "tags", render: (tags: string[]) => tags.map((tag) => <Tag>{tag}</Tag>) },
    { title: "提供者", dataIndex: "userId", key: "userId" },
    { title: "点赞数", dataIndex: "favourNum", key: "favourNum" },
    {
      title: "判题配置",
      dataIndex: "judgeConfig",
      key: "judgeConfig",
      render: (judgeConfig: { timeLimit: number; memoryLimit: number; stackLimit: number }) =>
        `Time Limit: ${judgeConfig.timeLimit}, Memory Limit: ${judgeConfig.memoryLimit}, Stack Limit: ${judgeConfig.stackLimit}`,
    },
    { title: "创建时间", dataIndex: "createTime", key: "createTime" },
  ];

  return (
    <div>
      <ProTable<DataType>
        columns={columns}
        request={async (params) => {
          try {
            // Fetch data from the backend
            const res = await QuestionControllerService.listQuestionVoByPageUsingPost({
              pageSize: params.pageSize || 10,
              current: params.current || 1,
            });

            // Return data in the required format
            return {
              data: res?.data?.records || [],
              success: true,
              total: res?.data?.total || 0,
            };
          } catch (error) {
            console.error("Error fetching data:", error);
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
        search={false} // Disable the search bar if not needed
        options={false} // Disable additional options like density, full screen, etc.
      />
    </div>
  );
}
import { getKeyValue, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { BaseResponse_Page_QuestionVO_, QuestionControllerService, QuestionVO } from "../../generated";
import React from "react";

export default function QuestionList() {
   
    const [page, setPage] = React.useState(1);

    const [data, setData] = React.useState<BaseResponse_Page_QuestionVO_ | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const rowsPerPage = 10;

    QuestionControllerService.listQuestionVoByPageUsingPost({
        pageSize: rowsPerPage,
        current: page,
    }).then((res: BaseResponse_Page_QuestionVO_) => {
        setData(res?.data);
        setIsLoading(true)
    })
  
   
    const pages = React.useMemo(() => {
      return data?.data?.total ? Math.ceil(data?.total / rowsPerPage) : 0;
    }, [data?.total, rowsPerPage]);
  
    const loadingState = isLoading || data?.data?.records?.length === 0 ? "loading" : "idle";
  

   
    return (
        <div>
             <Table
      aria-label="Example table with client async pagination"
      bottomContent={
        pages > 0 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        ) : null
      }
    >
      <TableHeader>
        <TableColumn key="name">Name</TableColumn>
        <TableColumn key="height">Height</TableColumn>
        <TableColumn key="mass">Mass</TableColumn>
        <TableColumn key="birth_year">Birth year</TableColumn>
        {
            data?.records?.map((question) => (
                <TableColumn key={question.id}>{question.title}</TableColumn>
            ))
        }
      </TableHeader>
      <TableBody
        items={data?.data?.records ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
      >
        {(item) => (
          <TableRow key={item?.id}>
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
        </div>
    )
}

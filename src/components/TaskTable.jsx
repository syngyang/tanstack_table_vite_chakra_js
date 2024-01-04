import { useState } from "react";
import { Box, Button, ButtonGroup, Icon, Text } from "@chakra-ui/react";
import {
  flexRender, 
  getCoreRowModel, 
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import DATA from '../data';
import EditableCell from "./EditableCell";
import StatusCell from "./StatusCell";
import DateCell from "./DateCell";
import Filters from "./Filters";
import SortIcon from "./icons/SortIcon";

const columns = [
  {
    accessorKey: 'task',
    header: 'Task',
    size: 225,
    // cell: (props)=><p>{props.getValue()}</p>
    cell: EditableCell,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: 'status',
    header: 'Status',
    // cell: (props)=><p>{props.getValue()?.name}</p>
    cell: StatusCell,
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: (row, columnId, filterStatuses) => {
      if (filterStatuses.length === 0) return true;
      const status = row.getValue(columnId);
      return filterStatuses.includes(status?.id);
    },
  },
  {
    accessorKey: 'due',
    header: 'Due',
    // cell: (props)=><p>{props.getValue()?.toLocaleTimeString()}</p>
    cell: DateCell,
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    size: 225,
    // cell: (props)=><p>{props.getValue()}</p>
    cell: EditableCell,
  },
];

const TaskTable = () => {
  const [data, setData] = useState(DATA);
  const [columnFilters, setColumnFilters] = useState([
    {
      // id: "task",
      // value:"Add"
    }
  ])
  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      // 3줄만 보이게 하려면, 아래처럼 . 그러나 기존 built-in, 즉 화살표 버튼(10줄용)은 수정되어야 한다.
      // pagination:{
      //   pageSize:3,
      //   pageIndex:0,
      // }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
    meta: {
      updateData: (rowIndex, columnId, value) => 
        { setData((prev) =>prev.map(
          (row,index)=> (index === rowIndex 
            ? { ...prev[rowIndex], [columnId]: value,} 
            : row))) 
        }
    }
  })
  console.log('table : ',table)
  // console.log('table.options : ',table.options)
  console.log('data : ',data)
  // console.log('table.getRowModel :',table.getRowModel())
  return ( 
  <Box>
    <Filters 
      columnFilters={columnFilters} 
      setColumnFilters={setColumnFilters}
    />
    <Box className="table" w={table.getTotalSize()}>
      {table.getHeaderGroups().map(headerGroup =>
        <Box className="tr" key={headerGroup.id}>
          {headerGroup.headers.map(header=>
            <Box className="th" w={header.getSize()} key={header.id}>
              {header.column.columnDef.header}
              {header.column.getCanSort() && (
                  <Icon
                    as={SortIcon}
                    mx={3}
                    fontSize={14}
                    onClick={header.column.getToggleSortingHandler()}
                  />
                )}
                {
                  {
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted()]
                }
              <Box 
                onMouseDown={header.getResizeHandler()}
                onTouchStart={header.getResizeHandler()}
                className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}

              />
            </Box>)}
        </Box>
      )}
      {table.getRowModel().rows.map(row=>
        <Box className="tr" key={row.id}>
          {row.getVisibleCells().map(cell=> 
            <Box className="td" w={cell.column.getSize()} key={cell.id}>
              {
                flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )
              }
            </Box>
          )}
        </Box>
      )}
    </Box>
    <br />
      <Text mb={2}>
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </Text>
      <ButtonGroup size="sm" isAttached variant="outline">
        <Button
          onClick={() => table.previousPage()}
          isDisabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </Button>
        <Button
          onClick={() => table.nextPage()}
          isDisabled={!table.getCanNextPage()}
        >
          {">"}
        </Button>
      </ButtonGroup>
  </Box>
  );
};
export default TaskTable;

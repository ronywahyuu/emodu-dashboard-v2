"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartBarIcon,
  ChevronDownIcon,
  Download,
  MoreHorizontal,
  SortAscIcon,
  UserCog,
} from "lucide-react";
import Link from "next/link";
// import { MeetingsType, ParticipantType } from "@/lib/api/types";
import { useModalStore } from "@/hooks/use-modal-store";
import { MeetingData } from "@/hooks/api/meeting-service-hooks";
import ActionTooltip from "@/components/action-tooltip";
import {
  RecognitionsDetail,
  useToggleMonitoring,
} from "@/hooks/api/recognition-service-hooks";
import { Label } from "@/components/ui/label";
// import { RecognitionsDetail } from "@/lib/api/types.recognition";
// import ActionTooltip from "../action-tooltip";
export interface UserParticipant {
  id: string;
  fullname: string;
  email: string;
  avatar: string;
  joinAt: string;
  leftAt: string;
  status: number;
  leave_count: number;
  user: {
    id: string;
    fullname: string;
    email: string;
    avatar: string;
  };
}

const fuzzyFilter: FilterFn<UserParticipant> = (
  row,
  columnId,
  filterValue: string,
) => {
  console.log("row", row);
  const searchValue = filterValue.toLowerCase();

  // Search in user object
  if (row.original.user) {
    if (
      row.original.user.fullname.toLowerCase().includes(searchValue) ||
      row.original.user.email.toLowerCase().includes(searchValue)
    ) {
      return true;
    }
  }

  // Search in join date
  if (row.original.joinAt) {
    if (
      new Date(row.original.joinAt)
        .toLocaleString()
        .toLowerCase()
        .includes(searchValue)
    ) {
      return true;
    }
  }

  return false;
};

export default function Participants({
  participants,
  recognitionDetail,
  meetingData,
}: {
  participants: UserParticipant[];
  meetingData: MeetingData;
  recognitionDetail: RecognitionsDetail;
}) {
  const data = participants;
  const toggleMonitoring = useToggleMonitoring();
  const { onOpen } = useModalStore();
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusOn, setStatusOn] = React.useState(true);

  const handleToggleMonitoring = async () => {
    setStatusOn((prev) => !prev);
    await toggleMonitoring.mutateAsync({
      meetingCode: meetingData.meetingCode,
      isMonitoring: statusOn,
    });
  };

  const getActionsColumn = (): ColumnDef<UserParticipant> => ({
    header: "Actions",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const classId = meetingData?.classId || "";
      const meetingId = meetingData?.id || "";
      const participantId = row.original.user.id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link
                href={`/class/${classId}/m/${meetingId}/participant/${participantId}`}
                className="flex items-center"
              >
                <ChartBarIcon className="mr-2 h-4 w-4" />
                View Emotions Detail
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center cursor-pointer">
              <UserCog className="h-4 w-4" />
              Assign as Co-Teacher
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  });

  const columnsData: ColumnDef<UserParticipant>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "fullname",
      // header: "Fullname",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fullname
            <SortAscIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.original.user.fullname}</div>
      ),
      enableColumnFilter: true,
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <SortAscIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.original.user.email}</div>
      ),
      enableColumnFilter: true,
      enableSorting: true,
    },
    {
      accessorKey: "joinAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Join
            <SortAscIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">
          {new Date(row.original.joinAt).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "Status",
      header: () => (
        <StatusHeader
          isOn={statusOn}
          toggle={handleToggleMonitoring}
          isLoading={toggleMonitoring.isPending}
        />
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        const leaveCount = row.original.leave_count;

        if (status === 1) {
          return (
            <div className="flex items-center gap-2">
              <span className="text-green-500">🟢</span>
              <span>Active</span>
              {leaveCount > 0 && (
                <ActionTooltip label={`Terdeteksi Keluar : ${leaveCount}`}>
                  <Label>({leaveCount})</Label>
                </ActionTooltip>
              )}
            </div>
          );
        } else if (status === 0) {
          return (
            <div className="flex items-center gap-2">
              <span className="text-red-500">🔴</span>
              <span>Inactive</span>
              {leaveCount > 0 && (
                <ActionTooltip label={`Terdeteksi Keluar : ${leaveCount}`}>
                  <Label>({leaveCount})</Label>
                </ActionTooltip>
              )}
            </div>
          );
        } else {
          return (
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">🟡</span>
              <span>Pending</span>
            </div>
          );
        }
      },
    },
  ];

  const columns: ColumnDef<UserParticipant>[] = [
    // ... other columns
    ...columnsData,
    getActionsColumn(),
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      // fuzzyFilter,
      fuzzyFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div className="w-full">
      <div className="flex  items-center py-4">
        <Input
          placeholder="Search all columns..."
          value={globalFilter}
          onChange={(event) => {
            setGlobalFilter(event.target.value);
          }}
          className="max-w-sm"
        />
        <ActionTooltip label="Export meeting data">
          <Button
            className="ml-auto mr-2"
            onClick={() => onOpen("exportMeetingData", recognitionDetail)}
          >
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </ActionTooltip>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

const StatusHeader: React.FC<{
  isOn: boolean;
  toggle: () => void;
  isLoading: boolean;
}> = ({ isOn, toggle, isLoading }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative inline-block">
      <Button
        variant="ghost"
        onClick={() => setOpen(!open)}
        className="flex items-center"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Status"}
        <SortAscIcon className="ml-2 h-4 w-4" />
      </Button>

      {open && (
        <div className="absolute left-0 mt-2 bg-white border rounded-md shadow-md p-2 z-20">
          <div className="flex items-center space-x-2">
            <Label htmlFor="status-toggle">On/Off</Label>
            <Button
              id="status-toggle"
              size="sm"
              variant={isOn ? "default" : "outline"}
              onClick={toggle}
            >
              {isOn ? "ON" : "OFF"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

export interface Requests {
    id?: number;
    numDocument: string;
    nameApplicant: string;
    amount: number;
    paymentDate: string;
    requestStatus: "aprovada" | "denegada";
    balanceStatus: "saldada" | "mora";
}

export interface DataItem {
    amount: number;
    balanceStatus: string;
    id: string;
    nameApplicant: string;
    numDocument: string;
    paimentDate: string;
    requestStatus: "saldada" | "mora";
}

export interface ColumnItem {
    name: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn<DataItem> | null;
    listOfFilter: NzTableFilterList;
    filterFn: NzTableFilterFn<DataItem> | null;
}
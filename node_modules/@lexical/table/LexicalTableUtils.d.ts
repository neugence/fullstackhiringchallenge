/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { TableMapType, TableMapValueType } from './LexicalTableSelection';
import type { PointType } from 'lexical';
import { LexicalNode } from 'lexical';
import { InsertTableCommandPayloadHeaders } from '.';
import { TableCellNode } from './LexicalTableCellNode';
import { TableNode } from './LexicalTableNode';
import { TableDOMTable } from './LexicalTableObserver';
import { TableRowNode } from './LexicalTableRowNode';
export declare function $createTableNodeWithDimensions(rowCount: number, columnCount: number, includeHeaders?: InsertTableCommandPayloadHeaders): TableNode;
export declare function $getTableCellNodeFromLexicalNode(startingNode: LexicalNode): TableCellNode | null;
export declare function $getTableRowNodeFromTableCellNodeOrThrow(startingNode: LexicalNode): TableRowNode;
export declare function $getTableNodeFromLexicalNodeOrThrow(startingNode: LexicalNode): TableNode;
export declare function $getTableRowIndexFromTableCellNode(tableCellNode: TableCellNode): number;
export declare function $getTableColumnIndexFromTableCellNode(tableCellNode: TableCellNode): number;
export type TableCellSiblings = {
    above: TableCellNode | null | undefined;
    below: TableCellNode | null | undefined;
    left: TableCellNode | null | undefined;
    right: TableCellNode | null | undefined;
};
export declare function $getTableCellSiblingsFromTableCellNode(tableCellNode: TableCellNode, table: TableDOMTable): TableCellSiblings;
export declare function $removeTableRowAtIndex(tableNode: TableNode, indexToDelete: number): TableNode;
export declare function $insertTableRow(tableNode: TableNode, targetIndex: number, shouldInsertAfter: boolean | undefined, rowCount: number, table: TableDOMTable): TableNode;
/**
 * Inserts a table row before or after the current focus cell node,
 * taking into account any spans. If successful, returns the
 * inserted table row node.
 */
export declare function $insertTableRow__EXPERIMENTAL(insertAfter?: boolean): TableRowNode | null;
export declare function $insertTableColumn(tableNode: TableNode, targetIndex: number, shouldInsertAfter: boolean | undefined, columnCount: number, table: TableDOMTable): TableNode;
/**
 * Inserts a column before or after the current focus cell node,
 * taking into account any spans. If successful, returns the
 * first inserted cell node.
 */
export declare function $insertTableColumn__EXPERIMENTAL(insertAfter?: boolean): TableCellNode | null;
export declare function $deleteTableColumn(tableNode: TableNode, targetIndex: number): TableNode;
export declare function $deleteTableRow__EXPERIMENTAL(): void;
export declare function $deleteTableColumn__EXPERIMENTAL(): void;
export declare function $unmergeCell(): void;
export declare function $computeTableMap(tableNode: TableNode, cellA: TableCellNode, cellB: TableCellNode): [TableMapType, TableMapValueType, TableMapValueType];
export declare function $computeTableMapSkipCellCheck(tableNode: TableNode, cellA: null | TableCellNode, cellB: null | TableCellNode): [
    tableMap: TableMapType,
    cellAValue: TableMapValueType | null,
    cellBValue: TableMapValueType | null
];
export declare function $getNodeTriplet(source: PointType | LexicalNode | TableCellNode): [TableCellNode, TableRowNode, TableNode];
export interface TableCellRectBoundary {
    minColumn: number;
    minRow: number;
    maxColumn: number;
    maxRow: number;
}
export interface TableCellRectSpans {
    topSpan: number;
    leftSpan: number;
    rightSpan: number;
    bottomSpan: number;
}
export declare function $computeTableCellRectSpans(map: TableMapType, boundary: TableCellRectBoundary): TableCellRectSpans;
export declare function $computeTableCellRectBoundary(map: TableMapType, cellAMap: TableMapValueType, cellBMap: TableMapValueType): TableCellRectBoundary;
export declare function $getTableCellNodeRect(tableCellNode: TableCellNode): {
    rowIndex: number;
    columnIndex: number;
    rowSpan: number;
    colSpan: number;
} | null;

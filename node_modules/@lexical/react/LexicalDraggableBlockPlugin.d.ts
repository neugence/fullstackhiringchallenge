/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ReactNode } from 'react';
export declare function DraggableBlockPlugin_EXPERIMENTAL({ anchorElem, menuRef, targetLineRef, menuComponent, targetLineComponent, isOnMenu, }: {
    anchorElem?: HTMLElement;
    menuRef: React.RefObject<HTMLElement>;
    targetLineRef: React.RefObject<HTMLElement>;
    menuComponent: ReactNode;
    targetLineComponent: ReactNode;
    isOnMenu: (element: HTMLElement) => boolean;
}): JSX.Element;

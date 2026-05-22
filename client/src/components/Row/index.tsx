import styles from './Row.module.css';

import React, { useRef } from 'react';
import type { ListChildComponentProps } from 'react-window';

export interface IItemData<T> {
  filteredOptions: T[];
  highlightedIndex: number;
  renderOption: (option: T) => React.ReactNode;
  onSelect: (option: T) => void;
  getOptionLabel: (option: T) => string;
  setInputValue: (value: string) => void;
  setIsOpen: (value: boolean) => void;
  setHighlightedIndex: (index: number) => void;
}

function Row<T>({ index, style, data }: ListChildComponentProps<IItemData<T>>) {
  const {
    filteredOptions,
    highlightedIndex,
    renderOption,
    onSelect,
    setHighlightedIndex,
  } = data;
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const item = filteredOptions[index];
  const isHighlighted = index === highlightedIndex;

  return (
    <div
      data-clickfx='link'
      className={`${styles.option} ${
        isHighlighted ? styles.optionHighlighted : ''
      }`}
      style={style}
      onPointerEnter={() => setHighlightedIndex(index)}
      onPointerDown={(e) => {
        pointerStartRef.current = {
          x: e.clientX,
          y: e.clientY,
        };

        isDraggingRef.current = false;
      }}
      onPointerMove={(e) => {
        const start = pointerStartRef.current;

        if (!start) return;

        const deltaX = Math.abs(e.clientX - start.x);
        const deltaY = Math.abs(e.clientY - start.y);

        if (deltaX > 6 || deltaY > 6) {
          isDraggingRef.current = true;
        }
      }}
      onPointerUp={(e) => {
        if (isDraggingRef.current) {
          pointerStartRef.current = null;
          return;
        }

        e.preventDefault();

        onSelect(item);

        pointerStartRef.current = null;
      }}
    >
      {renderOption(item)}
    </div>
  );
}

export const MemoizedRow = React.memo(Row) as typeof Row;

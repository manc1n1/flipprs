import styles from './Autocomplete.module.css';

import {
  forwardRef,
  KeyboardEvent,
  Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FixedSizeList as List } from 'react-window';

import { type IItemData, MemoizedRow } from '@/components/Row';

import { useClickOutside } from '@/hooks/useClickOutside';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { useHaptics } from '@/hooks/useHaptics';

import type { TSearchItem } from '@/types/item';

interface IAutocompleteProps<T extends TSearchItem> {
  options: T[];
  renderOption: (option: T) => React.ReactNode;
  getOptionLabel: (option: T) => string;
  onSelect: (option: T) => void;
  placeholder?: string;
  itemHeight?: number;
  minChars?: number;
}

export const Autocomplete = forwardRef<
  HTMLInputElement,
  IAutocompleteProps<TSearchItem>
>(function Autocomplete<T extends TSearchItem>(
  {
    options,
    renderOption,
    getOptionLabel,
    onSelect,
    placeholder = 'Search items...',
    itemHeight = 40,
    minChars = 1,
  }: IAutocompleteProps<T>,
  ref: Ref<unknown>,
) {
  const { selection } = useHaptics();
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<List>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useImperativeHandle(ref, () => inputRef.current);

  const debouncedQuery = useDebouncedValue(inputValue);
  const hasQuery = debouncedQuery.trim().length >= minChars;

  const itemCount = options.filter((option) =>
    getOptionLabel(option).toLowerCase().includes(inputValue.toLowerCase()),
  );

  const filteredOptions = useMemo(() => {
    if (!hasQuery) return [];
    const query = inputValue.toLowerCase();
    return options.filter((option) =>
      getOptionLabel(option).toLowerCase().includes(query),
    );
  }, [getOptionLabel, hasQuery, inputValue, options]);

  const updateFilteredOptions = useDebouncedCallback((val: string) => {
    const query = val.trim().toLowerCase();
    const currQuery = query.length >= minChars;
    if (!currQuery) {
      setIsOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    let count = 0;
    for (const option of options) {
      if (getOptionLabel(option).toLowerCase().includes(query)) count++;
    }
    setIsOpen(count > 0);
    setHighlightedIndex(count ? 0 : -1);
  });

  const visibleCount = Math.min(filteredOptions.length, 5);
  const dynamicHeight = visibleCount * itemHeight;

  useClickOutside(containerRef, () => setIsOpen(false));

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      if (hasQuery && filteredOptions.length > 0) setIsOpen(true);
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        if (!filteredOptions.length) return;
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % filteredOptions.length);
        break;
      case 'ArrowUp':
        if (!filteredOptions.length) return;
        e.preventDefault();
        setHighlightedIndex(
          (prev) =>
            (prev - 1 + filteredOptions.length) % filteredOptions.length,
        );
        break;
      case 'Enter': {
        if (!filteredOptions.length) return;
        e.preventDefault();
        const pickIndex = highlightedIndex >= 0 ? highlightedIndex : 0;
        const itemToSelect = filteredOptions[pickIndex];
        if (itemToSelect) {
          handleSelect(itemToSelect);
        }
        break;
      }
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0) {
      listRef.current?.scrollToItem(highlightedIndex, 'smart');
    }
  }, [highlightedIndex]);

  const handleSelect = async (item: T) => {
    onSelect(item);
    setIsOpen(false);
    setInputValue('');
    setHighlightedIndex(-1);
    scrollToTop();
  };

  return (
    <div
      ref={containerRef}
      className={styles.autocompleteContainer}
    >
      <input
        ref={inputRef}
        className={styles.autocompleteInput}
        data-autocomplete-input
        type='text'
        name='search'
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => {
          const val = e.target.value;
          setInputValue(val);
          setIsOpen(false);
          setHighlightedIndex(-1);
          updateFilteredOptions(val);
        }}
        onFocus={() => {
          selection();
          if (filteredOptions.length > 0) {
            setIsOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
      />
      <span className={styles.itemCount}>
        {itemCount.length !== 1 && (
          <span>
            {itemCount.length} {itemCount.length === 1 ? 'item' : 'items'}
          </span>
        )}
        {options.length > 0 ? (
          <div className={styles.dot} />
        ) : (
          <div className={styles.dotOffline} />
        )}
      </span>
      {isOpen && filteredOptions.length > 0 && (
        <div className={styles.autocompleteDropdown}>
          <List<IItemData<T>>
            ref={listRef}
            height={dynamicHeight}
            width='100%'
            overscanCount={10}
            children={MemoizedRow}
            itemSize={itemHeight}
            itemCount={filteredOptions.length}
            itemData={{
              filteredOptions,
              highlightedIndex,
              renderOption,
              onSelect: handleSelect,
              getOptionLabel,
              setInputValue,
              setIsOpen,
              setHighlightedIndex,
            }}
          />
        </div>
      )}
    </div>
  );
});

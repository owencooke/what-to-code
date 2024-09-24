import { useState, useEffect, useRef } from "react";
import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends [string, ...unknown[]] = [string],
>(
  queryKey: TQueryKey,
  queryFn: (value: string) => Promise<TQueryFnData>,
  delay: number = 500,
  options: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey" | "queryFn"
  > = {},
): UseQueryResult<TData, TError> & { setInputValue: (value: string) => void } {
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedValue = useDebounce(inputValue, delay);

  const debouncedQueryFn = useRef(queryFn);

  useEffect(() => {
    debouncedQueryFn.current = queryFn;
  }, [queryFn]);

  const result = useQuery<TQueryFnData, TError, TData, TQueryKey>({
    queryKey: [...queryKey, debouncedValue] as unknown as TQueryKey,
    queryFn: () => debouncedQueryFn.current(debouncedValue),
    ...options,
    enabled: !!debouncedValue && !!inputValue,
  });

  return { ...result, setInputValue };
}

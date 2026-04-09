import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useUpdateSearchParams(): UseSetSearchParamsReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const setSearchParam = useCallback(
    (name: string, value: string) => {
      router.replace(`${pathname}?${createQueryString(name, value)}`);
    },
    [router, pathname, createQueryString]
  );

  const addSearchParam = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const existingValue = params.get(name);

      if (existingValue) {
        // If the parameter already exists, append the new value
        params.append(name, value);
      } else {
        // If it doesn't exist, set it
        params.set(name, value);
      }

      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const deleteSearchParam = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const setMultipleSearchParams = useCallback(
    (items: { name: string; value: string | null }[]) => {
      const params = new URLSearchParams(searchParams.toString());
      items.forEach(({ name, value }) => {
        if (value !== null) {
          params.set(name, value);
        } else {
          params.delete(name);
        }
      });
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const addMultipleSearchParams = useCallback(
    (items: { name: string; value: string }[]) => {
      const params = new URLSearchParams(searchParams.toString());
      items.forEach(({ name, value }) => {
        const existingValue = params.get(name);
        if (existingValue) {
          params.append(name, value);
        } else {
          params.set(name, value);
        }
      });
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const deleteMultipleSearchParams = useCallback(
    (names: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      names.forEach((name) => {
        params.delete(name);
      });
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearAll = useCallback(
    (paramsToKeep?: string[]) => {
      const currentParams = new URLSearchParams(window.location.search);
      const newParams = new URLSearchParams();

      paramsToKeep?.forEach((param) => {
        const value = currentParams.get(param);
        if (value) newParams.append(param, value);
      });

      const newSearch = newParams.toString();
      const newPath = newSearch ? `${pathname}?${newSearch}` : pathname;
      router.replace(newPath);
    },
    [router, pathname]
  );

  return {
    setSearchParam,
    deleteSearchParam,
    addSearchParam,
    setMultipleSearchParams,
    addMultipleSearchParams,
    deleteMultipleSearchParams,
    clearAll,
  };
}

type UseSetSearchParamsReturn = {
  setSearchParam: (name: string, value: string) => void;
  deleteSearchParam: (name: string) => void;
  addSearchParam: (name: string, value: string) => void;
  setMultipleSearchParams: (
    items: { name: string; value: string | null }[]
  ) => void;
  addMultipleSearchParams: (items: { name: string; value: string }[]) => void;
  deleteMultipleSearchParams: (names: string[]) => void;
  clearAll: (paramsToKeep?: string[]) => void;
};

import React, { ReactElement } from "react";
import { Loading } from "../Loading";


interface Props<T> {
  isLoading: boolean;
  data: T | null | undefined;
  isRefetching: boolean;
  refetch: () => void;
  logout: () => void;
  children: ({ data }: { data: T }) => ReactElement | null;
}

export function ScreenData<T>({
  isLoading,
  data,
  isRefetching,
  refetch,
  logout,
  children,
}: Props<T>) {
  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    return (
      "error"
    );
  }

  return children({ data });
}

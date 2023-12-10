import { PaginationOptions } from '../interfaces';

export const getSkip = (options: PaginationOptions): number => {
  return (options.page - 1) * options.pageSize;
};

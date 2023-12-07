import { Injectable } from '@nestjs/common';
import { PaginationOptions, PaginationResult } from '../interfaces';
import { Repository } from 'typeorm';

function getSkip(options: PaginationOptions): number {
  return (options.page - 1) * options.pageSize;
}

@Injectable()
export class PaginationService {
  async findAll<T>(
    repository: Repository<T>,
    paginationOptions: PaginationOptions,
  ): Promise<PaginationResult<T>> {
    const { page, pageSize } = paginationOptions;
    const skip = getSkip(paginationOptions);

    const [data, total] = await repository.findAndCount({
      skip,
      take: pageSize,
    });

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}

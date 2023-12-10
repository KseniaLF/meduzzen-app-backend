import { Injectable } from '@nestjs/common';
import { PaginationOptions, PaginationResult } from '../interfaces';
import { Repository } from 'typeorm';
import { getSkip } from '../utils/pagination.util';

@Injectable()
export class PaginationService {
  async findAll<T>(
    repository: Repository<T>,
    paginationOptions: PaginationOptions,
  ): Promise<PaginationResult<T>> {
    const { page = 1, pageSize = 3 } = paginationOptions;
    const skip = getSkip({ page, pageSize });

    const [data, total] = await repository.findAndCount({
      skip,
      take: pageSize,
    });

    return {
      data,
      total,
      page: +page,
      pageSize: +pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}

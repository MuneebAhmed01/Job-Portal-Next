import { SearchJobsDto } from './dto/search-jobs.dto';

import { JobStatus } from '../lib/prisma/enums';



/**

 * Builds a Prisma-compatible query object from search parameters.

 *

 * Each `apply*` method is independent — new filters can be added

 * without touching existing ones (Open/Closed principle).

 */

export class JobSearchQueryBuilder {

  private where: Record<string, any> = { status: JobStatus.ACTIVE };

  private orderBy: Record<string, any>[] = [];



  constructor(private readonly params: SearchJobsDto) {}



  /** Full-text keyword search across title, description, and company name. */

  applyKeyword(): this {

    if (!this.params.keyword) return this;

    const keyword = this.params.keyword;

    this.where.OR = [

      { title: { contains: keyword, mode: 'insensitive' } },

      { description: { contains: keyword, mode: 'insensitive' } },

      { employer: { companyName: { contains: keyword, mode: 'insensitive' } } },

    ];

    return this;

  }



  /** Filter by job type (REMOTE / ONSITE / HYBRID). */

  applyType(): this {

    if (!this.params.type) return this;

    this.where.type = this.params.type;

    return this;

  }



  /** Case-insensitive partial match on location. */

  applyLocation(): this {

    if (!this.params.location) return this;

    this.where.location = { contains: this.params.location, mode: 'insensitive' };

    return this;

  }



  /**
   * Salary filter using job's stored min salary (single `salary` field).
   * Only min: salary >= minSalary. Only max: salary <= maxSalary. Both: in range.
   */
  applySalary(): this {

    const { minSalary, maxSalary } = this.params;

    if (minSalary === undefined && maxSalary === undefined) return this;



    const salaryFilter: Record<string, number> = {};

    if (minSalary !== undefined) salaryFilter.gte = minSalary;

    if (maxSalary !== undefined) salaryFilter.lte = maxSalary;

    this.where.salary = salaryFilter;

    return this;

  }



  /** Sort by createdAt, salary (min salary), or relevance. */

  applySorting(): this {

    const order = this.params.sortOrder ?? 'desc';



    switch (this.params.sortBy) {

      case 'salary':

        this.orderBy.push({ salary: { sort: order, nulls: 'last' } });

        break;

      case 'relevance':

        // Approximate relevance: title matches first, then newest

        if (this.params.keyword) {

          this.orderBy.push({ title: order });

        }

        this.orderBy.push({ createdAt: 'desc' });

        break;

      default:

        this.orderBy.push({ createdAt: order });

    }

    return this;

  }



  /** Run all filters and return the final Prisma query args. */

  build() {

    this.applyKeyword().applyType().applyLocation().applySalary().applySorting();



    return {

      where: this.where,

      orderBy: this.orderBy.length ? this.orderBy : [{ createdAt: 'desc' as const }],

      skip: (this.params.page - 1) * this.params.limit,

      take: this.params.limit,

    };

  }

}


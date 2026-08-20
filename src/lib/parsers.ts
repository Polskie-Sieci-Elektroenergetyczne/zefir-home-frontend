import { createParser } from 'nuqs/server';
import * as yup from 'yup';

import { dataTableConfig } from '@/config/data-table';

import type { ExtendedColumnFilter, ExtendedColumnSort } from '@/types/data-table';

const sortingItemSchema = yup.object({
  id: yup.string().required(),
  desc: yup.boolean().required()
});

const sortingSchema = yup.array().of(sortingItemSchema).required();

export const getSortingStateParser = <TData>(columnIds?: string[] | Set<string>) => {
  const validKeys = columnIds ? (columnIds instanceof Set ? columnIds : new Set(columnIds)) : null;

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value);
        const result = sortingSchema.validateSync(parsed, {
          strict: true
        });

        if (validKeys && result.some((item) => !validKeys.has(item.id))) {
          return null;
        }

        return result as ExtendedColumnSort<TData>[];
      } catch {
        return null;
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      a.every((item, index) => item.id === b[index]?.id && item.desc === b[index]?.desc)
  });
};

const filterItemSchema = yup.object({
  id: yup.string().required(),
  value: yup
    .mixed<string | string[]>()
    .test(
      'is-string-or-string-array',
      'value must be a string or an array of strings',
      (value): value is string | string[] =>
        typeof value === 'string' ||
        (Array.isArray(value) && value.every((item) => typeof item === 'string'))
    )
    .required(),
  variant: yup
    .mixed<(typeof dataTableConfig.filterVariants)[number]>()
    .oneOf(dataTableConfig.filterVariants)
    .required(),
  operator: yup
    .mixed<(typeof dataTableConfig.operators)[number]>()
    .oneOf(dataTableConfig.operators)
    .required(),
  filterId: yup.string().required()
});

const filtersSchema = yup.array().of(filterItemSchema).required();

export type FilterItemSchema = yup.InferType<typeof filterItemSchema>;

export const getFiltersStateParser = <TData>(columnIds?: string[] | Set<string>) => {
  const validKeys = columnIds ? (columnIds instanceof Set ? columnIds : new Set(columnIds)) : null;

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value);
        const result = filtersSchema.validateSync(parsed, {
          strict: true
        });

        if (validKeys && result.some((item) => !validKeys.has(item.id))) {
          return null;
        }

        return result as ExtendedColumnFilter<TData>[];
      } catch {
        return null;
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      a.every(
        (filter, index) =>
          filter.id === b[index]?.id &&
          filter.value === b[index]?.value &&
          filter.variant === b[index]?.variant &&
          filter.operator === b[index]?.operator
      )
  });
};

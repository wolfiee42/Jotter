import { FilterQuery, Query } from 'mongoose'

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>
  public query: Record<string, unknown>

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery
    this.query = query
  }

  // Search method
  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          field =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      })
    }
    return this
  }

  // Filter method
  filter() {
    const queryObj = { ...this.query }
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields']
    excludeFields.forEach(el => delete queryObj[el])
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>)

    return this
  }

  // sort method
  sort() {
    const sort = this?.query?.sort || '-createdAt'
    this.modelQuery = this.modelQuery.sort(sort as string)

    return this
  }

  // pagination method
  paginate() {
    const page = Number(this?.query?.page) || 1
    const limit = Number(this?.query?.limit) || 10
    const skip = (page - 1) * limit
    this.modelQuery = this.modelQuery.skip(skip).limit(limit)

    return this
  }

  // field limiting method

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v'
    this.modelQuery = this.modelQuery.select(fields)

    return this
  }

  // Count total method

  /**
   * The method `countTotal` calculates the total number of documents in a model, along with
   * pagination details such as current page, limit, and total pages.
   */
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter()
    const total = await this.modelQuery.model.countDocuments(totalQueries)
    const page = Number(this?.query?.page) || 1
    const limit = Number(this?.query?.limit) || 10
    const totalPages = Math.ceil(total / limit)
    return {
      total,
      page,
      limit,
      totalPages,
    }
  }
}

export default QueryBuilder

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    ////////// Filtering //////////
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);

    /////// Advanced filtering
    // Explained on Ref_ONLY version
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  ////////// Sorting //////////
  sort() {
    console.log('Sorting');
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  ///////// Field Limiting //////////

  limitFields() {
    if (this.query.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
      console.log('limit');
    }
    return this;
  }

  ////////// Pagination //////////
  paginate() {
    console.log('Pagination');
    // Convert the page to a number and make it 1 by default
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;

    // We can skip() the number on each page
    // to put us on a specific page
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

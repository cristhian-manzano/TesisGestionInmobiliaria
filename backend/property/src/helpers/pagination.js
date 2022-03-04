const DEFAULT_PAGINATION_SIZE = 10;

const getPagination = (page, size) => {
  const limit = size ? +size : DEFAULT_PAGINATION_SIZE;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

const getPagingData = (count, page, limit) => {
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(count / limit);

  return { totalItems: count, totalPages, currentPage };
};

module.exports = {
  getPagination,
  getPagingData
};

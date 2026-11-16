const assert = require('node:assert/strict');
const test = require('node:test');
const News = require('../src/models/News');
const { getAllNews } = require('../src/controllers/newsController');

test('GET /api/news returns the default page of 200 active posts', async (t) => {
  const posts = Array.from({ length: 200 }, (_, index) => ({ title: `News ${index + 1}` }));
  const originalFind = News.find;
  const originalCountDocuments = News.countDocuments;
  let appliedLimit;
  let appliedSort;

  News.find = () => {
    const query = {
      select() { return this; },
      sort(value) {
        appliedSort = value;
        return this;
      },
      skip() { return this; },
      limit(value) {
        appliedLimit = value;
        return this;
      },
      maxTimeMS() { return this; },
      lean: async () => posts
    };
    return query;
  };
  News.countDocuments = () => ({
    maxTimeMS: async () => posts.length
  });

  t.after(() => {
    News.find = originalFind;
    News.countDocuments = originalCountDocuments;
  });

  const response = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };

  await getAllNews({ query: {} }, response);

  assert.equal(appliedLimit, 200);
  assert.deepEqual(appliedSort, { createdAt: -1 });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, {
    success: true,
    count: 200,
    data: posts
  });
});

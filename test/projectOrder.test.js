const assert = require('node:assert/strict');
const http = require('node:http');
const test = require('node:test');
const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../src/models/Admin');
const Work = require('../src/models/Work');
const ProjectOrder = require('../src/models/ProjectOrder');
const workRoutes = require('../src/routes/workRoutes');

const JWT_SECRET = 'project-order-test-secret';
const PROJECT_IDS = [
  '64b000000000000000000001',
  '64b000000000000000000002'
];

async function createTestApi(t, {
  user = { role: 'admin', isTrustedAdmin: true },
  savedProjectIds = [],
  existingProjectIds = PROJECT_IDS
} = {}) {
  const originalSecret = process.env.JWT_SECRET;
  const originalAdminFindById = Admin.findById;
  const originalWorkFind = Work.find;
  const originalOrderFindOne = ProjectOrder.findOne;
  const originalOrderFindOneAndUpdate = ProjectOrder.findOneAndUpdate;
  let savedProjectOrder = savedProjectIds.length
    ? { projectIds: savedProjectIds }
    : null;
  let saveCallCount = 0;

  process.env.JWT_SECRET = JWT_SECRET;
  Admin.findById = (id) => ({
    select: async () => ({ ...user, _id: id })
  });
  Work.find = (filter) => ({
    select: () => ({
      lean: async () => {
        const requestedIds = filter._id.$in.map((id) => id.toString());
        return existingProjectIds
          .filter((id) => requestedIds.includes(id.toLowerCase()))
          .map((id) => ({ _id: id }));
      }
    })
  });
  ProjectOrder.findOne = () => ({
    lean: async () => savedProjectOrder
  });
  ProjectOrder.findOneAndUpdate = (filter, update) => {
    saveCallCount += 1;
    savedProjectOrder = { projectIds: update.$set.projectIds };
    return { lean: async () => savedProjectOrder };
  };

  const app = express();
  app.use(express.json());
  app.use('/api/work', workRoutes);
  app.use((error, req, res, next) => {
    res.status(500).json({ success: false, message: error.message });
  });

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const token = jwt.sign({ id: 'test-account' }, JWT_SECRET);

  t.after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }
    Admin.findById = originalAdminFindById;
    Work.find = originalWorkFind;
    ProjectOrder.findOne = originalOrderFindOne;
    ProjectOrder.findOneAndUpdate = originalOrderFindOneAndUpdate;
  });

  return {
    baseUrl: `http://127.0.0.1:${address.port}/api/work/all-projects/order`,
    token,
    getSaveCallCount: () => saveCallCount
  };
}

test('GET returns the saved All Projects order publicly', async (t) => {
  const api = await createTestApi(t, { savedProjectIds: PROJECT_IDS });
  const response = await fetch(api.baseUrl);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    success: true,
    data: { projectIds: PROJECT_IDS }
  });
});

test('PUT saves the order for a trusted administrator', async (t) => {
  const api = await createTestApi(t);
  const response = await fetch(api.baseUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${api.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ projectIds: [...PROJECT_IDS].reverse() })
  });

  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data.projectIds, [...PROJECT_IDS].reverse());
  assert.equal(api.getSaveCallCount(), 1);
});

test('PUT rejects a normal user and an untrusted admin', async (t) => {
  for (const user of [
    { role: 'user', isTrustedAdmin: false },
    { role: 'admin', isTrustedAdmin: false }
  ]) {
    const api = await createTestApi(t, { user });
    const response = await fetch(api.baseUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${api.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ projectIds: PROJECT_IDS })
    });

    assert.equal(response.status, 403);
    assert.equal(api.getSaveCallCount(), 0);
  }
});

test('PUT rejects malformed and duplicate project IDs', async (t) => {
  const api = await createTestApi(t);

  for (const projectIds of [
    undefined,
    ['not-an-object-id'],
    [PROJECT_IDS[0], PROJECT_IDS[0].toUpperCase()]
  ]) {
    const response = await fetch(api.baseUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${api.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ projectIds })
    });

    assert.equal(response.status, 400);
  }

  assert.equal(api.getSaveCallCount(), 0);
});

test('PUT rejects IDs that do not reference existing projects', async (t) => {
  const api = await createTestApi(t, { existingProjectIds: [PROJECT_IDS[0]] });
  const response = await fetch(api.baseUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${api.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ projectIds: PROJECT_IDS })
  });

  assert.equal(response.status, 400);
  assert.equal(api.getSaveCallCount(), 0);
});

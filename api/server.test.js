// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')





test('sanity', () => {
  expect(true).not.toBe(false)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})


describe('POST /register', () => {
  test('returns new registered user with status 200', async () => {
    const res = await request(server)
    .post('/api/auth/register')
    .send({username:'foo',password:'bar'})
    expect(res.status).toBe(200)
  })
})

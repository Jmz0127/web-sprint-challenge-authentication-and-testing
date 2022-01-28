// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')





test('sanity', () => {
  expect(true).not.toBe(false)
})

it('correct env var',()=>{expect(process.env.NODE_ENV).toBe('testing')}) //testing the testing environment

beforeAll(async () => {
  await db.migrate.rollback() //migrate refresh, the automated way, before all tests
  await db.migrate.latest() //migrate refresh, the automated way, before all tests
})

afterAll(async () => { //after all tests clear the db
  await db.destroy()
})


describe('POST /register', () => {
  test('returns new registered user with status 201', async () => {
    const res = await request(server)
    .post('/api/auth/register')
    .send({username:'foob',password:'argh'})
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({username: 'foob'})
  })
})

describe('POST /login', () => {
  test('Success with login status 200',async() => {
    const res = await request(server).post('/api/auth/login')
    .send({username:'foob',password:'argh'})

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({message:'welcome, foob'})
  })
})

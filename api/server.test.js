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
  test('registering returns new registered username and a new 201', async () => {
    const res = await request(server)
    .post('/api/auth/register')
    .send({username:'foob',password:'argh'})
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({username: 'foob'})
  })
  test('prohibits registering if username is already taken', async()=> {
    const res = await request(server)
    .post('/api/auth/register')
    .send({username:'foob',password:'argh'})

    expect(res.status).toBe(400)
    
  })


})



describe('POST /login', () => {
  test('successful login gives correct welcome message' ,async() => {
    const res = await request(server)
    .post('/api/auth/login')
    .send({username:'foob',password:'argh'})

    expect(res.body).toMatchObject({message:'welcome, foob'})
  })

  test('successful login gives status 200',async() => {
    const res = await request(server)
    .post('/api/auth/login')
    .send({username:'foob',password:'argh'})

    expect(res.status).toBe(200)
    
  })
})




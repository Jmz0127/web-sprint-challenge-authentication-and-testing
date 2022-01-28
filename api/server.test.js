// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')





test('sanity', () => {
  expect(true).not.toBe(false) //changed sanity so we are sane
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
  test('registering returns new registered username with a 201', async () => {
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

    expect(res.status).toBe(401)
    expect(res.body.message).toBe("username taken")
  })

})



describe('POST /login', () => {
  test('successful login gives correct welcome message' ,async() => {
    const res = await request(server)
    .post('/api/auth/login')
    .send({username:'foob',password:'argh'})

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({message:'welcome, foob'})
  })

  test('one or both incorrect username/password prompts them with correct error',async() => {
    const res = await request(server)
    .post('/api/auth/login')
    .send({username:'foo',password:'argh'})

    expect(res.status).toBe(401)
    expect(res.body).toMatchObject({message:'invalid credentials'})
    
  })
})

describe('GET restricted /jokes', () => {
  test('successful login allows access to all of the jokes' ,async() => {
    const res = await request(server)
    .post('/api/auth/login')
    .send({username:'foob',password:"argh"})
    
    const jokes = await request(server)
      .get('/api/jokes')
      .set("Authorization",res.body.token)

    expect(jokes.status).toBe(200)
    expect(jokes.body[2]).toHaveProperty("id")
    expect(jokes.body[1]).toHaveProperty("joke")
  })

  test('failed login gives them none of the jokes',async () => {
    const res = await request(server)
    .get('/api/jokes')
    
    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(/token required/i) //message wasn't working as an object - using case insensitive string here instead
  })
})

const express = require('express')
const { Pool } = require('pg')
const { Ollama } = require('ollama')
const { MongoClient } = require('mongodb')

process.on('uncaughtException', (err) => {
  console.log('Connection error handled:', err.message)
})

const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
// PostgreSQL nodes
const node1 = new Pool({ host: 'localhost', port: 5433, database: 'stormdb1', user: 'postgres', password: 'password' })
const node2 = new Pool({ host: 'localhost', port: 5434, database: 'stormdb2', user: 'postgres', password: 'password' })
const node3 = new Pool({ host: 'localhost', port: 5435, database: 'stormdb3', user: 'postgres', password: 'password' })
const node2Replica = new Pool({ host: 'localhost', port: 5436, database: 'stormdb2', user: 'postgres', password: 'password' })

// Ollama
const ollama = new Ollama()

// MongoDB Atlas
const mongoClient = new MongoClient('mongodb+srv://ninnmisha:dbuserninmisha@cluster0.kisjvfp.mongodb.net/?appName=Cluster0')
let queryCollection

async function connectMongo() {
  await mongoClient.connect()
  const db = mongoClient.db('stormdb')
  queryCollection = db.collection('queries')
  console.log('MongoDB Atlas connected!')
}

connectMongo()

let nodeStatus = { node1: 'alive', node2: 'alive', node3: 'alive', node2Replica: 'alive' }

async function setupTables() {
  const query = `DROP TABLE IF EXISTS students; CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100),
    city VARCHAR(100),
    score INTEGER
  )`
  await node1.query(query)
  await node2.query(query)
  await node3.query(query)
  await node2Replica.query(query)
  console.log('Tables created in all 4 nodes!')
}

function getNode(id) {
  if (id >= 1 && id <= 300) return node1
  if (id >= 301 && id <= 600) return node2
  if (id >= 601 && id <= 900) return node3
}

app.get('/health', async (req, res) => {
  try {
    await node1.query('SELECT 1')
    await node2.query('SELECT 1')
    await node3.query('SELECT 1')
    await node2Replica.query('SELECT 1')
    res.json({ status: 'All nodes connected!', ...nodeStatus })
  } catch (err) {
    res.json({ status: 'error', message: err.message })
  }
})

app.post('/insert', async (req, res) => {
  const { id, name, city, score } = req.body
  const node = getNode(id)
  if (!node) return res.json({ error: 'ID out of range (1-900)' })
  const nodeNumber = id <= 300 ? 1 : id <= 600 ? 2 : 3
  if (nodeStatus[`node${nodeNumber}`] === 'dead') {
    return res.json({ error: `Node ${nodeNumber} is dead! Cannot insert.` })
  }
  await node.query('INSERT INTO students (id, name, city, score) VALUES ($1, $2, $3, $4)', [id, name, city, score])
  if (nodeNumber === 2) {
    await node2Replica.query('INSERT INTO students (id, name, city, score) VALUES ($1, $2, $3, $4)', [id, name, city, score])
    console.log(`Replicated student ${id} to Node 2 replica`)
  }
  res.json({ message: `Student inserted into Node ${nodeNumber}`, id, name, city, score })
})

app.get('/query', async (req, res) => {
  const results = []
  if (nodeStatus.node1 === 'alive') {
    const r = await node1.query('SELECT * FROM students')
    results.push(...r.rows)
  }
  if (nodeStatus.node2 === 'alive') {
    const r = await node2.query('SELECT * FROM students')
    results.push(...r.rows)
  } else {
    console.log('Node 2 dead — using replica!')
    const r = await node2Replica.query('SELECT * FROM students')
    results.push(...r.rows)
  }
  if (nodeStatus.node3 === 'alive') {
    const r = await node3.query('SELECT * FROM students')
    results.push(...r.rows)
  }
  res.json({ results, total: results.length, nodeStatus })
})

app.get('/status', (req, res) => {
  res.json(nodeStatus)
})

app.post('/ask', async (req, res) => {
  const { question } = req.body

  const response = await ollama.chat({
    model: 'llama3.2',
    messages: [
      {
        role: 'system',
        content: `You are a SQL expert. Convert the user's question to a PostgreSQL SQL query for a table called "students" with columns: id (integer), name (varchar), city (varchar), score (integer). Return ONLY the SQL query, nothing else. No explanation, no markdown, just the raw SQL.`
      },
      {
        role: 'user',
        content: question
      }
    ]
  })

  const sql = response.message.content.trim()
  console.log('Generated SQL:', sql)

  const results = []
  try {
    if (nodeStatus.node1 === 'alive') {
      const r = await node1.query(sql)
      results.push(...r.rows)
    }
    if (nodeStatus.node2 === 'alive') {
      const r = await node2.query(sql)
      results.push(...r.rows)
    } else {
      const r = await node2Replica.query(sql)
      results.push(...r.rows)
    }
    if (nodeStatus.node3 === 'alive') {
      const r = await node3.query(sql)
      results.push(...r.rows)
    }
  } catch (err) {
    return res.json({ error: err.message, sql })
  }

if (queryCollection) {
  await queryCollection.insertOne({
    question,
    sql,
    timestamp: new Date()
  })
}

  res.json({ question, sql, results, total: results.length })
})

app.get('/history', async (req, res) => {
  if (!queryCollection) return res.json({ error: 'MongoDB not connected yet' })
  const history = await queryCollection.find({}).sort({ timestamp: -1 }).limit(10).toArray()
  res.json(history)
})

setInterval(async () => {
  try { await node1.query('SELECT 1'); nodeStatus.node1 = 'alive' } catch { nodeStatus.node1 = 'dead' }
  try { await node2.query('SELECT 1'); nodeStatus.node2 = 'alive' } catch { nodeStatus.node2 = 'dead' }
  try { await node3.query('SELECT 1'); nodeStatus.node3 = 'alive' } catch { nodeStatus.node3 = 'dead' }
  try { await node2Replica.query('SELECT 1'); nodeStatus.node2Replica = 'alive' } catch { nodeStatus.node2Replica = 'dead' }
  console.log('Node status:', nodeStatus)
}, 5000)

setupTables()

app.listen(5000, () => {
  console.log('StormDB running on port 5000')
})

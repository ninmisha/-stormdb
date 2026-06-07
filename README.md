# ⚡ StormDB — Distributed Database with Natural Language Query Layer

A fully local, privacy-preserving distributed database system built from scratch with an AI-powered natural language interface.

## 🚀 What it does
- Distributes data across **3 PostgreSQL nodes** using range-based sharding
- **Automatically detects node failures** every 5 seconds
- **Replicates data** to a backup node and switches to it on failure
- Converts **plain English questions to SQL** using LLaMA 3 (local AI)
- **Live React dashboard** showing node health and query results in real time

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (x4 Docker containers)
- **AI:** LLaMA 3.2 via Ollama (runs locally)
- **Frontend:** React.js
- **Infrastructure:** Docker, Docker Compose
- **Vector Search:** MongoDB Atlas

## ⚙️ How to run
1. Install Docker Desktop, Node.js, Ollama
2. Run `ollama pull llama3.2`
3. Run `docker-compose up -d`
4. Run `npm install && node server.js`
5. Open `stormdb-frontend` → `npm install && npm start`
6. Visit `http://localhost:3000`

## 📊 Features
| Feature                     |Status |
|                             |       |
| Range-based sharding        | ✅   |
| Real-time health monitoring | ✅   |
| Automatic failover          | ✅   |
| Node replication            | ✅   |
| Natural language queries    | ✅   |
| Live dashboard              | ✅   |

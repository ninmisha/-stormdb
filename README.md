# ⚡ StormDB — Distributed Database with AI-Powered Natural Language Querying

A fully local, privacy-first distributed database system that combines fault-tolerant data storage with an AI-powered natural language interface. StormDB enables users to interact with a distributed PostgreSQL cluster using plain English while providing automatic sharding, replication, failover, and real-time monitoring.

---

## 🚀 Overview

StormDB is designed to demonstrate core distributed database concepts alongside modern AI-driven user experiences.

The system distributes data across multiple PostgreSQL nodes, continuously monitors node health, automatically handles failures through replication and failover mechanisms, and allows users to query data using natural language powered by a locally running LLM.

Unlike cloud-dependent AI solutions, StormDB operates entirely on local infrastructure, ensuring complete privacy and zero external API dependency.

---

## ✨ Key Features

### 🔹 Distributed Data Storage

* Range-based sharding across multiple PostgreSQL nodes
* Automatic query routing to the correct shard
* Scalable architecture for horizontal expansion

### 🔹 Fault Tolerance & High Availability

* Continuous node health monitoring
* Automatic failure detection every 5 seconds
* Replica-based recovery mechanism
* Seamless failover to backup nodes during outages

### 🔹 AI-Powered Query Interface

* Convert natural language into SQL using LLaMA 3.2
* Execute database queries directly from plain English
* Fully local inference using Ollama
* No external API calls or cloud dependencies

### 🔹 Real-Time Monitoring Dashboard

* Live visualization of node status
* Health monitoring and uptime tracking
* Real-time query execution results
* Interactive React-based user interface

### 🔹 Privacy-First Architecture

* Entirely self-hosted
* Local AI execution
* No third-party data transmission
* Secure and offline-capable deployment

---

## 🏗️ System Architecture

```
User Query
│
▼
React Dashboard
│
▼
Node.js API Layer
│
┌───┴───────────────┐
│                   │
▼                   ▼
LLaMA 3.2       Query Router
(Ollama)             │
▼
PostgreSQL Sharded Cluster
┌──────┬──────┬──────┐
│Node 1│Node 2│Node 3│
└──────┴──────┴──────┘
│
▼
Replica Node
```

---

## 🛠️ Tech Stack

| Layer          | Technologies                |
| -------------- | --------------------------- |
| Frontend       | React.js                    |
| Backend        | Node.js, Express.js         |
| Database       | PostgreSQL                  |
| AI Engine      | LLaMA 3.2 via Ollama        |
| Vector Search  | MongoDB Atlas               |
| Infrastructure | Docker, Docker Compose      |
| Monitoring     | Custom Health Check Service |

---

## 📊 Feature Matrix

| Feature                  | Status |
| ------------------------ | ------ |
| Range-Based Sharding     | ✅      |
| Automatic Replication    | ✅      |
| Failover Recovery        | ✅      |
| Health Monitoring        | ✅      |
| Natural Language Queries | ✅      |
| AI-to-SQL Conversion     | ✅      |
| Live Dashboard           | ✅      |
| Docker Deployment        | ✅      |
| Local AI Execution       | ✅      |

---

## ⚙️ Installation & Setup

### Prerequisites

* Docker Desktop
* Node.js (v18+)
* Ollama

### 1. Install LLaMA 3.2

```bash
ollama pull llama3.2
```

### 2. Start Database Infrastructure

```bash
docker-compose up -d
```

### 3. Start Backend Server

```bash
npm install
node server.js
```

### 4. Start Frontend

```bash
cd stormdb-frontend
npm install
npm start
```

### 5. Open Application

```
http://localhost:3000
```

---

## 📌 Example Natural Language Queries

```
Show all users from Bangalore
```

```
List orders placed this month
```

```
Find customers with purchases above ₹10,000
```

The system automatically converts these requests into executable SQL queries using LLaMA 3.2.


## 🎯 Learning Outcomes

This project demonstrates practical implementation of:

* Distributed Database Design
* Data Sharding Strategies
* Replication & Failover Mechanisms
* Fault-Tolerant Systems
* AI-Powered Query Processing
* Full-Stack Development
* Docker-Based Infrastructure
* Real-Time Monitoring Systems


## 👨‍💻 Author

**K. Sruthi Ninmisha**

Built as a portfolio-grade project showcasing distributed systems, database engineering, AI integration, and modern full-stack development.

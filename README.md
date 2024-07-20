# Scheduler App

Scheduler App is a web application that allows users to schedule posts. It includes features such as user authentication, a dashboard to view all scheduled posts, and a preview feature for posts before scheduling. The backend is implemented using Node.js and Supabase.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Features

- User authentication
- Schedule posts
- Dashboard to view all scheduled posts
- Preview feature for posts before scheduling
- Error handling and validation

## Prerequisites

- Node.js (>=14.0.0)
- npm (>=6.0.0)
- Supabase account and project

## Installation

1. Clone the repository:

2. Install dependencies:
    ```bash
    npm install
    ```

## Configuration

1. Create a `.env` file in the root directory and add your Supabase credentials:
    ```plaintext
    SUPABASE_URL=your-supabase-url
    SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

2. (Optional) Add other configuration options as needed.

## Usage

1. Start the development server:
    ```bash
    npm run dev
    ```

2. The server will be running at `http://localhost:3000`.

## API Endpoints

### Authentication

- **Sign Up**
  - `POST /auth/signup`
  - Request Body: `{ email, password }`
  - Response: `{ user, token }`

- **Sign In**
  - `POST /auth/signin`
  - Request Body: `{ email, password }`
  - Response: `{ user, token }`

### Posts

- **Get All Posts**
  - `GET /posts`
  - Response: `[{ id, title, content, scheduledAt }]`

- **Create a Post**
  - `POST /posts`
  - Request Body: `{ title, content, scheduledAt }`
  - Response: `{ id, title, content, scheduledAt }`


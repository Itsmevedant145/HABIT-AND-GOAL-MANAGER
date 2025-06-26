HABIT-AND-GOAL-MANAGER

Habit & Goal Manager is a full-stack web application designed to help you set and achieve your long-term goals by building and tracking daily habits. It includes secure user authentication, goal and habit management, milestone tracking, and a dynamic dashboard for monitoring your progress.

Overview

This app keeps you motivated by letting you create goals and break them down into smaller milestones. You can build habits linked to those goals, track your habit completions, and watch your progress grow over time. The dashboard gives a clear picture of your overall status, habit streaks, and milestone achievements. User profiles and settings let you personalize your experience.

Features

User registration and login secured with JWT authentication

Create, update, and delete personal goals

Add milestones to goals to break down progress into manageable steps and mark them complete

Create, update, and delete daily or recurring habits

Link habits to goals with customizable contribution weights

Toggle habit completion for specific dates

View a dashboard summarizing progress, habit streaks, and milestone statuses

Manage your profile and account settings, including password changes and account deletion

Backend API Endpoints

Authentication

POST /api/auth/register — Register a new user

POST /api/auth/login — Log in and receive a JWT token

User

GET /api/users/me — Get current user's profile

PUT /api/users/me — Update user information

PUT /api/users/me/password — Change password

DELETE /api/users/me — Delete account

Habits

POST /api/habits — Create a new habit

GET /api/habits — Retrieve all habits

PUT /api/habits/:habitId — Update a habit

DELETE /api/habits/:habitId — Delete a habit

POST /api/habits/:habitId/toggle-completion — Toggle habit completion for a date

Goals

POST /api/goals — Create a new goal

GET /api/goals — Get all goals

GET /api/goals/:goalId — Get a specific goal

PUT /api/goals/:goalId — Update a goal

DELETE /api/goals/:goalId — Delete a goal

POST /api/goals/:goalId/habits — Link a habit to a goal

GET /api/goals/:goalId/progress — Get goal progress

POST /api/goals/:goalId/milestones — Add a milestone to a goal

PUT /api/goals/milestones/:milestoneId/complete — Mark a milestone as complete

Analytics

GET /api/analytics/weekly-summary — Weekly summary of habits and goals

GET /api/analytics/habit-streaks/:habitId — Get habit streak data

GET /api/analytics/stats — Overall user stats

Technologies Used

Frontend: React, Vite, Tailwind CSS

Backend: Node.js, Express, MongoDB

Authentication: JWT

State Management: React Context

API Client: Axios

Setup Instructions

Prerequisites

Node.js and npm installed

MongoDB running locally or accessible via cloud

Backend Setup

Navigate to the backend folder: cd backend

Install dependencies: npm install

Create a .env file with:

ini
Copy
Edit
MONGODB_URI=your_mongo_connection_string  
JWT_SECRET=your_jwt_secret  
Start backend server: npm run dev or node Server.js

Frontend Setup

Navigate to the frontend folder: cd frontend

Install dependencies: npm install

Start frontend server: npm run dev

Open the app in your browser: http://localhost:5173

Project Structure

/frontend — React frontend application

/backend — Node.js and Express backend API

Both folders contain components, pages, hooks, and utility functions to keep code organized and maintainable.

Deployment

You can deploy the frontend on platforms like Vercel and the backend on services such as Render or Railway.

License

This project is open source. Feel free to use, modify, and share it as you like.

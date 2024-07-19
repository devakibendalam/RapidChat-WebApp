# Telegram Clone

This project is a pixel-perfect replica of the Telegram messaging application, built using ReactJS, TanStack Query. It replicates both desktop and mobile views of the Telegram UI/UX.

## Live Demo: https://telegram-react-project.netlify.app/

## Features

- Responsive design for both desktop and mobile views
- Chat list display with search functionality
- Individual chat message display
- Dark and light mode toggle
- Integration with provided API endpoints for chat and message data

## Technologies Used

- ReactJS
- Vite (for build tooling and development server)
- TanStack Query (React Query) for state management
- Material-UI (MUI)

## API Integration

The application uses two main API endpoints:

1. Chat List API:
   - URL: https://devapi.beyondchats.com/api/get_all_chats?page=1
   - Type: GET
   - Description: Returns a paginated list of chats

2. Chat Messages API:
   - URL: https://devapi.beyondchats.com/api/get_chat_messages?chat_id=[CHAT_ID]
   - Type: GET
   - Description: Returns a list of messages for a given chat ID

## Running the Application

To run the application in development mode:
npm run dev

This will start the Vite development server. Open your browser and navigate to the URL provided in the console (usually http://localhost:5173).

## Deployment

This project is deployed on Netlify.

## Contact

Vinay kumar - s170528@rguktsklm.ac.in

Project Link: https://github.com/P-Vinay-kumar/React-Project

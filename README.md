# Mystery Message

Mystery Message is a full-stack web application that allows users to sign up, verify their email via a verification code, and receive anonymous messages. It features AI-powered message suggestions and an intuitive interface for managing received messages.

## Features

- **User Registration & Authentication**:
  - Users can sign up and verify their email through a unique verification code sent via email.
  - Authentication is handled using `next-auth`.

- **Anonymous Messaging**:
  - Users can opt-in to receive anonymous messages.
  - Non-logged-in users can send messages to registered users.

- **Message Management**:
  - Users can view received messages.
  - Messages can be deleted with a single click.

- **AI-Powered Message Suggestions**:
  - Integrated with Gimni AI to suggest message content.

- **Toast Notifications**:
  - Real-time feedback using `react-hot-toast`.

## Technologies Used

### Frontend:
- **Next.js**: Framework for building server-rendered React applications.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **shadcn**: UI components for a consistent design.
- **React Hot Toast**: For toast notifications.

### Backend:
- **Next.js**: Backend APIs built with Next.js.
- **Mongoose**: For interacting with MongoDB.
- **MailerSend**: To send email verification codes.
- **NextAuth.js**: For authentication and session management.

### Deployment:
- **Render**: The application is deployed using Render.
  
### Screenshots:
<img width="1920" height="2210" alt="screencapture-mystery-messages-onrender-2026-03-02-21_46_53" src="https://github.com/user-attachments/assets/4498157d-fa41-4bfb-a239-1ddcb324d56c" />





## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mystery-message.git
   cd mystery-message
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```bash
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   MONGODB_URI=your-mongodb-connection-string
   MAILERSEND_API_KEY=your-mailersend-api-key
   MAILERSEND_FROM_EMAIL=your-verified-sender-email
   GIMNI_AI_API_KEY=your-gimni-ai-api-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Deployment

This project is deployed on [Render](https://render.com/). To deploy:

1. Push your code to a GitHub repository.
2. Link the repository to Render.
3. Set up environment variables in Render's settings.
4. Deploy the application.

## Usage

1. **Sign Up**:
   - Register with an email address.
   - Verify your email using the code sent to your inbox.

2. **Enable Message Receiving**:
   - Opt-in to accept anonymous messages.

3. **Send and Manage Messages**:
   - Anyone can send messages without logging in.
   - View and delete received messages from your dashboard.

4. **AI Suggestions**:
   - Use Gimni AI for message suggestions.

## Screenshots
Add screenshots here to showcase your application.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn](https://ui.shadcn.dev/)
- [MailerSend](https://www.mailersend.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Gimni AI](https://gimni.ai/)



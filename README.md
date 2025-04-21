# KasaBridge

KasaBridge is an inclusive communication tool designed to empower speech-impaired individuals by converting text into Akan speech. It now features a fully embedded meeting experience using Jitsi Meet, allowing users to join and participate in meetings directly within the app, with all meeting controls and transcription/text-to-speech features available side-by-side.

## 🌟 Features

- **Text-to-Speech**: Type your message and convert it to natural-sounding Akan speech
- **Embedded Meetings**: Join and participate in Jitsi meetings directly inside the app, with full video/audio controls
- **Transcription Panel**: Use the Akan speech panel alongside your meeting for seamless communication
- **Responsive Design**: Works seamlessly across devices of all sizes
- **Dark/Light Mode**: Choose your preferred theme
- **Accessibility Features**: Designed with inclusivity in mind

## 📱 Screenshots

*Coming soon: screenshots of the embedded meeting and transcription panel*

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- pnpm, npm, or yarn

### Installation

1. Clone the repository:

   ```sh
   git clone https://git@github.com:Aliu2211/KasaBridge.git
   cd kasaBridge
   ```
2. Install dependencies:
   ```sh
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```sh
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```sh
pnpm build
# or
npm run build
# or
yarn build
```

## 🔧 Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For styling and responsive design
- **shadcn/ui**: For UI components
- **Jitsi Meet External API**: For embedded video meetings

## 📖 How to Use

### Text Input & Akan Speech

1. Type your message in the text input field
2. Click "Generate Akan Speech" to generate audio
3. Use the audio controls to play, pause, or adjust volume

### Embedded Meetings

1. Click "Join Meeting" in the sidebar
2. Paste your Jitsi meeting link (e.g., https://meet.jit.si/RoomName)
3. Join the meeting directly inside the app
4. Use the transcription panel to type and generate Akan speech during the meeting
5. All Jitsi controls (chat, participants, screen sharing, etc.) are available in the embedded meeting

## 🧩 Project Structure

```
app/            # Next.js app directory
components/     # React components (including meeting-integration)
hooks/          # Custom React hooks
lib/            # Utility functions and shared logic
public/         # Static assets
styles/         # Global and component styles
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Built for the Tɛkyerɛma Pa Hackathon 2025
- Special thanks to all contributors and supporters

---

Made with ❤️ for inclusive communication


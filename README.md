# KasaBridge

KasaBridge is an inclusive communication tool designed to empower speech-impaired individuals by converting text and sign language into Akan speech. It serves as a bridge between different forms of expression, allowing users to communicate effectively regardless of speech limitations.

## 🌟 Features

- **Text-to-Speech**: Type your message and convert it to natural-sounding Akan speech
- **Sign Language Detection**: Use your device's camera for real-time sign language interpretation
- **Meeting Integration**: Join video conferences with text or sign language input
- **Progressive Web App**: Install on your device for offline use
- **Responsive Design**: Works seamlessly across devices of all sizes
- **Dark/Light Mode**: Choose your preferred theme
- **Accessibility Features**: Designed with inclusivity in mind

## 📱 Screenshots



## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
 ```sh
   git clone git@github.com:Aliu2211/KasaBridge.git
   cd kasaBridge
 ```

3. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

4. Start the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```sh
npm run build
# or
yarn build
```

## 🔧 Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For styling and responsive design
- **shadcn/ui**: For UI components
- **Progressive Web App (PWA)**: For offline capabilities
- **MediaDevices API**: For camera access and sign language detection

## 📖 How to Use

### Text Input

1. Type your message in the text input field
2. Click "Convert to Akan Speech" to generate audio
3. Use the audio controls to play, pause, or adjust volume

### Sign Language Detection

1. Click the camera icon to enable your device's camera
2. Position yourself in a well-lit area with your hands clearly visible
3. Make sign language gestures in front of the camera
4. The system will detect and interpret your signs, converting them to text and then to Akan speech

### Meeting Integration

1. Click "Join Meeting" in the sidebar
2. Enter the URL of your Zoom, Google Meet, or Microsoft Teams meeting
3. Join the meeting in a new tab
4. Use KasaBridge to convert your text or sign language to speech
5. Share your computer audio in the meeting to be heard

## 🧩 Project Structure

```
kasabridge/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── chat/             # Chat interface
│   ├── help/             # Help center
│   ├── settings/         # Settings page
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── ui/               # UI components (shadcn)
│   └── ...               # Application components
├── lib/                  # Utility functions and hooks
├── public/               # Static assets
└── ...                   # Configuration files
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
\`\`\`


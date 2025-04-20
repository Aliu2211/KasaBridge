import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">About KasaBridge</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
          <CardDescription>Bridging communication gaps through technology</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            KasaBridge was created to empower speech-impaired individuals by providing an accessible tool for
            communication in Akan language contexts. Our application bridges the gap between different forms of
            expression, allowing users to communicate effectively regardless of speech limitations.
          </p>
          <p>
            By combining modern web technologies with inclusive design principles, we aim to create a world where
            everyone has equal opportunity to express themselves and be understood.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>Simple, intuitive, and powerful</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Text Input</h3>
              <p>
                Type your message in English, and our system will convert it to Akan audio. This mode is perfect for
                those who can type but have difficulty speaking.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Sign Language Input</h3>
              <p>
                Use your device's camera to capture sign language gestures. Our system will interpret these signs,
                convert them to text, and then generate Akan audio output.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Akan Audio Output</h3>
              <p>
                Both input methods produce clear Akan speech, allowing users to communicate effectively in Akan-speaking
                environments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Our Technology</CardTitle>
          <CardDescription>Built with modern, accessible web standards</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            KasaBridge is built using Next.js, a powerful React framework that enables us to create fast, responsive web
            applications. We've implemented Progressive Web App (PWA) technology, allowing users to install KasaBridge
            on their devices and use it even with limited internet connectivity.
          </p>
          <p className="mb-4">
            Our sign language detection system uses computer vision technology to recognize and interpret signs in
            real-time. The text-to-speech component leverages advanced linguistic models to generate natural-sounding
            Akan speech.
          </p>
          <p>
            All of this is wrapped in an accessible, user-friendly interface designed to work seamlessly across devices
            of all sizes.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AccessibilityPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Accessibility</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Our Commitment</CardTitle>
          <CardDescription>Making communication accessible to everyone</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            At KasaBridge, accessibility isn't just a feature—it's our foundation. We believe that communication tools
            should be available to everyone, regardless of ability or disability.
          </p>
          <p>
            Our application is designed with accessibility as a core principle, following WCAG guidelines and best
            practices to ensure that all users can navigate, understand, and interact with our platform effectively.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Accessibility Features</CardTitle>
          <CardDescription>How we make KasaBridge accessible</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Keyboard Navigation</h3>
              <p>
                All features of KasaBridge can be accessed using a keyboard alone, with logical tab order and visible
                focus indicators.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Screen Reader Support</h3>
              <p>
                We've implemented proper ARIA attributes and semantic HTML to ensure compatibility with screen readers
                and other assistive technologies.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Color Contrast</h3>
              <p>
                Our color scheme is designed to provide sufficient contrast for users with visual impairments, and we
                offer a dark mode option for those who prefer or require it.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Responsive Design</h3>
              <p>
                KasaBridge adapts to different screen sizes and orientations, making it usable on devices ranging from
                smartphones to desktop computers.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Text Alternatives</h3>
              <p>
                All non-text content, including icons and images, has appropriate text alternatives for users who cannot
                see them.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedback and Improvements</CardTitle>
          <CardDescription>Help us make KasaBridge better</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We're committed to continuously improving the accessibility of KasaBridge. If you encounter any barriers or
            have suggestions for how we can make our application more accessible, please let us know.
          </p>
          <p>Your feedback is invaluable in helping us create a more inclusive communication tool for everyone.</p>
        </CardContent>
      </Card>
    </div>
  )
}

import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

export const metadata = {
  title: 'AI Chatbot - Next Generation',
  description: 'Premium AI Chatbot with Clerk Authentication',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider 
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#814dff',
          colorBackground: '#0f111a',
          colorText: 'white',
          borderRadius: '12px',
        },
        elements: {
          card: 'auth-card',
          navbar: 'hidden',
          headerTitle: 'auth-header-title',
          headerSubtitle: 'auth-header-subtitle',
          socialButtonsBlockButton: 'auth-social-button',
          formButtonPrimary: 'btn-primary border-none shadow-lg',
          footerActionLink: 'auth-link',
          formFieldLabel: 'auth-label',
          formFieldInput: 'auth-input',
          dividerText: 'auth-header-subtitle',
          dividerLine: 'auth-divider-line',
          socialButtonsBlockButtonText: 'auth-social-text',
        }
      }}
    >
      <html lang="en">
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

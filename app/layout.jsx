import './globals.css'

export const metadata = {
  title: 'African AI Policy Tracker',
  description: 'Monitoring AI legislation and regulatory proposals across 55 AU member states',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#f9f9f8', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}

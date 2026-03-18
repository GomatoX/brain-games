export default function ShareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="lt">
      <body>{children}</body>
    </html>
  )
}

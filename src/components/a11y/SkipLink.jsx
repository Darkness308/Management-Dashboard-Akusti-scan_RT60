/**
 * Skip Link Component
 * Allows keyboard users to skip to main content
 * WCAG 2.1 Success Criterion 2.4.1 (Bypass Blocks)
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
    >
      Zum Hauptinhalt springen
    </a>
  )
}

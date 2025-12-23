export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-3xl font-black">Privacy Policy</h1>
        <p className="text-white/70 text-sm">Last updated: {new Date().toISOString().slice(0, 10)}</p>

        <p className="text-white/80">
          Reset Run is designed to be lightweight and privacy‑respecting. We store your progress locally on your
          device. If you join the waitlist, we store your email (and any optional details you provide) to contact
          you about early access.
        </p>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">What we collect</h2>
          <ul className="text-white/75 list-disc pl-5 space-y-2">
            <li>Waitlist email (required for waitlist).</li>
            <li>Optional details you provide (first name, last name, phone).</li>
            <li>Local progress data stored on your device (not sent to us).</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">How we use it</h2>
          <ul className="text-white/75 list-disc pl-5 space-y-2">
            <li>To contact you about early access and product updates.</li>
            <li>To improve the product experience.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Data retention</h2>
          <p className="text-white/75">
            Waitlist data is retained until it is no longer needed for early access onboarding or you request removal.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="text-white/75">Email us if you have questions or want your data removed.</p>
        </div>
      </div>
    </main>
  )
}

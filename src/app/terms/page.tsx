export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-3xl font-black">Terms of Service</h1>
        <p className="text-white/70 text-sm">Last updated: {new Date().toISOString().slice(0, 10)}</p>

        <p className="text-white/80">
          By using Reset Run, you agree to use the app responsibly and for personal wellness purposes only.
          The app is provided "as is" without warranties of any kind.
        </p>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Use of the service</h2>
          <ul className="text-white/75 list-disc pl-5 space-y-2">
            <li>You are responsible for your own health decisions.</li>
            <li>Do not use the app for emergency or medical guidance.</li>
            <li>We may update or discontinue features at any time.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Accounts and waitlist</h2>
          <p className="text-white/75">
            If you join the waitlist, you consent to being contacted about early access and product updates.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Limitation of liability</h2>
          <p className="text-white/75">
            We are not liable for any damages arising from use of the app.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="text-white/75">Email us if you have questions about these terms.</p>
        </div>
      </div>
    </main>
  )
}

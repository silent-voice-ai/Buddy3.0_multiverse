import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold">BUDDY 3.0</span>
          </Link>
          <Link href="/signup" className="text-sm font-medium text-emerald-600 hover:underline">Sign Up</Link>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: January 2026</p>

        <div className="mt-8 space-y-8 text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">1. Data We Collect</h2>
            <p className="mt-2 leading-relaxed">BUDDY 3.0 collects the following information when you create an account and use the app:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Full name and email address</li>
              <li>Age group selection (Kids, Teens, or Youth)</li>
              <li>Country and currency preference</li>
              <li>Spending records (where you spent and how much)</li>
              <li>Savings goals and target amounts</li>
              <li>Investment values (invested amount and current value)</li>
              <li>App preferences and settings</li>
              <li>Future Self messages and Roaster feedback</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">2. Data Storage and Security</h2>
            <p className="mt-2 leading-relaxed">Your app data is stored locally in your browser using localStorage. Your account credentials (email and a hashed password) are also stored locally. BUDDY does not store plain-text passwords. We do not transmit your personal data to any server for app functionality.</p>
            <p className="mt-2 leading-relaxed">Because data is stored in your browser, clearing your browser data or using a different device/browser will not carry your data over.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">3. How We Use Your Data</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>To provide you with spending tracking, budgeting, goals, and investment features</li>
              <li>To personalize your experience based on your age group</li>
              <li>To generate friendly Roaster messages based on your spending habits</li>
              <li>To save your Future Self messages and unlock them at the right time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">4. We Do Not Sell or Share Your Data</h2>
            <p className="mt-2 leading-relaxed">BUDDY 3.0 does not sell, rent, or share your personal data with any third party. Your data stays on your device.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">5. BUDDY Store Payments</h2>
            <p className="mt-2 leading-relaxed">When you purchase a product from the BUDDY Store, the payment is processed by Razorpay, a third-party payment gateway. BUDDY does not collect or store your UPI PIN, OTP, bank password, or card details. All payment information is handled directly by Razorpay on their secure platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">6. Your Rights</h2>
            <p className="mt-2 leading-relaxed">You have full control over your data. You can:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li><strong>Edit</strong> — Change your preferences, goals, and spending records at any time</li>
              <li><strong>Delete</strong> — Remove individual expenses, goals, or messages</li>
              <li><strong>Export</strong> — Your data is visible within the app at all times</li>
              <li><strong>Reset</strong> — Clear all app data from Settings (with confirmation)</li>
              <li><strong>Delete Account</strong> — Permanently remove your account and all associated data from Settings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">7. Children&apos;s Privacy</h2>
            <p className="mt-2 leading-relaxed">BUDDY 3.0 includes a Kids mode designed for children ages 3–10. We recommend that parents or guardians help younger children set up and use the app. No sensitive financial data (such as bank details or real payment information) is collected from any user, including children. The Kids mode uses simulated savings and spending tools for educational purposes only.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">8. Contact Us</h2>
            <p className="mt-2 leading-relaxed">If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:support@buddy3.app" className="font-medium text-emerald-600 hover:underline">support@buddy3.app</a></p>
          </section>
        </div>

        <div className="mt-12 flex gap-4">
          <Link href="/signup" className="text-sm font-medium text-emerald-600 hover:underline">Back to Sign Up</Link>
          <Link href="/terms" className="text-sm font-medium text-slate-600 hover:underline">Terms of Use</Link>
        </div>
      </article>
    </div>
  );
}

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function TermsOfUsePage() {
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
        <h1 className="text-3xl font-bold text-slate-900">Terms of Use</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: January 2026</p>

        <div className="mt-8 space-y-8 text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">1. Acceptance of Terms</h2>
            <p className="mt-2 leading-relaxed">By creating an account and using BUDDY 3.0, you agree to these Terms of Use. If you do not agree, please do not use the app.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">2. What BUDDY 3.0 Is</h2>
            <p className="mt-2 leading-relaxed">BUDDY 3.0 is a personal money management app designed for educational and organizational purposes. It helps you track spending, manage budgets, set savings goals, and learn about money across three age-based worlds.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">3. Not Financial Advice</h2>
            <p className="mt-2 leading-relaxed">BUDDY 3.0 is a tool for tracking and organizing your own financial information. It does not provide financial advice, investment recommendations, or financial planning services. Always consult a qualified financial advisor before making investment decisions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">4. User Responsibilities</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>You are responsible for the accuracy of the data you enter</li>
              <li>You are responsible for keeping your account password secure</li>
              <li>You agree not to use the app for any illegal or unauthorized purpose</li>
              <li>You agree not to attempt to reverse engineer or compromise the app</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">5. BUDDY Store</h2>
            <p className="mt-2 leading-relaxed">The BUDDY Store offers digital products for purchase. Payments are processed by Razorpay, a third-party payment gateway. BUDDY does not handle payment processing directly and does not collect payment credentials. All digital product purchases are final. Delivery details will be shared after payment.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">6. Data and Privacy</h2>
            <p className="mt-2 leading-relaxed">Your use of BUDDY 3.0 is also governed by our Privacy Policy. Please review it to understand how your data is handled.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">7. Limitation of Liability</h2>
            <p className="mt-2 leading-relaxed">BUDDY 3.0 is provided &quot;as is&quot; without warranties of any kind. We are not liable for any financial losses, data loss, or damages arising from your use of the app. Since data is stored locally in your browser, we are not responsible for data loss due to browser settings or device changes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">8. Changes to Terms</h2>
            <p className="mt-2 leading-relaxed">We may update these Terms from time to time. Continued use of the app after changes constitutes acceptance of the new Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">9. Contact</h2>
            <p className="mt-2 leading-relaxed">Questions about these Terms? Contact us at: <a href="mailto:support@buddy3.app" className="font-medium text-emerald-600 hover:underline">support@buddy3.app</a></p>
          </section>
        </div>

        <div className="mt-12 flex gap-4">
          <Link href="/signup" className="text-sm font-medium text-emerald-600 hover:underline">Back to Sign Up</Link>
          <Link href="/privacy" className="text-sm font-medium text-slate-600 hover:underline">Privacy Policy</Link>
        </div>
      </article>
    </div>
  );
}

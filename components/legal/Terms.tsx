"use client";

export default function TermsAndConditionsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: (
        <>
          <p>
            Welcome to <strong>Tech Engi</strong>. By accessing or using our
            platform, website, mobile application, APIs, or related services
            (collectively, the "Platform"), you agree to be bound by these Terms
            and Conditions. If you do not agree with any part of these Terms,
            you must discontinue using the Platform immediately.
          </p>
        </>
      ),
    },
    {
      title: "2. About Tech Engi",
      content: (
        <>
          <p>
            Tech Engi is a professional networking and engineering marketplace
            that connects engineers, developers, designers, consultants, and
            other technical professionals with businesses and clients looking
            for engineering services.
          </p>

          <p className="mt-4">
            Tech Engi acts solely as a technology platform facilitating
            communication and collaboration. Unless explicitly stated, Tech Engi
            is not a party to agreements formed between users.
          </p>
        </>
      ),
    },
    {
      title: "3. Eligibility",
      content: (
        <>
          <p>You must:</p>

          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>Be at least 18 years old.</li>
            <li>Provide accurate registration information.</li>
            <li>Maintain the confidentiality of your account.</li>
            <li>Be legally permitted to enter into binding agreements.</li>
          </ul>
        </>
      ),
    },
    {
      title: "4. User Accounts",
      content: (
        <>
          <p>Users are responsible for:</p>

          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>Maintaining account security.</li>
            <li>Keeping profile information accurate.</li>
            <li>Protecting login credentials.</li>
            <li>All activities performed using their account.</li>
          </ul>
        </>
      ),
    },
    {
      title: "5. Platform Usage",
      content: (
        <>
          <p>You agree to use Tech Engi only for lawful purposes.</p>

          <div className="mt-6 rounded-xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900">You must not:</h4>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Provide false or misleading information.</li>
              <li>Impersonate another individual or organization.</li>
              <li>Upload malicious software or harmful code.</li>
              <li>Attempt unauthorized access to the Platform.</li>
              <li>Violate applicable laws or regulations.</li>
              <li>Interfere with platform security or operations.</li>
              <li>Use automated scraping tools without permission.</li>
            </ul>
          </div>
        </>
      ),
    },
    {
      title: "6. Engineer Responsibilities",
      content: (
        <>
          <p>Engineers using the Platform agree to:</p>

          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>Provide accurate qualifications and experience.</li>
            <li>Deliver services professionally.</li>
            <li>Respect client confidentiality.</li>
            <li>Comply with applicable laws.</li>
            <li>Complete projects ethically.</li>
          </ul>
        </>
      ),
    },
    {
      title: "7. Client Responsibilities",
      content: (
        <>
          <p>Clients agree to:</p>

          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>Provide accurate project requirements.</li>
            <li>Communicate professionally.</li>
            <li>Honor agreed payment obligations.</li>
            <li>Respect intellectual property rights.</li>
          </ul>
        </>
      ),
    },
    {
      title: "8. Payments",
      content: (
        <>
          <p>
            Payments processed through Tech Engi are subject to applicable fees,
            payment provider terms, taxes, and transaction policies.
          </p>

          <p className="mt-4">
            Tech Engi reserves the right to introduce service fees, commissions,
            subscription plans, or premium features at any time.
          </p>
        </>
      ),
    },
    {
      title: "9. Intellectual Property",
      content: (
        <>
          <p>
            All trademarks, branding, software, logos, interface designs,
            documentation, source code, graphics, and platform content remain
            the exclusive property of Tech Engi unless otherwise stated.
          </p>

          <p className="mt-4">
            Users retain ownership of content they upload while granting Tech
            Engi the rights necessary to operate and improve the Platform.
          </p>
        </>
      ),
    },
    {
      title: "10. AI & Platform Improvements",
      content: (
        <>
          <p>
            By using Tech Engi, you acknowledge that certain information
            voluntarily submitted to the Platform may be analyzed to improve
            recommendation systems, search quality, platform automation,
            analytics, and artificial intelligence models.
          </p>

          <p className="mt-4">
            Where appropriate, data may be aggregated or anonymized before being
            used for research and model improvement.
          </p>
        </>
      ),
    },
    {
      title: "11. Privacy",
      content: (
        <>
          <p>
            Your use of the Platform is also governed by our Privacy Policy,
            which explains how your information is collected, processed, stored,
            and protected.
          </p>
        </>
      ),
    },
    {
      title: "12. Suspension & Termination",
      content: (
        <>
          <p>We reserve the right to suspend or permanently terminate accounts that:</p>

          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>Violate these Terms.</li>
            <li>Engage in fraudulent activity.</li>
            <li>Threaten platform security.</li>
            <li>Abuse other users.</li>
            <li>Violate applicable laws.</li>
          </ul>
        </>
      ),
    },
    {
      title: "13. Disclaimer",
      content: (
        <>
          <p>
            Tech Engi is provided on an "AS IS" and "AS AVAILABLE" basis without
            warranties of any kind, whether express or implied.
          </p>

          <p className="mt-4">
            We do not guarantee uninterrupted availability, successful hiring,
            project completion, or financial outcomes.
          </p>
        </>
      ),
    },
    {
      title: "14. Limitation of Liability",
      content: (
        <>
          <p>
            To the maximum extent permitted by law, Tech Engi shall not be
            liable for indirect, incidental, consequential, special, or punitive
            damages arising from the use of the Platform.
          </p>
        </>
      ),
    },
    {
      title: "15. Indemnification",
      content: (
        <>
          <p>
            Users agree to indemnify and hold harmless Tech Engi, its
            employees, directors, affiliates, and partners against claims,
            losses, damages, liabilities, and expenses arising from misuse of
            the Platform or violation of these Terms.
          </p>
        </>
      ),
    },
    {
      title: "16. Governing Law",
      content: (
        <>
          <p>
            These Terms shall be governed by and interpreted in accordance with
            the laws of the applicable jurisdiction where Tech Engi operates,
            unless otherwise required by applicable law.
          </p>
        </>
      ),
    },
    {
      title: "17. Changes to Terms",
      content: (
        <>
          <p>
            Tech Engi may update these Terms from time to time. Continued use of
            the Platform after updates constitutes acceptance of the revised
            Terms.
          </p>
        </>
      ),
    },
    {
      title: "18. Contact Us",
      content: (
        <>
          <div className="space-y-2">
            <p>
              <strong>Tech Engi</strong>
            </p>
            <p>Support: tsy1@tsquarey.store</p>
            <p>Website: https://techengi.tsquarey.store</p>
          </div>
        </>
      ),
    },
  ];

  return (
    <main className="bg-white text-gray-700">
      <section className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <span className="rounded-full border border-gray-300 px-4 py-1 text-sm font-medium">
            Legal
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-gray-900">
            Terms & Conditions
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Please read these Terms and Conditions carefully before using Tech
            Engi. By accessing or using our Platform, you agree to comply with
            these Terms.
          </p>

          <div className="mt-8 flex flex-wrap gap-8 text-sm text-gray-500">
            <span>
              <strong className="text-gray-900">Effective:</strong> July 20,
              2026
            </span>

            <span>
              <strong className="text-gray-900">Last Updated:</strong> July 20,
              2026
            </span>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl space-y-16 px-6 lg:px-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-3xl font-bold text-gray-900">
                {section.title}
              </h2>

              <div className="mt-6 space-y-4 leading-8">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
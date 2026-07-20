"use client";

export default function PrivacyPolicy() {
  return (
    <main className="bg-white text-gray-700">
      <section className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <span className="inline-flex rounded-full border border-gray-300 px-4 py-1 text-sm font-medium text-gray-600">
            Legal
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Privacy Policy
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Your privacy matters to us. This Privacy Policy explains how Tech
            Engi collects, uses, stores, and protects your information while
            connecting engineers with clients worldwide.
          </p>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-500">
            <div>
              <span className="font-semibold text-gray-800">
                Effective Date:
              </span>{" "}
              July 20, 2026
            </div>

            <div>
              <span className="font-semibold text-gray-800">
                Last Updated:
              </span>{" "}
              July 20, 2026
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="space-y-16">

            {/* About */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900">
                1. About Tech Engi
              </h2>

              <p className="mt-5 leading-8">
                Tech Engi is a professional engineering platform that connects
                engineers, developers, designers, consultants, and technical
                professionals with businesses and clients seeking engineering
                services. Our platform enables networking, hiring, project
                collaboration, communication, and professional growth.
              </p>
            </section>

            {/* Information */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900">
                2. Information We Collect
              </h2>

              <p className="mt-5 leading-8">
                We collect information that you voluntarily provide, as well as
                certain technical information required to operate our platform.
              </p>

              <div className="mt-8 grid gap-8 md:grid-cols-2">

                <div className="rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Personal Information
                  </h3>

                  <ul className="mt-4 list-disc space-y-2 pl-5">
                    <li>Full name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Profile photo</li>
                    <li>Professional headline</li>
                    <li>Education</li>
                    <li>Work experience</li>
                    <li>Portfolio links</li>
                    <li>Resume / CV</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Platform Data
                  </h3>

                  <ul className="mt-4 list-disc space-y-2 pl-5">
                    <li>Projects</li>
                    <li>Proposals</li>
                    <li>Uploaded documents</li>
                    <li>Portfolio content</li>
                    <li>Skills & expertise</li>
                    <li>Messages</li>
                    <li>Reviews & ratings</li>
                    <li>Support requests</li>
                  </ul>
                </div>

              </div>

              <div className="mt-8 rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Technical Information
                </h3>

                <ul className="mt-4 grid list-disc gap-2 pl-5 md:grid-cols-2">
                  <li>IP Address</li>
                  <li>Browser information</li>
                  <li>Operating system</li>
                  <li>Device information</li>
                  <li>Session logs</li>
                  <li>Usage analytics</li>
                  <li>Cookies</li>
                  <li>Performance metrics</li>
                </ul>
              </div>
            </section>

            {/* Usage */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900">
                3. How We Use Your Information
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  "Create and manage your account",
                  "Connect engineers with clients",
                  "Recommend projects",
                  "Improve platform performance",
                  "Provide customer support",
                  "Process payments",
                  "Prevent fraud and abuse",
                  "Maintain platform security",
                  "Analyze platform usage",
                  "Develop new features",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-gray-200 p-5"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* AI */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900">
                4. AI Model Training
              </h2>

              <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-8">
                <p className="leading-8">
                  Tech Engi may use certain information voluntarily submitted by
                  users to improve artificial intelligence, recommendation
                  systems, search quality, automation, and overall platform
                  performance.
                </p>

                <p className="mt-5 leading-8">
                  Information used may include profile information, engineering
                  skills, portfolio descriptions, technical documentation,
                  project metadata, and interactions with platform features.
                </p>

                <p className="mt-5 leading-8">
                  Where appropriate, we use aggregation, anonymization, or
                  de-identification techniques before utilizing data for model
                  training. We do not intentionally use confidential client
                  information or private communications for AI training without
                  an appropriate legal basis or required consent.
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900">
                5. Cookies & Analytics
              </h2>

              <p className="mt-5 leading-8">
                We use cookies and similar technologies to remember your
                preferences, keep you signed in, analyze usage, improve
                performance, and protect the security of our platform.
              </p>
            </section>

            {/* Sharing */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900">
                6. Information Sharing
              </h2>

              <p className="mt-5 leading-8">
                We may share information with trusted service providers,
                payment processors, cloud infrastructure providers, identity
                verification services, legal authorities where required, and
                business successors in case of mergers or acquisitions.
              </p>

              <p className="mt-5 font-semibold text-gray-900">
                We do not sell your personal information.
              </p>
            </section>

            {/* Security */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900">
                7. Data Security
              </h2>

              <p className="mt-5 leading-8">
                We implement appropriate technical and organizational safeguards
                designed to protect your information against unauthorized
                access, alteration, disclosure, or destruction. While we strive
                to protect your information, no system can guarantee absolute
                security.
              </p>
            </section>

            {/* Retention */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900">
                8. Data Retention
              </h2>

              <p className="mt-5 leading-8">
                We retain personal information only for as long as necessary to
                provide our services, comply with legal obligations, resolve
                disputes, and improve our platform. Aggregated or anonymized
                information may be retained for research and analytics.
              </p>
            </section>

            {/* Rights */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900">
                9. Your Rights
              </h2>

              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  "Access your information",
                  "Update your information",
                  "Delete your account",
                  "Request data deletion",
                  "Restrict data processing",
                  "Withdraw consent",
                  "Request data export",
                  "Object to processing",
                  "Contact our privacy team",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-gray-200 p-5"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* Third Party */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900">
                10. Third-Party Services
              </h2>

              <p className="mt-5 leading-8">
                Our platform may integrate with payment providers, analytics
                providers, authentication services, communication tools, cloud
                infrastructure, and other third-party services. These providers
                maintain their own privacy policies.
              </p>
            </section>

            {/* Children */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900">
                11. Children's Privacy
              </h2>

              <p className="mt-5 leading-8">
                Tech Engi is intended for individuals aged 18 years or older.
                We do not knowingly collect personal information from children.
              </p>
            </section>

            {/* International */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900">
                12. International Data Transfers
              </h2>

              <p className="mt-5 leading-8">
                Your information may be processed and stored in countries where
                our infrastructure or service providers operate. Appropriate
                safeguards are implemented in accordance with applicable laws.
              </p>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900">
                13. Changes to this Policy
              </h2>

              <p className="mt-5 leading-8">
                We may update this Privacy Policy from time to time. Any changes
                become effective immediately upon publication unless otherwise
                stated.
              </p>
            </section>

            {/* Contact */}
            <section className="rounded-2xl border border-gray-200 bg-gray-50 p-10">
              <h2 className="text-3xl font-bold text-gray-900">
                14. Contact Us
              </h2>

              <p className="mt-5 leading-8">
                If you have any questions regarding this Privacy Policy or our
                privacy practices, please contact us.
              </p>

              <div className="mt-8 space-y-2">
                <p>
                  <span className="font-semibold text-gray-900">
                    Company:
                  </span>{" "}
                  Tech Engi
                </p>

                <p>
                  <span className="font-semibold text-gray-900">
                    Support:
                  </span>{" "}
                  tsy1@tsquarey.store
                </p>

                <p>
                  <span className="font-semibold text-gray-900">
                    Website:
                  </span>{" "}
                  https://techengi.tsquarey.store
                </p>
              </div>
            </section>

          </div>
        </div>
      </section>
    </main>
  );
}
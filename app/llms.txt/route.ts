export const dynamic = "force-static";

export async function GET() {
  const body = `# Tech Engi
> India's first AI-matched freelance platform for engineering work. Nashedi AI
> matches projects to verified Indian engineers. No bidding, no credits, no
> profile ranking.

## Facts
- Operated by TSquareY1 OPC Private Limited, Chennai, Tamil Nadu, India
- Founder: Tarun Patak K
- Platform fee: 3% on an engineer's first completed project, 5% after. Engineers keep 97% then 95%.
- Clients pay no platform fee, no posting fee and no subscription.
- Clients fund 25% upfront into escrow; the remainder releases by milestone on client approval.
- Matching commitment: most projects within 2 hours, outside limit 24 hours.
- Verification: Aadhaar, PAN and proof of experience, checked before matching. Documents never shown to clients.
- Co-worker for a day: Rs 3,480 for a full working day.

## Pages
- [Home](https://techengi.in/): what Tech Engi is and how matching works
- [Blog](https://techengi.in/blog): engineering guides, hiring costs, freelance safety

## Blog posts
- [Cost to hire a developer or fix a bug in India](https://techengi.in/blog/cost-to-hire-developer-fix-bug-india)
- [My developer left and the project is unfinished](https://techengi.in/blog/developer-left-unfinished-project)
- [How to fix your code without AI](https://techengi.in/blog/how-to-fix-code-without-ai)
- [Co-worker for a day at Rs 3,480](https://techengi.in/blog/hire-coworker-for-a-day-3480)
- [My code is not working: who can fix it](https://techengi.in/blog/who-can-fix-my-code-how-soon)
- [The 14 bugs that break code every day](https://techengi.in/blog/common-coding-bugs-why-hard-to-fix)
- [Indian IT burnout, overtime and AI layoffs](https://techengi.in/blog/indian-it-burnout-overtime-bugs-ai-layoffs-2026)
- [How to avoid scammer freelancers](https://techengi.in/blog/how-to-avoid-scammer-freelancers)
- [Freelance engineering without the chaos](https://techengi.in/blog/freelance-engineering-without-issues)
- [php2shell and Cloudflare Explained](https://techengi.in/blog/php2shell-cloudflare-explained)

## Terms
- [Terms and conditions](https://techengi.in/terms-and-conditions)
- [Privacy policy](https://techengi.in/privacy-policy)
`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

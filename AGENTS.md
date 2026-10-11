<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Keep destination, public copy, legal links and the single active experiment in `src/config/site.ts` so campaigns can change without rewriting views.
- Route every affiliate action through the shared CTA and outbound handler; missing or unsafe destinations must show a non-redirecting error.
- Keep this landing frontend-only until a real integration is requested; analytics emits allowlisted browser events only after opt-in, never fabricated reports.
- Assign only one experimental variable in memory per visit, with no persistent age or experiment storage, to respect visitor privacy.

- Keep conversion improvements in the shared CTA and existing profile flow, with a sticky header and optional age-selection continuation; this keeps one destination and avoids additional registration steps.

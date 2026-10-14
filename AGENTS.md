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
- Resolve shared profile media from its asset pointer against the verified Lovable asset-serving origin, not the visitor's domain, because custom-domain hosts may not proxy asset paths.
- Keep destination, public copy, legal links and the single active experiment in `src/config/site.ts` so campaigns can change without rewriting views.
- Route every affiliate action through the shared CTA and outbound handler; missing or unsafe destinations must show a non-redirecting error.
- Page statistics are stored anonymously (random per-visit id, no personal data) in Lovable Cloud and read only via a password-checked server function, because the owner asked for built-in stats without a consent banner.
- Assign only one experimental variable in memory per visit, with no persistent age or experiment storage, to respect visitor privacy.

- Keep conversion improvements in the shared CTA and existing profile flow, with a sticky header, viewport-aware mobile CTA, inline consent and optional age-selection continuation; this keeps one destination and avoids additional registration steps.

- Keep the existing browser analytics event name stable across rebranding so configured listeners remain compatible.

- The shared CTA scrolls registration-labelled actions to the age section without outbound tracking; age continuation and other actions retain the validated outbound handler. This separates on-page navigation from external visits.

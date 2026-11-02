# Vox Vena

Paste text that sounds like an AI wrote it. Get it back sounding like a person said it.

*Vena* is Latin for vein: the natural pulse under the words. Vox Vena strips the machine polish ("delve", "furthermore", "leverage synergies", brochure openers) and gives the text a human rhythm back. It runs on your own PC.

## What it does

| Before | After |
|---|---|
| Furthermore, it is important to note that we leverage synergies. | Also, we work together. |
| We need to harness synergies between sales and engineering. | We need to get sales and engineering working together. |
| Our bespoke platform empowers users to unlock the potential of data. | Our custom platform helps users to get more from data. |
| Ultimately, fostering collaboration remains paramount to success. | In the end, building collaboration remains key to success. |
| In conclusion, this comprehensive guide will delve into best practices. | This guide will look at best practices. |

These come from the **Light** setting, with no AI involved. Every rule is a plain word swap you can read in `src/ai_tells.ts` and `src/spoken_pass.ts`.

Three strengths:

| Level | What it changes |
|---|---|
| Light | Phrase swaps only |
| Medium | Phrases plus structure cleanup (list cadence, same-length paragraphs, stiff openers) |
| Heavy | All of the above plus contractions; the optional AI pass is freer |

## Run it

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm start
```

Open http://127.0.0.1:8787, paste your text and pick a strength.

## Optional: a second pass with your own AI

The word swaps work offline. For a deeper rewrite, Vox Vena can send the cleaned text to any OpenAI-compatible model: [Janus](https://github.com/Vibra-Ingenn/Janus), Ollama, LM Studio, OpenRouter and others.

Copy `.env.example` to `.env` and point it at your model:

```env
HUMANIZER_BASE_URL=http://127.0.0.1:8990/v1   # Janus; Ollama is http://127.0.0.1:11434/v1
HUMANIZER_MODEL=local
HUMANIZER_API_KEY=janus
```

Then tick **LLM roughen** (used on Medium and Heavy; Light never calls a model). Leave it unticked to stay fully offline.

## Your own voice

A voice pack is a small JSON file describing how you write: what to do, what to avoid, words you like, a few example sentences. The example is `src/fixtures/example_voice_style.json`. Make your own and point Vox Vena at it:

```env
HUMANIZER_VOICE_PATH=./my_voice.json
```

## API

```bash
curl -X POST http://127.0.0.1:8787/api/humanize \
  -H "Content-Type: application/json" \
  -d '{"text": "We must leverage our core competencies.", "intensity": "light", "use_llm": false}'
```

## Honest limits

- No tool makes text undetectable, and Vox Vena doesn't promise to. It makes text read better.
- A careful human edit still wins. This gets you most of the way fast.
- English only for now.

## Support Vox Vena

Vox Vena is free and stays free. Sponsorship keeps it updated with new rules, better voice packs and more languages. If it saves you time, please consider sponsoring it.

Want it to run by itself, like cleaning every draft in a folder? **Vibe Engine**, my paid tool, runs Vox Vena and my other tools together, the same way every time: [adeptuscamini.com](https://adeptuscamini.com). Either way, thanks for using it.

## License

MIT. See [LICENSE](LICENSE).

---

<p align="center"><i lang="la" title="We refuse to keep doing the same broken things; we do other things.">Recusamus pergere eadem fracta facere; nos alia facimus.</i></p>

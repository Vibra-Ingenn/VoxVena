import assert from "node:assert/strict";
import test from "node:test";
import { humanize } from "./humanize.js";

// Sentences that give away a pasted chatbot answer (from our test rounds, 2026-11).
const caught_lines = `You've never actually physically touched anything, right? Not a table, not a wall, not another person.

So how does that work?

Let me break it down for you. Atoms are tiny structures made up of protons, neutrons, and electrons.

Here's the thing: atoms are almost entirely empty space.

Here's what happens: someone touches your arm, mechanical forces deform your skin, and your brain reads that as touch.

And that's the really mind-blowing part: what you experience as contact is forces between atoms.

Think about it this way: an atom can be mostly empty space, but the electrons decide how close other atoms get.

So the setup was this: there were 1,200 people in the study.

The thing is, these people had no way to talk to each other directly.

That sounds complicated, so let's unpack it. Two electrons can't share a state.

So let's connect this to your original question about touching things. Atoms have structure because electrons can't share a state.

And if you want to explore more, you could ask: what exactly is an electron? That's where quantum physics gets really fascinating.

One thing worth exploring next is what exactly an electron is.`;

const banned = [
    /let me break it down/i,
    /here's the thing/i,
    /here's what happens/i,
    /mind-blowing part/i,
    /think about it this way/i,
    /the setup was this/i,
    /the thing is/i,
    /your original question/i,
    /you could ask/i,
    /worth exploring next/i,
    /gets really fascinating/i,
    /sounds complicated/i,
    /unpack/i
];

test("chatbot habits readers spot are removed on every level", async () =>
{
    for (const intensity of ["light", "medium", "heavy"] as const)
    {
        const { output } = await humanize({ text: caught_lines, intensity, use_llm: false });
        for (const pattern of banned)
        {
            assert.doesNotMatch(output, pattern, `${intensity} still has ${pattern}\n---\n${output}`);
        }
        // The facts stay.
        assert.match(output, /1,200 people/);
        assert.match(output, /Back to touching things\./);
        assert.match(output, /protons, neutrons, and electrons/);
    }
});

const chatgpt_paste = `This is actually one of the most fascinating things in physics because it leads to a rather mind-bending realization:

You have probably never physically touched anything.

# 1. What is an atom?

Everything around you is made of atoms.

- Your body.
- The chair you're sitting on.
- The air you're breathing.

[What is Quantum Mechanical Modeling?](https://images.openai.com/static-rsc-4/abc?purpose=inline)

[azonano.com](https://www.azonano.com/article.aspx?ArticleID=6791\\&utm_source=chatgpt.com)

Read more at https://example.com/page?utm_source=chatgpt.com and https://example.com/a?x=1&utm_source=chatgpt.com.

## The thought I'd like you to take away

In a very real sense, the world is particles and fields interacting.

And that's one of the most extraordinary things about physics.`;

test("ChatGPT paste junk and headings: no 'Basically #', links cleaned, levels differ", async () =>
{
    const light = (await humanize({ text: chatgpt_paste, intensity: "light", use_llm: false })).output;
    const medium = (await humanize({ text: chatgpt_paste, intensity: "medium", use_llm: false })).output;
    const heavy = (await humanize({ text: chatgpt_paste, intensity: "heavy", use_llm: false })).output;

    for (const out of [light, medium, heavy])
    {
        assert.doesNotMatch(out, /Basically #|#/, out);
        assert.doesNotMatch(out, /utm_source|images\.openai\.com|azonano/, out);
        assert.doesNotMatch(out, /In a very real sense/i, out);
        assert.match(out, /https:\/\/example\.com\/page and https:\/\/example\.com\/a\?x=1\./, out);
    }

    // Light keeps the heading words and the list; Medium drops headings and joins the list.
    assert.match(light, /^What is an atom\?$/m);
    assert.match(light, /^- Your body\.$/m);
    assert.doesNotMatch(medium, /What is an atom\?/);
    assert.match(medium, /Your body\. The chair you're sitting on\. The air you're breathing\./);

    // Heavy also cuts the warm-up and wrap-up lines.
    assert.match(medium, /most fascinating things in physics/);
    assert.doesNotMatch(heavy, /most fascinating things in physics/);
    assert.doesNotMatch(heavy, /most extraordinary things about physics/);

    assert.notEqual(light, medium);
    assert.notEqual(medium, heavy);
});

test("sentences starting 'For' or 'If' are not treated as code", async () =>
{
    const text = "The distances are huge.\n\nFor example:\n\nIf you could remove the empty space, the nuclei would fit in a sugar cube.";
    for (const intensity of ["light", "medium", "heavy"] as const)
    {
        const out = (await humanize({ text, intensity, use_llm: false })).output;
        assert.doesNotMatch(out, /Basically/, out);
        assert.match(out, /For example:/, out);
    }
});

test("medium joins ChatGPT's one-sentence paragraphs into paragraphs of different sizes", async () =>
{
    const text = Array.from({ length: 9 }, (_, i) => `Sentence number ${i + 1} is here.`).join("\n\n");
    const out = (await humanize({ text, intensity: "medium", use_llm: false })).output;
    const sizes = out.split(/\n\n/).map((p) => (p.match(/\./g) || []).length);
    assert.deepEqual(sizes, [3, 2, 4], out);
    const light = (await humanize({ text, intensity: "light", use_llm: false })).output;
    assert.equal(light.split(/\n\n/).length, 9);
});

test("text copied from a PDF is re-joined, not capitalized line by line", async () =>
{
    const text = "The Sumerians were the people of southern Mesopotamia, in what is now southern\nIraq, who built one of the world's first urban civilizations between about 4500 and 1900\nBCE. They did not form a single empire for most of their history, but lived in\nindependent city-states such as Uruk, Ur, Eridu, Lagash, and Umma, each with its own\nruler, patron god, and territory.";
    for (const intensity of ["light", "medium", "heavy"] as const)
    {
        const out = (await humanize({ text, intensity, use_llm: false })).output;
        assert.match(out, /lived in independent city-states/, out);
        assert.match(out, /its own ruler, patron god/, out);
    }
});

test("medium drops bare title lines and never glues them onto a paragraph", async () =>
{
    const text = "The run showed strange behavior across the whole test.\n\nThe Garden Survey Results\n\nThe survey was built to count birds.\n\nVolunteers shared one notebook.";
    const out = (await humanize({ text, intensity: "medium", use_llm: false })).output;
    assert.doesNotMatch(out, /Garden Survey Results/, out);
    assert.match(out, /The survey was built to count birds\./, out);
});

test("Qwen3 habits: kicker/deal openers, ellipsis casing, 'Why does this matter? Because'", async () =>
{
    const text = "So here's the deal... Electrons can't share a state. They're more like... clouds around atoms.\n\nWhy does this matter? Because without it, matter would collapse.\n\nAnd here's the kicker: bosons can share states. But that's another story for later.";
    const out = (await humanize({ text, intensity: "medium", use_llm: false })).output;
    assert.doesNotMatch(out, /kicker|here's the deal|another story/i, out);
    assert.match(out, /more like\.\.\. clouds/, out);
    assert.match(out, /Why does this matter\? Because without it/, out);
    assert.match(out, /^Electrons can't share a state\./, out);
    assert.match(out, /Bosons can share states\./, out);
});

test("model leftovers (Gemma, Qwen3) and OmniCoder/Llama habits", async () =>
{
    const gemma = "<|channel>thought\n<channel|>So, when they ran the benchmark, things got weird.";
    const qwen = "---ROUGH---\nThe volunteers shared one notebook.\n\n---ROUGH---\nNo markdown. No filler. Keep it simple.";
    const habits = "Two identical electrons can't share a state. That sounds complicated, so think about it like this: electrons have rules about where they can exist.\n\nSounds technical, right? Let's break it down without the jargon. But here's the twist—two electrons can share an orbital. And get this - bosons can share states.\n\nSo let me connect this back to your question about touching things. Atoms resist compression.\n\nThe city rebuilt its water infrastructure.\n\nIf you're curious what an electron is, that's where things get really wild in quantum physics.\n\nBut here's the key part: empty space isn't empty. But there's a twist. Two electrons *can* share an orbital.\n\nBut here's the important distinction:\n\nEmpty space is full of fields.";

    for (const intensity of ["light", "medium", "heavy"] as const)
    {
        const g = (await humanize({ text: gemma, intensity, use_llm: false })).output;
        assert.equal(g, "So, when they ran the benchmark, things got weird.");
        const quotes = (await humanize({ text: "He’s famous. It's old. The “Ishtar” gate.", intensity, use_llm: false })).output;
        assert.equal(quotes, "He's famous. It's old. The \"Ishtar\" gate.");
        const curly_only = (await humanize({ text: "He’s famous.", intensity, use_llm: false })).output;
        assert.equal(curly_only, "He’s famous.");
        const q = (await humanize({ text: qwen, intensity, use_llm: false })).output;
        assert.equal(q, "The volunteers shared one notebook.");

        const h = (await humanize({ text: habits, intensity, use_llm: false })).output;
        assert.doesNotMatch(h, /sounds (?:complicated|technical)|break it down|twist|get this|your question|curious|wild/i, h);
        assert.match(h, /Electrons have rules about where they can exist\./, h);
        assert.match(h, /Two electrons can share an orbital\./, h);
        assert.match(h, /Back to touching things\./, h);
        assert.match(h, /water infrastructure/, h);
        assert.match(h, /Empty space isn't empty\. Two electrons can share an orbital\./, h);
        assert.doesNotMatch(h, /But Empty/, h);
        assert.match(h, /Empty space is full of fields\./, h);
        assert.doesNotMatch(h, /key part|\*/, h);
    }
});

test("repeated openers: no 'Also, ... Also,' and capped 'So'", async () =>
{
    const text = "Furthermore, our solution is solid. Moreover, we work together.\n\nSo it starts. So it grows. So it ends. So it stops.";
    const medium = (await humanize({ text, intensity: "medium", use_llm: false })).output;
    assert.doesNotMatch(medium, /Also, [^.]*\. Also,/, medium);
    assert.equal((medium.match(/\bSo\b/g) || []).length, 2, medium);
});

test("running the rules twice changes nothing more (safe to re-run on AI output)", async () =>
{
    for (const intensity of ["light", "medium", "heavy"] as const)
    {
        const once = (await humanize({ text: chatgpt_paste + "\n\n" + caught_lines, intensity, use_llm: false })).output;
        const twice = (await humanize({ text: once, intensity, use_llm: false })).output;
        assert.equal(twice, once, `${intensity} changed on a second pass`);
    }
});

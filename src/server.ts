import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import dotenv from "dotenv";
import { humanize, type Intensity } from "./humanize.js";
import { load_voice_style } from "./voice.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const public_dir = path.join(__dirname, "..", "public");
const port = Number(process.env.PORT || 8787);
const voice = load_voice_style();

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use((req, res, next) =>
{
    if (req.path === "/" || req.path.endsWith(".html") || req.path.endsWith(".js") || req.path.endsWith(".css"))
    {
        res.setHeader("Cache-Control", "no-store");
    }
    next();
});
app.use(express.static(public_dir, {
    etag: false,
    lastModified: false,
    cacheControl: false
}));

app.get("/api/health", (_req, res) =>
{
    res.json({
        ok: true,
        app: "vox-vena",
        llm_base_url: process.env.HUMANIZER_BASE_URL || "http://127.0.0.1:8990/v1",
        llm_model: process.env.HUMANIZER_MODEL || "local",
        voice_id: voice?.voice_id ?? null,
        voice_label: voice?.label ?? null
    });
});

app.post("/api/humanize", async (req, res) =>
{
    try
    {
        const body = req.body as {
            text?: string;
            intensity?: Intensity;
            use_llm?: boolean;
        };

        const result = await humanize({
            text: body.text ?? "",
            intensity: body.intensity,
            use_llm: Boolean(body.use_llm)
        });

        res.json({
            ok: true,
            output: result.output,
            hits: result.hits,
            hit_count: result.hit_count,
            used_llm: result.used_llm,
            notes: result.notes
        });
    }
    catch (err)
    {
        const message = err instanceof Error ? err.message : String(err);
        res.status(500).json({ ok: false, error: message });
    }
});

app.listen(port, "127.0.0.1", () =>
{
    console.log(`Vox Vena running at http://127.0.0.1:${port}`);
});

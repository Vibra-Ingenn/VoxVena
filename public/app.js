const input_el = document.getElementById("input");
const output_el = document.getElementById("output");
const intensity_el = document.getElementById("intensity");
const use_llm_el = document.getElementById("use_llm");
const run_btn = document.getElementById("run_btn");
const copy_btn = document.getElementById("copy_btn");
const status_el = document.getElementById("status");

function set_status(message, is_error = false)
{
    status_el.textContent = message;
    status_el.classList.toggle("error", is_error);
}

async function show_ready_status()
{
    try
    {
        const response = await fetch("/api/health", { cache: "no-store" });
        const data = await response.json();
        if (!data.ok)
        {
            set_status("Server responded but health check failed.", true);
            return;
        }
        const voice = data.voice_label || data.voice_id || "no voice pack";
        set_status(`Ready · model ${data.llm_model} · voice ${voice}`);
    }
    catch (err)
    {
        set_status(`Cannot reach server: ${err.message || err}`, true);
    }
}

show_ready_status();

run_btn.addEventListener("click", async () =>
{
    const text = input_el.value;
    if (!text.trim())
    {
        set_status("Paste some text first.", true);
        return;
    }

    run_btn.disabled = true;
    const wants_llm = use_llm_el.checked && intensity_el.value !== "light";
    set_status(wants_llm ? "Humanizing + LLM roughen…" : "Humanizing (local)…");

    try
    {
        const response = await fetch("/api/humanize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text,
                intensity: intensity_el.value,
                use_llm: use_llm_el.checked
            })
        });

        const data = await response.json();
        if (!response.ok || !data.ok)
        {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        output_el.value = data.output;

        const unchanged = data.output.trim() === text.trim();
        const llm_skipped = (data.notes || []).some((n) => String(n).startsWith("llm_skipped"));
        const llm_part = data.used_llm
            ? " · LLM ran"
            : (use_llm_el.checked ? " · LLM skipped" : " · local only");

        if (unchanged)
        {
            set_status(
                `No changes made${llm_part}. Nothing is broken: this text has none of the AI habits Vox Vena looks for.`,
                true
            );
            return;
        }

        const hit_part = data.hit_count
            ? `${data.hit_count} fix(es): ${data.hits.slice(0, 8).join(", ")}${data.hits.length > 8 ? "…" : ""}`
            : "wording changed";
        const skip_reason = String((data.notes || []).find((n) => String(n).startsWith("llm_skipped")) || "")
            .replace(/^llm_skipped:\s*/, "");
        const skip_note = !llm_skipped ? ""
            : skip_reason === "light_is_local_only"
                ? " · Light never uses the AI; pick Medium or Heavy for that"
                : ` · AI rewrite thrown away (${skip_reason}), showing the rules-only version`;
        const barely_note = (data.notes || []).includes("llm_barely_changed")
            ? " · the AI kept most sentences as they were; a bigger model usually changes more"
            : "";
        set_status(`${hit_part}${llm_part}${skip_note}${barely_note}`);
    }
    catch (err)
    {
        set_status(err.message || String(err), true);
    }
    finally
    {
        run_btn.disabled = false;
    }
});

copy_btn.addEventListener("click", async () =>
{
    const value = output_el.value;
    if (!value)
    {
        set_status("Nothing to copy yet.", true);
        return;
    }

    try
    {
        await navigator.clipboard.writeText(value);
        set_status("Copied.");
    }
    catch
    {
        output_el.select();
        set_status("Select the output and copy manually.", true);
    }
});

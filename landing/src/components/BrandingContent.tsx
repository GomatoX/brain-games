"use client";

import { useState } from "react";

interface BrandingPreset {
  id: string;
  name: string;
  accent_color: string | null;
  accent_hover_color: string | null;
  accent_light_color: string | null;
  selection_color: string | null;
  selection_ring_color: string | null;
  highlight_color: string | null;
  correct_color: string | null;
  present_color: string | null;
  bg_primary_color: string | null;
  bg_secondary_color: string | null;
  text_primary_color: string | null;
  text_secondary_color: string | null;
  border_color: string | null;
  cell_bg_color: string | null;
  cell_blocked_color: string | null;
  sidebar_active_color: string | null;
  sidebar_active_bg_color: string | null;
  grid_border_color: string | null;
  font_sans: string | null;
  font_serif: string | null;
  border_radius: string | null;
}

interface FieldDef {
  key: string;
  label: string;
  type: "color" | "text" | "select";
  options?: { value: string; label: string }[];
}

const SANS_FONT_OPTIONS = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Source Sans Pro, sans-serif", label: "Source Sans Pro" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Open Sans, sans-serif", label: "Open Sans" },
  { value: "Lato, sans-serif", label: "Lato" },
  { value: "Nunito, sans-serif", label: "Nunito" },
  { value: "Poppins, sans-serif", label: "Poppins" },
  { value: "Montserrat, sans-serif", label: "Montserrat" },
  { value: "Raleway, sans-serif", label: "Raleway" },
  { value: "Work Sans, sans-serif", label: "Work Sans" },
  { value: "DM Sans, sans-serif", label: "DM Sans" },
  { value: "Outfit, sans-serif", label: "Outfit" },
];

const SERIF_FONT_OPTIONS = [
  { value: "Playfair Display, serif", label: "Playfair Display" },
  { value: "Lora, serif", label: "Lora" },
  { value: "Merriweather, serif", label: "Merriweather" },
  { value: "Libre Baskerville, serif", label: "Libre Baskerville" },
  { value: "EB Garamond, serif", label: "EB Garamond" },
  { value: "Cormorant Garamond, serif", label: "Cormorant Garamond" },
  { value: "Crimson Text, serif", label: "Crimson Text" },
  { value: "PT Serif, serif", label: "PT Serif" },
  { value: "Source Serif Pro, serif", label: "Source Serif Pro" },
  { value: "DM Serif Display, serif", label: "DM Serif Display" },
];

const FIELD_GROUPS: { title: string; icon: string; fields: FieldDef[] }[] = [
  {
    title: "Accent Colors",
    icon: "palette",
    fields: [
      { key: "accent_color", label: "Accent", type: "color" },
      { key: "accent_hover_color", label: "Accent Hover", type: "color" },
      { key: "accent_light_color", label: "Accent Light", type: "color" },
    ],
  },
  {
    title: "Backgrounds",
    icon: "format_paint",
    fields: [
      { key: "bg_primary_color", label: "Primary BG", type: "color" },
      { key: "bg_secondary_color", label: "Secondary BG", type: "color" },
    ],
  },
  {
    title: "Text",
    icon: "title",
    fields: [
      { key: "text_primary_color", label: "Primary Text", type: "color" },
      { key: "text_secondary_color", label: "Secondary Text", type: "color" },
    ],
  },
  {
    title: "Grid & Cells",
    icon: "grid_on",
    fields: [
      { key: "cell_bg_color", label: "Cell BG", type: "color" },
      { key: "cell_blocked_color", label: "Blocked Cell", type: "color" },
      { key: "selection_color", label: "Selection", type: "color" },
      { key: "selection_ring_color", label: "Selection Ring", type: "color" },
      { key: "highlight_color", label: "Highlight", type: "color" },
      { key: "grid_border_color", label: "Grid Lines", type: "color" },
      { key: "sidebar_active_color", label: "Sidebar Active", type: "color" },
      {
        key: "sidebar_active_bg_color",
        label: "Sidebar Active BG",
        type: "color",
      },
      { key: "border_color", label: "Border", type: "color" },
    ],
  },
  {
    title: "Feedback",
    icon: "check_circle",
    fields: [
      { key: "correct_color", label: "Correct", type: "color" },
      { key: "present_color", label: "Present", type: "color" },
    ],
  },
  {
    title: "Typography & Layout",
    icon: "text_fields",
    fields: [
      {
        key: "font_sans",
        label: "Sans Font",
        type: "select",
        options: SANS_FONT_OPTIONS,
      },
      {
        key: "font_serif",
        label: "Serif Font",
        type: "select",
        options: SERIF_FONT_OPTIONS,
      },
      { key: "border_radius", label: "Border Radius", type: "text" },
    ],
  },
];

const ALL_FIELDS = FIELD_GROUPS.flatMap((g) => g.fields);
const COLOR_FIELDS = ALL_FIELDS.filter((f) => f.type === "color");

export default function BrandingContent({
  initialPresets,
}: {
  initialPresets: BrandingPreset[];
}) {
  const [presets, setPresets] = useState<BrandingPreset[]>(initialPresets);
  const [editing, setEditing] = useState<BrandingPreset | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  async function fetchPresets() {
    try {
      const res = await fetch("/api/branding");
      if (res.ok) {
        const data = await res.json();
        setPresets(data);
      }
    } catch {
      // Silently fail
    }
  }

  function openCreate() {
    setEditing(null);
    setFormName("");
    setFormValues({});
    setCreating(true);
    setError("");
  }

  function openEdit(preset: BrandingPreset) {
    setCreating(false);
    setEditing(preset);
    setFormName(preset.name || "");
    const values: Record<string, string> = {};
    for (const f of ALL_FIELDS) {
      const val = preset[f.key as keyof BrandingPreset];
      if (val) values[f.key] = val as string;
    }
    setFormValues(values);
    setError("");
  }

  function closeModal() {
    setCreating(false);
    setEditing(null);
    setError("");
  }

  function setField(key: string, value: string) {
    setFormValues({ ...formValues, [key]: value });
  }

  function clearField(key: string) {
    const updated = { ...formValues };
    delete updated[key];
    setFormValues(updated);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) {
      setError("Name is required");
      return;
    }

    setSaving(true);
    setError("");

    const data: Record<string, unknown> = {
      collection: "branding",
      name: formName.trim(),
    };
    for (const f of ALL_FIELDS) {
      data[f.key] = formValues[f.key] || null;
    }

    try {
      if (editing) {
        data.id = editing.id;
        await fetch("/api/games", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        await fetch("/api/games", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      await fetchPresets();
      closeModal();
    } catch {
      setError("Failed to save preset");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/games?collection=branding&id=${id}`, {
        method: "DELETE",
      });
      await fetchPresets();
    } catch {
      // ignore
    }
    setDeleteConfirm(null);
  }

  const isModalOpen = creating || editing !== null;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#0f172a] mb-1">
            Branding
          </h1>
          <p className="text-[#64748b] text-sm">
            Create and manage reusable color presets for your games.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-[#c25e40] text-white rounded-lg hover:bg-[#a0492d] transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Preset
        </button>
      </div>

      {/* Presets Grid */}
      {presets.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-[#cbd5e1] mb-3 block">
            palette
          </span>
          <p className="text-sm text-[#64748b] mb-4">
            No branding presets yet. Create one to customize your games.
          </p>
          <button
            onClick={openCreate}
            className="px-4 py-2 text-sm font-medium bg-[#c25e40] text-white rounded-lg hover:bg-[#a0492d] transition-colors"
          >
            Create First Preset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Color Preview Bar */}
              <div className="h-3 flex">
                {COLOR_FIELDS.map((f) => (
                  <div
                    key={f.key}
                    className="flex-1"
                    style={{
                      backgroundColor:
                        (preset[f.key as keyof BrandingPreset] as string) ||
                        "transparent",
                    }}
                  />
                ))}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#0f172a]">
                    {preset.name || "Untitled"}
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(preset)}
                      className="p-1.5 text-[#64748b] hover:text-amber-600 transition-colors rounded-lg hover:bg-slate-100"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-lg">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(preset.id)}
                      className="p-1.5 text-[#64748b] hover:text-red-600 transition-colors rounded-lg hover:bg-slate-100"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-lg">
                        delete
                      </span>
                    </button>
                  </div>
                </div>

                {/* Color Swatches */}
                <div className="flex flex-wrap gap-1.5">
                  {COLOR_FIELDS.map((f) => {
                    const color = preset[
                      f.key as keyof BrandingPreset
                    ] as string;
                    if (!color) return null;
                    return (
                      <div
                        key={f.key}
                        className="flex items-center gap-1.5 bg-slate-50 rounded-md px-2 py-1"
                        title={f.label}
                      >
                        <div
                          className="w-3.5 h-3.5 rounded-sm border border-slate-200"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[10px] text-[#64748b] font-medium uppercase">
                          {f.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Typography info */}
                {(preset.font_sans || preset.font_serif) && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {preset.font_sans && (
                      <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                        Sans: {preset.font_sans.split(",")[0]}
                      </span>
                    )}
                    {preset.font_serif && (
                      <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">
                        Serif: {preset.font_serif.split(",")[0]}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c25e40]">
                  palette
                </span>
                <h2 className="text-lg font-semibold text-[#0f172a]">
                  {editing ? "Edit Preset" : "New Branding Preset"}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-1 text-[#64748b] hover:text-[#0f172a] transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="p-6 overflow-y-auto flex-1 flex flex-col gap-5"
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                  Preset Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. LRT, Default, Dark theme"
                  className="w-full px-3.5 py-2.5 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c25e40]/30 focus:border-[#c25e40]"
                />
              </div>

              {/* Grouped Fields */}
              {FIELD_GROUPS.map((group) => (
                <div key={group.title}>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="material-symbols-outlined text-sm text-[#94a3b8]">
                      {group.icon}
                    </span>
                    <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                      {group.title}
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {group.fields.map((f) =>
                      f.type === "color" ? (
                        <div
                          key={f.key}
                          className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2"
                        >
                          <input
                            type="color"
                            value={formValues[f.key] || "#000000"}
                            onChange={(e) => setField(f.key, e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border border-slate-200 p-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#0f172a]">
                              {f.label}
                            </p>
                            <input
                              type="text"
                              value={formValues[f.key] || ""}
                              onChange={(e) => setField(f.key, e.target.value)}
                              placeholder="#000000"
                              className="text-[10px] text-[#64748b] bg-transparent w-full outline-none"
                            />
                          </div>
                          {formValues[f.key] && (
                            <button
                              type="button"
                              onClick={() => clearField(f.key)}
                              className="p-0.5 text-[#94a3b8] hover:text-red-500 transition-colors"
                              title="Clear"
                            >
                              <span className="material-symbols-outlined text-sm">
                                close
                              </span>
                            </button>
                          )}
                        </div>
                      ) : f.type === "select" ? (
                        <div
                          key={f.key}
                          className="bg-slate-50 rounded-lg px-3 py-2"
                        >
                          <p className="text-xs font-medium text-[#0f172a] mb-1">
                            {f.label}
                          </p>
                          <select
                            value={formValues[f.key] || ""}
                            onChange={(e) =>
                              e.target.value
                                ? setField(f.key, e.target.value)
                                : clearField(f.key)
                            }
                            className="w-full text-xs text-[#0f172a] bg-white border border-slate-200 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-[#c25e40]/30"
                          >
                            <option value="">Default</option>
                            {f.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div
                          key={f.key}
                          className="bg-slate-50 rounded-lg px-3 py-2"
                        >
                          <p className="text-xs font-medium text-[#0f172a] mb-1">
                            {f.label}
                          </p>
                          <input
                            type="text"
                            value={formValues[f.key] || ""}
                            onChange={(e) => setField(f.key, e.target.value)}
                            placeholder="0.75rem"
                            className="w-full text-xs text-[#0f172a] bg-white border border-slate-200 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-[#c25e40]/30"
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ))}

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm bg-[#c25e40] text-white rounded-lg hover:bg-[#a0492d] transition-colors disabled:opacity-50"
                >
                  {saving
                    ? "Saving…"
                    : editing
                      ? "Save Changes"
                      : "Create Preset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold text-[#0f172a] mb-2">
              Delete Preset
            </h3>
            <p className="text-sm text-[#64748b] mb-6">
              Are you sure? Games using this preset will lose their branding.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, Save } from "lucide-react";

const entryTypes = [
  { value: "reflection", label: "📖 Reflection" },
  { value: "prayer", label: "🙏 Prayer" },
  { value: "gratitude", label: "💛 Gratitude" },
  { value: "testimony", label: "✨ Testimony" },
];

const moods = [
  { value: "peaceful", label: "😌 Peaceful" },
  { value: "joyful", label: "😊 Joyful" },
  { value: "struggling", label: "😔 Struggling" },
  { value: "grateful", label: "🙏 Grateful" },
  { value: "hopeful", label: "🌅 Hopeful" },
];

export default function JournalEditor({ entry, onSave, onCancel }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    title: entry?.title || "",
    content: entry?.content || "",
    entry_type: entry?.entry_type || "reflection",
    entry_date: entry?.entry_date || today,
    mood: entry?.mood || "",
    linked_verse: entry?.linked_verse || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    if (entry?.id) {
      await base44.entities.JournalEntry.update(entry.id, form);
    } else {
      await base44.entities.JournalEntry.create(form);
    }
    setIsSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-pink-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            {entry ? "Edit Entry" : "New Journal Entry"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <Label className="text-gray-700 dark:text-gray-300 mb-1.5 block font-medium">Title</Label>
            <Input
              required
              placeholder="What's on your heart today?"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="border-pink-200 dark:border-gray-600 focus:ring-pink-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-300 mb-1.5 block font-medium">Type</Label>
              <Select value={form.entry_type} onValueChange={(v) => set("entry_type", v)}>
                <SelectTrigger className="border-pink-200 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {entryTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-300 mb-1.5 block font-medium">Mood</Label>
              <Select value={form.mood} onValueChange={(v) => set("mood", v)}>
                <SelectTrigger className="border-pink-200 dark:border-gray-600">
                  <SelectValue placeholder="How do you feel?" />
                </SelectTrigger>
                <SelectContent>
                  {moods.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-300 mb-1.5 block font-medium">Date</Label>
              <Input
                type="date"
                required
                value={form.entry_date}
                onChange={(e) => set("entry_date", e.target.value)}
                className="border-pink-200 dark:border-gray-600"
              />
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-300 mb-1.5 block font-medium">Scripture Reference</Label>
              <Input
                placeholder="e.g. John 3:16"
                value={form.linked_verse}
                onChange={(e) => set("linked_verse", e.target.value)}
                className="border-pink-200 dark:border-gray-600"
              />
            </div>
          </div>

          <div>
            <Label className="text-gray-700 dark:text-gray-300 mb-1.5 block font-medium">Your Thoughts</Label>
            <Textarea
              required
              placeholder="Write your reflections, prayers, or gratitude here..."
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              className="min-h-[200px] border-pink-200 dark:border-gray-600 focus:ring-pink-400 resize-none leading-relaxed"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Entry"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

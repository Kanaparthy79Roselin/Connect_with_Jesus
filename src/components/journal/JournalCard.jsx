import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

const typeStyles = {
  reflection: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  prayer: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  gratitude: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  testimony: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

const typeLabels = {
  reflection: "📖 Reflection",
  prayer: "🙏 Prayer",
  gratitude: "💛 Gratitude",
  testimony: "✨ Testimony",
};

const moodLabels = {
  peaceful: "😌 Peaceful",
  joyful: "😊 Joyful",
  struggling: "😔 Struggling",
  grateful: "🙏 Grateful",
  hopeful: "🌅 Hopeful",
};

export default function JournalCard({ entry, onEdit, onDelete }) {
  const formattedDate = new Date(entry.entry_date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg truncate">{entry.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{formattedDate}</p>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button variant="ghost" size="icon" onClick={() => onEdit(entry)} className="h-8 w-8 text-gray-400 hover:text-pink-500">
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(entry)} className="h-8 w-8 text-gray-400 hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeStyles[entry.entry_type]}`}>
            {typeLabels[entry.entry_type]}
          </span>
          {entry.mood && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300">
              {moodLabels[entry.mood]}
            </span>
          )}
          {entry.linked_verse && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              📜 {entry.linked_verse}
            </span>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
          {entry.content}
        </p>
      </CardContent>
    </Card>
  );
}
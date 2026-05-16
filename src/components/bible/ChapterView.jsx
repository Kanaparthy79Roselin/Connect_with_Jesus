
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Bookmark, Share2, AlertTriangle, Loader2 } from "lucide-react";
import { Bookmark as BookmarkEntity } from "@/entities/Bookmark";

export default function ChapterView({ book, selectedChapter, onChapterSelect }) {
  const [bookmarkedVerses, setBookmarkedVerses] = useState(new Set());
  const [verses, setVerses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedChapter) {
      fetchChapterContent();
    }
  }, [selectedChapter, book]);

  const fetchChapterContent = async () => {
    setIsLoading(true);
    setError(null);
    setVerses([]);
    try {
      // The API expects book names like "Genesis", "Exodus", etc.
      // And chapter numbers. It uses a '+' for spaces if any, e.g., "Song+of+Solomon"
      // Assuming book.name is already correctly formatted for the API (e.g., "Song of Solomon" -> "Song+of+Solomon")
      // If not, a simple replaceAll(' ', '+') might be needed for some book names.
      const apiBookName = book.name.replaceAll(' ', '+');
      const response = await fetch(`https://bible-api.com/${apiBookName}+${selectedChapter}?translation=kjv`); // Added KJV translation
      
      if (!response.ok) {
        // Attempt to parse error message from API if available
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Could not load chapter. Please check the reference and try again.");
      }
      const data = await response.json();
      setVerses(data.verses);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching chapter content:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmarkVerse = async (chapter, verse, text) => {
    const reference = `${book.name} ${chapter}:${verse}`;
    
    try {
      await BookmarkEntity.create({
        book: book.name,
        chapter: chapter,
        verse: verse,
        text: text,
        reference: reference
      });
      
      setBookmarkedVerses(prev => new Set([...prev, `${chapter}:${verse}`]));
    } catch (error) {
      console.error("Error bookmarking verse:", error);
    }
  };

  if (!selectedChapter) {
    // Show chapter selection
    return (
      <motion.div
        key="chapters"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {book.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {book.chapters} {book.chapters === 1 ? 'chapter' : 'chapters'} • Choose a chapter to read
          </p>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {Array.from({ length: book.chapters }, (_, i) => i + 1).map((chapter) => (
            <motion.div
              key={chapter}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: chapter * 0.02 }}
            >
              <Button
                variant="outline"
                className="w-full h-12 text-lg font-semibold border-2 hover:border-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-200"
                onClick={() => onChapterSelect(chapter)}
              >
                {chapter}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Show verse content
  return (
    <motion.div
      key="verses"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="border-none shadow-xl bg-gradient-to-br from-white to-pink-50/30 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="border-b border-pink-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {book.name} {selectedChapter}
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  King James Version
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-12 h-12 animate-spin text-pink-500 mb-4" />
              <p className="text-lg font-semibold">Loading Scripture...</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Fetching from bible-api.com</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-12 text-red-500">
              <AlertTriangle className="w-12 h-12 mb-4" />
              <p className="text-lg font-semibold mb-2">Error Loading Chapter</p>
              <p className="text-center text-sm">{error}</p>
              <Button onClick={fetchChapterContent} variant="outline" className="mt-4">
                Try Again
              </Button>
            </div>
          )}

          {!isLoading && !error && verses.length > 0 && (
            <div className="space-y-6">
              {verses.map((verseData) => (
                <motion.div
                  key={verseData.verse}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: verseData.verse * 0.05 }}
                  className="group flex gap-4 p-4 rounded-xl hover:bg-pink-50/50 dark:hover:bg-gray-800/50 transition-all duration-200"
                >
                  <span className="verse-number text-pink-600 dark:text-pink-400 font-bold text-sm mt-1 min-w-[2rem]">
                    {verseData.verse}
                  </span>
                  <div className="flex-1">
                    <p className="bible-text text-slate-800 dark:text-slate-200 leading-relaxed">
                      {verseData.text.trim()}
                    </p>
                    <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs hover:bg-pink-100 dark:hover:bg-pink-900/20 hover:text-pink-600 dark:hover:text-pink-400"
                        onClick={() => handleBookmarkVerse(selectedChapter, verseData.verse, verseData.text)}
                        disabled={bookmarkedVerses.has(`${selectedChapter}:${verseData.verse}`)}
                      >
                        <Bookmark className="w-3 h-3 mr-1" />
                        {bookmarkedVerses.has(`${selectedChapter}:${verseData.verse}`) ? 'Saved' : 'Save'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs hover:bg-pink-100 dark:hover:bg-pink-900/20 hover:text-pink-600 dark:hover:text-pink-400"
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && !error && verses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No verses found for this chapter.
              </h3>
              <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                This might happen if the chapter number is out of range or the API has no data.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
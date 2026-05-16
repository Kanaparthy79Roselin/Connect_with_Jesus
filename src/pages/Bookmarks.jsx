
import React, { useState, useEffect } from "react";
import { Bookmark as BookmarkEntity } from "@/entities/Bookmark";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Book, Trash2, Share2, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const data = await BookmarkEntity.list('-created_date');
      setBookmarks(data);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    }
    setIsLoading(false);
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    try {
      await BookmarkEntity.delete(bookmarkId);
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 md:pl-24">
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:pl-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center shadow-lg">
          <Bookmark className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          My Bookmarks
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your saved verses for meditation and study
        </p>
      </motion.div>

      {bookmarks.length > 0 ? (
        <div className="space-y-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {bookmarks.length} {bookmarks.length === 1 ? 'verse' : 'verses'} saved
          </div>

          {bookmarks.map((bookmark, index) => (
            <motion.div
              key={bookmark.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group border-none shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-pink-50/30 dark:from-gray-800 dark:to-gray-900">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                      <Book className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-pink-600 dark:text-pink-400">
                          {bookmark.reference}
                        </h3>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs hover:bg-pink-100 dark:hover:bg-pink-900/20 hover:text-pink-600 dark:hover:text-pink-400"
                          >
                            <Share2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                            onClick={() => handleDeleteBookmark(bookmark.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="bible-text text-slate-800 dark:text-slate-200 leading-relaxed mb-3">
                        {bookmark.text}
                      </p>
                      {bookmark.notes && (
                        <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                            "{bookmark.notes}"
                          </p>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                        Saved on {new Date(bookmark.created_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl flex items-center justify-center">
            <Heart className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
            No bookmarks yet
          </h3>
          <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto mb-8">
            Start saving your favorite verses by clicking the bookmark icon when reading scripture. 
            They'll appear here for easy access during your devotional time.
          </p>
          <Button 
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
            onClick={() => window.location.href = createPageUrl("Bible")}
          >
            <Book className="w-4 h-4 mr-2" />
            Explore Scripture
          </Button>
        </motion.div>
      )}
    </div>
  );
}

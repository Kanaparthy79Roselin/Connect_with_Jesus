
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Star, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BooksList from "../components/bible/BooksList";
import ChapterView from "../components/bible/ChapterView";

export default function Bible() {
  const location = useLocation();
  const [selectedTestament, setSelectedTestament] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const testament = urlParams.get('testament');
    if (testament === 'old' || testament === 'new') {
      setSelectedTestament(testament);
    }
  }, [location]);

  const handleBack = () => {
    if (selectedChapter) {
      setSelectedChapter(null);
    } else if (selectedBook) {
      setSelectedBook(null);
    } else if (selectedTestament) {
      setSelectedTestament(null);
    }
  };

  const renderBreadcrumb = () => {
    const parts = [];
    if (selectedTestament) parts.push(selectedTestament === 'old' ? 'Old Testament' : 'New Testament');
    if (selectedBook) parts.push(selectedBook.name);
    if (selectedChapter) parts.push(`Chapter ${selectedChapter}`);
    
    return parts.length > 0 ? parts.join(' › ') : 'Holy Bible (KJV)';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:pl-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        {(selectedTestament || selectedBook || selectedChapter) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {selectedChapter ? `${selectedBook.name} ${selectedChapter}` : 'Holy Bible'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {renderBreadcrumb()}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedTestament && (
          <motion.div
            key="testaments"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Testament Selection */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card 
                className="cursor-pointer group border-none shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
                onClick={() => setSelectedTestament('old')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Old Testament
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    39 Books • Genesis to Malachi
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    The foundation of faith, prophecy, and God's covenant with His people
                  </p>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer group border-none shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20"
                onClick={() => setSelectedTestament('new')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                    New Testament
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    27 Books • Matthew to Revelation
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    The life of Jesus Christ and the early Christian church
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {selectedTestament && !selectedBook && (
          <BooksList 
            testament={selectedTestament}
            onBookSelect={setSelectedBook}
          />
        )}

        {selectedBook && (
          <ChapterView
            book={selectedBook}
            selectedChapter={selectedChapter}
            onChapterSelect={setSelectedChapter}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

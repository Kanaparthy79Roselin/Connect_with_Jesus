
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Book, ChevronRight } from "lucide-react";
import { bibleBooks } from "./bible-structure"; // Changed import path

export default function BooksList({ testament, onBookSelect }) {
  const books = bibleBooks[testament];
  const testamentName = testament === 'old' ? 'Old Testament' : 'New Testament';

  return (
    <motion.div
      key="books"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {testamentName}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {books.length} books • Choose a book to explore
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book, index) => (
          <motion.div
            key={book.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className="cursor-pointer group border-none shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
              onClick={() => onBookSelect(book)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Book className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                      {book.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {book.chapters} {book.chapters === 1 ? 'chapter' : 'chapters'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

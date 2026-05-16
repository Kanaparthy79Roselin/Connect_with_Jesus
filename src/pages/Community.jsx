
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Post } from "@/entities/Post";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Plus, Heart, Send } from "lucide-react";
import { motion } from "framer-motion";

const PostCard = ({ post, onAmenClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
  >
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${post.type === 'prayer_request' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'}`}>
            {post.type === 'prayer_request' ? 'Prayer Request' : 'Testimony'}
          </span>
          <h3 className="text-xl font-bold mt-3 text-gray-900 dark:text-gray-100">{post.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            by {post.is_anonymous ? 'Anonymous' : post.author_name} • {new Date(post.created_date).toLocaleDateString()}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onAmenClick(post)}
          className={`rounded-full transition-colors duration-200 ${post.type === 'prayer_request' 
            ? 'text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/20 hover:text-pink-500' 
            : 'text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-500'}`}
        >
          {post.type === 'prayer_request' && <Heart className="w-6 h-6" />}
          {post.type === 'testimony' && <Send className="w-6 h-6" />}
        </Button>
      </div>
      <p className="text-gray-700 dark:text-gray-300 line-clamp-3 mb-6">
        {post.content}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-pink-600 dark:text-pink-400">
          {post.amen_count || 0} Amens
        </span>
        <Link to={createPageUrl(`PostDetails?id=${post.id}`)}>
          <Button variant="outline" className="rounded-full">
            View & Comment
          </Button>
        </Link>
      </div>
    </div>
  </motion.div>
);

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const allPosts = await Post.list('-created_date');
      setPosts(allPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
    setIsLoading(false);
  };
  
  const handleAmen = async (clickedPost) => {
    const newAmenCount = (clickedPost.amen_count || 0) + 1;
    
    // Optimistically update the UI for instant feedback
    setPosts(prevPosts => 
      prevPosts.map(p => 
        p.id === clickedPost.id ? { ...p, amen_count: newAmenCount } : p
      )
    );
    
    // Update the database in the background
    try {
      await Post.update(clickedPost.id, { amen_count: newAmenCount });
    } catch (error) {
      console.error("Failed to update amen count:", error);
      // If the API call fails, revert the change in the UI
      setPosts(prevPosts =>
        prevPosts.map(p =>
          p.id === clickedPost.id ? { ...p, amen_count: clickedPost.amen_count } : p
        )
      );
    }
  };

  const prayerRequests = posts.filter(p => p.type === 'prayer_request');
  const testimonies = posts.filter(p => p.type === 'testimony');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:pl-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Community Wall</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Share, pray, and support one another in faith.</p>
        </div>
        <Link to={createPageUrl("CreatePost")}>
          <Button className="w-full md:w-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold">
            <Plus className="w-5 h-5 mr-2" />
            Share Your Story
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="prayer">Prayer Requests</TabsTrigger>
          <TabsTrigger value="testimony">Testimonies</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map(post => <PostCard key={post.id} post={post} onAmenClick={handleAmen} />)}
          </div>
        </TabsContent>
        <TabsContent value="prayer">
          <div className="grid md:grid-cols-2 gap-6">
            {prayerRequests.map(post => <PostCard key={post.id} post={post} onAmenClick={handleAmen} />)}
          </div>
        </TabsContent>
        <TabsContent value="testimony">
          <div className="grid md:grid-cols-2 gap-6">
            {testimonies.map(post => <PostCard key={post.id} post={post} onAmenClick={handleAmen} />)}
          </div>
        </TabsContent>
      </Tabs>
      
      {isLoading && <p className="text-center text-gray-500">Loading posts...</p>}
      {!isLoading && posts.length === 0 && (
        <div className="text-center py-16">
          <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">The wall is quiet...</h3>
          <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">Be the first to share a prayer request or testimony with the community.</p>
        </div>
      )}
    </div>
  );
}
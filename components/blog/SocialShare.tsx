"use client";

import { Facebook, Twitter, Linkedin, Link as LinkIcon, Mail } from "lucide-react";
import { useState } from "react";

interface SocialShareProps {
    url: string;
    title: string;
    description?: string;
}

export function SocialShare({ url, title, description }: SocialShareProps) {
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : url;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description || title);

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        email: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`,
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShare = (platform: string) => {
        window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400');
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 ">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this post</h3>
            <div className="flex flex-col gap-3">
                <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <Facebook className="h-5 w-5" />
                    <span className="font-medium">Facebook</span>
                </button>

                <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center gap-3 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                >
                    <Twitter className="h-5 w-5" />
                    <span className="font-medium">Twitter</span>
                </button>

                <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center gap-3 px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
                >
                    <Linkedin className="h-5 w-5" />
                    <span className="font-medium">LinkedIn</span>
                </button>

                <button
                    onClick={() => handleShare('email')}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                    <Mail className="h-5 w-5" />
                    <span className="font-medium">Email</span>
                </button>

                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-3 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors relative"
                >
                    <LinkIcon className="h-5 w-5" />
                    <span className="font-medium">{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
            </div>
        </div>
    );
}

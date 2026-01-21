"use client";

import { Share2, Link as LinkIcon, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
    title: string;
    description: string;
}

export function ShareButtons({ title, description }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description || "");

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg sm:rounded-3xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Share this story</h3>
            <div className="flex flex-wrap gap-3">
                {/* WhatsApp */}
                <a
                    href={`https://api.whatsapp.com/send?text=${encodedTitle}%20-%20${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-110 hover:shadow-md"
                    aria-label="Share on WhatsApp"
                >
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306.943.32 1.571.227 1.115-.166 2.373-.918 2.373-2.274 0-.596-.289-1.125-.494-1.266-.197-.14-.495-.19-.792-.338" />
                    </svg>
                </a>

                {/* Facebook */}
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1877F2] text-white transition-transform hover:scale-110 hover:shadow-md"
                    aria-label="Share on Facebook"
                >
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.956-2.971 3.594v1.446h4.295l-.657 3.667h-3.638v7.925a17.385 17.385 0 0 1-5.744-.016Z" />
                    </svg>
                </a>

                {/* X (Twitter) */}
                <a
                    href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition-transform hover:scale-110 hover:shadow-md"
                    aria-label="Share on X"
                >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </a>

                {/* LinkedIn */}
                <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0A66C2] text-white transition-transform hover:scale-110 hover:shadow-md"
                    aria-label="Share on LinkedIn"
                >
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                </a>

                {/* Copy Link */}
                <button
                    onClick={handleCopyLink}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform hover:bg-slate-200 hover:scale-110 hover:shadow-md"
                    aria-label="Copy Link"
                >
                    {copied ? <Check className="h-5 w-5 text-green-600" /> : <LinkIcon className="h-5 w-5" />}
                </button>

                {/* Native Share */}
                <button
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: title,
                                text: description,
                                url: shareUrl,
                            });
                        }
                    }}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform hover:bg-slate-200 hover:scale-110 hover:shadow-md md:hidden"
                    aria-label="Share"
                >
                    <Share2 className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

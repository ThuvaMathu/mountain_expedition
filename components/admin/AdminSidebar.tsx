"use client";

import {
  BarChart3,
  Mountain,
  ImageIcon,
  FileText,
  BarChart2,
  Phone,
  Settings,
  ClipboardList,
  Bus,
  MessageSquare,
  X,
  LogOut,
  Rocket,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Clock,
} from "lucide-react";
import Link from "next/link";
import AppLogo from "../ui/app-logo";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const DEPLOY_HOOK_URL =
  "https://api.vercel.com/v1/integrations/deploy/prj_QpJf2AKyqReh1njGi5NZwdBs3XmO/4uzsmTfIWb";

// 10 minutes in ms
const COOLDOWN_MS = 10 * 60 * 1000;

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
}: AdminSidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // Countdown timer while cooldown is active
  useEffect(() => {
    if (!cooldownUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
      setRemainingSeconds(remaining);
      if (remaining === 0) {
        setCooldownUntil(null);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownUntil]);

  const isOnCooldown = !!cooldownUntil && remainingSeconds > 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const res = await fetch(DEPLOY_HOOK_URL, { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("🚀 Deployment triggered! Site will be live in ~10 minutes.", { autoClose: 8000 });
      setCooldownUntil(Date.now() + COOLDOWN_MS);
      setRemainingSeconds(COOLDOWN_MS / 1000);
    } catch (err) {
      toast.error("❌ Deployment failed. Please try again.");
    } finally {
      setIsDeploying(false);
      setIsModalOpen(false);
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "booking", label: "Bookings", icon: ClipboardList },
    { id: "trourist", label: "Tour & Travel", icon: Bus },
    { id: "mountains", label: "Trekking", icon: Mountain },
    { id: "blog", label: "Blog Posts", icon: FileText },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "stats", label: "Statistics", icon: BarChart2 },
    { id: "contacts", label: "Contact Details", icon: Phone },
    { id: "testimonials", label: "Testimonials", icon: MessageSquare },
    { id: "account", label: "Admin Account", icon: Settings },
  ];

  return (
    <>
      {/* Sidebar Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="h-full grid grid-rows-[auto_auto_minmax(0,1fr)_auto] bg-white border-r">
          <div className="p-4 border-b flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <AppLogo isWithText={false} size="small" />
              <span className="font-bold text-teal-700">Tamil Adventure</span>
            </Link>
            <button
              onClick={onClose}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-6 py-4 border-b">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Settings className="h-4 w-4" /> Admin Panel
            </h2>
          </div>

          <nav className="overflow-y-auto py-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${activeTab === item.id
                    ? "bg-teal-50 text-teal-700 border-r-2 border-teal-600"
                    : "text-gray-700"
                  }`}
              >
                <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t bg-gray-50 flex flex-col gap-2">
            {/* Publish All Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isOnCooldown || isDeploying}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-md transition-all duration-300 ${isOnCooldown
                  ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-teal-700 active:scale-95"
                }`}
            >
              {isOnCooldown ? (
                <>
                  <Clock className="h-4 w-4" />
                  Deploying… {formatTime(remainingSeconds)}
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4" />
                  Publish All
                </>
              )}
            </button>

            <Link
              href="/"
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-teal-700 bg-white border border-teal-200 rounded-md hover:bg-teal-50 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Back to Website
            </Link>
          </div>
        </div>
      </aside>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Publish All Changes?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  This will trigger a full site redeployment on Vercel. The site will be updated with all current changes in approximately{" "}
                  <span className="font-semibold text-teal-700">10 minutes</span>.
                </p>
              </div>

              <div className="flex gap-3 w-full pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isDeploying}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-70 shadow-md"
                >
                  {isDeploying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Triggering…
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Confirm
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

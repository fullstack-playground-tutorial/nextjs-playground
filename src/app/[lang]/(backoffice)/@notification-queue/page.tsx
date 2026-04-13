"use client"
import { Notification } from "@/app/feature/notification/notification";
import { useEffect, useState } from "react";

export default function NotificationQueuePage() {
    const [notifications, setNotifications] = useState<Notification[]>([])

    useEffect(() => {
        // Listening to notification stream
        const eventSource = new EventSource("http://localhost:3000/api/notification-queue")
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setNotifications((prev) => [...prev, data]);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== data.id));
            }, 5000);
        }
        return () => {
            eventSource.close()
        }
    }, [])

    return (
        <div className="fixed bottom-24 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            {notifications.map((notification) => (
                <div 
                    key={notification.id} 
                    className="pointer-events-auto min-w-[300px] max-w-md bg-surface-1/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-500 overflow-hidden relative group"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent-0"></div>
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent-0/10 flex items-center justify-center text-xl overflow-hidden border border-white/5 flex-shrink-0">
                            <img 
                                src={notification.requester?.avatarURL || `https://ui-avatars.com/api/?name=${notification.requester?.name || 'System'}&background=random`} 
                                alt="Notif" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-white mb-0.5">{notification.title}</h4>
                            <p className="text-xs text-white/60 line-clamp-2">{notification.content}</p>
                        </div>
                        <button 
                            onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                            className="text-white/20 hover:text-white transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Loader2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "ai";
    content: string;
}

interface ChatInterfaceProps {
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    alwaysShowLabel?: boolean;
}

export function ChatInterface({ isOpen: propIsOpen, onOpenChange, alwaysShowLabel = false }: ChatInterfaceProps) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    // Use controlled state if prop is provided, otherwise internal state
    const isControlled = propIsOpen !== undefined;
    const isOpen = isControlled ? propIsOpen : internalIsOpen;

    const setIsOpen = (value: boolean) => {
        if (onOpenChange) {
            onOpenChange(value);
        }
        if (!isControlled) {
            setInternalIsOpen(value);
        }
    };
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [showLabel, setShowLabel] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { language, t } = useLanguage();

    const chatMutation = useMutation({
        mutationFn: async (message: string) => {
            const res = await apiRequest<{ response: string }>("POST", "/api/chat", {
                message,
                language
            });
            return res.response;
        },
        onSuccess: (response) => {
            setMessages((prev) => [...prev, { role: "ai", content: response }]);
        },
        onError: () => {
            setMessages((prev) => [...prev, {
                role: "ai",
                content: t.errorOccurred
            }]);
        }
    });

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMessage = inputValue.trim();
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setInputValue("");
        chatMutation.mutate(userMessage);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
                    <DialogHeader className="p-6 pb-4">
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Bot className="w-6 h-6 text-primary" />
                            {t.aiAssistant}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                        <ScrollArea className="flex-1 px-6">
                            <div className="space-y-4 pb-4">
                                {messages.length === 0 && (
                                    <div className="text-center text-muted-foreground py-12 px-4">
                                        <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-base">
                                            {t.chatWelcome}
                                        </p>
                                    </div>
                                )}
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "flex gap-3",
                                            msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                            msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                                        )}>
                                            {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                        </div>
                                        <div className={cn(
                                            "rounded-lg p-4 max-w-[75%]",
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {chatMutation.isPending && (
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                                            <Bot className="w-5 h-5" />
                                        </div>
                                        <div className="bg-muted rounded-lg p-4">
                                            <Bot className="w-5 h-5 text-primary animate-robot-bounce" />
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>
                        <div className="p-6 pt-4 border-t bg-background">
                            <div className="flex gap-2">
                                <Input
                                    placeholder={t.chatPlaceholder}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    disabled={chatMutation.isPending}
                                    className="flex-1"
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || chatMutation.isPending}
                                    size="icon"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <div
                className="fixed bottom-24 right-0 z-50 flex items-center"
                onMouseEnter={() => setShowLabel(true)}
                onMouseLeave={() => setShowLabel(false)}
            >
                {!isOpen && (showLabel || alwaysShowLabel) && (
                    <span className="text-[10px] sm:text-xs font-medium bg-primary text-white backdrop-blur px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md shadow-sm whitespace-nowrap animate-in fade-in slide-in-from-right-2 duration-200 mr-2">
                        {t.aiFloatingLabel}
                    </span>
                )}
                <Button
                    size="lg"
                    className="rounded-l-full rounded-r-none h-10 w-12 sm:h-12 sm:w-14 shadow-lg bg-primary hover:bg-primary/90 transition-all hover:scale-110 p-0 pl-1"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                </Button>
            </div>
        </>
    );
}

import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Mic, Square, X } from "lucide-react";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";

interface ChatInputProps {
    onSend: (msg: string, file?: File) => void;
    disabled: boolean;
    isGenerating?: boolean;
    onStop?: () => void;
}

export const ChatInput = ({
    onSend,
    disabled,
    isGenerating = false,
    onStop,
}: ChatInputProps) => {
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Speech-to-text
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    // Put recognized speech into textarea
    useEffect(() => {
        if (transcript) {
            setValue(transcript);

            requestAnimationFrame(() => {
                if (textareaRef.current) {
                    textareaRef.current.style.height = "auto";
                    textareaRef.current.style.height =
                        Math.min(
                            textareaRef.current.scrollHeight,
                            160
                        ) + "px";
                }
            });
        }
    }, [transcript]);

    // Cleanup speech recognition
    useEffect(() => {
        return () => {
            SpeechRecognition.stopListening();
        };
    }, []);

    // ---------------------------------------------
    // Submit
    // ---------------------------------------------

    const submit = () => {
        const message = value.trim();

        if (
            (!message && !selectedFile) ||
            disabled ||
            isGenerating
        ) {
            return;
        }

        // Stop listening before sending
        if (listening) {
            SpeechRecognition.stopListening();
        }

        // Backend receives TEXT
        onSend(message, selectedFile || undefined);

        setValue("");
        setSelectedFile(null);

        resetTranscript();

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    // ---------------------------------------------
    // Keyboard
    // ---------------------------------------------

    const handleKey = (
        e: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
        }
    };

    // ---------------------------------------------
    // Text input
    // ---------------------------------------------

    const handleInput = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setValue(e.target.value);

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                Math.min(
                    textareaRef.current.scrollHeight,
                    160
                ) + "px";
        }
    };

    // ---------------------------------------------
    // File attachment
    // ---------------------------------------------

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (file) {
            setSelectedFile(file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // ---------------------------------------------
    // Speech-to-text
    // ---------------------------------------------

    const toggleSpeechRecognition = () => {
        if (!browserSupportsSpeechRecognition) {
            alert(
                "Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge."
            );
            return;
        }

        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            // Start a fresh recognition session
            resetTranscript();

            SpeechRecognition.startListening({
                continuous: true,
                language: "en-IN",
            });
        }
    };

    return (
        <div className="border-t border-border bg-background/95 px-4 py-3">
            <div className="max-w-3xl mx-auto">

                <div
                    className={`rounded-2xl border transition-all duration-200 ${
                        focused
                            ? "border-foreground/50 shadow-lg"
                            : "border-border"
                    }`}
                    style={{ background: "var(--card)" }}
                >

                    {/* -------------------------------- */}
                    {/* FILE PREVIEW */}
                    {/* -------------------------------- */}

                    {selectedFile && (
                        <div className="flex items-center justify-between px-4 pt-3 pb-1 border-b border-border/50">
                            <div className="flex items-center gap-2 text-sm text-foreground truncate max-w-[90%]">
                                <span className="text-muted-foreground">
                                    📎
                                </span>

                                <span className="truncate">
                                    {selectedFile.name}
                                </span>
                            </div>

                            <button
                                onClick={handleRemoveFile}
                                className="p-1 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                title="Remove file"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    {/* -------------------------------- */}
                    {/* LISTENING INDICATOR */}
                    {/* -------------------------------- */}

                    {listening && (
                        <div className="flex items-center gap-2 px-4 pt-3 pb-1 text-sm text-red-500 animate-pulse">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                            </span>

                            Listening...
                        </div>
                    )}

                    {/* -------------------------------- */}
                    {/* TEXTAREA */}
                    {/* -------------------------------- */}

                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={handleInput}
                        onKeyDown={handleKey}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder="Message Shrija AI..."
                        rows={1}
                        className="w-full bg-transparent px-4 pt-3.5 pb-1 text-sm text-foreground placeholder-muted-foreground resize-none outline-none"
                        style={{
                            minHeight: 44,
                            maxHeight: 160,
                        }}
                        disabled={disabled || isGenerating}
                    />

                    {/* -------------------------------- */}
                    {/* BOTTOM CONTROLS */}
                    {/* -------------------------------- */}

                    <div className="flex items-center justify-between px-3 pb-2.5">

                        <div className="flex items-center gap-1">

                            {/* File input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={
                                    disabled || isGenerating
                                }
                            />

                            {/* Attach */}
                            <button
                                onClick={handleAttachClick}
                                disabled={
                                    disabled || isGenerating
                                }
                                title="Attach file"
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all disabled:opacity-50"
                            >
                                <Paperclip size={14} />
                            </button>

                            {/* -------------------------------- */}
                            {/* SPEECH-TO-TEXT MIC */}
                            {/* -------------------------------- */}

                            <button
                                onClick={
                                    toggleSpeechRecognition
                                }
                                disabled={
                                    disabled || isGenerating
                                }
                                title={
                                    listening
                                        ? "Stop voice input"
                                        : "Voice input"
                                }
                                className={`p-1.5 rounded-lg transition-all ${
                                    listening
                                        ? "text-red-500 bg-red-500/10 animate-pulse"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                }`}
                            >
                                {listening ? (
                                    <Square
                                        size={14}
                                        className="fill-current"
                                    />
                                ) : (
                                    <Mic size={14} />
                                )}
                            </button>
                        </div>

                        {/* -------------------------------- */}
                        {/* RIGHT SIDE */}
                        {/* -------------------------------- */}

                        <div className="flex items-center gap-2">

                            {/* Stop generating */}
                            {isGenerating && onStop && (
                                <button
                                    onClick={onStop}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all text-sm"
                                >
                                    <Square
                                        size={14}
                                        className="fill-current"
                                    />

                                    Stop
                                </button>
                            )}

                            {/* Send */}
                            <button
                                onClick={submit}
                                disabled={
                                    (!value.trim() &&
                                        !selectedFile) ||
                                    disabled ||
                                    isGenerating
                                }
                                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                                    (value.trim() ||
                                        selectedFile) &&
                                    !disabled &&
                                    !isGenerating
                                        ? "bg-foreground text-background hover:opacity-80"
                                        : "bg-secondary text-muted-foreground cursor-not-allowed"
                                }`}
                            >
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center text-[10px] text-muted-foreground mt-2">
                    Shrija AI can make mistakes. Review important information.
                </p>
            </div>
        </div>
    );
};
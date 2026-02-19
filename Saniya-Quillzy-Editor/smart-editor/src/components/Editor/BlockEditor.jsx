import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useEditorStore } from "../../store/useEditorStore";
import { useDebounce } from "../../hooks/useDebounce";
import { api } from "../../services/api";
import { useState } from "react";

export default function BlockEditor() {
    const { currentPost, updateContent, setSaving } = useEditorStore();
    const [aiSummary, setAiSummary] = useState("");

    const saveToBackend = async (content) => {
        if (!currentPost?._id) return;
        setSaving(true);
        try {
            await api.patch(`/api/posts/${currentPost._id}`, { content });
        } catch (err) {
            console.error("Auto-save failed", err);
        } finally {
            setSaving(false);
        }
    };

    const debounceSave = useDebounce(saveToBackend, 2000);

    const handleAiGenerate = async () => {
        if (!currentPost?.content) return alert("Write something first!");
        try {
            const { data } = await api.post("/api/ai/generate", { text: currentPost.content });
            setAiSummary(data.result);
        } catch (err) {
            alert("AI Generation failed");
        }
    };

    const initialConfig = {
        namespace: "SmartEditor",
        onError: (error) => console.error(error),
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <LexicalComposer initialConfig={initialConfig}>
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="outline-none min-h-[400px] prose prose-slate" />}
                        placeholder={<div className="text-gray-300 absolute top-6">Start your story...</div>}
                    />
                    <HistoryPlugin />
                    <OnChangePlugin onChange={(editorState) => {
                        editorState.read(() => {
                            const root = editorState._nodeMap.get("root"); // Simplified for demo
                            const text = root?.__text || "";
                            updateContent(text);
                            debounceSave(text);
                        });
                    }} />
                </LexicalComposer>
            </div>

            <div className="mt-6 flex flex-col gap-4">
                <button
                    onClick={handleAiGenerate}
                    className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition w-fit"
                >
                    ✨ Generate AI Summary
                </button>

                {aiSummary && (
                    <div className="p-4 bg-lavender rounded-lg border border-purple-200">
                        <h3 className="font-bold text-charcoal mb-2">AI Summary:</h3>
                        <p className="text-sm">{aiSummary}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
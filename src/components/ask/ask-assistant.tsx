"use client";
import * as React from "react";
import { Send, Info } from "lucide-react";
import { SectionHeader, Button, Chip } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import { EvidenceDrawer } from "@/components/intelligence/evidence-drawer";
import { answerQuestion, EXAMPLE_QUESTIONS, type AskAnswer } from "./answers";
import { AnswerCard } from "./answer-card";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text?: string;
  answer?: AskAnswer | null;
}

let messageSeq = 0;

/**
 * Ask KhanijDrishti — a grounded, deterministic assistant (spec §46-47).
 * This is NOT a live LLM: every answer is matched from example questions or
 * keyword heuristics against the real `@/lib/data` demo dataset, so it never
 * fabricates evidence.
 */
export function AskAssistant() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [drawerIds, setDrawerIds] = React.useState<string[] | null>(null);

  function ask(question: string) {
    const q = question.trim();
    if (!q) return;
    const answer = answerQuestion(q);
    setMessages((prev) => [
      ...prev,
      { id: `m-${messageSeq++}`, role: "user", text: q },
      { id: `m-${messageSeq++}`, role: "assistant", answer },
    ]);
    setInput("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    ask(input);
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Ask KhanijDrishti"
        title="Ask the Intelligence Assistant"
        subtitle="A grounded, deterministic assistant that answers only from the indexed demo dataset."
      />

      <div className="flex items-start gap-2 rounded-card border border-mineral/30 bg-mineral/5 px-4 py-2.5 text-2xs leading-relaxed text-ink-soft">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mineral" />
        <span>
          Prototype assistant — answers are derived deterministically from the indexed demo dataset via keyword and
          entity matching. It never fabricates evidence and does not call any external LLM.
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {EXAMPLE_QUESTIONS.map((q) => (
          <Chip key={q} onClick={() => ask(q)}>
            {q}
          </Chip>
        ))}
      </div>

      <div className="space-y-4 rounded-card border border-border bg-surface p-4">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-faint">
            Ask a question above, or pick an example chip to get started.
          </p>
        ) : (
          <div className="space-y-4">
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[80%] rounded-card bg-mineral/15 px-3 py-2 text-sm text-ink">{m.text}</div>
                </div>
              ) : (
                <FadeIn key={m.id}>
                  {m.answer ? (
                    <AnswerCard answer={m.answer} onOpenEvidence={setDrawerIds} />
                  ) : (
                    <div className="rounded-card border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-ink-soft">
                      Insufficient public evidence in the indexed dataset.
                    </div>
                  )}
                </FadeIn>
              )
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border pt-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about minerals, technologies, gaps, organisations…"
            className="flex-1 rounded-md border border-border-strong bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-data focus:outline-none"
          />
          <Button type="submit" variant="primary">
            <Send className="h-4 w-4" /> Ask
          </Button>
        </form>
      </div>

      <EvidenceDrawer open={!!drawerIds} onClose={() => setDrawerIds(null)} evidenceIds={drawerIds ?? []} />
    </div>
  );
}

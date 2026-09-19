import { Moon, Waves } from "lucide-react";
import { Card, CardHeader, CardBody, Pill } from "@/components/ui";

/** Display-only preferences panel (spec §76): motion + theme. */
export function PreferencesCard() {
  return (
    <Card>
      <CardHeader>
        <div>
          <div className="text-sm font-semibold text-ink">Preferences</div>
          <p className="mt-0.5 text-2xs text-ink-soft">Display and motion settings</p>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex items-start gap-2.5">
          <Waves className="mt-0.5 h-4 w-4 shrink-0 text-data" />
          <div>
            <div className="text-sm text-ink">Reduced motion</div>
            <p className="mt-0.5 text-2xs leading-relaxed text-ink-faint">
              Respects your operating system&apos;s reduced-motion setting automatically — animations across
              KhanijDrishti shorten or disable themselves, no in-app toggle needed.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Moon className="mt-0.5 h-4 w-4 shrink-0 text-mineral" />
          <div>
            <div className="flex items-center gap-2 text-sm text-ink">
              Theme
              <Pill className="border-mineral/40 bg-mineral/10 text-mineral">Intelligence Dark</Pill>
            </div>
            <p className="mt-0.5 text-2xs leading-relaxed text-ink-faint">
              Light mode is coming later — this prototype ships with a single, purpose-built dark theme.
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

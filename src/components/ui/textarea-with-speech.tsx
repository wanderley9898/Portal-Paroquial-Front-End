import { useSpeechToText } from "@/hooks/use-speech-to-text";
import * as React from "react";
import { SpeechToTextButton } from "./speech-to-text-button";
import { Textarea } from "./textarea";

interface TextareaWithSpeechProps extends React.ComponentProps<
  typeof Textarea
> {
  speechLang?: string;
}

export const TextareaWithSpeech = React.forwardRef<
  HTMLTextAreaElement,
  TextareaWithSpeechProps
>(({ value, onChange, speechLang, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(value ?? "");
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e);
  };
  const speech = useSpeechToText({
    value: typeof value === "string" ? value : (internalValue as string),
    onChange: (text) => {
      setInternalValue(text);
      if (onChange) {
        // Simula evento para compatibilidade com RHF
        onChange({
          target: { value: text },
        } as any);
      }
    },
    lang: speechLang,
  });
  return (
    <div className="relative">
      <Textarea
        {...props}
        ref={ref}
        value={typeof value === "string" ? value : internalValue}
        onChange={handleChange}
        className={"pr-12 " + (props.className || "")}
      />
      <span className="absolute right-2 top-2">
        <SpeechToTextButton
          isListening={speech.isListening}
          isSupported={speech.isSupported}
          onToggle={speech.toggleListening}
        />
      </span>
    </div>
  );
});
TextareaWithSpeech.displayName = "TextareaWithSpeech";

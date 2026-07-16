import { useSpeechToText } from "@/hooks/use-speech-to-text";
import * as React from "react";
import { Input } from "./input";
import { SpeechToTextButton } from "./speech-to-text-button";

interface InputWithSpeechProps extends React.ComponentProps<typeof Input> {
  speechLang?: string;
}

export const InputWithSpeech = React.forwardRef<
  HTMLInputElement,
  InputWithSpeechProps
>(({ value, onChange, speechLang, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(value ?? "");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="relative flex items-center">
      <Input
        {...props}
        ref={ref}
        value={typeof value === "string" ? value : internalValue}
        onChange={handleChange}
        className={"pr-12 " + (props.className || "")}
      />
      <span className="absolute right-2 top-1/2 -translate-y-1/2">
        <SpeechToTextButton
          isListening={speech.isListening}
          isSupported={speech.isSupported}
          onToggle={speech.toggleListening}
        />
      </span>
    </div>
  );
});
InputWithSpeech.displayName = "InputWithSpeech";

// Voice Assistant using Web Speech API
export interface VoiceAssistantOptions {
  language: string;
  onTranscript?: (transcript: string) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export class VoiceAssistant {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private isMuted = false;
  private options: VoiceAssistantOptions;

  constructor(options: VoiceAssistantOptions) {
    this.options = options;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.language = this.options.language;
    this.recognition.continuous = false;
    this.recognition.interimResults = true;

    this.recognition.onstart = () => {
      this.options.onStart?.();
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (event.results[event.results.length - 1].isFinal) {
        this.options.onTranscript?.(transcript);
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this.options.onError?.(event.error);
    };

    this.recognition.onend = () => {
      this.options.onEnd?.();
    };
  }

  public startListening() {
    if (this.recognition && !this.isSpeaking) {
      this.recognition.start();
    }
  }

  public stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  public async speak(text: string) {
    return new Promise<void>((resolve) => {
      if (this.isMuted) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.language = this.options.language;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        resolve();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        resolve();
      };

      speechSynthesis.speak(utterance);
    });
  }

  public stopSpeaking() {
    speechSynthesis.cancel();
    this.isSpeaking = false;
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopSpeaking();
    }
    return this.isMuted;
  }

  public setLanguage(language: string) {
    this.options.language = language;
    if (this.recognition) {
      this.recognition.language = language;
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }
}

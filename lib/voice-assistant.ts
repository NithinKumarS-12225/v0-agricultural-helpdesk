// Voice Assistant using Web Speech API
export interface VoiceAssistantOptions {
  language: string;
  onTranscript?: (transcript: string) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export class VoiceAssistant {
  private recognition: any = null;
  private synthesis: SpeechSynthesis;
  private isSpeaking = false;
  private isMuted = false;
  private options: VoiceAssistantOptions;
  private isListening = false;

  constructor(options: VoiceAssistantOptions) {
    this.options = options;
    this.synthesis = window.speechSynthesis;
    
    // Initialize speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.setupRecognition();
        console.log('[v0] Speech recognition initialized for language:', options.language);
      } catch (error) {
        console.error('[v0] Failed to initialize speech recognition:', error);
      }
    } else {
      console.warn('[v0] Speech Recognition API not supported');
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.language = this.options.language;
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      console.log('[v0] Speech recognition started');
      this.isListening = true;
      this.options.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      let transcript = '';
      let isFinal = false;
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        isFinal = event.results[i].isFinal;
      }
      
      console.log('[v0] Speech result:', { transcript, isFinal });
      
      // Only submit when speech is final
      if (isFinal && transcript.trim()) {
        this.isListening = false;
        this.options.onTranscript?.(transcript);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('[v0] Speech recognition error:', event.error);
      this.isListening = false;
      this.options.onError?.(event.error || 'Speech recognition error');
    };

    this.recognition.onend = () => {
      console.log('[v0] Speech recognition ended');
      this.isListening = false;
      this.options.onEnd?.();
    };
  }

  public startListening() {
    if (!this.recognition) {
      console.warn('[v0] Speech recognition not available');
      return;
    }
    
    if (!this.isListening) {
      try {
        console.log('[v0] Starting to listen for speech in language:', this.options.language);
        this.recognition.start();
      } catch (error) {
        console.error('[v0] Error starting recognition:', error);
      }
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        console.log('[v0] Stopping speech recognition');
        this.recognition.stop();
      } catch (error) {
        console.error('[v0] Error stopping recognition:', error);
      }
    }
  }

  public async speak(text: string) {
    return new Promise<void>((resolve) => {
      if (this.isMuted) {
        console.log('[v0] Speech synthesis muted');
        resolve();
        return;
      }

      try {
        // Cancel any ongoing speech first
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.language = this.options.language;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => {
          console.log('[v0] Speech synthesis started');
          this.isSpeaking = true;
        };

        utterance.onend = () => {
          console.log('[v0] Speech synthesis ended');
          this.isSpeaking = false;
          resolve();
        };

        utterance.onerror = (event: any) => {
          console.error('[v0] Speech synthesis error:', event.error);
          this.isSpeaking = false;
          resolve();
        };

        console.log('[v0] Speaking text:', text.substring(0, 50));
        this.synthesis.speak(utterance);
      } catch (error) {
        console.error('[v0] Error in speak method:', error);
        resolve();
      }
    });
  }

  public stopSpeaking() {
    this.synthesis.cancel();
    this.isSpeaking = false;
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    console.log('[v0] Mute toggled:', this.isMuted);
    if (this.isMuted) {
      this.stopSpeaking();
    }
    return this.isMuted;
  }

  public setLanguage(language: string) {
    console.log('[v0] Setting language to:', language);
    this.options.language = language;
    if (this.recognition) {
      this.recognition.language = language;
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }
}

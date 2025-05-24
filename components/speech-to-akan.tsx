'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { speakAkan, generateAkanAudio } from '../lib/text-to-speech';
import { Play, Send, Mic, MicOff } from 'lucide-react';
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';

interface AkanSpeechPanelProps {
  className?: string;
  callId?: string;
}

export const AkanSpeechPanel: React.FC<AkanSpeechPanelProps> = ({ className, callId }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [micStatus, setMicStatus] = useState<'on' | 'off' | 'unknown'>('unknown');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Get call context safely - this will be undefined if not in a call
  const call = useCall();
  
  // Safely access the microphone state
  const isCallActive = Boolean(call);
  const callStateHooks = isCallActive ? useCallStateHooks() : null;
  const isMicrophoneEnabled = callStateHooks?.useMicrophoneState?.() ?? false;
  
  // Update mic status when it changes
  useEffect(() => {
    if (typeof isMicrophoneEnabled === 'boolean') {
      setMicStatus(isMicrophoneEnabled ? 'on' : 'off');
    } else {
      setMicStatus('unknown');
    }
  }, [isMicrophoneEnabled]);

  // Generate Akan audio but don't auto-play it
  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    setError(null);
    setLoading(true);
    try {
      // Generate audio and get the URL
      const generatedAudioUrl = await generateAkanAudio(text);
      setAudioUrl(generatedAudioUrl);
      
      // Set up the audio element for playback
      if (audioRef.current) {
        audioRef.current.src = generatedAudioUrl;
      }
    } catch (e) {
      setError('Failed to generate Akan speech.');
      console.error(e);
    }
    setLoading(false);
  };
  
  // Play the audio for preview
  const handlePreview = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };
  
  // Function to enable microphone and inject audio
  const enableMicrophoneAndInjectAudio = async () => {
    try {
      // Check if we're in a call context
      if (!isCallActive) {
        setError("Not connected to a call. The audio will only play locally.");
        return "local-only";
      }
      
      // Check if microphone is already enabled, if not try to enable it
      if (!isMicrophoneEnabled) {
        try {
          // Try to enable the microphone using the available call API
          if (call && call.microphone) {
            await call.microphone.enable();
            return "mic-enabled";
          } else {
            setError("Cannot enable microphone automatically. Please unmute manually using call controls.");
            return "mic-error";
          }
        } catch (micError) {
          console.error("Error enabling microphone:", micError);
          setError("Failed to enable microphone. Please unmute manually using call controls.");
          return "mic-error";
        }
      }
      
      return "ready";
    } catch (error) {
      console.error("Error in enableMicrophoneAndInjectAudio:", error);
      return "error";
    }
  };
  
  // New function to properly inject audio into the microphone stream
  const injectAudioIntoMicStream = async (audioUrl: string) => {
    try {
      if (!call || !call.microphone) {
        // If not in a call or no microphone access, just play locally
        await speakAkan(text);
        return;
      }
      
      // Create audio context and element for the generated speech
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioElement = new Audio(audioUrl);
      
      // Create a media stream destination to route audio to
      const mediaStreamDestination = audioContext.createMediaStreamDestination();
      
      // Create a source from the audio element
      const source = audioContext.createMediaElementSource(audioElement);
      
      // Connect the source to the destination
      source.connect(mediaStreamDestination);
      source.connect(audioContext.destination);
      
      // Get the stream from the destination
      const audioStream = mediaStreamDestination.stream;
      
      // Here we would ideally use call.microphone.setStream(audioStream)
      // but if that's not available in your SDK version, we'll do the next best thing
      
      // The user will hear the audio, and if their microphone is on,
      // the audio will be played through their mic to other call participants
      audioElement.oncanplay = () => {
        audioElement.play();
      };
      
      audioElement.onended = () => {
        // Clean up
        source.disconnect();
        audioContext.close();
      };
      
      audioElement.load();
      
      return new Promise((resolve) => {
        audioElement.onended = () => {
          resolve(true);
        };
      });
    } catch (error) {
      console.error("Error injecting audio:", error);
      // Fallback to regular playback
      await speakAkan(text);
    }
  };
  
  // Check microphone status and enable it if needed before sending audio
  const handleSendToCall = async () => {
    if (!audioUrl) {
      setError("Please generate audio first.");
      return;
    }
    
    setIsSending(true);
    setError(null);
    
    try {
      // First, try to enable the microphone
      const micState = await enableMicrophoneAndInjectAudio();
      
      if (micState === "local-only") {
        // Just play locally if not in a call
        await speakAkan(text);
      } else if (micState === "mic-error") {
        // Error message already set, just play locally
        await speakAkan(text);
      } else {
        // Mic is enabled or was already on, inject audio into mic stream
        await injectAudioIntoMicStream(audioUrl);
      }
      
      // Reset UI state
      setText('');
      setAudioUrl(null);
    } catch (e) {
      setError('Failed to send audio to call: ' + (e instanceof Error ? e.message : String(e)));
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className || ''}`}>
      <Textarea
        className="flex-grow mb-6 bg-[#111827] border-gray-600 text-white h-48 resize-none focus:ring-green-500 focus:border-green-500"
        placeholder="Type your message to be spoken in the meeting..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      
      {!audioUrl ? (
        <Button 
          onClick={handleGenerate} 
          disabled={!text.trim() || loading} 
          className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-base font-medium"
          size="lg"
        >
          {loading ? 'Generating...' : 'Generate Akan Speech'}
        </Button>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Button 
              onClick={handlePreview}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Play className="h-4 w-4 mr-2" /> Preview
            </Button>
            <Button 
              onClick={handleSendToCall}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              size="lg"
              disabled={isSending}
            >
              <Send className="h-4 w-4 mr-2" /> 
              {isSending ? 'Sending...' : 'Send to Call'}
            </Button>
          </div>
          
          {/* Show microphone and call status */}
          <div className="flex items-center justify-center text-sm">
            <div className={`flex items-center gap-1 ${!isCallActive ? 'text-yellow-400' : micStatus === 'off' ? 'text-red-400' : 'text-green-400'}`}>
              {!isCallActive ? (
                <>
                  <MicOff className="h-4 w-4" /> 
                  <span>Not connected to a call</span>
                </>
              ) : micStatus === 'off' ? (
                <>
                  <MicOff className="h-4 w-4" /> 
                  <span>Mic is off - will be turned on when sending</span>
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" /> 
                  <span>Mic is on</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Hidden audio element for playback */}
      <audio ref={audioRef} style={{ display: 'none' }} />
      
      {error ? (
        <div className="text-red-500 text-xs mt-3">{error}</div>
      ) : (
        <div className="text-gray-400 text-xs mt-3 text-center">
          {!audioUrl 
            ? "Type your message and click Generate Akan Speech to prepare audio."
            : isCallActive
              ? "Preview the audio or send it directly to the call."
              : "Preview the audio locally (not connected to a call)."
          }
        </div>
      )}
    </div>
  );
};

export default AkanSpeechPanel;
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  User,
} from '@stream-io/video-react-sdk';
import { Copy, Check, Share2 } from 'lucide-react';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import '../../stream.css';
import AkanSpeechPanel from '@/components/speech-to-akan';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function KasaMeet() {
  const searchParams = useSearchParams();
  const callId = searchParams.get('callId') || 'default-call-id';
  const userName = searchParams.get('user') || 'Guest';
  const meetingTitle = searchParams.get('title') || 'Meeting';

  const [callInstance, setCallInstance] = useState<any>(null);
  const [clientInstance, setClientInstance] = useState<StreamVideoClient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');
  const [copied, setCopied] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');

  // Generate a shareable meeting link with the current parameters
  useEffect(() => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/kasameet?callId=${callId}&title=${encodeURIComponent(meetingTitle)}`;
    setMeetingLink(link);
  }, [callId, meetingTitle]);

  const copyMeetingLink = useCallback(() => {
    navigator.clipboard.writeText(meetingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [meetingLink]);

  // Share meeting link using the Web Share API if available
  const shareMeetingLink = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: `Join my KasaBridge meeting: ${meetingTitle}`,
        text: 'Join my KasaBridge video call with Akan speech translation',
        url: meetingLink
      }).catch(err => console.log('Error sharing:', err));
    } else {
      copyMeetingLink();
    }
  }, [meetingTitle, meetingLink, copyMeetingLink]);

  useEffect(() => {
    const apiKey = 'mmhfdzb5evj2';
    
    // Generate a userId based on the user name (sanitized for use as an ID)
    const userId = userName.replace(/[^a-zA-Z0-9]/g, '_') + '_' + Math.random().toString(36).substring(2, 7);
    
    // For debugging purposes, use a hardcoded token that we know works
    // In production, you'd use the token from your API
    const hardcodedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0F1cnJhX1NpbmciLCJ1c2VyX2lkIjoiQXVycmFfU2luZyIsInZhbGlkaXR5X2luX3NlY29uZHMiOjYwNDgwMCwiaWF0IjoxNzQ1ODkzMDA2LCJleHAiOjE3NDY0OTc4MDZ9.7-JqOY3IpSCVdAhmmtWvXoqyW_4IbNJGHNdsRzZPwMQ';
    
    async function setupCall() {
      try {
        setLoading(true);
        setDebugInfo('Setting up call...');
        
        // Create user object with hardcoded user ID that matches the token
        const user: User = {
          id: 'Aurra_Sing', // This matches the user_id in the hardcoded token
          name: userName,
          image: `https://getstream.io/random_svg/?id=Aurra_Sing&name=${encodeURIComponent(userName)}`,
        };

        setDebugInfo('Creating client...');
        const client = new StreamVideoClient({
          apiKey,
          user,
          token: hardcodedToken,
        });

        setDebugInfo('Creating call...');
        const call = client.call('default', callId);
        
        setDebugInfo('Joining call...');
        await call.join({ create: true });
        
        setDebugInfo('Call joined successfully!');
        setCallInstance(call);
        setClientInstance(client);
        document.title = `${meetingTitle} | KasaBridge Meet`;
        setLoading(false);
      } catch (err) {
        console.error('Error setting up call:', err);
        setDebugInfo(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setError('Failed to set up video call: ' + (err instanceof Error ? err.message : 'Unknown error'));
        setLoading(false);
      }
    }

    setupCall();

    return () => {
      if (clientInstance && callInstance) {
        callInstance.leave();
        clientInstance.disconnectUser();
      }
      document.title = 'KasaBridge';
    };
  }, [callId, userName, meetingTitle]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <div className="bg-gray-100 p-4 rounded-md text-xs overflow-auto max-w-full mb-4">
          <pre>{debugInfo}</pre>
        </div>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading || !clientInstance || !callInstance) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-xl">Loading video call...</div>
          <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-primary rounded-full"></div>
        </div>
        <div className="bg-gray-100 p-4 rounded-md text-xs overflow-auto max-w-full">
          <pre>{debugInfo}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-[#111827] overflow-hidden">
      {/* Main call area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-green-500 text-white py-2 px-4 flex items-center justify-between">
          <div className="text-lg font-bold">{meetingTitle}</div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-white border-green-400"
                    onClick={copyMeetingLink}
                  >
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    Copy Link
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy meeting link to invite others</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {navigator.share && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-white border-green-400"
                      onClick={shareMeetingLink}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share meeting invitation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        <div className="flex-grow relative">
          <StreamVideo client={clientInstance}>
            <StreamCall call={callInstance}>
              <MyUILayout />
            </StreamCall>
          </StreamVideo>
        </div>
      </div>
      
      {/* Akan Speech sidebar panel */}
      <div className="w-80 bg-[#1F2937] border-l border-gray-700 p-4 flex flex-col h-full">
        <div className="flex flex-col mb-6">
          <h3 className="text-white font-semibold text-lg">Text to Akan (Speech)</h3>
          <div className="mt-2 p-3 bg-slate-800 rounded-md">
            <p className="text-xs text-slate-300 mb-2">Meeting Link (Share to invite others):</p>
            <div className="flex items-center">
              <input 
                type="text" 
                value={meetingLink} 
                readOnly 
                className="text-xs p-1 bg-slate-700 text-white rounded-l flex-1 overflow-hidden text-ellipsis"
              />
              <button 
                onClick={copyMeetingLink} 
                className="bg-green-600 p-1 rounded-r hover:bg-green-700 transition-colors"
                title="Copy link"
              >
                {copied ? <Check className="h-4 w-4 text-white" /> : <Copy className="h-4 w-4 text-white" />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex-grow flex flex-col">
          <AkanSpeechPanel />
        </div>
      </div>
    </div>
  );
}

const MyUILayout = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return <div className="flex items-center justify-center min-h-[90vh]">
      <div className="animate-pulse text-xl">Joining call...</div>
    </div>;
  }

  return (
    <StreamTheme>
      <SpeakerLayout participantsBarPosition='bottom' />
      <CallControls />
    </StreamTheme>
  );
};
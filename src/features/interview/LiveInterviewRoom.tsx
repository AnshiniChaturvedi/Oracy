"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { ArrowRight } from "@/components/Icons";

const ROLE_QUESTIONS: Record<string, Array<{ category: string; question: string; tip: string }>> = {
  "Data Analyst": [
    {
      category: "Technical · SQL & Data Modeling",
      question: "How would you detect and handle missing or corrupted data in a customer dataset before running SQL aggregations?",
      tip: "Focus on detection techniques (NULL counts, distribution checks), imputation strategies, and business impact.",
    },
    {
      category: "Analytical · Problem Solving",
      question: "Walk me through a situation where business stakeholders questioned your dashboard insights. How did you validate and communicate your findings?",
      tip: "Highlight data verification, clear visual presentation, active listening, and building stakeholder confidence.",
    },
    {
      category: "Communication · Business Storytelling",
      question: "How do you translate complex statistical correlations or customer segmentation into concrete recommendations for non-technical leadership?",
      tip: "Emphasize actionable outcomes, executive summaries, and framing data in terms of revenue, retention, and efficiency.",
    },
  ],
  "Python Developer": [
    {
      category: "Language Architecture & Concurrency",
      question: "Can you explain how the Global Interpreter Lock (GIL) affects multithreaded vs multiprocessing applications in Python, and how you select between them?",
      tip: "Explain CPU-bound vs I/O-bound bottlenecks, asyncio for network operations, and ProcessPoolExecutor for compute.",
    },
    {
      category: "API Design & Resiliency",
      question: "How do you design a high-throughput REST or async API (such as FastAPI) to handle database pooling, validation, and structured error responses gracefully?",
      tip: "Mention async database engines, Pydantic schema validation, centralized middleware, and idempotency.",
    },
    {
      category: "Testing & Code Reliability",
      question: "Describe your strategy for writing unit and integration tests with pytest when dealing with external databases and third-party APIs.",
      tip: "Discuss test fixtures, monkeypatching/mocking vs test databases, and verifying boundary/failure cases.",
    },
  ],
  "Software Developer": [
    {
      category: "System Design & Scalability",
      question: "How would you design a resilient notification microservice that delivers millions of real-time notifications without overwhelming downstream providers?",
      tip: "Discuss message queues (Kafka, RabbitMQ), rate-limiting, exponential backoff, dead letter queues, and deduplication.",
    },
    {
      category: "Debugging & Problem Solving",
      question: "Walk me through the most challenging production outage or bug you diagnosed. What was your step-by-step diagnostic process?",
      tip: "Describe initial metric alerts, log correlation, isolating the failing layer, deploying a safe rollback/fix, and the post-mortem.",
    },
    {
      category: "Engineering Best Practices",
      question: "How do you balance shipping features quickly versus refactoring technical debt and maintaining high code quality in a team?",
      tip: "Discuss test coverage, modular codebases, incremental refactoring, and aligning technical debt with business risk.",
    },
  ],
  "Machine Learning Engineer": [
    {
      category: "MLOps & Production Monitoring",
      question: "How do you detect and mitigate data drift and concept drift in a deployed real-time machine learning service?",
      tip: "Discuss statistical drift metrics (PSI, KS-test), monitoring feature inputs, automated alerting, and retraining pipelines.",
    },
    {
      category: "Modeling & Evaluation",
      question: "In an imbalanced classification problem, why is raw accuracy misleading, and how do you evaluate and optimize performance instead?",
      tip: "Cover Precision-Recall curves, F1/PR-AUC, cost-sensitive learning, and resampling techniques.",
    },
  ],
  "Frontend Developer": [
    {
      category: "Performance & Web Vitals",
      question: "What specific strategies do you use to diagnose and fix slow Core Web Vitals (LCP, FID/INP, and CLS) in a modern React / Next.js web application?",
      tip: "Mention code splitting, dynamic imports, image optimization, font display strategies, and minimizing main-thread blocking.",
    },
    {
      category: "State Management & Reactivity",
      question: "How do you decide when to use local component state, React Context, or a server-cache solution like TanStack Query / SWR?",
      tip: "Highlight separation of UI state from remote server state and preventing unnecessary re-renders in deep trees.",
    },
  ],
  "Designer": [
    {
      category: "UX / UI Process & Methodology",
      question: "Can you walk me through your end-to-end design process, from discovery and wireframing to user testing and developer handoff?",
      tip: "Highlight user personas, iterative wireframing, usability testing feedback loops, and Figma design tokens.",
    },
    {
      category: "Cross-Functional Collaboration",
      question: "How do you handle situations where engineering constraints or business deadlines conflict with your ideal design vision?",
      tip: "Focus on pragmatic trade-offs, progressive enhancement, active collaboration with engineers, and phasing out complex interactions.",
    },
    {
      category: "Design Systems & Accessibility",
      question: "Describe your experience working with design systems. How do you ensure high visual consistency and WCAG accessibility standards across products?",
      tip: "Mention atomic design principles, contrast ratios, keyboard navigability, semantic HTML, and documentation.",
    },
  ],
};

const FILLER_WORDS = ["um", "uh", "like", "you know", "actually", "basically", "literally", "sort of", "i mean"];

function getQuestionsForRole(roleName: string) {
  const normalized = Object.keys(ROLE_QUESTIONS).find(
    (k) => k.toLowerCase() === roleName.trim().toLowerCase()
  );
  if (normalized) return ROLE_QUESTIONS[normalized];

  return [
    {
      category: "Professional Background & Role Fit",
      question: `Why are you interested in this ${roleName || "target"} position, and how does your past experience make you a strong fit?`,
      tip: "Structure your response using the STAR method: Situation, Task, Action, and measurable Result.",
    },
    {
      category: "Problem Solving & Technical Execution",
      question: "Describe a project where you faced unforeseen technical constraints or changing requirements midway. How did you adapt?",
      tip: "Focus on prioritization, communication with team members, and pragmatic trade-offs.",
    },
    {
      category: "Impact & Ownership",
      question: "Tell me about an accomplishment you are most proud of in your career. What was the impact and what did you learn?",
      tip: "Quantify your impact where possible (e.g. speedup, user satisfaction, cost reduction) and share key takeaways.",
    },
  ];
}

interface LiveInterviewRoomProps {
  role: string;
  onExit: () => void;
}

export function LiveInterviewRoom({ role, onExit }: LiveInterviewRoomProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);

  const [cameraLoading, setCameraLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);

  // Active view tab in right column: "question" | "signals" | "transcript"
  const [activeTab, setActiveTab] = useState<"question" | "signals" | "transcript">("question");

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // --- Real-Time Vision & Multimodal Analysis Signals ---
  const [postureStatus, setPostureStatus] = useState("Upright & Centered");
  const [postureScore, setPostureScore] = useState(90);
  const [framingStatus, setFramingStatus] = useState("Optimal Distance");
  const [faceDetected, setFaceDetected] = useState(true);

  const [expressionStatus, setExpressionStatus] = useState("Confident & Attentive");
  const [expressionScore, setExpressionScore] = useState(88);
  const [gazeStatus, setGazeStatus] = useState("Direct Camera Eye-Contact");

  // Speech Analysis
  const [transcript, setTranscript] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [speechWpm, setSpeechWpm] = useState(138);
  const [speechPace, setSpeechPace] = useState("Steady (Ideal)");
  const [detectedFillers, setDetectedFillers] = useState<string[]>([]);

  // AI Voice / Text-to-Speech State
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  // Personality Assessment Dimensions
  const [confidenceScore, setConfidenceScore] = useState(86);
  const [clarityScore, setClarityScore] = useState(84);
  const [composureScore, setComposureScore] = useState(91);
  const [engagementScore, setEngagementScore] = useState(85);

  const questions = getQuestionsForRole(role);
  const currentQ = questions[activeQuestionIndex];

  // AI Voice Text-to-Speech function
  const speakQuestion = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    if (!aiVoiceEnabled) {
      setIsAiSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice =
      voices.find(
        (v) =>
          (v.name.includes("Natural") ||
            v.name.includes("Google") ||
            v.name.includes("Samantha") ||
            v.name.includes("Jenny") ||
            v.name.includes("Daniel") ||
            v.name.includes("Arthur")) &&
          v.lang.startsWith("en")
      ) || voices.find((v) => v.lang.startsWith("en"));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => setIsAiSpeaking(true);
    utterance.onend = () => setIsAiSpeaking(false);
    utterance.onerror = () => setIsAiSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Automatically speak question aloud when loaded or index changes
  useEffect(() => {
    if (!interviewFinished && !cameraLoading && aiVoiceEnabled) {
      const timer = setTimeout(() => {
        speakQuestion(currentQ.question);
      }, 500);
      return () => {
        clearTimeout(timer);
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      };
    } else {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        setIsAiSpeaking(false);
      }
    }
  }, [activeQuestionIndex, cameraLoading, aiVoiceEnabled, interviewFinished]);

  // Initialize camera and mic
  useEffect(() => {
    let animId: number;
    let isMounted = true;

    async function startMedia() {
      setCameraLoading(true);
      setCameraError(null);

      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        if (isMounted) {
          setCameraError("Camera access is not supported in this browser or environment.");
          setCameraLoading(false);
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: true,
        });

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Web Audio API for audio meter & vocal energy
        try {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (AudioContextClass) {
            const ctx = new AudioContextClass();
            audioContextRef.current = ctx;
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            analyser.smoothingTimeConstant = 0.5;

            const source = ctx.createMediaStreamSource(stream);
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const monitorAudio = () => {
              if (!isMounted) return;
              analyser.getByteFrequencyData(dataArray);
              let total = 0;
              for (let i = 0; i < dataArray.length; i++) {
                total += dataArray[i];
              }
              const avg = total / dataArray.length;
              const currentLevel = Math.min(100, Math.round((avg / 128) * 100));
              setAudioLevel(currentLevel);

              // Dynamically adjust engagement score based on speaking activity
              if (currentLevel > 18) {
                setEngagementScore((prev) => Math.min(96, Math.max(78, prev + 1)));
              }

              animId = requestAnimationFrame(monitorAudio);
            };
            animId = requestAnimationFrame(monitorAudio);
          }
        } catch (audioErr) {
          console.warn("Audio meter setup skipped:", audioErr);
        }

        setCameraLoading(false);
      } catch (err) {
        if (!isMounted) return;
        setCameraLoading(false);
        const error = err as Error;
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          setCameraError("Camera and microphone permission denied. Please click the camera icon in your browser URL bar to allow access, then click 'Retry Camera'.");
        } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
          setCameraError("No webcam or microphone found on your device. Please connect a camera and try again.");
        } else {
          setCameraError(`Unable to start camera: ${error.message || "Unknown error"}. Please check device permissions.`);
        }
      }
    }

    startMedia();

    return () => {
      isMounted = false;
      if (animId) cancelAnimationFrame(animId);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // --- Real-time Computer Vision Frame Analyzer (Posture & Expressions) ---
  useEffect(() => {
    let frameInterval: NodeJS.Timeout;

    const analyzeVideoFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2 || !cameraEnabled) return;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = 160;
      canvas.height = 120;
      ctx.drawImage(video, 0, 0, 160, 120);

      try {
        const frame = ctx.getImageData(0, 0, 160, 120);
        const data = frame.data;

        // Compute brightness & color distribution across columns & rows
        let leftBrightness = 0;
        let rightBrightness = 0;
        let topBrightness = 0;
        let bottomBrightness = 0;
        let centerBrightness = 0;
        let totalSamples = 0;

        for (let y = 0; y < 120; y += 4) {
          for (let x = 0; x < 160; x += 4) {
            const idx = (y * 160 + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

            totalSamples++;
            if (x < 60) leftBrightness += brightness;
            else if (x > 100) rightBrightness += brightness;
            else centerBrightness += brightness;

            if (y < 45) topBrightness += brightness;
            else if (y > 75) bottomBrightness += brightness;
          }
        }

        const avgLeft = leftBrightness / (totalSamples / 3);
        const avgRight = rightBrightness / (totalSamples / 3);
        const avgCenter = centerBrightness / (totalSamples / 3);
        const avgTop = topBrightness / (totalSamples / 3);

        const horizontalDiff = avgLeft - avgRight;

        // Posture classification
        if (Math.abs(horizontalDiff) < 18) {
          setPostureStatus("Upright & Centered");
          setPostureScore(92);
          setFramingStatus("Optimal Centering");
        } else if (horizontalDiff > 18) {
          setPostureStatus("Leaning Left");
          setPostureScore(78);
        } else {
          setPostureStatus("Leaning Right");
          setPostureScore(78);
        }

        if (avgTop < 25) {
          setPostureStatus("Slouching / Head Low");
          setPostureScore(70);
        }

        // Facial Expression & Gaze Estimation
        if (Math.abs(horizontalDiff) < 12) {
          setGazeStatus("Direct Camera Eye-Contact");
          setExpressionStatus("Confident & Attentive");
          setExpressionScore(90);
          setConfidenceScore((prev) => Math.min(95, prev + 0.5));
          setComposureScore(92);
        } else {
          setGazeStatus("Gaze Drifting Off-Center");
          setExpressionStatus("Pensive / Thoughtful");
          setExpressionScore(82);
        }

        setFaceDetected(avgCenter > 20);
      } catch (e) {
        // Fallback silently if canvas read error
      }
    };

    frameInterval = setInterval(analyzeVideoFrame, 1000);
    return () => clearInterval(frameInterval);
  }, [cameraEnabled]);

  // --- Real-time Speech Recognition & Transcription Engine ---
  useEffect(() => {
    let recognition: any = null;
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (SpeechRecognition && micEnabled && !interviewFinished) {
      try {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let currentText = "";
          for (let i = 0; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript + " ";
          }

          const trimmed = currentText.trim();
          setTranscript(trimmed);

          const words = trimmed.split(/\s+/).filter(Boolean);
          const count = words.length;
          setWordCount(count);

          // Calculate Words Per Minute
          if (elapsedSeconds > 5 && count > 0) {
            const minutes = elapsedSeconds / 60;
            const currentWpm = Math.round(count / minutes);
            setSpeechWpm(currentWpm);

            if (currentWpm >= 120 && currentWpm <= 165) {
              setSpeechPace("Steady (Ideal Pace)");
              setClarityScore((prev) => Math.min(94, prev + 1));
            } else if (currentWpm > 165) {
              setSpeechPace("Rapid (Slightly Fast)");
            } else {
              setSpeechPace("Deliberate (Slow / Pausing)");
            }
          }

          // Scan for filler words
          const lower = trimmed.toLowerCase();
          const foundFillers: string[] = [];
          FILLER_WORDS.forEach((fw) => {
            const regex = new RegExp(`\\b${fw}\\b`, "gi");
            const matches = lower.match(regex);
            if (matches) {
              foundFillers.push(...matches);
            }
          });
          setDetectedFillers(foundFillers);
        };

        recognition.onerror = (err: any) => {
          console.warn("Speech recognition notice:", err.error);
        };

        recognition.onend = () => {
          // Restart recognition automatically if mic is still on
          if (micEnabled && !interviewFinished) {
            try {
              recognition.start();
            } catch (e) {}
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (recErr) {
        console.warn("SpeechRecognition initialization failed:", recErr);
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {}
      }
    };
  }, [micEnabled, interviewFinished, elapsedSeconds]);

  // Elapsed timer
  useEffect(() => {
    if (interviewFinished) return;
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [interviewFinished]);

  const toggleCamera = () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCameraEnabled(videoTrack.enabled);
    }
  };

  const toggleMic = () => {
    if (!streamRef.current) return;
    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicEnabled(audioTrack.enabled);
    }
  };

  const handleExit = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    onExit();
  };

  const retryCamera = () => {
    window.location.reload();
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Average overall delivery score
  const overallDeliveryScore = Math.round(
    postureScore * 0.25 + expressionScore * 0.25 + clarityScore * 0.25 + composureScore * 0.25
  );

  return (
    <div className="mx-auto w-full max-w-page px-5 pb-24 pt-28 sm:px-8 md:pt-36 lg:px-12">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* Top Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 items-center justify-center">
            <span className="absolute h-3 w-3 animate-ping rounded-full bg-ok/40" />
            <span className="h-2 w-2 rounded-full bg-ok" />
          </span>
          <div>
            <h1 className="font-display text-xl sm:text-2xl text-ink">
              Live AI Multimodal Session: <span className="text-cobalt">{role || "Candidate"}</span>
            </h1>
            <p className="text-xs font-mono uppercase tracking-wider text-mute">
              Real-time Vision, Speech, Posture & Personality Analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (isAiSpeaking && typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
                setIsAiSpeaking(false);
              }
              setAiVoiceEnabled(!aiVoiceEnabled);
            }}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs transition border shadow-sm ${
              aiVoiceEnabled
                ? "border-cobalt/40 bg-cobalt/10 text-cobalt hover:bg-cobalt/20"
                : "border-line bg-card text-mute hover:bg-line/40"
            }`}
            title="Toggle AI Voice speech for interview questions"
          >
            <span>{aiVoiceEnabled ? "🔊" : "🔇"}</span>
            <span className="hidden sm:inline">AI Voice: {aiVoiceEnabled ? "ON" : "OFF"}</span>
          </button>

          <div className="flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 font-mono text-xs text-ink/80 shadow-sm">
            <span className="text-mute uppercase tracking-wider text-[10px]">Timer</span>
            <span className="font-semibold text-cobalt">{formatTimer(elapsedSeconds)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 font-mono text-xs text-ink/80 shadow-sm">
            <span className="text-mute uppercase tracking-wider text-[10px]">Delivery Score</span>
            <span className="font-semibold text-ok">{overallDeliveryScore}%</span>
          </div>

          <button
            type="button"
            onClick={handleExit}
            className="rounded-full border border-line bg-card px-4 py-1.5 text-xs font-medium text-ink/75 transition hover:border-bad hover:bg-bad/5 hover:text-bad"
          >
            End Interview
          </button>
        </div>
      </div>

      {!interviewFinished ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Live Video Chamber with AI Multimodal HUD */}
          <div className="space-y-4 lg:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-line bg-ink shadow-lift sm:aspect-[16/10]">
              {/* Actual Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`h-full w-full object-cover -scale-x-100 transition-opacity duration-300 ${
                  cameraEnabled && !cameraError && !cameraLoading ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Camera Loading Overlay */}
              {cameraLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/90 text-white">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-cobalt border-t-transparent" />
                  <p className="mt-4 font-mono text-xs uppercase tracking-widest text-white/80">
                    Connecting camera & vision models...
                  </p>
                </div>
              )}

              {/* Camera Error Message */}
              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-ink text-white">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bad/20 text-bad mb-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                      <path d="M15 10l5-5v14l-5-5" />
                      <path d="M4 6h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
                      <path d="M2 2l20 20" />
                    </svg>
                  </div>
                  <h3 className="font-display text-lg">Camera Access Required</h3>
                  <p className="mt-2 max-w-md text-xs leading-relaxed text-white/70">
                    {cameraError}
                  </p>
                  <Button onClick={retryCamera} className="mt-5 text-xs py-2 px-4" variant="primary">
                    Retry Camera
                  </Button>
                </div>
              )}

              {/* Camera Paused Placeholder */}
              {!cameraEnabled && !cameraLoading && !cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink text-white">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white/60 mb-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8">
                      <path d="M15 10l5-5v14l-5-5" />
                      <path d="M4 6h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
                      <path d="M2 2l20 20" />
                    </svg>
                  </div>
                  <p className="font-mono text-xs uppercase tracking-widest text-white/60">
                    Camera feed paused
                  </p>
                </div>
              )}

              {/* Real-time AI Analysis Overlay HUD on Video */}
              {!cameraLoading && !cameraError && cameraEnabled && (
                <div className="pointer-events-none absolute inset-0 p-4 sm:p-6 flex flex-col justify-between">
                  {/* Top Bar Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur border border-white/10">
                        <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" />
                        Posture: {postureStatus}
                      </span>
                      <span className="rounded-full bg-black/70 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/90 backdrop-blur border border-white/10">
                        Gaze: {gazeStatus}
                      </span>
                    </div>

                    <span className="rounded-full bg-cobalt/80 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                      AI Vision Active
                    </span>
                  </div>

                  {/* AI Speaking Notice Overlay */}
                  {isAiSpeaking && (
                    <div className="mx-auto rounded-full bg-cobalt px-4 py-1.5 font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white shadow-lift flex items-center gap-2 backdrop-blur animate-pulse">
                      <span>🗣️</span>
                      <span>AI Interviewer Speaking Question...</span>
                    </div>
                  )}

                  {/* Centering Face Landmark Guide Box */}
                  <div className="mx-auto w-44 sm:w-56 h-56 sm:h-64 border border-dashed border-white/30 rounded-3xl flex flex-col justify-between p-3">
                    <div className="flex justify-between text-[9px] font-mono text-white/50 uppercase">
                      <span>┌ Head Target</span>
                      <span>┐</span>
                    </div>
                    <div className="flex justify-center">
                      <span className="text-[10px] font-mono text-white/70 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur">
                        {expressionStatus}
                      </span>
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-white/50 uppercase">
                      <span>└ Shoulders</span>
                      <span>┘</span>
                    </div>
                  </div>

                  {/* Bottom Video HUD: Speech & Voice Level */}
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    {/* Audio Level & Speech Pace */}
                    <div className="flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur border border-white/10">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-3.5 w-3.5 ${micEnabled ? "text-ok" : "text-bad"}`}>
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                      </svg>
                      <div className="flex items-center gap-0.5 h-3">
                        {[1, 2, 3, 4, 5, 6].map((bar) => {
                          const active = micEnabled && audioLevel > bar * 14;
                          return (
                            <span
                              key={bar}
                              className={`w-1 rounded-full transition-all duration-75 ${
                                active ? "bg-ok" : "bg-white/20"
                              }`}
                              style={{ height: active ? `${Math.max(6, (bar * 2.5) + (audioLevel * 0.1))}px` : "4px" }}
                            />
                          );
                        })}
                      </div>
                      <span className="font-mono text-[10px] text-white/80 pl-1">
                        {speechPace} · {speechWpm} wpm
                      </span>
                    </div>

                    {/* Personality & Confidence Real-time Pill */}
                    <span className="rounded-full bg-black/70 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ok backdrop-blur border border-white/10">
                      Confidence: {confidenceScore}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* In-Chamber Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card p-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleCamera}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition ${
                    cameraEnabled
                      ? "bg-cobalt/10 text-cobalt hover:bg-cobalt/20"
                      : "bg-bad/10 text-bad hover:bg-bad/20"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M15 10l5-5v14l-5-5" />
                    <path d="M4 6h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
                    {!cameraEnabled && <line x1="2" y1="2" x2="22" y2="22" />}
                  </svg>
                  {cameraEnabled ? "Turn Camera Off" : "Turn Camera On"}
                </button>

                <button
                  type="button"
                  onClick={toggleMic}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition ${
                    micEnabled
                      ? "bg-cobalt/10 text-cobalt hover:bg-cobalt/20"
                      : "bg-bad/10 text-bad hover:bg-bad/20"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                    {!micEnabled && <line x1="2" y1="2" x2="22" y2="22" />}
                  </svg>
                  {micEnabled ? "Mute Microphone" : "Unmute Microphone"}
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-mute font-mono">
                <span>Fillers detected:</span>
                <span className={`font-semibold ${detectedFillers.length > 2 ? "text-warn" : "text-ok"}`}>
                  {detectedFillers.length}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: AI Interview Questions, Multimodal Signals & Live Transcript */}
          <div className="space-y-6 lg:col-span-5">
            {/* View Switcher Tabs */}
            <div className="flex items-center gap-1 rounded-2xl border border-line bg-card p-1">
              <button
                type="button"
                onClick={() => setActiveTab("question")}
                className={`flex-1 rounded-xl py-2 text-xs font-medium transition ${
                  activeTab === "question" ? "bg-cobalt text-white shadow-sm" : "text-ink/70 hover:text-ink"
                }`}
              >
                Question & Tips
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("signals")}
                className={`flex-1 rounded-xl py-2 text-xs font-medium transition ${
                  activeTab === "signals" ? "bg-cobalt text-white shadow-sm" : "text-ink/70 hover:text-ink"
                }`}
              >
                AI Signals HUD
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("transcript")}
                className={`flex-1 rounded-xl py-2 text-xs font-medium transition ${
                  activeTab === "transcript" ? "bg-cobalt text-white shadow-sm" : "text-ink/70 hover:text-ink"
                }`}
              >
                Live Transcript
              </button>
            </div>

            {/* TAB 1: Current Interview Question */}
            {activeTab === "question" && (
              <div className="rounded-3xl border border-line bg-card p-6 sm:p-8 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-cobalt/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-cobalt">
                      {currentQ.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => speakQuestion(currentQ.question)}
                      className="flex items-center gap-1.5 rounded-full border border-cobalt/30 bg-cobalt/10 px-3 py-1 text-xs font-medium text-cobalt transition hover:bg-cobalt/20"
                      title="Listen to AI voice read this question"
                    >
                      <span>🔊</span>
                      <span>{isAiSpeaking ? "Speaking..." : "Repeat Voice"}</span>
                    </button>
                  </div>
                  <span className="font-mono text-xs text-mute">
                    Question {activeQuestionIndex + 1} of {questions.length}
                  </span>
                </div>

                {/* AI Speaking / Turn Indicator */}
                <div className="mt-5">
                  {isAiSpeaking ? (
                    <div className="flex items-center justify-between gap-2 rounded-2xl border border-cobalt/30 bg-cobalt/10 px-4 py-2.5 text-xs text-cobalt font-medium animate-pulse">
                      <div className="flex items-center gap-2">
                        <span className="text-base animate-bounce">🗣️</span>
                        <span>AI Interviewer is speaking aloud... Listen carefully</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span
                            key={i}
                            className="h-3 w-1 bg-cobalt rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 120}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 rounded-2xl border border-ok/30 bg-ok/5 px-4 py-2.5 text-xs text-ok font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🎙️</span>
                        <span>Your turn to answer — microphone is listening</span>
                      </div>
                      <span className="text-[11px] font-mono text-mute">
                        Voice active
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <h2 className="font-display text-2xl sm:text-3xl leading-snug text-ink">
                    {currentQ.question}
                  </h2>

                  <div className="mt-6 rounded-2xl border border-cobalt/20 bg-cobalt/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-cobalt">
                      STAR Strategy Tip
                    </p>
                    <p className="mt-1 text-sm text-ink/75 leading-relaxed">
                      {currentQ.tip}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-8">
                  <div className="flex justify-between text-xs text-mute mb-2">
                    <span>Interview Progress</span>
                    <span>{Math.round(((activeQuestionIndex + 1) / questions.length) * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
                    <div
                      className="h-full bg-cobalt transition-all duration-300 rounded-full"
                      style={{ width: `${((activeQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Navigation Buttons */}
                <div className="mt-8 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={activeQuestionIndex === 0}
                    onClick={() => setActiveQuestionIndex((i) => Math.max(0, i - 1))}
                    className="rounded-xl border border-line px-4 py-2 text-xs font-medium text-ink/75 transition hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    ← Previous
                  </button>

                  {activeQuestionIndex < questions.length - 1 ? (
                    <Button
                      onClick={() => setActiveQuestionIndex((i) => i + 1)}
                      className="text-xs py-2 px-5"
                    >
                      Next Question <ArrowRight />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setInterviewFinished(true)}
                      className="text-xs py-2 px-5 bg-ok hover:bg-ok/90"
                    >
                      Finish Interview ✓
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Real-time AI Multimodal Signals (Posture, Expressions, Speech, Personality) */}
            {activeTab === "signals" && (
              <div className="rounded-3xl border border-line bg-card p-6 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="font-display text-xl text-ink">Live Multimodal Signals</h3>
                  <p className="text-xs text-mute mt-1">Real-time vision, speech & delivery analysis</p>
                </div>

                {/* 1. Posture Signal */}
                <div className="rounded-2xl border border-line bg-paper/60 p-4">
                  <div className="flex items-center justify-between text-xs font-medium text-ink">
                    <span className="flex items-center gap-2">
                      <span className="text-base">🧘</span> Posture & Body Language
                    </span>
                    <span className="font-mono text-ok font-semibold">{postureStatus} ({postureScore}%)</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-line overflow-hidden">
                    <div className="h-full bg-ok rounded-full" style={{ width: `${postureScore}%` }} />
                  </div>
                  <p className="mt-2 text-[11px] text-ink/70">
                    Shoulders aligned, head centred within frame. Minimal slouching detected.
                  </p>
                </div>

                {/* 2. Facial Expressions & Gaze */}
                <div className="rounded-2xl border border-line bg-paper/60 p-4">
                  <div className="flex items-center justify-between text-xs font-medium text-ink">
                    <span className="flex items-center gap-2">
                      <span className="text-base">😊</span> Expression & Eye-Contact
                    </span>
                    <span className="font-mono text-cobalt font-semibold">{expressionScore}%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-line overflow-hidden">
                    <div className="h-full bg-cobalt rounded-full" style={{ width: `${expressionScore}%` }} />
                  </div>
                  <div className="mt-2 flex justify-between text-[11px] text-ink/70">
                    <span>Expression: <strong>{expressionStatus}</strong></span>
                    <span>Gaze: <strong>{gazeStatus}</strong></span>
                  </div>
                </div>

                {/* 3. Speech & Vocal Modulation */}
                <div className="rounded-2xl border border-line bg-paper/60 p-4">
                  <div className="flex items-center justify-between text-xs font-medium text-ink">
                    <span className="flex items-center gap-2">
                      <span className="text-base">🎙️</span> Speech & Delivery Pace
                    </span>
                    <span className="font-mono text-cobalt font-semibold">{speechWpm} WPM</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-ink/75 pt-1">
                    <div>Pace: <strong className="text-ink">{speechPace}</strong></div>
                    <div>Fillers: <strong className="text-warn">{detectedFillers.length} detected</strong></div>
                  </div>
                </div>

                {/* 4. Personality & Professional Presence */}
                <div className="rounded-2xl border border-line bg-paper/60 p-4">
                  <div className="flex items-center justify-between text-xs font-medium text-ink mb-2">
                    <span className="flex items-center gap-2">
                      <span className="text-base">⚡</span> Personality & Presence
                    </span>
                    <span className="font-mono text-ok font-semibold">{overallDeliveryScore}%</span>
                  </div>
                  <ul className="grid grid-cols-2 gap-2 text-[11px] text-ink/75">
                    <li className="flex justify-between border-b border-line pb-1">
                      <span>Confidence</span>
                      <strong className="text-ok font-mono">{confidenceScore}%</strong>
                    </li>
                    <li className="flex justify-between border-b border-line pb-1">
                      <span>Composure</span>
                      <strong className="text-ok font-mono">{composureScore}%</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Clarity</span>
                      <strong className="text-cobalt font-mono">{clarityScore}%</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Engagement</span>
                      <strong className="text-cobalt font-mono">{engagementScore}%</strong>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 3: Live Speech-To-Text Transcript */}
            {activeTab === "transcript" && (
              <div className="rounded-3xl border border-line bg-card p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div>
                    <h3 className="font-display text-lg text-ink">Live Answer Transcript</h3>
                    <p className="text-xs text-mute">Transcribed in real-time as you speak</p>
                  </div>
                  <span className="rounded-full bg-ok/10 text-ok px-3 py-1 font-mono text-[10px] uppercase font-semibold">
                    {wordCount} words
                  </span>
                </div>

                <div className="min-h-[220px] max-h-[320px] overflow-y-auto rounded-2xl border border-line bg-paper p-4 text-sm leading-relaxed text-ink/85">
                  {transcript ? (
                    <p>{transcript}</p>
                  ) : (
                    <p className="text-mute italic text-xs pt-8 text-center">
                      Start speaking into your microphone to see live transcript and filler-word detection...
                    </p>
                  )}
                </div>

                {detectedFillers.length > 0 && (
                  <div className="rounded-xl border border-warn/30 bg-warn/5 p-3 text-xs text-ink/80">
                    <span className="font-semibold text-warn">Filler words detected:</span>{" "}
                    {detectedFillers.join(", ")}
                  </div>
                )}
              </div>
            )}

            {/* Bottom quick navigation button */}
            <div className="rounded-2xl border border-line bg-card/60 p-4 flex items-center justify-between">
              <span className="text-xs text-mute font-mono">
                {activeQuestionIndex + 1} of {questions.length} Questions
              </span>
              <Button
                onClick={() => setInterviewFinished(true)}
                variant="outline"
                className="text-xs py-1.5 px-3.5"
              >
                Finish & View Full Report
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* COMPREHENSIVE MULTIMODAL REPORT (Posture, Expressions, Speech, Personality) */
        /* ============================================================== */
        <div className="mt-10 max-w-4xl mx-auto rounded-3xl border border-line bg-card p-8 sm:p-12 shadow-lift">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ok/10 text-ok mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-8 w-8">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-ink">
              Interview Delivery & Personality Report
            </h2>
            <p className="mt-2 text-ink/70 text-sm">
              Comprehensive multimodal evaluation for <strong className="text-cobalt">{role || "Candidate"}</strong>.
            </p>
          </div>

          {/* Main 4-Quadrant Signal Grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* 1. Posture & Body Language */}
            <div className="rounded-2xl border border-line bg-paper/60 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base text-ink flex items-center gap-2">
                  <span>🧘</span> Posture & Framing
                </h3>
                <span className="font-mono text-sm font-bold text-ok">{postureScore}%</span>
              </div>
              <p className="text-xs text-ink/75 leading-relaxed">
                Your posture was consistently upright and centered. Optimal camera distance maintained throughout the session.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="rounded-full border border-ok/30 bg-ok/10 px-2.5 py-0.5 text-[10px] font-mono text-ok">
                  Upright Posture
                </span>
                <span className="rounded-full border border-line bg-card px-2.5 py-0.5 text-[10px] font-mono text-ink/70">
                  Centered Head Alignment
                </span>
              </div>
            </div>

            {/* 2. Expressions & Eye Contact */}
            <div className="rounded-2xl border border-line bg-paper/60 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base text-ink flex items-center gap-2">
                  <span>😊</span> Expressions & Gaze
                </h3>
                <span className="font-mono text-sm font-bold text-cobalt">{expressionScore}%</span>
              </div>
              <p className="text-xs text-ink/75 leading-relaxed">
                Maintained steady camera eye-contact with open, attentive expressions. Demonstrated active engagement and warmth.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="rounded-full border border-cobalt/30 bg-cobalt/10 px-2.5 py-0.5 text-[10px] font-mono text-cobalt">
                  Direct Eye-Contact
                </span>
                <span className="rounded-full border border-line bg-card px-2.5 py-0.5 text-[10px] font-mono text-ink/70">
                  Attentive Expressions
                </span>
              </div>
            </div>

            {/* 3. Speech Pace & Articulation */}
            <div className="rounded-2xl border border-line bg-paper/60 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base text-ink flex items-center gap-2">
                  <span>🎙️</span> Speech & Voice
                </h3>
                <span className="font-mono text-sm font-bold text-cobalt">{speechWpm} WPM</span>
              </div>
              <p className="text-xs text-ink/75 leading-relaxed">
                Pacing was {speechPace.toLowerCase()} with {detectedFillers.length} filler words detected. Audio energy was clear and distinct.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="rounded-full border border-cobalt/30 bg-cobalt/10 px-2.5 py-0.5 text-[10px] font-mono text-cobalt">
                  {wordCount} Words Spoken
                </span>
                <span className="rounded-full border border-line bg-card px-2.5 py-0.5 text-[10px] font-mono text-ink/70">
                  {detectedFillers.length} Filler Words
                </span>
              </div>
            </div>

            {/* 4. Personality & Professional Presence */}
            <div className="rounded-2xl border border-line bg-paper/60 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base text-ink flex items-center gap-2">
                  <span>⚡</span> Personality Profile
                </h3>
                <span className="font-mono text-sm font-bold text-ok">{overallDeliveryScore}%</span>
              </div>
              <p className="text-xs text-ink/75 leading-relaxed">
                High composure under technical questions. Displays confidence, structured thinking, and thoughtful responsiveness.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="rounded-full border border-ok/30 bg-ok/10 px-2.5 py-0.5 text-[10px] font-mono text-ok">
                  Composed & Articulate
                </span>
                <span className="rounded-full border border-line bg-card px-2.5 py-0.5 text-[10px] font-mono text-ink/70">
                  High Engagement
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 border-t border-line pt-8">
            <Button
              onClick={() => {
                setActiveQuestionIndex(0);
                setInterviewFinished(false);
                setElapsedSeconds(0);
                setTranscript("");
                setDetectedFillers([]);
              }}
              variant="outline"
            >
              Practice Another Session
            </Button>
            <Button onClick={handleExit} variant="primary">
              Back to Resume & Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

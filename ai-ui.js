/**
 * LUMINA - Next-Generation AI Assistant Interactive Engine (Obsidian Dark Edition)
 * Powers screen transitions, simulated streaming AI responses, 
 * multimodal voice, memory graph exploration, and design system inspection.
 */

// Application State
const LuminaState = {
  activeScreen: 'dashboard', // dashboard, chat, history, results, settings, studio
  activeTheme: 'hyperpop', // hyperpop, cybermint, candy
  isListening: false,
  isGenerating: false,
  voiceVolume: 0.8,
  autonomyLevel: 85,
  creativityLevel: 70,
  activeModel: 'Gemini 3.8 Ultra (Adaptive Reasoning)',
  memorySearchQuery: '',
  chatMessages: [
    {
      id: 'm1',
      sender: 'ai',
      time: '10:42 AM',
      avatar: 'sparkles',
      text: "Hello Alex! ✨ I've analyzed your workflow telemetry. Your Q3 growth deck is ready for review, and I've prepared predictive analysis on our mobile onboarding funnel. What shall we tackle together?",
      chips: ["📊 Onboarding Drop-offs", "🔑 Passkey Login Prototype", "💻 Export Code Component"]
    }
  ]
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initLucideIcons();
  setupNavigation();
  setupChat();
  setupMemoryGraph();
  setupAudioSimulator();
  setupSettingsControls();
  setupStudioCanvas();
  setupDesignSystemModal();
  setupMockupModal();
  setupThemeSwitcher();
});

function initLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Screen Switcher
function switchScreen(screenId) {
  LuminaState.activeScreen = screenId;

  // Update nav buttons
  document.querySelectorAll('[data-screen-target]').forEach(btn => {
    const target = btn.getAttribute('data-screen-target');
    if (target === screenId) {
      btn.classList.add('bg-gradient-to-r', 'from-violet-600', 'to-fuchsia-600', 'text-white', 'shadow-lg', 'shadow-violet-600/40', 'scale-[1.03]');
      btn.classList.remove('text-slate-300', 'hover:text-white', 'hover:bg-white/10', 'bg-transparent');
    } else {
      btn.classList.remove('bg-gradient-to-r', 'from-violet-600', 'to-fuchsia-600', 'text-white', 'shadow-lg', 'shadow-violet-600/40', 'scale-[1.03]');
      btn.classList.add('text-slate-300', 'hover:text-white', 'hover:bg-white/10');
    }
  });

  // Show target screen container with smooth entry
  document.querySelectorAll('.app-screen-container').forEach(screen => {
    if (screen.id === `screen-${screenId}`) {
      screen.classList.remove('hidden');
      screen.classList.add('animate-in', 'fade-in-50', 'zoom-in-95', 'duration-300');
    } else {
      screen.classList.add('hidden');
    }
  });

  // Re-render icons for newly visible screen
  setTimeout(initLucideIcons, 50);

  // Scroll to top of workspace
  const mainContent = document.getElementById('main-workspace');
  if (mainContent) {
    mainContent.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function setupNavigation() {
  document.querySelectorAll('[data-screen-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-screen-target');
      switchScreen(target);
    });
  });
}

// Chat System Simulation
function setupChat() {
  const chatInput = document.getElementById('chat-user-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const chatStream = document.getElementById('chat-message-stream');

  if (!chatInput || !sendBtn) return;

  function handleSend() {
    const val = chatInput.value.trim();
    if (!val) return;

    // Append User Message
    appendUserMessage(val);
    chatInput.value = '';

    // Show simulated AI thinking
    showAIThinkingIndicator();

    setTimeout(() => {
      removeAIThinkingIndicator();
      generateSmartAIResponse(val);
    }, 1200);
  }

  sendBtn.addEventListener('click', handleSend);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // Quick prompt pills
  document.querySelectorAll('.quick-prompt-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const promptText = pill.getAttribute('data-prompt') || pill.textContent.trim();
      switchScreen('chat');
      const input = document.getElementById('chat-user-input');
      if (input) {
        input.value = promptText;
        input.focus();
      }
    });
  });
}

function appendUserMessage(text) {
  const chatStream = document.getElementById('chat-message-stream');
  if (!chatStream) return;

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const msgHtml = `
    <div class="flex items-end justify-end gap-3 max-w-2xl ml-auto animate-in slide-in-from-bottom-2 duration-300">
      <div class="space-y-1.5 text-right">
        <div class="flex items-center justify-end gap-2 text-[11px] text-slate-400 font-medium">
          <span>You</span>
          <span>•</span>
          <span>${now}</span>
        </div>
        <div class="p-4 rounded-3xl rounded-br-none bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30 text-sm leading-relaxed text-left font-medium">
          ${escapeHtml(text)}
        </div>
      </div>
      <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-amber-400 p-0.5 shrink-0 shadow-md">
        <div class="w-full h-full rounded-[14px] bg-[#0c0d16] flex items-center justify-center text-white text-xs font-bold">
          AX
        </div>
      </div>
    </div>
  `;

  chatStream.insertAdjacentHTML('beforeend', msgHtml);
  scrollToBottom(chatStream);
  initLucideIcons();
}

function showAIThinkingIndicator() {
  const chatStream = document.getElementById('chat-message-stream');
  if (!chatStream) return;

  const indicatorHtml = `
    <div id="ai-typing-indicator" class="flex items-start gap-3 max-w-xl animate-in fade-in duration-200">
      <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-500 p-0.5 shrink-0 shadow-md animate-pulse">
        <div class="w-full h-full rounded-[14px] bg-[#0c0d16] flex items-center justify-center text-violet-400">
          <i data-lucide="sparkles" class="w-4 h-4"></i>
        </div>
      </div>
      <div class="p-4 rounded-3xl rounded-tl-none bg-[#141624]/95 backdrop-blur-md border border-white/10 shadow-lg flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-violet-400 animate-bounce"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-fuchsia-400 animate-bounce" style="animation-delay: 0.15s"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-bounce" style="animation-delay: 0.3s"></span>
        <span class="text-xs font-semibold text-slate-300 ml-2">Lumina is synthesizing...</span>
      </div>
    </div>
  `;

  chatStream.insertAdjacentHTML('beforeend', indicatorHtml);
  scrollToBottom(chatStream);
  initLucideIcons();
}

function removeAIThinkingIndicator() {
  const el = document.getElementById('ai-typing-indicator');
  if (el) el.remove();
}

function generateSmartAIResponse(userPrompt) {
  const chatStream = document.getElementById('chat-message-stream');
  if (!chatStream) return;

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const responses = [
    {
      text: "I've structured a multi-step solution for your request. The neural model has synthesized 3 actionable alternatives and cross-referenced with your project memory graph.",
      badge: "Deep Reasoning 3.8",
      chips: ["Execute Alternative A", "Refine Parameters", "Send to Results Studio"]
    },
    {
      text: "Here is the exact data breakdown and dynamic solution. I've also prepared an interactive component in the Results Studio where you can adjust variables in real-time.",
      badge: "Multimodal Synthesis",
      chips: ["Open in Results Studio", "Generate Code Export", "Save to Memory"]
    }
  ];

  const res = responses[Math.floor(Math.random() * responses.length)];

  const msgHtml = `
    <div class="flex items-start gap-3 max-w-2xl animate-in slide-in-from-bottom-2 duration-300">
      <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-500 p-0.5 shrink-0 shadow-md">
        <div class="w-full h-full rounded-[14px] bg-[#0c0d16] flex items-center justify-center text-violet-400">
          <i data-lucide="sparkles" class="w-4 h-4"></i>
        </div>
      </div>
      <div class="space-y-2.5 w-full">
        <div class="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <span class="font-bold text-violet-400">Lumina Core</span>
          <span class="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[10px] font-semibold">${res.badge}</span>
          <span>•</span>
          <span>${now}</span>
        </div>
        <div class="p-5 rounded-3xl rounded-tl-none bg-[#141624]/95 backdrop-blur-xl border border-white/10 shadow-lg text-sm text-slate-200 leading-relaxed font-normal">
          ${res.text}
          <div class="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-2">
            ${res.chips.map(chip => `
              <button class="px-3 py-1.5 rounded-full bg-white/5 hover:bg-violet-600 hover:text-white text-slate-300 text-xs font-semibold transition-all border border-white/5">
                ${chip}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  chatStream.insertAdjacentHTML('beforeend', msgHtml);
  scrollToBottom(chatStream);
  initLucideIcons();
}

function scrollToBottom(container) {
  if (container) {
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[m]);
}

// Memory Graph Interactive Filtering
function setupMemoryGraph() {
  const searchInput = document.getElementById('memory-search-input');
  const memoryCards = document.querySelectorAll('.memory-item-card');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      memoryCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (!q || text.includes(q)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  }

  // Memory tags
  document.querySelectorAll('.memory-filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.memory-filter-pill').forEach(p => p.classList.remove('bg-violet-600', 'text-white'));
      pill.classList.add('bg-violet-600', 'text-white');
      const tag = pill.getAttribute('data-tag');

      memoryCards.forEach(card => {
        const cardTag = card.getAttribute('data-tag');
        if (tag === 'all' || cardTag === tag) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// Audio Synthesis Waveform Simulator
function setupAudioSimulator() {
  const voiceToggleBtn = document.getElementById('voice-mode-toggle');
  if (!voiceToggleBtn) return;

  voiceToggleBtn.addEventListener('click', () => {
    LuminaState.isListening = !LuminaState.isListening;
    if (LuminaState.isListening) {
      voiceToggleBtn.classList.add('bg-rose-500', 'text-white', 'animate-pulse');
      voiceToggleBtn.classList.remove('bg-violet-500/20', 'text-violet-300');
      document.getElementById('voice-btn-label').textContent = 'Listening...';
      startWaveformSimulation();
    } else {
      voiceToggleBtn.classList.remove('bg-rose-500', 'text-white', 'animate-pulse');
      voiceToggleBtn.classList.add('bg-violet-500/20', 'text-violet-300');
      document.getElementById('voice-btn-label').textContent = 'Voice Ambient';
      stopWaveformSimulation();
    }
  });
}

let waveInterval;
function startWaveformSimulation() {
  waveInterval = setInterval(() => {
    document.querySelectorAll('.wave-bar').forEach(bar => {
      const randomH = Math.floor(Math.random() * 32) + 8;
      bar.style.height = `${randomH}px`;
    });
  }, 120);
}

function stopWaveformSimulation() {
  clearInterval(waveInterval);
}

// Settings & Persona Controls
function setupSettingsControls() {
  const autonomySlider = document.getElementById('setting-autonomy-slider');
  const autonomyVal = document.getElementById('setting-autonomy-val');
  if (autonomySlider && autonomyVal) {
    autonomySlider.addEventListener('input', (e) => {
      autonomyVal.textContent = `${e.target.value}%`;
    });
  }

  // Model selectors
  document.querySelectorAll('.model-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.model-select-btn').forEach(b => {
        b.classList.remove('border-violet-500', 'bg-violet-950/40', 'ring-2', 'ring-violet-500/40');
        b.classList.add('border-white/10', 'bg-white/5');
      });
      btn.classList.add('border-violet-500', 'bg-violet-950/40', 'ring-2', 'ring-violet-500/40');
      btn.classList.remove('border-white/10', 'bg-white/5');
    });
  });
}

// Creative Studio Canvas Interactive Nodes
function setupStudioCanvas() {
  const agentNodes = document.querySelectorAll('.agent-workflow-node');
  agentNodes.forEach(node => {
    node.addEventListener('click', () => {
      agentNodes.forEach(n => n.classList.remove('ring-4', 'ring-violet-400/50'));
      node.classList.add('ring-4', 'ring-violet-400/50');
    });
  });

  const runPipelineBtn = document.getElementById('run-agent-pipeline-btn');
  if (runPipelineBtn) {
    runPipelineBtn.addEventListener('click', () => {
      runPipelineBtn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Synthesizing Swarm...`;
      initLucideIcons();
      setTimeout(() => {
        runPipelineBtn.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-emerald-300"></i> Swarm Completed!`;
        initLucideIcons();
        setTimeout(() => {
          runPipelineBtn.innerHTML = `<i data-lucide="play" class="w-4 h-4"></i> Run Agent Swarm`;
          initLucideIcons();
        }, 2500);
      }, 2000);
    });
  }
}

// Theme Switcher
function setupThemeSwitcher() {
  document.querySelectorAll('[data-theme-choice]').forEach(choice => {
    choice.addEventListener('click', () => {
      const theme = choice.getAttribute('data-theme-choice');
      applyTheme(theme);
    });
  });
}

function applyTheme(theme) {
  const root = document.getElementById('lumina-app-root');
  if (!root) return;

  if (theme === 'cybermint') {
    root.style.setProperty('--color-violet-glow', '#06b6d4');
    root.style.setProperty('--color-fuchsia-glow', '#10b981');
  } else if (theme === 'candy') {
    root.style.setProperty('--color-violet-glow', '#f43f5e');
    root.style.setProperty('--color-fuchsia-glow', '#fb7185');
  } else {
    root.style.setProperty('--color-violet-glow', '#8b5cf6');
    root.style.setProperty('--color-fuchsia-glow', '#ec4899');
  }
}

// Design System Inspector Drawer
function setupDesignSystemModal() {
  const openBtn = document.getElementById('open-design-system-btn');
  const closeBtn = document.getElementById('close-design-system-btn');
  const modal = document.getElementById('design-system-modal');

  if (!modal) return;

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });
  }

  // Copy hex codes on click
  document.querySelectorAll('.copy-color-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const hex = pill.getAttribute('data-hex');
      navigator.clipboard.writeText(hex).then(() => {
        const originalText = pill.innerText;
        pill.innerText = "COPIED!";
        setTimeout(() => {
          pill.innerText = originalText;
        }, 1200);
      });
    });
  });
}

// Concept Mockup Modal
function setupMockupModal() {
  const openBtn = document.getElementById('open-mockup-modal-btn');
  const closeBtn = document.getElementById('close-mockup-modal-btn');
  const viewInteractiveBtn = document.getElementById('view-interactive-screens-btn');
  const modal = document.getElementById('mockup-modal');

  if (!modal) return;

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });
  }

  if (viewInteractiveBtn) {
    viewInteractiveBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      switchScreen('dashboard');
    });
  }
}

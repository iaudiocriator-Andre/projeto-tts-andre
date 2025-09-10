// Arquivo: js/scripts.js
// ATENCAO: substitua API_URL pelo URL público do ngrok ou pelo endpoint de produção.
const API_URL = 'https://ae58da7f9d49.ngrok-free.app'; // ex: https://abcd-12-34-56.ngrok-free.app

const voices = [
    { id: 'default', name: 'Padrão (MMS)', description: 'Voz padrão do modelo MMS-TTS.' },
    { id: 'v_feminina_br', name: 'Marina', description: 'Voz feminina natural e expressiva.' },
    { id: 'v_masculina_br', name: 'Gustavo', description: 'Voz masculina profissional e forte.' }
];

const voiceOptionsContainer = document.getElementById('voice-options-container');
const ttsAudioPlayer = document.getElementById('tts-audio-player');
const generateTtsBtn = document.getElementById('generate-tts-btn');
const textInput = document.getElementById('text-input');
const globalStatusMessage = document.getElementById('global-status-message');
const copyApiBtn = document.getElementById('copy-api-url-btn');

let selectedVoiceId = 'default';

function renderVoices() {
    voiceOptionsContainer.innerHTML = '';
    voices.forEach(voice => {
        const div = document.createElement('div');
        div.className = 'voice-option';
        div.setAttribute('data-voice-id', voice.id);
        div.innerHTML = `
            <strong>${voice.name}</strong>
            <div class="desc">${voice.description}</div>
        `;
        div.addEventListener('click', () => {
            document.querySelectorAll('.voice-option').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            selectedVoiceId = voice.id;
        });
        voiceOptionsContainer.appendChild(div);

        // select first by default
        if (voice.id === selectedVoiceId) div.classList.add('selected');
    });
}

async function generateTTS() {
    if (!API_URL || API_URL === 'REPLACE_WITH_YOUR_API_URL') {
        globalStatusMessage.textContent = '⚠️ API_URL não está configurado. Edite js/scripts.js e cole o link do ngrok.';
        return;
    }
    const text = textInput.value.trim();
    if (!text) {
        globalStatusMessage.textContent = 'Por favor, digite algum texto.';
        return;
    }

    generateTtsBtn.disabled = true;
    globalStatusMessage.textContent = 'Gerando áudio...';

    try {
        let api = API_URL;
        if (!api.endsWith('/')) api += '/';
        const resp = await fetch(api + 'generate_audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text, voice_id: selectedVoiceId })
        });

        console.log('Status:', resp.status, resp.statusText, resp.headers.get('content-type'));
        if (!resp.ok) {
            const txt = await resp.text();
            throw new Error(`Servidor respondeu ${resp.status}: ${txt}`);
        }

        const ct = resp.headers.get('content-type') || '';
        if (!ct.includes('audio')) {
            const txt = await resp.text();
            throw new Error('Resposta sem áudio: ' + txt);
        }

        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        ttsAudioPlayer.src = url;
        ttsAudioPlayer.style.display = 'block';
        await ttsAudioPlayer.play();
        globalStatusMessage.textContent = '✅ Áudio gerado com sucesso!';
    } catch (err) {
        console.error(err);
        globalStatusMessage.textContent = '❌ Erro: ' + err.message;
    } finally {
        generateTtsBtn.disabled = false;
    }
}

copyApiBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(API_URL).then(() => {
        alert('API_URL copiada para a área de transferência.');
    }).catch(() => {
        alert('Não foi possível copiar. Edite js/scripts.js manualmente.');
    });
});

generateTtsBtn.addEventListener('click', generateTTS);
document.addEventListener('DOMContentLoaded', renderVoices);

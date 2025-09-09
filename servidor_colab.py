# servidor_colab.py - Exemplo de servidor Flask robusto para Colab / VPS
import io, numpy as np, logging
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from scipy.io import wavfile
from transformers import pipeline

logging.basicConfig(level=logging.INFO)
app = Flask(__name__)
CORS(app)

MODEL_NAME = 'facebook/mms-tts-por'
synthesizer = pipeline('text-to-speech', model=MODEL_NAME)
app.logger.info('Modelo carregado.')

@app.route('/')
def home():
    return jsonify({'msg':'API de TTS online'})

@app.route('/generate_audio', methods=['POST','OPTIONS'])
def generate_audio():
    try:
        data = request.get_json(force=True)
        text = data.get('text'); voice_id = data.get('voice_id')
        if not text:
            return jsonify({'error':'Nenhum texto fornecido'}), 400
        app.logger.info(f'Gerando para: {text[:50]}... voice_id={voice_id}')
        speech = synthesizer(text)
        audio = None; sr = 24000
        if isinstance(speech, dict):
            audio = speech.get('audio') or speech.get('waveform') or speech.get('samples')
            sr = speech.get('sampling_rate') or sr
        else:
            audio = speech
        try:
            import torch
            if hasattr(audio, 'cpu'):
                audio = audio.cpu().detach().numpy()
        except Exception:
            pass
        audio = np.asarray(audio)
        if audio.ndim > 1:
            if audio.shape[0] == 1:
                audio = audio.squeeze(0)
            elif audio.shape[0] < audio.shape[1]:
                audio = audio.T
        if not np.issubdtype(audio.dtype, np.integer):
            maxv = float(np.max(np.abs(audio))) if audio.size else 1.0
            if maxv == 0: maxv = 1.0
            audio = audio / maxv
            audio_out = np.int16(np.clip(audio, -1.0, 1.0) * 32767)
        else:
            audio_out = audio.astype(np.int16)
        buf = io.BytesIO()
        wavfile.write(buf, int(sr), audio_out)
        buf.seek(0)
        return send_file(buf, mimetype='audio/wav', as_attachment=False, download_name='tts.wav')
    except Exception as e:
        app.logger.exception('Erro ao gerar áudio')
        return jsonify({'error':str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

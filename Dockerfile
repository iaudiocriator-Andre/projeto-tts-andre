# Dockerfile - Exemplo simples para rodar o servidor Flask de TTS
FROM python:3.11-slim
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir flask flask-cors transformers scipy soundfile torch
EXPOSE 5000
ENV MODEL_NAME=facebook/mms-tts-por
CMD ["python", "servidor_colab.py"]

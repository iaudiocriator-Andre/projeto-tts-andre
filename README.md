        # Andre TTS - Pacote Completo

        Conteúdo: frontend (HTML/CSS/JS), exemplos e scripts para rodar a API TTS (Flask + ngrok), além de Dockerfile e docker-compose.

        ## Como usar (rápido)

        1. **Backend no Colab (rápido, não-prod):**
           - Cole e execute o bloco `servidor_flask_colab.py` no Colab (ex.: arquivo contido neste pacote como referência).
           - Aguarde carregar o modelo. O Colab imprimirá algo como `🔗 API disponível em: https://...` (ngrok).
           - Copie esse URL e cole em `js/scripts.js` substituindo `REPLACE_WITH_YOUR_API_URL`.

        2. **Testar frontend:**
           - Abra `index.html` localmente (arraste no navegador) ou hospede os arquivos estáticos em qualquer servidor estático.
           - Clique em uma voz, escreva texto e pressione *Gerar Voz*.

        3. **Testes alternativos:**
           - `curl` (Windows PowerShell):
             ```powershell
             curl -X POST "https://SEU_LINK_NGROK/generate_audio" -H "Content-Type: application/json" -d "{"text":"Olá André","voice_id":"default"}" --output saida.wav
             ```
           - Python (requests):
             ```python
             import requests
             r = requests.post("https://SEU_LINK_NGROK/generate_audio", json={"text":"Olá","voice_id":"default"})
             open("saida.wav","wb").write(r.content)
             ```

        ## Docker (exemplo)
        - O `Dockerfile` deste pacote cria uma imagem rodando Flask com o endpoint `/generate_audio`. Veja `docker-compose.yml` para orquestrar.

        ## Segurança e produção
        - Não exponha ngrok com token público em produção. Proteja endpoints (API key ou autenticação).
        - Para produção use um servidor WSGI (gunicorn/uvicorn) e configure TLS (HTTPS) e CORS restrito.

        ## Arquivos incluídos
        - index.html
- js/scripts.js
- css/styles.css
- servidor_colab.py (exemplo de servidor)
- Dockerfile
- docker-compose.yml
- README.md

Se quiser, eu já gero o arquivo ZIP com os arquivos e um Dockerfile funcional — clique no link disponibilizado por mim após a geração para baixar.

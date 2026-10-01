# Firaw - VidBee — site local

O site está em `dist/` e funciona sem serviço externo. Na raiz do projeto, rode:

```powershell
python -m http.server 4175 --bind 127.0.0.1 --directory site/dist
```

Abra <http://localhost:4175/>. O botão **Abrir aplicativo web** depende da API e do aplicativo web, iniciados em outro terminal com `pnpm run start:web`. Os arquivos do instalador e da versão portátil ficam em `dist/downloads/` após a criação dos pacotes Windows.

O site é uma página de apresentação local, com a barra inferior compartilhada dos projetos Firawynix. Ela oferece acesso aos downloads, à [Microsoft Store](https://apps.microsoft.com/detail/9P7LKC7HF335), ao [GitHub Firawynix](https://github.com/firawynix/firaw-vidbee), ao portfólio e à página de apoio. A [política de privacidade](http://localhost:4175/privacidade.html) está no próprio site. O aplicativo web com downloads, histórico e configurações está em <http://localhost:3000/>.

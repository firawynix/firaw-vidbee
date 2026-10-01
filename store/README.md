# Firaw - VidBee na Microsoft Store

O aplicativo foi publicado na [Microsoft Store](https://apps.microsoft.com/detail/9P7LKC7HF335) em 1º de outubro de 2026. O produto tem Store ID `9P7LKC7HF335` e preço R$ 0. O pacote AppX/MSIX enviado está em `apps/desktop/dist/Firaw - VidBee 2.1.0.appx` (x64, 568 MB). Seu manifesto contém a identidade oficial `Name=Firawynix.Firaw-VidBee-Videodownload` e `Publisher=CN=1FDE3668-C222-4506-AFE6-E2E425EAECD8`, obtidas no Partner Center. A Microsoft assina os pacotes aceitos por esse caminho.

Neste Windows, use o kit oficial instalado ao gerar o AppX:

```powershell
$env:ELECTRON_BUILDER_WINDOWS_KITS_PATH = 'C:\Program Files (x86)\Windows Kits\10\bin\10.0.26100.0\x64'
pnpm --filter ./apps/desktop exec electron-builder --win appx --publish never
```

O instalador EXE serve para distribuição local. Para enviá-lo pelo caminho MSI/EXE da Store, a Microsoft exige assinatura digital confiável e URL HTTPS versionada; o instalador local atual não atende a esses requisitos.

As propriedades, a classificação IARC, as listagens em português e inglês e a captura real `screenshot-desktop.png` foram preenchidas. O site do produto permanece local conforme solicitado. O [Partner Center](https://partner.microsoft.com/pt-br/dashboard/products/9P7LKC7HF335/overview) mostra o produto disponível na Store.

Referências: [reserva do nome](https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/msix/reserve-your-apps-name), [submissão de AppX/MSIX](https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/msix/create-app-submission), [requisitos de EXE/MSI](https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/msi/app-package-requirements).

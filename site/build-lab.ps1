$ErrorActionPreference = 'Stop'
$siteRoot = $PSScriptRoot
$source = Join-Path $siteRoot 'dist'
$target = Join-Path $siteRoot 'lab-dist'
$expected = [System.IO.Path]::GetFullPath((Join-Path $siteRoot 'lab-dist'))
$actual = [System.IO.Path]::GetFullPath($target)
if ($actual -ne $expected -or -not $actual.StartsWith([System.IO.Path]::GetFullPath($siteRoot) + [System.IO.Path]::DirectorySeparatorChar)) {
  throw 'Destino fora da pasta site.'
}
if (Test-Path -LiteralPath $target) {
  Remove-Item -LiteralPath $target -Recurse -Force
}
New-Item -ItemType Directory -Path $target | Out-Null
Copy-Item -LiteralPath (Join-Path $source 'assets') -Destination $target -Recurse
foreach ($file in @('index.html', 'privacidade.html', 'styles.css', 'project-footer.css')) {
  Copy-Item -LiteralPath (Join-Path $source $file) -Destination $target
}

$indexPath = Join-Path $target 'index.html'
$index = Get-Content -LiteralPath $indexPath -Raw
$replacements = @(
  @('<a class="button button-outline" href="http://localhost:3000/">Abrir aplicativo web</a>', '<a class="button button-outline" href="https://github.com/firawynix/firaw-vidbee" target="_blank" rel="noopener noreferrer">Ver aplicativo web no GitHub</a>'),
  @('<a href="./downloads/firaw-vidbee-2.1.0-setup.exe" download>Baixar instalador Windows</a><a href="./downloads/firaw-vidbee-2.1.0-windows-portable.zip" download>Baixar versão portátil</a>', ''),
  @('<a href="http://localhost:3000/">Abrir em localhost:3000</a>', '<a href="https://github.com/firawynix/firaw-vidbee#instalar-e-usar" target="_blank" rel="noopener noreferrer">Como executar no seu computador</a>'),
  @('<a href="./downloads/firaw-vidbee-2.1.0-setup.exe" download>Instalador · Windows x64</a>', '<a href="https://apps.microsoft.com/detail/9P7LKC7HF335" target="_blank" rel="noopener noreferrer">Instalar pelo Microsoft Store · Windows</a>'),
  @('<a href="./downloads/firaw-vidbee-2.1.0-windows-portable.zip" download>Versão portátil · Windows x64</a>', '<a href="https://github.com/firawynix/firaw-vidbee#instalar-e-usar" target="_blank" rel="noopener noreferrer">Código-fonte e instruções</a>'),
  @('Você também pode usar o instalador ou a versão portátil gerados localmente.', 'O código-fonte inclui instruções para executar e gerar pacotes no seu computador.'),
  @('Abra o aplicativo no navegador enquanto o serviço local estiver ativo.', 'O aplicativo web pode ser executado no seu computador. Consulte o repositório para iniciar o serviço local.'),
  @('no desktop e em uma instalação web local.', 'no desktop e em uma versão web que você pode executar localmente.')
)
foreach ($pair in $replacements) {
  if (-not $index.Contains($pair[0])) { throw "Trecho esperado ausente: $($pair[0])" }
  $index = $index.Replace($pair[0], $pair[1])
}
if ($index -match 'localhost|\.\/downloads\/') { throw 'Link local restante na página do lab.' }
Set-Content -LiteralPath $indexPath -Value $index -Encoding utf8

$privacyPath = Join-Path $target 'privacidade.html'
$privacy = Get-Content -LiteralPath $privacyPath -Raw
$privacy = $privacy.Replace('<a href="./downloads/firaw-vidbee-2.1.0-setup.exe" download>Instalador · Windows x64</a>', '<a href="https://apps.microsoft.com/detail/9P7LKC7HF335" target="_blank" rel="noopener noreferrer">Instalar pelo Microsoft Store · Windows</a>')
$privacy = $privacy.Replace('<a href="./downloads/firaw-vidbee-2.1.0-windows-portable.zip" download>Versão portátil · Windows x64</a>', '<a href="https://github.com/firawynix/firaw-vidbee#instalar-e-usar" target="_blank" rel="noopener noreferrer">Código-fonte e instruções</a>')
if ($privacy -match 'localhost|\.\/downloads\/') { throw 'Link local restante na privacidade do lab.' }
Set-Content -LiteralPath $privacyPath -Value $privacy -Encoding utf8

Write-Output "Site do lab pronto em $target"

# Portfólio NEXUS

Página estática de portfólio baseada na imagem, no `DESIGN.md` e no `code.html` fornecidos. A página pronta para publicação está em [`dist/index.html`](dist/index.html).

Os três destaques também aparecem na grade de projetos. A grade mostra seis projetos por página, com controles para avançar, voltar e escolher uma página.

## Personalização

O nome Alex, e-mail, Discord, números de experiência e desempenho, projetos e descrições vieram da referência e são **conteúdo de demonstração**. Substitua-os por informações verificadas antes de usar o portfólio como apresentação profissional real.

O formulário prepara uma mensagem no aplicativo de e-mail do visitante; ele não possui servidor de envio. Os botões de código e redes sociais levam à seção de contato até que os URLs reais sejam informados. O botão “CV (PDF)” abre a impressão do navegador para salvar como PDF.

As fontes, ícones, estilos Tailwind e imagens dos projetos usam endereços externos presentes no HTML de referência. Para uma versão totalmente independente de terceiros, esses recursos precisarão ser hospedados no projeto.

## Executar localmente

```powershell
python -m http.server 8765 --directory dist
```

Abra `http://localhost:8765` no navegador.

# Developer Certificate of Origin | Certificado de Origem do Desenvolvedor

## Developer Certificate of Origin
Version 1.1

Copyright (C) 2004, 2006 The Linux Foundation and its contributors.

Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.

**Developer's Certificate of Origin 1.1**

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.

---

## Certificado de Origem do Desenvolvedor
Versão 1.1

Copyright (C) 2004, 2006 The Linux Foundation e seus colaboradores.

É permitido a todos copiar e distribuir cópias literais deste
documento de licença, mas não é permitido alterá-lo.

**Certificado de Origem do Desenvolvedor 1.1**

Ao contribuir para este projeto, certifico que:

(a) A contribuição foi criada no todo ou em parte por mim e eu
    tem o direito de enviá-lo sob a licença de código aberto
    indicado no arquivo; ou

(b) A contribuição é baseada em trabalhos anteriores que, na melhor das hipóteses,
    do meu conhecimento, está coberto por um código aberto apropriado
    licença e tenho o direito sob essa licença de enviar isso
    trabalhar com modificações, sejam elas criadas no todo ou em parte
    por mim, sob a mesma licença de código aberto (a menos que eu esteja
    permitido enviar sob uma licença diferente), conforme indicado
    no arquivo; ou

(c) A contribuição foi-me fornecida diretamente por alguma outra pessoa
    pessoa que certificou (a), (b) ou (c) e eu não modifiquei
    isto.

(d) Compreendo e concordo que este projeto e a contribuição
    são públicas e que um registro da contribuição (incluindo todas
    as informações pessoais que eu envio com ele, incluindo minha assinatura) são
    mantido indefinidamente e pode ser redistribuído de acordo com
    este projeto ou a(s) licença(s) de código aberto envolvida(s).

---

## How to Sign Your Commits | Como Assinar Seus Commits

To comply with the DCO, you need to add a `Signed-off-by` line to your commit messages. This can be done automatically using the `-s` flag with `git commit`:

Para cumprir com o DCO, você precisa adicionar uma linha `Signed-off-by` às suas mensagens de commit. Isso pode ser feito automaticamente usando a flag `-s` com `git commit`:

```bash
git commit -s -m "Your commit message"
```

This will add a line like this to your commit message:

Isso adicionará uma linha como esta à sua mensagem de commit:

```
Signed-off-by: Your Name <your.email@example.com>
```

### Setting up DCO signing by default | Configurando assinatura DCO por padrão

You can configure Git to always sign your commits in this repository:

Você pode configurar o Git para sempre assinar seus commits neste repositório:

```bash
# Configure DCO signing for this repository
git config commit.template .gitmessage
git config commit.gpgsign false
```

Or globally for all repositories:

Ou globalmente para todos os repositórios:

```bash
# Configure DCO signing globally
git config --global alias.dco 'commit -s'
```

Then you can use:

Então você pode usar:

```bash
git dco -m "Your commit message"
```

### Amending commits without DCO | Corrigindo commits sem DCO

If you forgot to sign a commit, you can amend it:

Se você esqueceu de assinar um commit, você pode corrigi-lo:

```bash
git commit --amend -s --no-edit
```

For multiple commits, you can use interactive rebase:

Para múltiplos commits, você pode usar rebase interativo:

```bash
git rebase --exec 'git commit --amend --no-edit -s' HEAD~<number-of-commits>
```
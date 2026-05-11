import React from 'react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans p-6 md:py-16 md:px-8 overflow-y-auto selection:bg-emerald-500/30 notranslate" translate="no">
      <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-lg p-8 md:p-12 shadow-2xl">
        {/* Header */}
        <header className="mb-10 border-b border-zinc-800 pb-8">
          <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight mb-2">Termos de Serviço e Política de Privacidade</h1>
          <p className="text-sm text-zinc-500">Última atualização: Maio de 2026</p>
        </header>

        {/* Content */}
        <div className="space-y-8 text-sm leading-relaxed text-zinc-400">
          <section>
            <p className="mb-4">
              Bem-vindo(a). Este documento descreve as regras de uso da nossa plataforma e a forma como tratamos as suas informações pessoais. Ao acessar ou utilizar nossos serviços, você concorda em se vincular a estes Termos de Serviço e à nossa Política de Privacidade.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-zinc-100 mb-4">1. Coleta e Uso de Informações</h2>
            <div className="space-y-4">
              <p>
                Nós projetamos nossos serviços para coletar a menor quantidade possível de dados pessoais. O escopo das informações coletadas inclui:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-300">
                <li><strong className="text-zinc-200">Dados da Conta:</strong> Ao se registrar, você fornece um nome de exibição e credenciais de login. Estas informações são necessárias estritamente para a manutenção da sua conta e autenticação.</li>
                <li><strong className="text-zinc-200">Metadados de Uso:</strong> Coletamos automaticamente registros de conexão básicos (logs), frequência de uso e relatórios de erro para garantir a estabilidade e segurança da plataforma.</li>
                <li><strong className="text-zinc-200">Conteúdo de Comunicação:</strong> As mensagens, arquivos e mídias transitam pela nossa infraestrutura com o único objetivo de serem entregues aos destinatários. Nós empregamos tecnologias de criptografia ponta a ponta que impedem o acesso ao conteúdo dessas comunicações por nós ou por terceiros.</li>
              </ul>
              <p>
                Não comercializamos, alugamos ou monetizamos os seus dados de nenhuma forma. O uso se restringe estritamente à operação, manutenção e proteção do serviço oferecido.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium text-zinc-100 mb-4">2. Segurança e Proteção de Dados</h2>
            <p className="mb-4">
              Empregamos medidas técnicas e organizacionais rigorosas desenhadas para proteger os seus dados pessoais contra acesso, alteração, divulgação ou destruição não autorizados. Isso inclui o uso de criptografia robusta (RSA-4096) para conteúdos sensíveis.
            </p>
            <p>
              Contudo, a segurança plena na internet é um esforço conjunto. Você é responsável por manter a confidencialidade de suas senhas, chaves de acesso e dispositivos. Caso seu dispositivo ou chaves sejam comprometidos, a plataforma não terá meios técnicos de recuperar informações perdidas ou interceptadas em seu próprio ambiente local.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-zinc-100 mb-4">3. Conduta e Responsabilidades do Usuário</h2>
            <p className="mb-4">
              Ao utilizar a plataforma, você se compromete pessoalmente a agir de acordo com a legalidade e o respeito. É estritamente proibido:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-300">
              <li>Utilizar o serviço para assédio, ameaças, intimidação ou discursos de ódio.</li>
              <li>Distribuir ou promover material ilegal, spam ou esquemas fraudulentos.</li>
              <li>Realizar engenharia reversa maliciosa com o intuito de prejudicar ou interromper o funcionamento do sistema ou a experiência de terceiros.</li>
            </ul>
            <p className="mt-4">
              Violações destas diretrizes configuram quebra de contrato e resultarão na suspensão imediata ou no banimento permanente da sua conta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-zinc-100 mb-4">4. Direitos do Titular dos Dados</h2>
            <p className="mb-4">
              Você detém direitos fundamentais sobre as informações associadas ao seu perfil. A plataforma fornece as ferramentas necessárias para que você possa:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-300">
              <li>Acessar ou atualizar as informações do seu perfil a qualquer momento.</li>
              <li>Solicitar a deleção completa da sua conta. Ao confirmar esta ação, todos os seus dados identificáveis e credenciais criptográficas são removidos irreversivelmente dos nossos servidores centrais.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-zinc-100 mb-4">5. Modificações nestes Termos</h2>
            <p>
              Reservamo-nos o direito de atualizar este documento periodicamente para refletir mudanças em nossos serviços, melhorias de segurança ou obrigações legais. Alterações substanciais serão comunicadas ativamente aos usuários dentro da própria plataforma. A continuidade do uso após a atualização pressupõe a aceitação dos novos termos.
            </p>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-zinc-800 text-center">
          <p className="text-zinc-500 mb-6 text-sm">Se você discorda de alguma parte deste documento, solicitamos que não realize o registro na plataforma.</p>
          <button 
            onClick={() => window.close()}
            className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-medium rounded-md transition-colors"
          >
            Concordo e Fechar
          </button>
        </footer>
      </div>
    </div>
  );
};

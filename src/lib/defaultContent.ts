import type { SiteContent } from "@/types/content";

// Conteúdo padrão — dados reais extraídos do currículo do Vinícius.
// Serve como fallback: o site funciona 100% mesmo SEM Supabase configurado.
// Quando o admin salva algo, o valor persiste no banco e sobrescreve este padrão.

export const defaultContent: SiteContent = {
  meta: {
    title: "Vinícius Viti · Desenvolvedor Front-End",
    description:
      "Portfólio de Vinícius Viti · Desenvolvedor Front-End (React · Next.js · TypeScript · Angular). Bacharel em Ciência da Computação pela PUC Minas.",
    initials: "VV",
  },

  social: {
    github: "https://github.com/viniviti",
    linkedin: "https://www.linkedin.com/in/vinícius-freitas-viti-02a1ba236/",
    facebook: "https://www.facebook.com/vinicius.viti",
    email: "viti.2901@gmail.com",
    whatsapp: "https://wa.me/5535998178132",
    phoneLabel: "(35) 99817-8132",
  },

  hero: {
    availableBadge: "Disponível para vaga júnior front-end",
    name: "Vinícius Viti",
    leftWord: "designer",
    rightWord: "front-end",
    leftText:
      "Construo interfaces responsivas e componentes reutilizáveis, com olhar para usabilidade, consistência visual e detalhes que fazem a diferença.",
    rightText:
      "Desenvolvedor Front-End que escreve código limpo, elegante e eficiente em React, Next.js, TypeScript e Angular.",
    portraitUrl: "https://vcurriculoweb.vercel.app/image/fotoLinkedIn.png",
    resumeUrl: "https://vcurriculoweb.vercel.app/",
  },

  about: {
    heading: "Sobre",
    paragraphs: [
      "Bacharel em Ciência da Computação pela PUC Minas, com experiência prática em desenvolvimento front-end usando Angular, React, TypeScript e JavaScript.",
      "Atuei na construção de interfaces responsivas, componentização e integração com APIs REST em produtos digitais usados por clientes reais. Tenho familiaridade com Git, metodologias ágeis (Scrum/Kanban) e busco uma posição júnior em engenharia de software front-end para evoluir tecnicamente em um ambiente colaborativo.",
    ],
    education: {
      course: "Bacharelado em Ciência da Computação",
      place: "PUC Minas · Campus Poços de Caldas",
      period: "Concluído em 2026",
    },
    photoUrl: "https://blog-do-vinice.vercel.app/images/euVinice.png",
    location: "Poços de Caldas – MG, Brasil",
    availability:
      "Disponível para modelo híbrido em São Paulo, com flexibilidade para presencial ou remoto.",
  },

  experience: [
    // 🔮 PRÓXIMO CARGO — descomente e preencha quando entrar num novo lugar.
    // A lista é "mais novo primeiro"; a seção Trajetória inverte para exibir
    // em ordem cronológica (mais antigo → mais recente).
    // {
    //   role: "Novo Cargo",
    //   company: "Nova Empresa",
    //   period: "2026 → Atual",
    //   bullets: [
    //     "Principal responsabilidade ou entrega de destaque.",
    //     "Outra conquista relevante com impacto mensurável.",
    //   ],
    //   tags: ["Tech 1", "Tech 2", "Tech 3"],
    // },
    {
      role: "Desenvolvedor Front-End",
      company: "Neuronex",
      period: "Jun 2025 → Atual",
      bullets: [
        "Desenvolvimento de funcionalidades front-end com Next.js, React, TypeScript e Tailwind CSS.",
        "Criação de componentes reutilizáveis e interfaces responsivas, aplicando boas práticas de organização de código.",
        "Integração com APIs REST para consumo e envio de dados entre front-end e serviços de back-end.",
        "Colaboração com equipe multidisciplinar usando Git e metodologia ágil (Kanban).",
        "Correção de bugs e evolução contínua do produto, com foco em usabilidade e consistência da interface.",
      ],
      tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "REST API", "Git", "Kanban"],
    },
    {
      role: "Analista Operacional & Automações",
      company: "ID Logistics",
      period: "Ago 2024 → Jun 2025",
      bullets: [
        "Gestão de robôs autônomos (AMRs) e interação com sistemas internos e automações, na interface entre operação e tecnologia.",
        "Contato direto com APIs e tecnologias de automação, com produção de relatórios operacionais orientados a dados.",
        "Inclui período como Auxiliar Operacional (Abr 2024 → Jul 2024).",
      ],
      tags: ["AMRs", "APIs", "Automação", "Relatórios de dados"],
    },
    {
      role: "Desenvolvedor Front-End Júnior",
      company: "Kapibara Softwares",
      period: "Abr 2023 → Ago 2023",
      bullets: [
        "Desenvolvimento de funcionalidades front-end com Angular, TypeScript, HTML5, CSS3 e JavaScript.",
        "Criação de componentes reutilizáveis e consumo de APIs REST para integração com o back-end (MySQL).",
        "Implementação de testes unitários básicos com Jest para validar componentes e funções críticas.",
        "Trabalho em equipe ágil (Kanban) e versionamento de código via Git.",
      ],
      tags: ["Angular", "TypeScript", "JavaScript", "HTML5", "CSS3", "Jest", "MySQL", "Git"],
    },
  ],

  skills: [
    {
      label: "Front-End",
      items: ["Angular", "React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap"],
    },
    { label: "Banco de Dados", items: ["Node.js", "MySQL", "PostgreSQL", "Prisma"] },
    { label: "Ferramentas", items: ["Git", "GitHub", "REST APIs", "JSON"] },
    { label: "Testes", items: ["Jest (básico)"] },
    { label: "Metodologias", items: ["Scrum", "Kanban", "XP"] },
    { label: "Complementar", items: ["N8N", "Evolution API", "API Oficial da Meta"] },
  ],

  softSkills: [
    "Proatividade e curiosidade técnica",
    "Comunicação clara e objetiva",
    "Aprendizado autônomo",
    "Colaboração e trabalho em equipe",
    "Organização e foco em entrega",
  ],

  languages: [
    { flag: "🇧🇷", name: "Português", level: "Nativo" },
    { flag: "🇺🇸", name: "Inglês", level: "Intermediário (em progresso)" },
    { flag: "🇪🇸", name: "Espanhol", level: "Básico (nível escolar)" },
  ],

  certificates: [
    { title: "Curso Front-End Completo 2.0", issuer: "Danki Code" },
    { title: "Curso JavaScript Completo", issuer: "Danki Code" },
    { title: "NLW Expert · HTML, CSS e JavaScript", issuer: "Rocketseat" },
    { title: "Construção de Páginas Web com HTML, CSS e JS", issuer: "PUC Minas" },
    { title: "Flexbox e CSS Grid", issuer: "Alura" },
  ],

  projects: [
    {
      id: "vcurriculo",
      title: "VCurrículo Web",
      description:
        "Currículo online interativo e multi-idioma (PT · EN · ES), com exportação em PDF e navegação por seções animadas. Front-end responsivo do zero.",
      tags: ["HTML5", "CSS3", "JavaScript", "i18n"],
      imageUrl: "",
      liveUrl: "https://vcurriculoweb.vercel.app/",
      githubUrl: "https://github.com/viniviti",
      status: "live",
      year: "2026",
      accent: "violet",
    },
    {
      id: "blog-vinice",
      title: "Blog do Vinicè",
      description:
        "Blog literário autoral com 68+ poemas, contos e o livro digital «A Caçada», com capa e páginas que viram. Onde a lógica encontra a poesia.",
      tags: ["HTML5", "CSS3", "JavaScript", "UX"],
      imageUrl: "",
      liveUrl: "https://blog-do-vinice.vercel.app/",
      githubUrl: "https://github.com/viniviti",
      status: "live",
      year: "2024",
      accent: "emerald",
    },
    {
      id: "soon-1",
      title: "Em breve",
      description: "Um novo projeto está em construção. Volte logo para conferir o que estou criando.",
      tags: [],
      imageUrl: "",
      liveUrl: "",
      githubUrl: "",
      status: "soon",
      year: "2026",
      accent: "violet",
    },
    {
      id: "soon-2",
      title: "Em breve",
      description: "Espaço reservado para o próximo destaque do portfólio.",
      tags: [],
      imageUrl: "",
      liveUrl: "",
      githubUrl: "",
      status: "soon",
      year: "2026",
      accent: "emerald",
    },
  ],

  contact: {
    heading: "Vamos construir algo juntos?",
    subheading:
      "Aberto a oportunidades júnior em front-end e engenharia de software. Me chama, respondo rápido.",
    location: "Poços de Caldas – MG, Brasil",
    availability: "Híbrido em São Paulo · presencial ou remoto",
  },
};

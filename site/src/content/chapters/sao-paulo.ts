import { slot } from "../slot";
import type { Chapter, Provenance } from "../types";

const provenance = (): Provenance => ({
  creator: slot("creator"),
  title: slot("title"),
  holder: slot("holding institution"),
  reference: slot("reference number"),
  rights: slot("rights statement"),
  alterations: slot("any alteration you made"),
});

const instructions1950 =
  "Instituto Brasileiro de Geografia e Estatística, Conselho Nacional de Estatística, Serviço Nacional de Recenseamento, Censo demográfico: Instruções ao recenseador, C. D. 1.30 (Recenseamento Geral de 1950)";
const instructions1950Url = "https://biblioteca.ibge.gov.br/visualizacao/instrumentos_de_coleta/doc46.pdf";
const code1950 = "Serviço Nacional de Recenseamento, Divisão Técnica, Censo demográfico 1950: Código para uso do codificador";
const code1950Url = "https://biblioteca.ibge.gov.br/visualizacao/instrumentos_de_coleta/doc48.pdf";
const manual2018 =
  "Instituto Brasileiro de Geografia e Estatística, Diretoria de Pesquisas, Coordenação de Trabalho e Rendimento, Pesquisa Nacional por Amostra de Domicílios Contínua: Manual básico da entrevista (Rio de Janeiro: IBGE, August 2018)";
const manual2018Url = "https://biblioteca.ibge.gov.br/visualizacao/instrumentos_de_coleta/doc5609.pdf";
const accessed = "accessed 26 November 2026.";

export const saoPaulo: Chapter = {
  slug: "sao-paulo",
  place: "São Paulo",
  country: "Brazil",
  historicalYear: 1950,
  presentYear: 2020,
  showPersonCard: true,
  contentNote:
    "The quoted census documents on this page use historical Portuguese colour and race terms, some of which are now considered offensive. They appear only inside quotation marks, as the documents' own wording.",
  photograph: {
    id: "sao-paulo-photograph",
    kind: "photograph",
    status: "sourced",
    image: null,
    alt: slot("short alternative text"),
    longDescription: slot("longer description"),
    transcription: null,
    provenance: provenance(),
    contentNote: null,
    annotations: [],
    gapNote: null,
  },
  photographContext: slot("your context"),
  items: [
    {
      id: "sao-paulo-item-1",
      kind: "document",
      status: "sourced",
      image: null,
      alt: slot("short alternative text"),
      longDescription: slot("longer description"),
      transcription:
        "10.7 — RESPONSABILIDADE DAS DECLARAÇÕES\nA responsabilidade das declarações cabe:\na) no boletim de família, ao Chefe da família; no impedimento dêste, ao cônjuge, ao filho mais velho ou a outra pessoa residente no domicílio e em condições de responsabilizar-se pelas informações;\nb) no boletim individual, ao próprio recenseado; [...]\nQUESITO 8 — Côr.\nA côr Amarela sòmente se aplica a pessoas de raça amarela (japonêses, chineses, etc. e seus descendentes). [...]\nEm caso algum deverá ser usada, como resposta, a expressão \"morena\".\n\nEnglish translation: 10.7 — RESPONSIBILITY FOR THE DECLARATIONS\nResponsibility for the declarations lies:\na) on the family bulletin, with the head of the family; if the head is unable, with the spouse, the eldest child or another person living in the household and able to take responsibility for the information;\nb) on the individual bulletin, with the person enumerated; [...]\nQUESTION 8 — Colour.\nThe colour Yellow applies only to persons of the yellow race (Japanese, Chinese, etc. and their descendants). [...]\nIn no case is the expression \"morena\" to be used as an answer.",
      provenance: {
        creator:
          "Instituto Brasileiro de Geografia e Estatística (IBGE), Conselho Nacional de Estatística, Serviço Nacional de Recenseamento",
        title: "Censo demográfico: Instruções ao recenseador (Recenseamento Geral de 1950)",
        holder: "IBGE Biblioteca (digital library of the Instituto Brasileiro de Geografia e Estatística)",
        reference:
          "Form number C. D. 1.30, printed on the cover; IBGE digital library file doc46.pdf. Passages from printed pages 11 and 28.",
        rights: "Rights not stated by the holder; check before reuse.",
        alterations: slot("any alteration you made"),
      },
      contentNote: null,
      annotations: [
        {
          id: "sao-paulo-item-1-annotation-1",
          text: "Section 10.7 makes the head of the family, or if the head is unable a spouse, eldest child or other able resident, answer for everyone on the family bulletin. A head of family, including a person living alone, therefore answers for themself; so does a person enumerated on their own in a collective dwelling, on the individual bulletin.",
        },
        {
          id: "sao-paulo-item-1-annotation-2",
          text: "The instruction for question 8 defines no colour except 'Amarela', which it limits to people of Japanese, Chinese or similar origin and their descendants; a further sentence, cut here, adds that the term does not cover people whose skin is yellowed by illness. Its remaining rule bars the answer 'morena'. It does not tell the enumerator to judge colour by sight.",
        },
      ],
      gapNote:
        "No image has been added yet; the document can be read in the IBGE Biblioteca digital library at https://biblioteca.ibge.gov.br/visualizacao/instrumentos_de_coleta/doc46.pdf.",
    },
    {
      id: "sao-paulo-item-2",
      kind: "document",
      status: "sourced",
      image: null,
      alt: slot("short alternative text"),
      longDescription: slot("longer description"),
      transcription:
        "4. Estão incluídas neste Código, além das designações corretas e adequadas, muitas outras que poderão ocorrer, de acôrdo com o próprio entendimento do declarante. [...]\nQUESITO 8 — Côr.\n[left column] 1 — Branca\n2 — Preta — De côr\n3 — Amarela\n4 — Parda — Mulata\n9 — Ignorada\n[right column] 5 — Cafuso\n6 — Caboclo\n7 — Mestiço\n8 — Índio\n9 — Ignorada\n\nEnglish translation: 4. This Code includes, besides the correct and suitable designations, many others that may occur, according to the declarant's own understanding. [...]\nQUESTION 8 — Colour.\n[left column] 1 — White\n2 — Black — \"De côr\"\n3 — Yellow\n4 — Brown — \"Mulata\"\n9 — Unknown\n[right column] 5 — \"Cafuso\"\n6 — \"Caboclo\"\n7 — \"Mestiço\"\n8 — Indigenous (\"Índio\")\n9 — Unknown",
      provenance: {
        creator: "Serviço Nacional de Recenseamento, Divisão Técnica (Brazil)",
        title: "Censo demográfico 1950: Código para uso do codificador",
        holder: "IBGE Biblioteca (digital library of the Instituto Brasileiro de Geografia e Estatística)",
        reference:
          "No form number printed on the cover; IBGE digital library file doc48.pdf. Passages from the cover (item 4) and PDF page 8.",
        rights: "Rights not stated by the holder; check before reuse.",
        alterations: slot("any alteration you made"),
      },
      contentNote: null,
      annotations: [
        {
          id: "sao-paulo-item-2-annotation-1",
          text: "This was the coders' manual, used after collection to turn written answers into numbers. Its cover notes that the Code lists, besides the correct designations, many others that may occur, according to the declarant's own understanding.",
        },
        {
          id: "sao-paulo-item-2-annotation-2",
          text: "The right-hand column gives separate numbers to 'Cafuso', 'Caboclo', 'Mestiço' and 'Índio'. This page does not say how those codes were grouped in the published tables.",
        },
      ],
      gapNote:
        "No image has been added yet; the document can be read in the IBGE Biblioteca digital library at https://biblioteca.ibge.gov.br/visualizacao/instrumentos_de_coleta/doc48.pdf.",
    },
  ],
  basis: {
    quote:
      "\"A responsabilidade das declarações cabe: a) no boletim de família, ao Chefe da família; no impedimento dêste, ao cônjuge, ao filho mais velho ou a outra pessoa residente no domicílio e em condições de responsabilizar-se pelas informações; b) no boletim individual, ao próprio recenseado; [...]\"\nEnglish translation: \"Responsibility for the declarations lies: a) on the family bulletin, with the head of the family; if the head is unable, with the spouse, the eldest child or another person living in the household and able to take responsibility for the information; b) on the individual bulletin, with the person enumerated; [...]\"",
    citation: instructions1950 + ", 11, " + instructions1950Url + ", " + accessed,
    explanation:
      "The 1950 census did not tell enumerators to judge colour by sight. Its instructions placed responsibility for every answer on a declarant: the head of the family for everyone on the family bulletin, or the person themself on the individual bulletin. The colour question came with limits only on 'Amarela', reserved for people of Japanese, Chinese or similar origin, and a bar on the answer 'morena'. The coders' manual then matched the written word against a numbered list, and its cover notes that the list includes many other words that may occur, according to the declarant's own understanding.",
    cardFactsUsed: ["fact-2"],
  },
  outcome: {
    text:
      "First, someone declares a colour. If the person heads their household or lives in a collective dwelling, they answer for themself; otherwise the head of the family, or a stand-in such as a spouse or eldest child, answers for them. The card does not say which. Second, the word written decides the code. Fact 2 counts only if the declarant reports the person's own description; the instructions list no answers for question 8. The code numbers 'Parda — Mulata' as 4 and 'Mestiço' as 7, so the result depends on the Portuguese word used, and the code gives no rule for a word it does not list. Facts 1, 3 and 4 play no part: apart from defining 'Amarela' by origin, the rule asks for no ancestry, community standing or papers.",
    confidence:
      "Low. The result turns on who answers and which word they give, then on how that word is coded, and the card settles none of these.",
    citation:
      instructions1950 + ", 11 and 28, " + instructions1950Url + ", " + accessed + " " + code1950 + ", cover and PDF page 8, " + code1950Url + ", " + accessed,
  },
  changeOfDate: {
    historicalItemId: "sao-paulo-item-1",
    presentItemId: "sao-paulo-present-instrument",
  },
  present: {
    instrument: {
      id: "sao-paulo-present-instrument",
      kind: "document",
      status: "sourced",
      image: null,
      alt: slot("short alternative text"),
      longDescription: slot("longer description"),
      transcription:
        "Cor ou raça (Quesito 10)\nA cor ou raça dos moradores deve ser determinada pelo próprio entrevistado, sem qualquer influência do entrevistador, mesmo que este discorde das informações declaradas. [...]\nLeia as opções de cor ou raça para o entrevistado e marque aquela que for declarada:\n1. Branca | Para a pessoa que se declarar branca.\n2. Preta | Para a pessoa que se declarar preta.\n3. Amarela | Para a pessoa que se declarar de cor amarela (de origem oriental: japonesa, chinesa, coreana etc.).\n4. Parda | Para a pessoa que se declarar parda.\n5. Indígena | Para a pessoa que se declarar indígena ou índia. [...]\n\nEnglish translation: Colour or race (Question 10)\nThe colour or race of the residents must be determined by the person interviewed, without any influence from the interviewer, even if the interviewer disagrees with the information declared. [...]\nRead the colour or race options to the person interviewed and mark the one declared:\n1. White | For the person who declares themself white.\n2. Black | For the person who declares themself black.\n3. Yellow | For the person who declares themself of yellow colour (of \"oriental\" origin: Japanese, Chinese, Korean etc.).\n4. Brown | For the person who declares themself brown.\n5. Indigenous | For the person who declares themself indigenous or \"índia\". [...]",
      provenance: {
        creator:
          "Instituto Brasileiro de Geografia e Estatística (IBGE), Diretoria de Pesquisas, Coordenação de Trabalho e Rendimento",
        title: "Pesquisa Nacional por Amostra de Domicílios Contínua: Manual básico da entrevista (August 2018 edition)",
        holder: "IBGE Biblioteca (digital library of the Instituto Brasileiro de Geografia e Estatística)",
        reference: "IBGE digital library file doc5609.pdf; passage on page 61. No other reference number stated.",
        rights:
          "The PDF carries the notice \"©Projeto gráfico e editoração: DPE/GPO/GEPES, IBGE, 2018.\" No other rights statement seen; check before reuse.",
        alterations: slot("any alteration you made"),
      },
      contentNote: null,
      annotations: [
        {
          id: "sao-paulo-present-instrument-annotation-1",
          text: "The census planned for 2020 was not taken that year: IBGE's 2020 management report (Relatório de Gestão 2020, listed in the bibliography) records that in mid-March its board decided to postpone the Demographic Census to 2021. The continuous household survey (PNAD Contínua) went on, by telephone. That it asked this question in 2020 by this procedure is assumed from the manual, not shown by the report.",
        },
        {
          id: "sao-paulo-present-instrument-annotation-2",
          text: "This August 2018 edition is the latest edition from before 2020 found in IBGE's library. Whether it, or separate telephone instructions, governed interviews in 2020 has not been confirmed. In the transcription, a vertical bar marks the break between the option and description columns of the manual's table.",
        },
      ],
      gapNote:
        "No image has been added yet; the document can be read in the IBGE Biblioteca digital library at https://biblioteca.ibge.gov.br/visualizacao/instrumentos_de_coleta/doc5609.pdf.",
    },
    basis: {
      quote:
        "\"A cor ou raça dos moradores deve ser determinada pelo próprio entrevistado, sem qualquer influência do entrevistador, mesmo que este discorde das informações declaradas.\"\nEnglish translation: \"The colour or race of the residents must be determined by the person interviewed, without any influence from the interviewer, even if the interviewer disagrees with the information declared.\"",
      citation: manual2018 + ", 61, " + manual2018Url + ", " + accessed,
      explanation:
        "IBGE's continuous household survey asks colour or race by declaration. The interviewer's manual says to read out five options and mark the one declared, without influencing the answer even when the interviewer disagrees. Each option is defined only as the category a person declares; 'Amarela' alone carries a note on origin. The manual also has the interviewer record whether the answers came from the person, another resident or a non-resident, so one member of a household may still answer for another.",
      cardFactsUsed: ["fact-2"],
    },
    outcome: {
      text:
        "The procedure is fixed, and the answer belongs to whoever is interviewed: the person, another resident or a non-resident informant. Fact 2 is only the starting point. Asked, the person says 'mixed', which is not one of the five options, so to be recorded the respondent must choose 'Branca', 'Preta', 'Amarela', 'Parda' or 'Indígena'. The August 2018 manual gives no rule for an answer outside the five options (the June 2022 edition adds one: the interviewer rereads the options and asks the person to choose), and it does not let the interviewer choose. Facts 1, 3 and 4 play no part: apart from a note on origin under 'Amarela', the instruction asks for no ancestry, community standing or documents.",
      confidence:
        "Moderate. The procedure is stated plainly, but which of the five options the person would choose cannot be read from the card.",
      citation:
        manual2018 +
        ", 61–62, " +
        manual2018Url +
        ", " +
        accessed +
        " For the later rule: the same manual, June 2022 edition, 63–64, https://biblioteca.ibge.gov.br/visualizacao/instrumentos_de_coleta/doc5642.pdf, " +
        accessed,
    },
    reflection:
      "Between 1950 and 2020 the official question in São Paulo moved from a word supplied by a declarant, often the head of the family, to a choice among five read-out options made by the person or another informant. At both dates the state asked for a declaration rather than evidence: neither instruction asks about ancestry, neighbours or papers, so facts 1, 3 and 4 stay outside the record. What changed is where the sorting happens. In 1950 a coder matched the written word, which could be one such as 'Mestiço', against a numbered list after the interview. In 2020 the sorting happens during the interview itself, because the person must fit 'mixed' into one of the five listed categories.",
  },
};

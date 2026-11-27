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

const PRA_URL =
  "https://www.sahistory.org.za/sites/default/files/archive-files2/leg19500707.028.020.030.pdf";
const GAA_URL =
  "https://sahistory.org.za/sites/default/files/archive-files3/leg19500707.028.020.041.pdf";
const REGS_URL =
  "https://www.gov.za/sites/default/files/gcis_document/201409/37873rg10241gon595.pdf";

export const johannesburg: Chapter = {
  slug: "johannesburg",
  place: "Johannesburg",
  country: "South Africa",
  historicalYear: 1955,
  presentYear: 2020,
  showPersonCard: true,
  contentNote:
    "This chapter quotes South African laws from 1950 that use the racial terms of their time, such as \"native\" and \"coloured person\", and a form in use in 2020 that uses present-day population-group labels. These terms appear only as the sources' own wording.",
  photograph: {
    id: "johannesburg-photograph",
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
      id: "johannesburg-item-1",
      kind: "document",
      status: "sourced",
      image: null,
      alt: slot("short alternative text"),
      longDescription: slot("longer description"),
      transcription:
        "1. In this Act, unless the context otherwise indicates—\n[...]\n(iii) \"coloured person\" means a person who is not a white person or a native; (iv)\n[...]\n(x) \"native\" means a person who in fact is or is generally accepted as a member of any aboriginal race or tribe of Africa; (vii)\n[...]\n(xv) \"white person\" means a person who in appearance obviously is, or who is generally accepted as a white person, but does not include a person who, although in appearance obviously a white person, is generally accepted as a coloured person. (i)",
      provenance: {
        creator: "Parliament of the Union of South Africa",
        title: "Population Registration Act, No. 30 of 1950 (assented to 22 June 1950), section 1, as enacted",
        holder: "South African History Online (sahistory.org.za)",
        reference:
          "Act No. 30 of 1950; section 1 on printed pages 275 and 277 and section 11 on pages 283 to 285 of the scanned statute volume; English text (the Afrikaans text was the signed version); SAHO file leg19500707.028.020.030.pdf",
        rights: "Rights not stated by the holder; check before reuse.",
        alterations: slot("any alteration you made"),
      },
      contentNote: null,
      annotations: [
        {
          id: "johannesburg-item-1-annotation-1",
          text: "This is the wording as enacted in 1950. Parliament passed several Population Registration Amendment Acts in later years, so later versions of these definitions should not be read back into 1955.",
        },
        {
          id: "johannesburg-item-1-annotation-2",
          text: "None of the three definitions mentions ancestry or descent. Each turns on appearance, on general acceptance by others, or, for \"native\", on being \"in fact\" a member of a group the Act does not further define.",
        },
        {
          id: "johannesburg-item-1-annotation-3",
          text: "Section 11 allowed any person to object in writing to someone else's classification, on paying a deposit of ten pounds, and sent such objections to a board for decision. The numeral printed after each definition, such as \"(iv)\", is kept as it appears in the source.",
        },
      ],
      gapNote:
        "No image has been added yet; the Act can be read in the scan held by South African History Online at " +
        PRA_URL +
        ".",
    },
    {
      id: "johannesburg-item-2",
      kind: "document",
      status: "sourced",
      image: null,
      alt: slot("short alternative text"),
      longDescription: slot("longer description"),
      transcription:
        "2. (1) For the purposes of this Act, there shall be the following groups:\n(a) a white group, in which shall be included any person who in appearance, obviously is, or who is generally accepted as a white person, other than a person who although in appearance obviously a white person, is generally accepted as a coloured person, [...]\n(b) a native group, in which shall be included—\n(i) any person who in fact is, or is generally accepted as a member of an aboriginal race or tribe of Africa, other than a person who is, in terms of sub-paragraph (ii) of paragraph (c), a member of the coloured group; [...]\n(c) a coloured group, in which shall be included—\n(i) any person who is not a member of the white group or of the native group; [...]",
      provenance: {
        creator: "Parliament of the Union of South Africa",
        title: "Group Areas Act, No. 41 of 1950 (assented to 24 June 1950), section 2, as enacted",
        holder: "South African History Online (sahistory.org.za)",
        reference:
          "Act No. 41 of 1950; section 1(viii) on printed page 409 and section 2 on page 413 of the scanned statute volume; SAHO file leg19500707.028.020.041.pdf",
        rights: "Rights not stated by the holder; check before reuse.",
        alterations: slot("any alteration you made"),
      },
      contentNote: null,
      annotations: [
        {
          id: "johannesburg-item-2-annotation-1",
          text: "The Group Areas Act sets out its own groups using almost the same tests of appearance and general acceptance as the Population Registration Act, rather than referring to the population register. Group membership mattered here because section 1 defines a \"disqualified person\" in a group area as one \"who is not a member of the group specified\" for that area.",
        },
        {
          id: "johannesburg-item-2-annotation-2",
          text: "Sub-paragraphs (b)(ii) and (c)(ii), cut here, placed in the \"native group\" or \"coloured group\" any woman married to, or living with, a member of that group. This is the text as enacted in 1950; the Act was amended before the end of 1955, and whether section 2 had changed by then has not been checked here.",
        },
      ],
      gapNote:
        "No image has been added yet; the Act can be read in the scan held by South African History Online at " +
        GAA_URL +
        ".",
    },
  ],
  basis: {
    quote:
      "5. (1) Every person whose name is included in the register shall be classified by the Director as a white person, a coloured person or a native, as the case may be [...]\n[...]\n19. (1) A person who in appearance obviously is a white person shall for the purposes of this Act be presumed to be a white person until the contrary is proved.",
    citation:
      "Population Registration Act, No. 30 of 1950 (Union of South Africa), ss. 5(1) and 19(1), printed pages 279 and 293, South African History Online, " +
      PRA_URL +
      ", accessed 26 November 2026.",
    explanation:
      "The Act made classification an administrative decision. Section 5(1) required the Director of Census to place every registered person in one of three categories, applying the definitions in section 1. Those definitions rest on three tests: how a person looked, whether others generally accepted them as belonging to a group, and, for \"native\", whether the person \"in fact\" was a member of an \"aboriginal race or tribe of Africa\". Section 19(1) added that a person who \"in appearance obviously is a white person\" is \"presumed to be a white person until the contrary is proved\". Section 3 told the Director to draw the register's particulars from the 1951 census returns and other available records. The person's own description of themself is not named anywhere in these provisions.",
    cardFactsUsed: ["fact-3"],
  },
  outcome: {
    text:
      "The Director decides (section 5(1)). The first limb of the \"white person\" definition, appearance, cannot be applied from the card alone. The second limb, general acceptance, depends on fact 3: no single community claims this person, so the card shows no general acceptance as \"white\", as \"coloured\" or as a member of an \"aboriginal race or tribe of Africa\". The Act does not say whether one grandparent recorded as of African descent (fact 1) makes someone \"in fact\" such a member. Self-description (fact 2) is not a test in the definitions, though the person could object to their own classification under section 11(1), and the birth certificate (fact 4) records no race. Because \"coloured person\" is the residual category, the result turns on the Director's judgement of appearance and of whether the person is \"in fact\" such a member.",
    confidence:
      "Cannot be determined. The definitions turn on appearance, on general acceptance and, for \"native\", on whether a person \"in fact\" is a member of an \"aboriginal race or tribe of Africa\", a phrase the Act does not define. The card records no physical description and no community's acceptance, so the outcome rests on an official's assessment the card cannot predict.",
    citation:
      "Population Registration Act, No. 30 of 1950 (Union of South Africa), ss. 1, 3, 5(1), 11(1) and 19(1), printed pages 277, 279, 283 and 293, South African History Online," +
      PRA_URL +
      ", accessed 26 November 2026.",
  },
  changeOfDate: {
    historicalItemId: "johannesburg-item-1",
    presentItemId: "johannesburg-present-instrument",
  },
  present: {
    instrument: {
      id: "johannesburg-present-instrument",
      kind: "document",
      status: "sourced",
      image: null,
      alt: slot("short alternative text"),
      longDescription: slot("longer description"),
      transcription:
        "DECLARATION BY EMPLOYEE\n(Confidential)\n[...]\nThis form is used to obtain information from employees for the purpose of assisting employers in conducting an analysis on the workforce profile. [...]\n3. Please indicate to which categories you belong with an 'X' below:\nMale Female\nAfrican Coloured Indian White\n[...]\n'Designated groups', mean black people, women and people with disabilities who-\na) Are citizens of the Republic of South Africa by birth or descent; or\nb) Became citizens of the Republic of South Africa by naturalization - [...]\n4. I verify that the above information is true and correct.",
      provenance: {
        creator: "Department of Labour, Republic of South Africa (Minister of Labour, Mildred Nelisiwe Oliphant)",
        title:
          "Employment Equity Regulations, 2014, Form EEA1: Declaration by Employee (listed in the regulations as \"Employee declaration in terms of Section 19(1) of the Act\")",
        holder: "South African Government (gov.za)",
        reference: "Government Notice No. R. 595, Government Gazette No. 37873, 1 August 2014, p. 13",
        rights: "Rights not stated by the holder; check before reuse.",
        alterations: slot("any alteration you made"),
      },
      contentNote: null,
      annotations: [
        {
          id: "johannesburg-present-instrument-annotation-1",
          text: "The form defines none of its four categories, and the Employment Equity Act says only that \"black people\" is a \"generic term which means Africans, Coloureds and Indians\" (Employment Equity Act, No. 55 of 1998, section 1, as enacted; listed in the bibliography). There is no box for \"mixed\" and no instruction for a person who belongs to more than one category.",
        },
      ],
      gapNote:
        "No image has been added yet; the form can be read on page 13 of Government Gazette No. 37873, held by the South African Government at " +
        REGS_URL +
        ".",
    },
    basis: {
      quote:
        "(1) When a designated employer collects information contemplated in section 19 of the Act, the employer must request each employee in the workforce to complete a declaration using the EEA1 form.\n(2) An employee may add information to the EEA1 form.\n(3) Where an employee refuses to complete the EEA1 form or provides inaccurate information, the employer may establish the designation of an employee by using reliable historical and existing data. [...]",
      citation:
        "Department of Labour, Employment Equity Regulations, 2014, Government Notice No. R. 595, Government Gazette No. 37873, 1 August 2014, reg. 8(1)-(3), p. 9, " +
        REGS_URL +
        ", accessed 26 November 2026.",
      explanation:
        "In 2020 the classification that counted at work was, in the first instance, a self-declaration. Regulation 8 required a designated employer to ask each employee to complete the EEA1 form, and allowed the employee to add information to it. The purpose was to count the workforce for employment equity analysis and reporting, not to enter people in a population register. Only if the employee refused, or gave inaccurate information, could the employer fall back on \"reliable historical and existing data\". The regulations do not say what such data are or who judges the inaccuracy.",
      cardFactsUsed: ["fact-2", "fact-4"],
    },
    outcome: {
      text:
        "This applies only if the person works for a designated employer, which the card does not state. The form asks the person to mark with an \"X\" the \"categories\" they belong to, listing \"African\", \"Coloured\", \"Indian\" and \"White\". Fact 2 is the starting point, but \"mixed\" is not offered. The form does not limit the person to one box or say what to do if more than one applies, and the person may add information, as regulation 8(2) allows. Appearance, neighbours' acceptance (fact 3) and ancestry (fact 1) are not asked. If the answer were inaccurate, the employer could use \"reliable historical and existing data\", but the birth certificate (fact 4) holds no race entry. Whether the person falls in a \"designated group\" also depends on citizenship, which the card does not state.",
      confidence:
        "Low. The form records what the person declares, and the card says only that they describe themself as \"mixed\", a term the form does not offer, so which box or boxes they would mark cannot be known from the card.",
      citation:
        "Department of Labour, Employment Equity Regulations, 2014, Government Notice No. R. 595, Government Gazette No. 37873, 1 August 2014, reg. 8 and Form EEA1, pp. 9 and 13, " +
        REGS_URL +
        ", accessed 26 November 2026.",
    },
    reflection:
      "Between 1955 and 2020 the decision in Johannesburg moved from an official to the person. In 1955 the Director of Census classified each registered person under definitions that turned on appearance, general acceptance and, for \"native\", membership \"in fact\", and anyone could object to someone else's classification before a board. The Population Registration Act was repealed by Act No. 114 of 1991. In 2020 an employee marks a box on a confidential form, used to count a workforce rather than to enter them in a national register. What did not change is the set of named categories: the 2020 form still lists \"Coloured\" and \"White\" among four boxes and has no place for \"mixed\". Both systems also leave the last word with someone other than the person: the Director and, on objection, a board then; the employer's \"reliable historical and existing data\" now, if the employee refuses or gives inaccurate information.",
  },
};

import { slot } from "../slot";
import type { Chapter } from "../types";

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
  summary: {
    historical: {
      decides: "The Director of Census; on objection, a board",
      evidence: "Appearance, general acceptance and, for one category, membership “in fact”",
    },
    present: {
      decides: "The employee, on a workplace form; the employer if the employee refuses or gives inaccurate information",
      evidence: "Self-declaration; failing that, “reliable historical and existing data”",
    },
  },
  contentNote:
    "This chapter quotes South African laws from 1950 that use the racial terms of their time, such as \"native\" and \"coloured person\", and a form in use in 2020 that uses present-day population-group labels. These terms appear only as the sources' own wording.",
  photograph: {
    id: "johannesburg-photograph",
    kind: "photograph",
    status: "sourced",
    image: { src: "/images/johannesburg/johannesburg-photograph.jpg", width: 2000, height: 1480 },
    alt: "Black-and-white aerial photograph of Johannesburg in 1954, looking across blocks of tall buildings toward pale mine dumps on the horizon.",
    longDescription:
      "An oblique aerial view taken from above a traffic circle planted with palm trees in the foreground. Avenues lined with trees run away from the circle between apartment and office blocks of ten or more storeys, mixed with lower houses with pitched roofs. Farther back the buildings grow denser, and along the horizon a row of large pale mine dumps stands against low hills. Faint lettering on shop fronts at the lower left cannot be read; cars and a bus are on the roads, and the print's edges show some wear.",
    transcription: null,
    translation: null,
    provenance: {
      creator: "Unknown author (as stated by the file page)",
      title: "Aerial view of Johannesburg (Italian: \"Veduta aerea di Johannesburg\")",
      holder: "Archivio Storico del Touring Club Italiano (Milan); digital copy on Wikimedia Commons",
      reference:
        "Touring Club Italiano BBs 232; Wikimedia Commons file \"Photo Aerial view of Joannesburg 1954 - Touring Club Italiano BBs 232.jpg\", https://commons.wikimedia.org/wiki/File:Photo_Aerial_view_of_Joannesburg_1954_-_Touring_Club_Italiano_BBs_232.jpg (original file https://upload.wikimedia.org/wikipedia/commons/3/32/Photo_Aerial_view_of_Joannesburg_1954_-_Touring_Club_Italiano_BBs_232.jpg); dated 1954 on the file page",
      rights:
        "Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0), https://creativecommons.org/licenses/by-sa/4.0/; published on Wikimedia Commons with permission from Touring Club Italiano (VRT ticket #2022090510003181). Credit: Touring Club Italiano.",
      alterations:
        "Scan of 3298 by 2440 pixels resized to 2000 by 1480 pixels and saved as JPEG; not cropped, colourised or retouched.",
    },
    contentNote: null,
    annotations: [],
    gapNote: null,
  },
  photographContext:
    "This aerial photograph shows Johannesburg from above, with tall apartment and office blocks, tree-lined avenues and a palm-planted traffic circle in front, and pale mine dumps along the horizon. The photograph is dated 1954, a year before this chapter's year of 1955. Its photographer is not named. It belongs to the historical archive of the Touring Club Italiano in Milan, which released it on Wikimedia Commons under a free licence. It is used here under a Creative Commons Attribution-ShareAlike 4.0 licence, credited to Touring Club Italiano, and has only been resized.",
  items: [
    {
      id: "johannesburg-item-1",
      kind: "document",
      status: "sourced",
      image: { src: "/images/johannesburg/johannesburg-item-1.jpg", width: 1600, height: 2451 },
      alt: "Scanned printed page 277 of the 1950 statute volume, the English text of the Population Registration Act, showing a numbered list of definitions.",
      longDescription:
        "A single printed page with the running head \"Population Registration.\" and the page number 277 at the top right, and \"Act No. 30 of 1950.\" in bold in the right margin. Most of the page is a list of definitions numbered (ii) to (xv), the end of section 1; the \"native\" definition sits near the middle of the list and the \"white person\" definition is the last item. The opening words of section 1 and its first definition, (i), are on the preceding English page, 275; the \"coloured person\" definition is near the top of this page. Below the list are sections 2, 3 and the start of section 4, each with a short marginal note in the right margin.",
      transcription:
        "1. In this Act, unless the context otherwise indicates—\n[...]\n(iii) \"coloured person\" means a person who is not a white person or a native; (iv)\n[...]\n(x) \"native\" means a person who in fact is or is generally accepted as a member of any aboriginal race or tribe of Africa; (vii)\n[...]\n(xv) \"white person\" means a person who in appearance obviously is, or who is generally accepted as a white person, but does not include a person who, although in appearance obviously a white person, is generally accepted as a coloured person. (i)",
      translation: null,
      provenance: {
        creator: "Parliament of the Union of South Africa",
        title: "Population Registration Act, No. 30 of 1950 (assented to 22 June 1950), section 1, as enacted",
        holder:
          "Wikimedia Commons (page image, a scan of the Statutes of the Union of South Africa, 1950); South African History Online (copy read)",
        reference:
          "Act No. 30 of 1950; section 1 on printed pages 275 and 277 and section 11 on pages 283 to 285 of the scanned statute volume; English text (the Afrikaans text was the signed version); SAHO file leg19500707.028.020.030.pdf; image shows printed page 277, from the byte-identical file on Wikimedia Commons, https://commons.wikimedia.org/wiki/File:Population_Registration_Act_1950.pdf",
        rights:
          "Public domain in South Africa as a work of the South African Government published more than 50 years ago, as stated on the Wikimedia Commons file page. South African History Online, where the text was read, licenses its content CC BY-NC-SA 4.0 and asks to be credited and notified when its archive material is reproduced (https://www.sahistory.org.za/policy).",
        alterations:
          "Page 2 of the PDF (printed page 277) rendered whole to an image 1600 pixels wide; not otherwise altered.",
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
      gapNote: null,
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
      translation: null,
      provenance: {
        creator: "Parliament of the Union of South Africa",
        title: "Group Areas Act, No. 41 of 1950 (assented to 24 June 1950), section 2, as enacted",
        holder: "South African History Online (sahistory.org.za)",
        reference:
          "Act No. 41 of 1950; section 1(viii) on printed page 409 and section 2 on page 413 of the scanned statute volume; SAHO file leg19500707.028.020.041.pdf, " +
          GAA_URL,
        rights:
          "South African History Online licenses its content CC BY-NC-SA 4.0, asks to be credited and notified when its public-domain archive material is reproduced, and says republication elsewhere on the web needs permission (https://www.sahistory.org.za/policy). No image of its scan is shown here for that reason.",
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
        "No image is shown: South African History Online, which holds the scan, asks for permission before its material is republished on the web. The Act can be read there at " +
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
    quoteTranslation: null,
    cardFactsUsed: ["fact-3"],
  },
  outcome: {
    level: "undetermined",
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
      image: { src: "/images/johannesburg/johannesburg-present-instrument.jpg", width: 1600, height: 2265 },
      alt: "Page 13 of Government Gazette No. 37873 of 1 August 2014, showing the blank one-page form EEA1, Declaration by Employee.",
      longDescription:
        "The gazette's running head and the page number 13 are at the top, and a footer line about the gazette's online availability is at the bottom. Below the head, a boxed banner carries the Department of Labour emblem on the left and \"PAGE 1 OF 1\" and \"EEA1\" on the right. The form itself is a bordered box under the title and \"(Confidential)\": a narrow left column of notes headed \"Please read this first\" and a wider right column of numbered questions with empty tick boxes. The row of four category boxes sits in the right column under question 3, and the definition of designated groups is in the left column under \"Please note\".",
      transcription:
        "DECLARATION BY EMPLOYEE\n(Confidential)\n[...]\nThis form is used to obtain information from employees for the purpose of assisting employers in conducting an analysis on the workforce profile. [...]\n3. Please indicate to which categories you belong with an 'X' below:\nMale Female\nAfrican Coloured Indian White\n[...]\n'Designated groups', mean black people, women and people with disabilities who-\na) Are citizens of the Republic of South Africa by birth or descent; or\nb) Became citizens of the Republic of South Africa by naturalization - [...]\n4. I verify that the above information is true and correct.",
      translation: null,
      provenance: {
        creator: "Department of Labour, Republic of South Africa (Minister of Labour, Mildred Nelisiwe Oliphant)",
        title:
          "Employment Equity Regulations, 2014, Form EEA1: Declaration by Employee (listed in the regulations as \"Employee declaration in terms of Section 19(1) of the Act\")",
        holder: "South African Government (gov.za)",
        reference:
          "Government Notice No. R. 595, Government Gazette No. 37873, 1 August 2014, p. 13, " + REGS_URL + " (PDF page 11)",
        rights:
          "The South African Government website's terms of use (https://www.gov.za/terms-and-conditions-use-0) allow its content to be viewed, copied, downloaded, printed and distributed \"only for non-commercial informational or reference purposes\"; commercial reproduction needs prior written permission. The gazette page itself carries no rights statement. Check before reuse.",
        alterations:
          "Page 11 of the PDF (gazette page 13) rendered whole to an image 1600 pixels wide; not otherwise altered.",
      },
      contentNote: null,
      annotations: [
        {
          id: "johannesburg-present-instrument-annotation-1",
          text: "The form defines none of its four categories, and the Employment Equity Act says only that \"black people\" is a \"generic term which means Africans, Coloureds and Indians\" (Employment Equity Act, No. 55 of 1998, section 1; the Employment Equity Amendment Act, No. 47 of 2013, replaced the definition of 'designated groups', whose wording the form repeats, and left this one as enacted; both listed in the bibliography). There is no box for \"mixed\" and no instruction for a person who belongs to more than one category.",
        },
      ],
      gapNote: null,
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
      quoteTranslation: null,
      cardFactsUsed: ["fact-2", "fact-4"],
    },
    outcome: {
      level: "low",
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

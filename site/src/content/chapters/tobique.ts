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

const LAC_1952 =
  "https://epe.lac-bac.gc.ca/100/205/301/ic/cdc/aboriginaldocs/stat/html/1951.htm";
const LAC_1956 =
  "https://epe.lac-bac.gc.ca/100/205/301/ic/cdc/aboriginaldocs/stat/pdf/1956au14.PDF";
const JUSTICE_2019 = "https://laws-lois.justice.gc.ca/eng/acts/I-5/20190815/P1TT3xt3.html";

export const tobique: Chapter = {
  slug: "tobique",
  place: "Tobique, New Brunswick",
  country: "Canada",
  historicalYear: 1960,
  presentYear: 2020,
  // false: no person card on this page. Whether a fictional person is placed here at all is
  // your and your instructor's decision (design-plan.md, "The Tobique chapter").
  showPersonCard: false,
  summary: {
    historical: {
      decides: "The Registrar, a federal officer; one reference to a judge",
      evidence: "Recorded descent through men, band membership and marriage",
    },
    present: {
      decides: "The Registrar, on application",
      evidence: "Descent through either parent; credible evidence where an ancestor is unknown or unstated",
    },
  },
  contentNote:
    "This chapter quotes federal legislation and a United Nations decision; the term \"Indian\" is the legal term of the Indian Act and appears here only as the statute's wording, and the 1950s provisions quoted apply rules that differ by sex. No person, fictional or real, is placed in this community: the chapter describes the federal registration system as it applied to Tobique First Nation (Neqotkuk), a Wolastoqiyik community, using only legislation and a published decision.",
  photograph: {
    id: "tobique-photograph",
    kind: "photograph",
    status: "sourced",
    image: null,
    alt: slot("short alternative text"),
    longDescription: slot("longer description"),
    transcription: null,
    translation: null,
    provenance: provenance(),
    contentNote: null,
    annotations: [],
    gapNote:
      "No photograph is shown here. An image of this community would need its permission, which has not been sought.",
  },
  photographContext: slot("your context"),
  items: [
    {
      id: "tobique-item-1",
      kind: "document",
      status: "sourced",
      image: null,
      alt: slot("short alternative text"),
      longDescription: slot("longer description"),
      transcription:
        "5. An Indian Register shall be maintained in the Department, which shall consist of Band Lists and General Lists and in which shall be recorded the name of every person who is entitled to be registered as an Indian. [...]\n7. (1) The Registrar may at any time add to or delete from a Band List or a General List the name of any person who, in accordance with the provisions of this Act, is entitled or not entitled, as the case may be, to have his name included in that List. [...]\n11. Subject to section 12, a person is entitled to be registered if that person [...]\n(c) is a male person who is a direct descendant in the male line of a male person described in paragraph (a) or (b); [...]\n12. (1) The following persons are not entitled to be registered, namely, [...]\n(b) a woman who is married to a person who is not an Indian.",
      translation: null,
      provenance: {
        creator: "Parliament of Canada (Indian Act, first enacted as S.C. 1951, c. 29)",
        title: "Indian Act, R.S.C. 1952, c. 149, sections 5, 7, 11 and 12",
        holder:
          "Library and Archives Canada, archived web content (an electronic transcription whose file metadata names the Eagle's Cry Project, 1999)",
        reference: "R.S.C. 1952, c. 149, ss. 5, 7(1), 11(c), 12(1)(b); " + LAC_1952,
        rights:
          "The archived collection pages state \"Copyright Six Nations Geo Systems 1999\"; Library and Archives Canada's archived-content notice links to its terms and conditions. Check before reuse.",
        alterations: slot("any alteration you made"),
      },
      contentNote: null,
      annotations: [
        {
          id: "tobique-item-1-annotation-1",
          text: "Section 5 keeps one national Indian Register in the federal Department, and section 7(1) gives the Registrar, a departmental officer, the power to add or delete names according to the Act's tests.",
        },
        {
          id: "tobique-item-1-annotation-2",
          text: "Section 11 traces entitlement largely through men: a male person's descent \"in the male line\" from a male person described in paragraph 11(a) or (b), or being the \"wife or widow\" of an entitled person under paragraph 11(f).",
        },
        {
          id: "tobique-item-1-annotation-3",
          text: "This is the 1952 wording of paragraph 12(1)(b). Parliament replaced it in 1956 with the wording shown in item 2, which is the version that applied in 1960.",
        },
      ],
      gapNote:
        "No image has been added yet; the text can be read in Library and Archives Canada's archived transcription at " +
        LAC_1952 +
        ".",
    },
    {
      id: "tobique-item-2",
      kind: "document",
      status: "sourced",
      image: null,
      alt: slot("short alternative text"),
      longDescription: slot("longer description"),
      transcription:
        "4. Paragraph (b) of subsection (1) of section 12 of the said Act is repealed and the following substituted therefor:\n\"(b) a woman who married a person who is not an Indian, unless that woman is subsequently the wife or widow of a person described in section 11.\" [...]\n26. Subsection (2) of section 108 of the said Act is repealed and the following substituted therefor:\n\"(2) On the report of the Minister that an Indian woman married a person who is not an Indian, the Governor in Council may by order declare that the woman is enfranchised as of the date of her marriage and, on the recommendation of the Minister may by order declare that all or any of her children are enfranchised as of the date of the marriage or such other date as the order may specify.\"",
      translation: null,
      provenance: {
        creator: "Parliament of Canada",
        title:
          "An Act to amend the Indian Act, S.C. 1956, c. 40 (assented to 14 August 1956), sections 4 and 26",
        holder: "Library and Archives Canada, archived web content",
        reference: "S.C. 1956, c. 40, ss. 4, 26; " + LAC_1956,
        rights:
          "The archived collection pages state \"Copyright Six Nations Geo Systems 1999\"; Library and Archives Canada's archived-content notice links to its terms and conditions. Check before reuse.",
        alterations: slot("any alteration you made"),
      },
      contentNote: null,
      annotations: [
        {
          id: "tobique-item-2-annotation-1",
          text: "The 1956 wording keeps the rule that a woman who \"married a person who is not an Indian\" is not entitled to be registered, with one exception: a later marriage to a man described in section 11. No parallel rule applied to men, whose wives became entitled under paragraph 11(f).",
        },
        {
          id: "tobique-item-2-annotation-2",
          text: "Under section 109 as replaced by the same 1956 Act, a person enfranchised by order was \"deemed not to be an Indian within the meaning of this Act or any other statute or law\", so section 26 let the federal Cabinet end such a woman's legal status by order.",
        },
        {
          id: "tobique-item-2-annotation-3",
          text: "In Lovelace v. Canada (views adopted 30 July 1981), the UN Human Rights Committee considered Sandra Lovelace, who had lost her status under paragraph 12(1)(b) after marrying in 1970, and found that denying her \"the legal right to reside on the Tobique Reserve\" breached article 27 of the International Covenant on Civil and Political Rights (Communication No. R.6/24, U.N. Doc. A/36/40 at 166, paragraph 19; read in the University of Minnesota Human Rights Library copy listed in the bibliography).",
        },
      ],
      gapNote:
        "No image has been added yet; the text can be read in Library and Archives Canada's archived copy at " +
        LAC_1956 +
        ".",
    },
  ],
  basis: {
    quote:
      "\"Indian\" means a person who pursuant to this Act is registered as an Indian or is entitled to be registered as an Indian; [...] \"Registrar\" means the officer of the Department who is in charge of the Indian Register;",
    citation:
      "Indian Act, R.S.C. 1952, c. 149, s. 2(1)(g), (n), transcription in Library and Archives Canada, archived web content, " +
      LAC_1952 +
      ", accessed 26 November 2026.",
    explanation:
      "In 1960 the Act defined an \"Indian\" by registration itself: a person was one in law if registered or entitled to be registered. The decision lay with the Registrar, an officer of the federal Department, who added or deleted names using the tests in sections 11 and 12. Those tests turned on recorded descent through men, band membership and marriage, not on how a person or a community described them. Under section 9 a protest against an addition or deletion went first to the Registrar, whose decision could be referred to a judge for review; the 1956 amendment allowed only one such reference. The criteria themselves were set by Parliament.",
    quoteTranslation: null,
    cardFactsUsed: [],
  },
  // No recorded outcome for a person in this chapter, whatever else is decided.
  outcome: null,
  changeOfDate: {
    historicalItemId: "tobique-item-1",
    presentItemId: "tobique-present-instrument",
  },
  present: {
    instrument: {
      id: "tobique-present-instrument",
      kind: "document",
      status: "sourced",
      image: null,
      alt: slot("short alternative text"),
      longDescription: slot("longer description"),
      transcription:
        "6 (1) Subject to section 7, a person is entitled to be registered if\n(a) that person was registered or entitled to be registered immediately before April 17, 1985;\n(a.1) the name of that person was omitted or deleted from the Indian Register, or from a band list before September 4, 1951, under subparagraph 12(1)(a)(iv), paragraph 12(1)(b) or subsection 12(2) or under subparagraph 12(1)(a)(iii) pursuant to an order made under subsection 109(2), as each provision read immediately before April 17, 1985, or under any former provision of this Act relating to the same subject matter as any of those provisions; [...]\n(f) both parents of that person are entitled to be registered under this section or, if the parents are no longer living, were so entitled at the time of death.\n(2) Subject to section 7, a person is entitled to be registered if one of their parents is entitled to be registered under subsection (1) or, if that parent is no longer living, was so entitled at the time of death.",
      translation: null,
      provenance: {
        creator: "Parliament of Canada; consolidation by the Department of Justice Canada",
        title:
          "Indian Act, R.S.C. 1985, c. I-5, section 6 (point-in-time version in force from 15 August 2019)",
        holder: "Department of Justice Canada, Justice Laws Website",
        reference:
          "R.S.C. 1985, c. I-5, s. 6(1)(a), (a.1), (f) and 6(2), version of document from 2019-08-15 to 2026-11-12; " +
          JUSTICE_2019,
        rights:
          "The Justice Laws Website states that under the Reproduction of Federal Law Order \"anyone may, without charge or request for permission, reproduce enactments and consolidations of enactments of the Government of Canada\", provided due diligence is exercised in ensuring accuracy and the reproduction is not represented as an official version (https://laws-lois.justice.gc.ca/eng/FAQ/).",
        alterations: slot("any alteration you made"),
      },
      contentNote: null,
      annotations: [
        {
          id: "tobique-present-instrument-annotation-1",
          text: "Paragraph (a.1) makes a person entitled to be registered if their name was omitted or deleted under paragraph 12(1)(b), as it read immediately before 17 April 1985, or under a former provision on the same subject, such as the wording in items 1 and 2.",
        },
        {
          id: "tobique-present-instrument-annotation-2",
          text: "Subsection 6(2) makes one parent of either sex enough if that parent is entitled under subsection 6(1), where section 11 of the 1952 Act traced descent through men. Membership of a particular band is a separate question: under section 10 a band may take control of its own Band List under written rules approved by its electors.",
        },
      ],
      gapNote:
        "No image has been added yet; the text can be read on the Department of Justice Canada's Justice Laws Website at " +
        JUSTICE_2019 +
        ".",
    },
    basis: {
      quote:
        "[...] the Registrar shall, without being required to establish the identity of that parent, grandparent or other ancestor, determine, after considering all of the relevant evidence, whether that parent, grandparent or other ancestor is, was or would have been entitled to be registered. In making the determination, the Registrar shall rely on any credible evidence that is presented by the applicant in support of the application or that the Registrar otherwise has knowledge of and shall draw from it every reasonable inference in favour of the person in respect of whom the application is made.",
      citation:
        "Indian Act, R.S.C. 1985, c. I-5, s. 5(6), version of document from 2019-08-15 to 2026-11-12, Justice Laws Website, Department of Justice Canada, " +
        JUSTICE_2019 +
        ", accessed 26 November 2026.",
      explanation:
        "In 2020 the Registrar, an officer of the Department of Indigenous Services, still decided entitlement, and under section 5(5) a name did not have to be recorded unless an application was made. Entitlement under section 6 often turned on a parent's or ancestor's entitlement (paragraphs 6(1)(a.3) and (f) and subsection 6(2)), so many applications rested on records of descent. Where a parent or ancestor was unknown or not named on a birth certificate, section 5(6) required the Registrar to rely on any credible evidence and draw every reasonable inference in the applicant's favour. Registration remained federal; band membership could be governed separately under section 10.",
      quoteTranslation: null,
      cardFactsUsed: [],
    },
    outcome: null,
    reflection:
      "Between 1960 and 2020 the decision stayed in the same place: a federal Registrar applying tests written by Parliament and recording the result in one Indian Register. What the tests looked at changed. The 1950s provisions traced entitlement through men and made a woman who married a man outside the Act's definition not entitled to be registered; section 6 in 2020 counts descent through either parent and treats removal under that marriage rule as a ground for entitlement. The evidence changed, since the Registrar must now rely on credible evidence and draw every reasonable inference in the applicant's favour where an ancestor is unknown or unstated. What did not change is that the Act, rather than the community, defines who is an \"Indian\" in law, although a band may now set its own membership rules under section 10.",
  },
};

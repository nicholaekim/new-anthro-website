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

const ipumsCitation =
  "IPUMS USA, “1930 Census: Enumerator Instructions,” par. 151, https://usa.ipums.org/usa/voliii/inst1930.shtml (accessed 26 November 2026).";

const censusRaceCitation =
  "U.S. Census Bureau, “About the Topic of Race,” page last revised 2 April 2026, https://www.census.gov/topics/population/race/about.html (accessed 26 November 2026).";

export const louisiana: Chapter = {
  slug: "louisiana",
  place: "Louisiana",
  country: "United States",
  historicalYear: 1930,
  presentYear: 2020,
  showPersonCard: true,
  contentNote:
    "This chapter quotes United States census instructions and Louisiana court records that use historical racial terms, some of them now offensive. These terms appear only inside quotation marks, as the sources’ own wording.",
  photograph: {
    id: "louisiana-photograph",
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
      id: "louisiana-item-1",
      kind: "document",
      status: "sourced",
      image: null,
      alt: slot("short alternative text"),
      longDescription: slot("longer description"),
      transcription:
        "150. Column 12. Color or race.-Write “W” for white; “Neg” for Negro; “Mex” for Mexican; “In” for Indian; “Ch” for Chinese; “Jp” for Japanese; “Fil” for Filipino; “Hin” for Hindu; and “Kor” for Korean. For a person of any other race, write the race in full.\n151. Negroes.-A person of mixed white and Negro blood should be returned as a Negro, no matter how small the percentage of Negro blood. Both black and mulatto persons are to be returned as Negroes, without distinction. A person of mixed Indian and Negro blood should be returned a Negro, unless the Indian blood predominates and the status as an Indian is generally accepted in the community.\n[...]\n155. Other mixed races.-Any mixture of white and nonwhite should be reported according to the nonwhite parent. [...]",
      provenance: {
        creator:
          "United States federal census authorities for the 1930 census; the issuing office is not named on the IPUMS transcription.",
        title: "1930 Census: Enumerator Instructions, paragraphs 150, 151 and 155 (Column 12, “Color or race”)",
        holder: "IPUMS USA (online transcription)",
        reference: "Paragraphs 150, 151 and 155; https://usa.ipums.org/usa/voliii/inst1930.shtml",
        rights:
          "The IPUMS USA website carries a general site copyright notice; no separate rights statement is given for the instruction text. Check before reuse.",
        alterations: slot("any alteration you made"),
      },
      contentNote: null,
      annotations: [
        {
          id: "louisiana-item-1-annotation-1",
          text: "These paragraphs are addressed to the enumerator, who wrote the entry in column 12 of the population schedule. For a person “of mixed white and Negro blood” the answer is fixed in advance, whatever the share.",
        },
        {
          id: "louisiana-item-1-annotation-2",
          text: "The next paragraph, on the category the instructions call “Indian,” allows an exception where a person “is regarded as a white person by those in the community where he lives.” Paragraph 151 offers no such exception for a person “of mixed white and Negro blood.”",
        },
      ],
      gapNote:
        "No image has been added yet; the full text of the instructions can be read at IPUMS USA, https://usa.ipums.org/usa/voliii/inst1930.shtml.",
    },
    {
      id: "louisiana-item-2",
      kind: "document",
      status: "sourced",
      image: null,
      alt: slot("short alternative text"),
      longDescription: slot("longer description"),
      transcription:
        "There is a word in the English language which does express the meaning of a person of mixed negro and other blood [...]. That word is the word “colored.” The word “colored,” when used to designate the race of a person, is unmistakable, at least in the United States. It means a person of negro blood pure or mixed; and the term applies no matter what may be the proportions of the admixture, so long as the negro blood is traceable. [...] In our Constitution and laws, when it has become necessary to use a word comprehending within its meaning both negroes, properly so-called, and persons of mixed negro blood, the term “colored” has invariably been used.",
      provenance: {
        creator: "Supreme Court of Louisiana (majority opinion; Land and Nicholls, JJ., dissenting)",
        title: "State v. Treadaway et al., 126 La. 300, 52 So. 500 (La. 1910), decided 25 April 1910",
        holder: "Caselaw Access Project (digitised copy of the Louisiana Reports)",
        reference: "126 La. 300; 52 So. 500; No. 18,149",
        rights: "Rights not stated by the holder; check before reuse.",
        alterations: slot("any alteration you made"),
      },
      contentNote: null,
      annotations: [
        {
          id: "louisiana-item-2-annotation-1",
          text: "Louisiana’s marriage law used the same word. In this 1910 opinion the court quoted the miscegenation law (Act No. 54 of 1894) as providing that “marriage between white persons and persons of color is prohibited.” Civil Code article 94 still carried that wording after 1930: the Louisiana Supreme Court described it in Sunseri v. Cassagne (1938) as one that “prohibits the marriage of white persons and persons of color,” and the Court of Appeal quoted it in part in Ryan v. Barthelmy (1947).",
        },
        {
          id: "louisiana-item-2-annotation-2",
          text: "The case was a prosecution under Act No. 87 of 1908, which used the words “negro or black race”; the court affirmed an acquittal, setting those words apart from “colored,” which it read as reaching any traceable African ancestry.",
        },
      ],
      gapNote:
        "No image has been added yet; the opinion can be read in the Caselaw Access Project’s digitised copy at https://static.case.law/la/126/html/0299-01.html.",
    },
  ],
  basis: {
    quote:
      "A person of mixed white and Negro blood should be returned as a Negro, no matter how small the percentage of Negro blood.",
    citation: ipumsCitation,
    explanation:
      "The 1930 instructions speak to the enumerator, who wrote the race entry; these paragraphs give the person counted no part in it. Paragraph 151 made ancestry the test for a person “of mixed white and Negro blood” and fixed the answer in advance: any share at all led to “Neg.” Paragraphs 151 and 152 show the instructions could give weight to how a community regarded someone, but only where the category they call “Indian” was involved, never for this mixture. Louisiana’s Supreme Court read the state’s word “colored” the same way, as covering anyone whose African ancestry was “traceable.” The paragraphs do not say how the enumerator was to learn a person’s ancestry.",
    cardFactsUsed: ["fact-1"],
  },
  outcome: {
    text: "Fact 1 decides the case. One of four grandparents was recorded as of African descent, so under paragraph 151 the person is “of mixed white and Negro blood,” and such a person “should be returned as a Negro, no matter how small the percentage of Negro blood.” The enumerator would write “Neg” in column 12. Facts 2 and 3 do not count: the rule has no place for the word “mixed” or for standing among neighbours. Fact 4 offers no race entry to consult. These paragraphs do not say how the enumerator was to learn of the grandparent.",
    confidence:
      "High. Paragraph 151 names this mixture in so many words; the only open point is whether the enumerator knew of the grandparent, which the card cannot settle.",
    citation: ipumsCitation,
  },
  changeOfDate: {
    historicalItemId: "louisiana-item-1",
    presentItemId: "louisiana-present-instrument",
  },
  present: {
    instrument: {
      id: "louisiana-present-instrument",
      kind: "document",
      status: "sourced",
      image: null,
      alt: slot("short alternative text"),
      longDescription: slot("longer description"),
      transcription:
        "9. What is Person 1’s race?\nMark [X] one or more boxes AND print origins.\nWhite – Print, for example, German, Irish, English, Italian, Lebanese, Egyptian, etc.\nBlack or African Am. – Print, for example, African American, Jamaican, Haitian, Nigerian, Ethiopian, Somali, etc.\nAmerican Indian or Alaska Native – Print name of enrolled or principal tribe(s), for example, Navajo Nation, Blackfeet Tribe, Mayan, Aztec, Native Village of Barrow Inupiat Traditional Government, Nome Eskimo Community, etc.\n[...]\nSome other race – Print race or origin.",
      provenance: {
        creator: "U.S. Census Bureau, U.S. Department of Commerce",
        title: "2020 Census informational questionnaire, Question 9 (race)",
        holder: "U.S. Census Bureau",
        reference: "Form DI-Q1 (05-31-2019); OMB No. 0607-1006",
        rights: "Rights not stated by the holder; check before reuse.",
        alterations: slot("any alteration you made"),
      },
      contentNote: null,
      annotations: [
        {
          id: "louisiana-present-instrument-annotation-1",
          text: "The cut omits the boxes and write-in lines for Asian and Pacific Islander groups. A note above Question 8 asks for answers to both the Hispanic-origin and race questions and states that “For this census, Hispanic origins are not races.”",
        },
      ],
      gapNote:
        "No image has been added yet; the questionnaire can be read as a PDF from the U.S. Census Bureau at https://www2.census.gov/programs-surveys/decennial/2020/technical-documentation/questionnaires-and-instructions/questionnaires/2020-informational-questionnaire-english_DI-Q1.pdf.",
    },
    basis: {
      quote:
        "An individual’s response to the race question is based upon self-identification. The Census Bureau does not tell individuals which boxes to mark or what heritage to write in.",
      citation: censusRaceCitation,
      explanation:
        "In 2020 the question is put to the household. The Census Bureau states that the answer rests on self-identification and that it does not direct which boxes to mark; the form asks the respondent to mark “one or more boxes AND print origins.” The Bureau describes its categories as “generally” reflecting “a social definition of race” rather than a biological one, and it classifies written answers under the Office of Management and Budget’s standards. Nothing in the question asks for ancestry records or papers. One limit remains: the form is completed by one person in the household, who is asked to “provide information for each person living here,” so the answer may be another household member’s account.",
      cardFactsUsed: ["fact-2"],
    },
    outcome: {
      text: "Fact 2 decides the case, as far as the form allows. “Mixed” is not one of the printed boxes, so the person, or the household member filling in the form, would choose how to express it: for example by marking both “White” and “Black or African Am.” and printing origins, or by marking “Some other race” and printing “mixed.” Fact 1 matters only if the respondent chooses to draw on it. Facts 3 and 4 play no part. Which boxes would be marked cannot be known from the card; what is settled is that the choice of answer belongs to the respondent, though the Census Bureau classifies what is written.",
      confidence:
        "Moderate. The sources make clear that the answer is self-identified, but the card does not say which of the permitted ways of reporting “mixed” the person would choose.",
      citation: censusRaceCitation,
    },
    reflection:
      "Between 1930 and 2020 the decision moved from the census taker to the respondent. In 1930 paragraph 151 told the enumerator to record a person “of mixed white and Negro blood” as “Neg,” whatever the share, and Louisiana’s Supreme Court read the state’s word “colored” the same way. The person’s own description and standing among neighbours had no bearing; only ancestry counted. In 2020 the Census Bureau says the answer rests on self-identification and allows more than one box, so the word “mixed” can be written in by the person, though the Bureau then classifies what is written. What did not change is that the state still asks the question and still sorts every answer into a fixed list of categories. The grandparent on paper now matters only if the person chooses to report it.",
  },
};

import type { PersonCard } from "./types";

// The four facts are fictional. Each reason points to the chapter whose cited source turns on that fact.
export const person: PersonCard = {
  facts: [
    {
      id: "fact-1",
      label: "Ancestry on paper",
      value:
        "One of four grandparents was recorded as of African descent; the other three were recorded as European.",
      reason:
        "The 1930 United States census instructions decided by ancestry, whatever the share (Louisiana chapter).",
    },
    {
      id: "fact-2",
      label: "How they describe themself",
      value: "When asked, says “mixed”.",
      reason:
        "The 2020 instruments in Louisiana, São Paulo and Johannesburg each record what a person declares (see those chapters).",
    },
    {
      id: "fact-3",
      label: "Standing among neighbours",
      value:
        "Lives and works among people of several groups. No single community claims them as its own or shuts them out.",
      reason:
        "South Africa’s Population Registration Act of 1950 asked whether a person was “generally accepted” as belonging to a group (Johannesburg chapter).",
    },
    {
      id: "fact-4",
      label: "Papers held",
      value: "A birth certificate naming both parents, with no entry for race or colour.",
      reason:
        "Where a declaration is refused or inaccurate, South Africa’s 2014 employment equity regulations let an employer turn to existing records (Johannesburg chapter).",
    },
  ],
  fictionStatement:
    "This person is fictional. No real individual, family or record is described, and the card gives no physical description.",
};

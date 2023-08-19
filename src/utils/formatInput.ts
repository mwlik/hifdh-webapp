export default function formatInput(input: string) {
  const arabicPunctuation = [
    "؟",
    "،",
    "؛",
    ":",
    ".",
    "!",
    "\\(",
    "\\)",
    "\\[",
    "\\]",
    "\\{",
    "\\}",
    "«",
    "»",
    "‘",
    "’",
    "“",
    "”",
    "ـ",
    "–",
    "—",
    "…",
  ];

  const arabicHarakat = ["َ", "ُ", "ِ", "ْ", "ّ", "ٌ", "ً", "ٍ"];

  // Replace multiple spaces with a single space
  const singleSpace = input.replace(/\s+/g, " ");

  let formattedInput = singleSpace;

  // Remove punctuation signs
  formattedInput = formattedInput
    .split("")
    .filter((char) => !arabicPunctuation.includes(char))
    .join("");

  // Remove Harakat signs
  arabicHarakat.forEach((haraka) => {
    formattedInput = formattedInput.replace(new RegExp(haraka, "g"), "");
  });

  return formattedInput;
}

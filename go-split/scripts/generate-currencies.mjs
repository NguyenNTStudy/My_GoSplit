// Generates src/domain/currencies.json: currencies in current use (R71) with names, symbols,
// minor units and rounding steps (R18, R19), the countries using each, and each region's main
// currency for picking a default (R70). The JSON is committed so every browser sees the same list.
//
// Sources: CLDR supplemental currencyData (cldr-core) for which currencies are legal tender where
// and how many decimals they use; the ICU data in Node's Intl for names and symbols.
// Run: npm run currencies:generate
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { currencyData } =
  require("cldr-core/supplemental/currencyData.json").supplemental;
const cldrVersion = require("cldr-core/package.json").version;

const OUT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "domain",
  "currencies.json",
);

// R71: shown after the account's recent currencies when the search box is empty.
const POPULAR = ["VND", "USD", "EUR", "THB", "JPY", "KRW", "SGD", "CNY"];

// R19: currencies with decimals round to 0.5. Zero-decimal currencies round to 1 unless listed:
// VND, JPY, KRW come from R19; IDR and LAK are common destinations whose smallest notes and
// coins make 1-unit precision meaningless.
const ZERO_DECIMAL_STEPS = {
  VND: "1000",
  JPY: "10",
  KRW: "100",
  IDR: "100",
  LAK: "1000",
};
const FRACTIONAL_STEP = "0.5";

const isCurrent = (info) => !info._to && info._tender !== "false";

// Region -> currencies that are legal tender there today, main currency first (CLDR order).
const regionCurrencies = new Map();
for (const [region, entries] of Object.entries(currencyData.region)) {
  if (!/^[A-Z]{2}$/.test(region)) continue;
  const current = entries
    .flatMap((entry) => Object.entries(entry))
    .filter(([, info]) => isCurrent(info))
    .map(([code]) => code);
  if (current.length) regionCurrencies.set(region, current);
}

const regionNames = {
  vi: new Intl.DisplayNames(["vi"], { type: "region" }),
  en: new Intl.DisplayNames(["en"], { type: "region" }),
};
const currencyNames = {
  vi: new Intl.DisplayNames(["vi"], { type: "currency" }),
  en: new Intl.DisplayNames(["en"], { type: "currency" }),
};
const symbolOf = (code, currencyDisplay) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency: code,
    currencyDisplay,
  })
    .formatToParts(0)
    .find((part) => part.type === "currency").value;
const digitsOf = (code) =>
  Number(
    (currencyData.fractions[code] ?? currencyData.fractions.DEFAULT)._digits,
  );

const countriesByCurrency = new Map();
for (const [region, codes] of regionCurrencies) {
  // EU is a CLDR region but not a country; it only adds EUR, which the member states have anyway.
  if (regionNames.en.of(region) === region || region === "EU") continue;
  for (const code of codes)
    countriesByCurrency.set(code, [
      ...(countriesByCurrency.get(code) ?? []),
      region,
    ]);
}

const currencies = [...countriesByCurrency.keys()]
  .filter((code) => Intl.supportedValuesOf("currency").includes(code))
  .sort()
  .map((code) => {
    const minorUnits = digitsOf(code);
    return {
      code,
      minorUnits,
      roundingStep:
        minorUnits > 0 ? FRACTIONAL_STEP : (ZERO_DECIMAL_STEPS[code] ?? "1"),
      symbol: symbolOf(code, "symbol"),
      narrowSymbol: symbolOf(code, "narrowSymbol"),
      name: { vi: currencyNames.vi.of(code), en: currencyNames.en.of(code) },
      countries: countriesByCurrency.get(code).sort(),
    };
  });

const listed = new Set(currencies.map((c) => c.code));
for (const code of [...POPULAR, ...Object.keys(ZERO_DECIMAL_STEPS)]) {
  if (!listed.has(code))
    throw new Error(`${code} is not a current currency in CLDR ${cldrVersion}`);
}

const countries = Object.fromEntries(
  [...new Set(currencies.flatMap((c) => c.countries))]
    .sort()
    .map((region) => [
      region,
      { vi: regionNames.vi.of(region), en: regionNames.en.of(region) },
    ]),
);
const regionCurrency = Object.fromEntries(
  [...regionCurrencies]
    .filter(([, codes]) => listed.has(codes[0]))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([region, codes]) => [region, codes[0]]),
);

// One entry per line keeps diffs readable when the data is regenerated.
const lines = (entries) =>
  entries.map((entry) => `    ${JSON.stringify(entry)}`).join(",\n");
const json = `{
  "source": ${JSON.stringify({ cldr: cldrVersion, icu: process.versions.icu })},
  "popular": ${JSON.stringify(POPULAR)},
  "currencies": [
${lines(currencies)}
  ],
  "countries": {
${Object.entries(countries)
  .map(([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v)}`)
  .join(",\n")}
  },
  "regionCurrency": ${JSON.stringify(regionCurrency)}
}
`;
JSON.parse(json);
writeFileSync(OUT, json);
process.stdout.write(
  `${currencies.length} currencies, ${Object.keys(countries).length} countries -> ${path.relative(process.cwd(), OUT)}\n`,
);

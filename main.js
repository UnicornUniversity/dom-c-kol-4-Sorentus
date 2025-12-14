// --------------------
// Data
// --------------------
const maleNames = [
    "Jan","Petr","Jakub","Tomáš","Lukáš","Matěj","Adam","Ondřej","Martin","Filip",
    "Vojtěch","Marek","Jiří","Karel","Michal","Daniel","David","Josef","Jaroslav","Roman",
    "Milan","Radek","Aleš","Patrik","Dominik","Šimon","Samuel","Robin","Vladimír","Radim",
    "Hynek","Vít","Sebastian","Erik","Richard","Rudolf","Bohuslav","Oldřich","Pavel","Libor",
    "Igor","Stanislav","Marcel","Eduard","Břetislav","Leoš","Alan","Vilém","Čeněk","Vlastimil"
];

const maleSurnames = [
    "Novák","Svoboda","Novotný","Dvořák","Černý","Procházka","Kučera","Veselý","Horák","Němec",
    "Marek","Pokorný","Král","Růžička","Beneš","Fiala","Sedláček","Doležal","Zeman","Kolář",
    "Urban","Kopecký","Čermák","Vaněk","Kříž","Pospíšil","Musil","Šimek","Říha","Steiner",
    "Moravec","Bláha","Havlíček","Matoušek","Hlavatý","Krejčí","Beran","Bartoš","Straka","Ouředník",
    "Vávra","Sýkora","Tichý","Vondráček","Kubík","Slavík","Ptáček","Holub","Hájek","Vacek"
];

const femaleNames = [
    "Lucie","Eva","Anna","Marie","Tereza","Adéla","Eliška","Natálie","Kristýna","Veronika",
    "Karolína","Barbora","Klára","Nikola","Markéta","Kateřina","Hana","Jana","Monika","Alena",
    "Rozálie","Sofie","Magdaléna","Gabriela","Simona","Denisa","Petra","Sandra","Zuzana","Nela",
    "Linda","Lenka","Pavla","Ivana","Karina","Viktorie","Amálie","Beáta","Laura","Stela",
    "Olga","Šárka","Blanka","Aneta","Michaela","Renata","Radka","Andrea","Sabina","Helena"
];

const femaleSurnames = [
    "Nováková","Svobodová","Novotná","Dvořáková","Černá","Procházková","Kučerová","Veselá","Horáková","Němcová",
    "Marková","Pokorná","Králová","Růžičková","Benešová","Fialová","Sedláčková","Doležalová","Zemanová","Kolářová",
    "Urbanová","Kopecká","Čermáková","Vaňková","Křížová","Pospíšilová","Musilová","Šimková","Říhová","Steinerová",
    "Moravcová","Bláhová","Havlíčková","Matoušková","Hlavatá","Krejčíová","Beranová","Bartošová","Straková","Ouředníková",
    "Vávrová","Sýkorová","Tichá","Vondráčková","Kubíková","Slavíková","Ptáčková","Holubová","Hájeková","Vacková"
];

const workloads = [10, 20, 30, 40];

// --------------------
// Pomocné funkce
// --------------------

/**
 * Vrací náhodný prvek z pole.
 * @param {Array} array
 * @returns {any} náhodný prvek
 */
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Vrací náhodné pohlaví "male" nebo "female"
 * @returns {string}
 */
function getRandomGender() {
    return Math.random() < 0.5 ? "male" : "female";
}

/**
 * Vrací náhodný workload z dostupných hodnot
 * @returns {number}
 */
function randomWorkload() {
    return getRandomElement(workloads);
}

/**
 * Vygeneruje unikátní náhodné datum narození mezi minAge a maxAge
 * @param {number} minAge
 * @param {number} maxAge
 * @param {Set} usedDates
 * @returns {string} ISO string
 */
function randomBirthday(minAge, maxAge, usedDates) {
    const now = Date.now();
    const maxBirth = now - minAge * 365.25 * 24 * 60 * 60 * 1000;
    const minBirth = now - maxAge * 365.25 * 24 * 60 * 60 * 1000;

    let birthTime;
    do {
        birthTime = Math.floor(minBirth + Math.random() * (maxBirth - minBirth));
    } while (usedDates.has(birthTime));

    usedDates.add(birthTime);
    return new Date(birthTime).toISOString();
}

/**
 * Spočítá věk podle data narození
 * @param {string} birthdate ISO string
 * @returns {number} věk
 */
function calculateAge(birthdate) {
    const birth = new Date(birthdate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    if (
        today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
    ) {
        age--;
    }
    return age;
}

// --------------------
// Hlavní funkce aplikace
// --------------------

/**
 * Generuje seznam zaměstnanců se všemi údaji
 * @param {object} dtoIn {count: number, age: {min, max}}
 * @returns {Array} pole zaměstnanců
 */
export function generateEmployeeData(dtoIn) {
    const { count, age } = dtoIn;
    const { min, max } = age;

    if (min > max) throw new Error("Špatně zadaný věkový interval");

    const employees = [];
    const usedDates = new Set();

    for (let i = 0; i < count; i++) {
        const gender = getRandomGender();

        employees.push({
            gender,
            name: gender === "male" ? getRandomElement(maleNames) : getRandomElement(femaleNames),
            surname: gender === "male" ? getRandomElement(maleSurnames) : getRandomElement(femaleSurnames),
            workload: randomWorkload(),
            birthdate: randomBirthday(min, max, usedDates)
        });
    }

    return employees;
}

/**
 * Vypočítá statistiky ze seznamu zaměstnanců
 * @param {Array} employees
 * @returns {object} statistiky zaměstnanců
 */
export function getEmployeeStatistics(employees) {
    const ages = [];
    const workloadsArr = [];

    let workload10 = 0;
    let workload20 = 0;
    let workload30 = 0;
    let workload40 = 0;

    let womenWorkloadSum = 0;
    let womenCount = 0;

    for (const emp of employees) {
        const age = calculateAge(emp.birthdate);
        ages.push(age);
        workloadsArr.push(emp.workload);

        if (emp.workload === 10) workload10++;
        if (emp.workload === 20) workload20++;
        if (emp.workload === 30) workload30++;
        if (emp.workload === 40) workload40++;

        if (emp.gender === "female") {
            womenWorkloadSum += emp.workload;
            womenCount++;
        }
    }

    ages.sort((a, b) => a - b);
    workloadsArr.sort((a, b) => a - b);

    const total = employees.length;

    const averageAge =
        Math.round((ages.reduce((s, a) => s + a, 0) / total) * 10) / 10;

    const median = (arr) =>
        arr.length % 2 === 0
            ? (arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2
            : arr[Math.floor(arr.length / 2)];

    return {
        total,
        workload10,
        workload20,
        workload30,
        workload40,
        averageAge,
        minAge: ages[0],
        maxAge: ages[ages.length - 1],
        medianAge: median(ages),
        medianWorkload: median(workloadsArr),
        averageWomenWorkload: womenCount ? womenWorkloadSum / womenCount : 0,
        sortedByWorkload: [...employees].sort((a, b) => a.workload - b.workload)
    };
}

/**
 * Hlavní funkce aplikace
 * Volá generování zaměstnanců a výpočet statistik
 * @param {object} dtoIn {count: number, age: {min, max}}
 * @returns {object} statistiky zaměstnanců
 */
export function main(dtoIn) {
    const employees = generateEmployeeData(dtoIn);
    return getEmployeeStatistics(employees);
}

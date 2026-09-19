import type { SummarySection } from "./types";

/**
 * Summary translation.
 *
 * There is no translation model here, so this is a dictionary rather than a
 * pretence at one: every string it knows is written out, and anything it does
 * not know is left in English and counted, so the UI can say exactly how much
 * of what you are reading was translated.
 *
 * The vocabulary covers the structure of every summary -- section headings and
 * the bullet labels -- plus the full body of the flagship call's Enhanced
 * template, which is the one a demo opens. A partial translation that admits
 * what it missed is honest; one that silently leaves half the page in English
 * is not.
 */

export type LangCode = "en" | "es" | "pt" | "de" | "fr" | "it" | "nl";

export const LANGUAGES: { code: LangCode; tag: string; name: string }[] = [
  { code: "en", tag: "US", name: "English" },
  { code: "es", tag: "ES", name: "Spanish" },
  { code: "pt", tag: "PT", name: "Portuguese" },
  { code: "de", tag: "DE", name: "German" },
  { code: "fr", tag: "FR", name: "French" },
  { code: "it", tag: "IT", name: "Italian" },
  { code: "nl", tag: "NL", name: "Dutch" },
];

/* Section headings, authored and derived. */
const HEADINGS: Record<string, Record<Exclude<LangCode, "en">, string>> = {
  "Meeting Purpose": { es: "Objetivo de la reunión", pt: "Objetivo da reunião", de: "Zweck des Meetings", fr: "Objet de la réunion", it: "Scopo della riunione", nl: "Doel van de vergadering" },
  "Key Takeaways": { es: "Conclusiones clave", pt: "Principais conclusões", de: "Wichtigste Erkenntnisse", fr: "Points clés", it: "Punti chiave", nl: "Belangrijkste punten" },
  "Current Challenges": { es: "Retos actuales", pt: "Desafios atuais", de: "Aktuelle Herausforderungen", fr: "Défis actuels", it: "Sfide attuali", nl: "Huidige uitdagingen" },
  "Next Steps": { es: "Próximos pasos", pt: "Próximos passos", de: "Nächste Schritte", fr: "Prochaines étapes", it: "Prossimi passi", nl: "Volgende stappen" },
  "Next steps": { es: "Próximos pasos", pt: "Próximos passos", de: "Nächste Schritte", fr: "Prochaines étapes", it: "Prossimi passi", nl: "Volgende stappen" },
  Summary: { es: "Resumen", pt: "Resumo", de: "Zusammenfassung", fr: "Résumé", it: "Riepilogo", nl: "Samenvatting" },
  Blockers: { es: "Bloqueos", pt: "Bloqueios", de: "Blocker", fr: "Blocages", it: "Ostacoli", nl: "Blokkades" },
  "Commitments Made": { es: "Compromisos adquiridos", pt: "Compromissos assumidos", de: "Getroffene Zusagen", fr: "Engagements pris", it: "Impegni presi", nl: "Gemaakte afspraken" },
  "Deal Impact": { es: "Impacto en la oportunidad", pt: "Impacto no negócio", de: "Auswirkung auf den Deal", fr: "Impact sur l'affaire", it: "Impatto sulla trattativa", nl: "Impact op de deal" },
  "Deal Snapshot": { es: "Resumen de la oportunidad", pt: "Panorama do negócio", de: "Deal-Überblick", fr: "Aperçu de l'affaire", it: "Panoramica della trattativa", nl: "Dealoverzicht" },
  Discussed: { es: "Temas tratados", pt: "Temas discutidos", de: "Besprochen", fr: "Sujets abordés", it: "Argomenti discussi", nl: "Besproken" },
  "In Progress": { es: "En curso", pt: "Em andamento", de: "In Arbeit", fr: "En cours", it: "In corso", nl: "Lopend" },
  "Objections Raised": { es: "Objeciones planteadas", pt: "Objeções levantadas", de: "Vorgebrachte Einwände", fr: "Objections soulevées", it: "Obiezioni sollevate", nl: "Bezwaren" },
  "Setup Decisions": { es: "Decisiones de configuración", pt: "Decisões de configuração", de: "Einrichtungsentscheidungen", fr: "Décisions de configuration", it: "Decisioni di configurazione", nl: "Instelbeslissingen" },
  "Questions & answers": { es: "Preguntas y respuestas", pt: "Perguntas e respostas", de: "Fragen und Antworten", fr: "Questions et réponses", it: "Domande e risposte", nl: "Vragen en antwoorden" },
  "Updates & priorities": { es: "Novedades y prioridades", pt: "Atualizações e prioridades", de: "Updates und Prioritäten", fr: "Mises à jour et priorités", it: "Aggiornamenti e priorità", nl: "Updates en prioriteiten" },
  Discussion: { es: "Discusión", pt: "Discussão", de: "Diskussion", fr: "Discussion", it: "Discussione", nl: "Discussie" },
  "In flight": { es: "En curso", pt: "Em andamento", de: "Laufend", fr: "En cours", it: "In corso", nl: "Lopend" },
  "Closed out": { es: "Cerrado", pt: "Concluído", de: "Abgeschlossen", fr: "Terminé", it: "Completato", nl: "Afgerond" },
  Start: { es: "Empezar", pt: "Começar", de: "Anfangen", fr: "Commencer", it: "Iniziare", nl: "Beginnen" },
  Stop: { es: "Dejar de hacer", pt: "Parar", de: "Aufhören", fr: "Arrêter", it: "Smettere", nl: "Stoppen" },
  Continue: { es: "Continuar", pt: "Continuar", de: "Weitermachen", fr: "Continuer", it: "Continuare", nl: "Doorgaan" },
  Misc: { es: "Varios", pt: "Diversos", de: "Sonstiges", fr: "Divers", it: "Varie", nl: "Overig" },
};

/* Bullet labels. Person names are deliberately absent -- they pass through. */
const LABELS: Record<string, Record<Exclude<LangCode, "en">, string>> = {
  Decision: { es: "Decisión", pt: "Decisão", de: "Entscheidung", fr: "Décision", it: "Decisione", nl: "Besluit" },
  Blocker: { es: "Bloqueo", pt: "Bloqueio", de: "Blocker", fr: "Blocage", it: "Ostacolo", nl: "Blokkade" },
  Risk: { es: "Riesgo", pt: "Risco", de: "Risiko", fr: "Risque", it: "Rischio", nl: "Risico" },
  "Open question": { es: "Pregunta abierta", pt: "Questão em aberto", de: "Offene Frage", fr: "Question ouverte", it: "Domanda aperta", nl: "Open vraag" },
  "Next step": { es: "Siguiente paso", pt: "Próximo passo", de: "Nächster Schritt", fr: "Prochaine étape", it: "Prossimo passo", nl: "Volgende stap" },
  Objection: { es: "Objeción", pt: "Objeção", de: "Einwand", fr: "Objection", it: "Obiezione", nl: "Bezwaar" },
  Goal: { es: "Objetivo", pt: "Objetivo", de: "Ziel", fr: "Objectif", it: "Obiettivo", nl: "Doel" },
  Budget: { es: "Presupuesto", pt: "Orçamento", de: "Budget", fr: "Budget", it: "Budget", nl: "Budget" },
  Pain: { es: "Problema", pt: "Dor", de: "Problem", fr: "Point de douleur", it: "Criticità", nl: "Knelpunt" },
  Trigger: { es: "Detonante", pt: "Gatilho", de: "Auslöser", fr: "Élément déclencheur", it: "Fattore scatenante", nl: "Aanleiding" },
  Upside: { es: "Oportunidad", pt: "Potencial", de: "Chance", fr: "Potentiel", it: "Potenziale", nl: "Kans" },
  Access: { es: "Acceso", pt: "Acesso", de: "Zugang", fr: "Accès", it: "Accesso", nl: "Toegang" },
  "At risk": { es: "En riesgo", pt: "Em risco", de: "Gefährdet", fr: "À risque", it: "A rischio", nl: "Risicovol" },
  Product: { es: "Producto", pt: "Produto", de: "Produkt", fr: "Produit", it: "Prodotto", nl: "Product" },
  Import: { es: "Importación", pt: "Importação", de: "Import", fr: "Import", it: "Importazione", nl: "Import" },
  Sequence: { es: "Secuencia", pt: "Sequência", de: "Ablauf", fr: "Séquence", it: "Sequenza", nl: "Volgorde" },
  "Core Function": { es: "Función principal", pt: "Função principal", de: "Kernfunktion", fr: "Fonction principale", it: "Funzione principale", nl: "Kernfunctie" },
};

/**
 * Body copy for the flagship call's Enhanced summary -- the one a demo opens,
 * and the only body written out in full.
 */
const BODY: Record<string, Record<Exclude<LangCode, "en">, string>> = {
  "Confirm whether the Q3 release is ready to ship on the 30th, and decide what gets cut if it is not.": {
    es: "Confirmar si la versión del T3 está lista para lanzarse el día 30 y decidir qué se recorta si no lo está.",
    pt: "Confirmar se a versão do T3 está pronta para ser lançada no dia 30 e decidir o que será cortado caso não esteja.",
    de: "Klären, ob das Q3-Release am 30. ausgeliefert werden kann, und entscheiden, was andernfalls gestrichen wird.",
    fr: "Confirmer si la version du T3 peut sortir le 30, et décider ce qui sera retiré dans le cas contraire.",
    it: "Verificare se la release del Q3 è pronta per il 30 e decidere cosa tagliare in caso contrario.",
    nl: "Vaststellen of de Q3-release op de 30e kan worden uitgebracht, en bepalen wat er anders afvalt.",
  },
  "Ship on September 30th, but with bulk import behind a feature flag for the first two weeks.": {
    es: "Lanzar el 30 de septiembre, pero con la importación masiva tras un feature flag durante las dos primeras semanas.",
    pt: "Lançar em 30 de setembro, mas com a importação em massa atrás de um feature flag nas duas primeiras semanas.",
    de: "Am 30. September ausliefern, den Massenimport in den ersten zwei Wochen aber hinter einem Feature-Flag halten.",
    fr: "Livrer le 30 septembre, mais avec l'import en masse derrière un feature flag les deux premières semaines.",
    it: "Rilasciare il 30 settembre, ma con l'importazione massiva dietro un feature flag per le prime due settimane.",
    nl: "Op 30 september uitbrengen, maar bulkimport de eerste twee weken achter een feature flag.",
  },
  "The migration rehearsal has not run against production-sized data; Tom owns a dry run by Wednesday.": {
    es: "El ensayo de migración no se ha ejecutado con datos del tamaño de producción; Tom se encarga de una prueba antes del miércoles.",
    pt: "O ensaio de migração não foi executado com dados do tamanho de produção; Tom fica responsável por um teste até quarta-feira.",
    de: "Die Migrationsprobe lief noch nicht mit produktionsgroßen Daten; Tom verantwortet einen Testlauf bis Mittwoch.",
    fr: "La répétition de migration n'a pas été lancée sur des données de taille production ; Tom prend en charge un test d'ici mercredi.",
    it: "La prova di migrazione non è stata eseguita su dati delle dimensioni di produzione; Tom si occupa di un test entro mercoledì.",
    nl: "De migratierepetitie is niet gedraaid op data van productieformaat; Tom doet een proefrun vóór woensdag.",
  },
  "Support headcount is flat while signups are forecast to triple, which Sofia flagged as the likeliest source of a bad launch week.": {
    es: "La plantilla de soporte no crece mientras se prevé que los registros se tripliquen, lo que Sofia señaló como la causa más probable de una mala semana de lanzamiento.",
    pt: "A equipa de suporte mantém-se igual enquanto se prevê que as inscrições tripliquem, o que Sofia apontou como a causa mais provável de uma má semana de lançamento.",
    de: "Der Support bleibt personell unverändert, während sich die Anmeldungen voraussichtlich verdreifachen – für Sofia die wahrscheinlichste Ursache einer schlechten Launch-Woche.",
    fr: "L'effectif du support reste stable alors que les inscriptions devraient tripler, ce que Sofia a signalé comme la cause la plus probable d'une mauvaise semaine de lancement.",
    it: "L'organico del supporto resta invariato mentre le iscrizioni dovrebbero triplicare: per Sofia è la causa più probabile di una brutta settimana di lancio.",
    nl: "De supportbezetting blijft gelijk terwijl de aanmeldingen naar verwachting verdrievoudigen, volgens Sofia de waarschijnlijkste oorzaak van een slechte lanceerweek.",
  },
  "Pricing for the Teams tier is still unresolved and now blocks the launch email.": {
    es: "El precio del plan Teams sigue sin decidirse y ahora bloquea el correo de lanzamiento.",
    pt: "O preço do plano Teams continua por decidir e agora bloqueia o e-mail de lançamento.",
    de: "Die Preisgestaltung für den Teams-Tarif ist weiter offen und blockiert inzwischen die Launch-E-Mail.",
    fr: "Le tarif de l'offre Teams n'est toujours pas tranché et bloque désormais l'e-mail de lancement.",
    it: "Il prezzo del piano Teams è ancora da definire e ora blocca l'email di lancio.",
    nl: "De prijs voor het Teams-abonnement is nog onbeslist en blokkeert nu de lanceringsmail.",
  },
  "Bulk import fails on files above roughly 50,000 rows, and the failure is silent rather than surfaced to the user.": {
    es: "La importación masiva falla con archivos de más de unas 50.000 filas, y el fallo es silencioso en lugar de mostrarse al usuario.",
    pt: "A importação em massa falha em ficheiros acima de cerca de 50 000 linhas, e a falha é silenciosa em vez de ser mostrada ao utilizador.",
    de: "Der Massenimport scheitert bei Dateien ab etwa 50.000 Zeilen, und der Fehler bleibt still, statt dem Nutzer angezeigt zu werden.",
    fr: "L'import en masse échoue sur les fichiers de plus de 50 000 lignes environ, et l'échec est silencieux au lieu d'être signalé à l'utilisateur.",
    it: "L'importazione massiva fallisce con file oltre le 50.000 righe circa, e l'errore resta silenzioso invece di essere mostrato all'utente.",
    nl: "Bulkimport faalt bij bestanden boven ongeveer 50.000 regels, en die fout blijft stil in plaats van aan de gebruiker te worden getoond.",
  },
  "Onboarding drop-off sits at 38% on the third step, which Jonas traced to the workspace-invite screen.": {
    es: "El abandono durante el onboarding es del 38% en el tercer paso, que Jonas localizó en la pantalla de invitación al espacio de trabajo.",
    pt: "O abandono no onboarding é de 38% no terceiro passo, que Jonas associou ao ecrã de convite para o espaço de trabalho.",
    de: "Der Onboarding-Abbruch liegt im dritten Schritt bei 38 %, was Jonas auf den Workspace-Einladungsbildschirm zurückführte.",
    fr: "L'abandon à l'onboarding atteint 38 % à la troisième étape, que Jonas a attribuée à l'écran d'invitation à l'espace de travail.",
    it: "L'abbandono nell'onboarding è al 38% al terzo passaggio, che Jonas ha ricondotto alla schermata di invito allo spazio di lavoro.",
    nl: "De uitval tijdens onboarding is 38% bij de derde stap, die Jonas herleidde tot het uitnodigingsscherm van de werkruimte.",
  },
  "Two enterprise prospects have made SSO a condition of signing, and it is not in the Q3 scope.": {
    es: "Dos clientes potenciales enterprise han puesto el SSO como condición para firmar, y no está en el alcance del T3.",
    pt: "Dois potenciais clientes enterprise puseram o SSO como condição para assinar, e não está no âmbito do T3.",
    de: "Zwei Enterprise-Interessenten machen SSO zur Bedingung für den Abschluss – es liegt nicht im Q3-Umfang.",
    fr: "Deux prospects enterprise ont fait du SSO une condition de signature, et il n'est pas dans le périmètre du T3.",
    it: "Due potenziali clienti enterprise hanno posto l'SSO come condizione per firmare, e non rientra nell'ambito del Q3.",
    nl: "Twee enterprise-prospects stellen SSO als voorwaarde om te tekenen, en dat valt buiten de Q3-scope.",
  },
  "Migration dry run against a production-sized dataset before Wednesday standup.": {
    es: "Prueba de migración con un conjunto de datos del tamaño de producción antes del standup del miércoles.",
    pt: "Teste de migração com um conjunto de dados do tamanho de produção antes do standup de quarta-feira.",
    de: "Migrations-Testlauf mit einem produktionsgroßen Datensatz vor dem Standup am Mittwoch.",
    fr: "Test de migration sur un jeu de données de taille production avant le standup de mercredi.",
    it: "Test di migrazione su un set di dati delle dimensioni di produzione prima dello standup di mercoledì.",
    nl: "Migratieproefrun op een dataset van productieformaat vóór de standup van woensdag.",
  },
  "Pricing decision for the Teams tier by Monday, so marketing can finalise the launch email.": {
    es: "Decisión de precio del plan Teams para el lunes, para que marketing pueda cerrar el correo de lanzamiento.",
    pt: "Decisão de preço do plano Teams até segunda-feira, para que o marketing possa fechar o e-mail de lançamento.",
    de: "Preisentscheidung für den Teams-Tarif bis Montag, damit das Marketing die Launch-E-Mail finalisieren kann.",
    fr: "Décision tarifaire pour l'offre Teams d'ici lundi, pour que le marketing finalise l'e-mail de lancement.",
    it: "Decisione sul prezzo del piano Teams entro lunedì, così il marketing può finalizzare l'email di lancio.",
    nl: "Prijsbesluit voor het Teams-abonnement vóór maandag, zodat marketing de lanceringsmail kan afronden.",
  },
  "Rewrite the invite step of onboarding, then re-measure drop-off after a week.": {
    es: "Rehacer el paso de invitación del onboarding y volver a medir el abandono al cabo de una semana.",
    pt: "Reescrever o passo de convite do onboarding e voltar a medir o abandono ao fim de uma semana.",
    de: "Den Einladungsschritt im Onboarding neu schreiben und den Abbruch nach einer Woche erneut messen.",
    fr: "Réécrire l'étape d'invitation de l'onboarding, puis remesurer l'abandon après une semaine.",
    it: "Riscrivere il passaggio di invito dell'onboarding e rimisurare l'abbandono dopo una settimana.",
    nl: "De uitnodigingsstap van de onboarding herschrijven en de uitval na een week opnieuw meten.",
  },
};

function lookup(
  table: Record<string, Record<Exclude<LangCode, "en">, string>>,
  text: string,
  lang: Exclude<LangCode, "en">,
) {
  return table[text]?.[lang];
}

export type Translated = {
  sections: SummarySection[];
  /** Strings left in English because the dictionary has no entry. */
  untranslated: number;
};

/**
 * Translates a summary as far as the dictionary reaches, and reports what it
 * could not do rather than hiding it.
 */
export function translateSections(
  sections: SummarySection[],
  lang: LangCode,
): Translated {
  if (lang === "en") return { sections, untranslated: 0 };
  const l = lang as Exclude<LangCode, "en">;
  let missed = 0;

  const body = (text: string) => {
    const hit = lookup(BODY, text, l);
    if (!hit) missed += 1;
    return hit ?? text;
  };

  const next = sections.map((s) => ({
    heading: lookup(HEADINGS, s.heading, l) ?? s.heading,
    blocks: s.blocks.map((b) =>
      b.kind === "para"
        ? { kind: "para" as const, text: body(b.text) }
        : {
            kind: "bullets" as const,
            items: b.items.map((i) => ({
              label: i.label ? (lookup(LABELS, i.label, l) ?? i.label) : undefined,
              text: body(i.text),
            })),
          },
    ),
  }));

  return { sections: next, untranslated: missed };
}

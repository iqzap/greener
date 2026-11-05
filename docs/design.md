# Greener — mobile-only prototype

## Direction approved 5 November 2026

A centered white app frame, max-width 430 px on phones and desktops. One admin, one office, Indonesian UI, no login, browser-local storage. Five views and three bottom tabs (Beranda, Aksi, Riwayat). Assessment and results open from Home; results also open from History. No illustrations, mascot, achievement collection, or illustration placeholders.

Typography uses Nunito: headings 28–32 px; questions 24–26 px; buttons 18 px; answers 20 px; supporting content 16 px. Touch controls have at least 56 px height. White canvas, green raised primary buttons, blue selected answers, thick rounded borders. Hugeicons Stroke Rounded subset is vendored locally with license.

## Flow

Home: one mission card with resume button and progress; latest score opens Results; compact XP in the header. Assessment: one short question per screen, category and question count, three neutral answers (Belum, Sebagian, Sudah), optional example, Back, Close, fixed Continue button. The bottom navigation is hidden during assessment. Answers survive Back, Close, and refresh. Resume starts at the first unanswered question. Category URLs from the previous UI continue to work.

Results: one large score, five expandable category rows, one action CTA. Actions: three short checklist items with expandable instructions. History: compact month/score rows. Reset and XP explanation live behind the header menu.

## Data and scoring

Fifteen positive practices, three each for energy, water, waste, paper, transport. Values are 0/50/100 with equally weighted categories. No point values are shown while answering. Completing any assessment earns the same monthly XP. Every answer is required before saving. One assessment per month; edit current month only; previous months remain readable. Existing storage keys and records stay compatible.

XP = 50 per monthly record + 10 per completed priority action, independently of green office score. Editing a monthly record does not multiply XP. Marking actions complete does not change the environmental score. Initial demo contains the preceding three months. Score is a simulation, not certification or measured emissions.

## Motion and validation

Buttons depress on press; pointer answer selections pop briefly; progress uses transforms; submission confirms with a compact dialog and short confetti. No illustration in the completion state. All animation and transitions are disabled for reduced motion.

Validate scoring/XP invariants, question resume and legacy links, one-question flow, draft persistence, Back and Close, final save/edit, action expansion and toggles, 320/390/430 px layouts, and centered desktop width.

Style source: [Refero Duolingo](https://styles.refero.design/style/7088d695-362b-4e09-b325-fa8136d4f350). Previous Mobbin research: [learning path](https://mobbin.com/screens/02544e61-aefd-4d89-815e-ffcc83d83539), [completion feedback](https://mobbin.com/screens/92705902-10f2-4dd7-b46f-21fe7732cfff).

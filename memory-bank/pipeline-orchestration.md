# Pipeline Orchestration

## Главный принцип

Каждый этап читает входной артефакт и пишет выходной. Агент не должен держать весь проект только в чате.

## Этапы

1. Brief → `artifacts/brief.md`
2. SRGID → `artifacts/srgid.md`
3. Research → `artifacts/research.md`
4. IA → `artifacts/ia.md`
5. Design System / React DS → `artifacts/design-system.md`
6. Screens / Prototype UI → `artifacts/screens.md`
7. Prototype links / Run instructions → `artifacts/prototype.md`
8. Craft audit → `artifacts/craft-audit.md`

## Stage gates

- Нет `brief.md` → не начинать research, кроме случая, когда пользователь явно просит быстрый анализ.
- Нет `srgid.md` → не переходить к полноценному design strategy.
- Нет `research.md` → не строить IA как финальную.
- Нет `ia.md` → не собирать screens как финальные.
- Нет `design-system.md` → не собирать flow на “системной” базе.

## Craft-layer

Craft-layer включается опционально:

- перед screens/implementation — выбрать visual register;
- после screens/implementation — anti-slop audit и polish.

Craft-layer не меняет scope, research или IA.

# Touchline Coach TC 1.6.3a – Team Snapshot Switch

Opravená metoda izolace týmů.

Princip:
- Nemění se původní datové funkce aplikace.
- Při přepnutí týmu se uloží aktuální data.
- Potom se načtou data druhého týmu do původního úložiště.
- Aplikace tak dál funguje stejně, jen s jiným obsahem.

Test:
1. Původní tým musí mít svá data.
2. Přidat U19.
3. U19 má být prázdné.
4. Přepnout zpět na původní tým.
5. Data se musí vrátit.

Summary:
TC 1.6.3a Team Snapshot Switch

Rollback:
TC 1.6.2a Team Switch UI Only

# Lumina Aura database

PostgreSQL schema for the candle shop, billings, and gift hampers.

| File | Description |
|------|-------------|
| `schema.sql` | Tables, constraints, indexes |
| `seed.sql` | Data from `data/store.json` + hamper options from `src/lib/hamper.ts` |

Full normalization rationale: [../docs/DATABASE-NORMALIZATION.md](../docs/DATABASE-NORMALIZATION.md).

```bash
createdb lumina_aura
psql -d lumina_aura -f database/schema.sql
psql -d lumina_aura -f database/seed.sql
```

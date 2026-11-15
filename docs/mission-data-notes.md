# Mission Date Semantics & Archival Notes

## Viking 1 end-of-mission dates (`viking-1-lander`)

Primary NASA sources distinguish two dates at the end of the Viking 1 Lander surface mission:

- **1982-11-11 (`lastSignalDate`):** NASA identifies November 11, 1982 as the date the lander stopped operating after an erroneous command upload, and the NASA/JPL factsheet identifies it as the final transmission date.
- **1982-11-13:** NASA's Viking project overview and NSSDCA describe November 13, 1982 as the date communications ended / formal end-of-mission cutoff.

`src/data/equipment.json` preserves `"lastSignalDate": "1982-11-11"` because `lastSignalDate` represents the final transmission event and drives the historical `6y 114d` operational lifespan calculation from `"landedDate": "1976-07-20"`.

# Runtime endpoint environment mismatch, 2026-09-05

Measured negative control: Python SimpleHTTPRequestHandler returned GET 404 and POST 501 for /__testcode/receipt. The browser source checker retained this failure correctly.

Implemented in Ventusltd/testcode commit ab632e5: localhost-only static server plus validated offline receipt persistence, GET endpoint metadata, bounded POST requests. Binary and source-download evidence remains outside Git.

Measured checks:
- Real HTTP regression: static GET 404/POST 501; corrected GET 200/POST 201; receipt read back from disk; invalid JSON/non-object 400; oversized request 413; unknown endpoint 404.
- CVAA focused vaccine tests: 9 passed, 0 failed. Covers missing probes, wrong body despite 200, build/environment mismatch, empty coverage and missing provenance.
- CVAA complete selftest: all antibodies fire on disease and stay silent on health; exit 0.
- Vaccine applied to actual local GET/POST probe snapshot: PASS.
- Installed Chrome on deployed generation 202609051820: 2 visits, PDF and source download PASS (53 runtime resources).
- Installed Chrome on corrected local server, same generation: 2 visits, PDF and source download PASS (59 runtime resources).

Offline evidence: C:/Users/vikra/OneDrive/Desktop/offline-screenshots/receipt-vaccine-202609051828/ . Contains retained-failed-50-run.json, deployed-check.json, local-corrected-check.json, runtime-endpoints.json, receipts and downloads. Both browser instances closed after each visit.

Limits: four focused browser visits, not a new fifty-visit release qualification. The preceding fifty-visit run also exposed independent Pipeline PDF rendering differences. These are not cured by the endpoint server and must not be hidden by this vaccine. Source downloads measured about 61-62 MB; phone usability still needs improvement without silently dropping dependencies. This contract is opt-in and only evaluates the declared probe evidence.

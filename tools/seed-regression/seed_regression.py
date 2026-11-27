"""CVAA bounded regressions against the published SEED instruments."""
import argparse
import gc
import hashlib
import json
import sqlite3
import struct
import sys
import tempfile
import unittest
from contextlib import closing
from pathlib import Path
from unittest.mock import patch


LINE = "const rail = '\U0001f6e4';\n".encode()
TARGET = LINE * 2
URL = "https://fixture.invalid/rail-component.js"
DIGEST = "9fda1c9bae41562ad7972824077a02d08886a86ec095d77c25356426025e1be3"
BLOB = "e4cfc77fbb6b19979decc02df5b627281509c9d9"
READABLE = "code \u00b7 shown in full \u00b7 bounded CVAA fixture"
RULE = "=" * 78


class SelectedReader:
    """Count actual user-space reads and refuse an accidental full capture read."""

    def __init__(self, path, start, length):
        self.path = path
        self.start = start
        self.length = length
        self.opens = 0
        self.bytes_read = 0

    def open(self, mode):
        if mode != "rb":
            raise AssertionError(f"Capture opened with {mode}")
        self.opens += 1
        return self

    def __enter__(self):
        self.stream = self.path.open("rb")
        return self

    def __exit__(self, *args):
        self.stream.close()

    def seek(self, offset):
        if offset != self.start:
            raise AssertionError(f"Unexpected capture offset {offset}")
        self.stream.seek(offset)

    def read(self, size=-1):
        if size != self.length or self.bytes_read:
            raise AssertionError(f"Capture read outside one selected range: {size} bytes")
        data = self.stream.read(size)
        self.bytes_read += len(data)
        return data


def make_capture(path, bodies):
    lengths = [len(content.decode().encode("utf-16-le")) // 2 for _, content in bodies]
    index_role = READABLE.replace("shown in full", "in full")
    header = [
        RULE,
        "THE SCREEN THIS CAME FROM",
        RULE,
        '{"generation":"cvaa-fixture","capturedAt":"2026-11-27T00:00:00Z","viewport":{}}',
        "",
        RULE,
        f"CONTENTS -- {len(bodies)} file(s), {sum(lengths)} characters",
        RULE,
    ]
    for number, ((url, _), size) in enumerate(zip(bodies, lengths), 1):
        header.extend([f"{number}. {url}", f"     {size} chars \u00b7 {index_role}"])
    header.append("")
    parts = [("\n".join(header) + "\n").encode()]
    for (url, content), size in zip(bodies, lengths):
        parts.append(f"{RULE}\nFILE: {url}\n{size} chars \u00b7 {READABLE}\n{RULE}\n".encode())
        parts.extend([content, b"\n\n"])
    parts.append(f"{RULE}\nEND OF TELEPRINT\n{RULE}\n".encode())
    path.write_bytes(b"".join(parts))


def make_database(path):
    with closing(sqlite3.connect(path)) as db, db:
        db.executescript("""
            create table line (n integer primary key, text blob);
            create table tablet (n integer primary key, git_blob text unique, lines blob);
            create table occurrence (repo text, commit_sha text, path text, tablet integer);
            create table commit_info (repo text, sha text, date text);
        """)
        db.execute("insert into line values (41, ?)", (LINE,))
        db.execute("insert into tablet values (73, ?, ?)", (BLOB, struct.pack("<II", 41, 41)))
        db.execute("insert into occurrence values ('seed-fixture', 'commit-beta', 'rail.js', 73)")
        db.execute("insert into occurrence values ('seed-fixture', 'commit-alpha', 'rail.js', 73)")
        db.execute("insert into commit_info values ('seed-fixture', 'commit-alpha', '2026-11-27T00:00:00Z')")


class SeedRegression(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.addCleanup(gc.collect)
        self.root = Path(temp.name)
        self.database = self.root / "stars.sqlite"
        self.capture = self.root / "capture.txt"
        self.index_path = self.root / "capture-index.json"
        other = (b"padding " + "\N{SNOWMAN}".encode() + b"\n") * 2048
        make_capture(self.capture, [("https://fixture.invalid/unrelated", other), (URL, TARGET)])
        make_database(self.database)
        catalogue = teleprint_index.index(self.capture, self.database)
        self.record = catalogue["records"][1]
        self.index_path.write_text(json.dumps(catalogue), encoding="utf-8")
        self.evidence = self.root / "evidence.json"
        self.evidence.write_text('{"local_fixture":true}', encoding="utf-8")

    def seed(self, key, components=(), *, path="evidence.json", status="demonstrated"):
        return seed_discover.available_record(
            key, key, status, "conditional ordinal retrieval", path, "auditable rail",
            components)

    def initialise_fixture_catalogue(self, records):
        catalogue = self.root / "catalogue.sqlite"
        # Install the public schema, then use the normal registry API against a disposable workspace.
        seed_discover.initialize(catalogue, [])
        with closing(sqlite3.connect(catalogue)) as db:
            db.execute("pragma foreign_keys=on")
            seed_discover.install(db, records, workspace=self.root)
        return catalogue

    def test_metadata_only_deterministic_search_and_expansion_budget(self):
        catalogue = self.initialise_fixture_catalogue([
            self.seed("leaf"), self.seed("stage-a", ["leaf"]),
            self.seed("stage-b", ["leaf"]), self.seed("root", ["stage-a", "stage-b"]),
            self.seed("proposal", status="speculative"),
        ])
        connect = sqlite3.connect

        def allowed_connect(name, *args, **kwargs):
            self.assertEqual(name, catalogue.as_uri() + "?mode=ro")
            return connect(name, *args, **kwargs)

        with patch("io.open", side_effect=AssertionError("Opened evidence or estate file")), \
             patch.object(sqlite3, "connect", side_effect=allowed_connect):
            args = (catalogue, "conditional ordinal retrieval", 8)
            complete = seed_discover.discover(*args, depth=12, cap=9, verified_only=True)
            repeat = seed_discover.discover(*args, depth=12, cap=9, verified_only=True)
            limited = seed_discover.discover(*args, depth=12, cap=2, verified_only=True)
            unreachable = seed_discover.discover(catalogue, "volcano seismometer", 4)
        for key in ("hits", "expanded"):
            self.assertEqual(complete[key], repeat[key])
        self.assertEqual([row["id"] for row in complete["hits"]], ["leaf", "root", "stage-a", "stage-b"])
        self.assertEqual(len(complete["expanded"]), 4)
        self.assertFalse(complete["expansion_budget_exhausted"])
        self.assertEqual(len(limited["expanded"]), 2)
        self.assertTrue(limited["expansion_budget_exhausted"])
        self.assertEqual(unreachable["status"], "no_indexed_match")
        self.assertEqual(complete["metrics"]["inference_calls"], 0)

    def test_registry_preserves_deterministic_contract_digest(self):
        catalogue = self.initialise_fixture_catalogue([self.seed("stable")])
        with closing(sqlite3.connect(catalogue)) as db:
            (encoded,) = db.execute("select contract from record where id='stable'").fetchone()
        checkout = json.loads(encoded)
        expected = checkout.pop("digest")
        data = json.dumps(checkout, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
        self.assertEqual(hashlib.sha256(data.encode()).hexdigest(), expected)

    def test_missing_and_cyclic_dependencies_rollback_metadata_and_postings(self):
        cases = [
            ([self.seed("valid"), self.seed("broken", ["absent"])], sqlite3.IntegrityError),
            ([self.seed("left", ["right"]), self.seed("right", ["left"])], ValueError),
        ]
        catalogue = self.initialise_fixture_catalogue([self.seed("previous")])
        with closing(sqlite3.connect(catalogue)) as db:
            db.execute("pragma foreign_keys=on")
            for records, error in cases:
                with self.subTest(error=error), self.assertRaises(error):
                    seed_discover.install(db, records, workspace=self.root)
                self.assertEqual(db.execute("select id from record").fetchall(), [("previous",)])
                self.assertEqual(db.execute("select id from objective_fts").fetchall(), [("previous",)])
                self.assertEqual(db.execute("select * from dependency").fetchall(), [])

    def test_refuses_evidence_outside_working_root(self):
        contained = self.root / "nested"
        contained.mkdir()
        catalogue = self.initialise_fixture_catalogue([])
        with closing(sqlite3.connect(catalogue)) as db:
            db.execute("pragma foreign_keys=on")
            with self.assertRaisesRegex(ValueError, "outside-workspace"):
                seed_discover.install(db, [self.seed("escape", path="../evidence.json")],
                                      workspace=contained)
            self.assertEqual(db.execute("select * from record").fetchall(), [])

    def test_selected_byte_range_and_cryptographic_identity(self):
        reader = SelectedReader(self.capture, self.record["byte_start"], len(TARGET))
        self.assertEqual(teleprint_index.retrieve(reader, self.record), TARGET)
        self.assertEqual(self.record["utf16_units"], 38)
        self.assertEqual(self.record["byte_length"], 42)
        self.assertEqual(self.record["text_sha256"], DIGEST)
        self.assertEqual(self.record["git_blob"], BLOB)
        self.assertEqual(self.record["tablet"], 73)
        self.assertEqual((reader.opens, reader.bytes_read), (1, len(TARGET)))

    def test_refuses_corrupted_selected_bytes_and_offsets(self):
        with self.assertRaisesRegex(ValueError, "differs from the index"):
            teleprint_index.retrieve(self.capture, dict(self.record,
                byte_start=self.record["byte_start"] + 1))
        with self.capture.open("r+b") as stream:
            stream.seek(self.record["byte_start"])
            stream.write(b"X")
        with self.assertRaisesRegex(ValueError, "differs from the index"):
            teleprint_index.retrieve(self.capture, self.record)

    def test_refuses_incomplete_capture_index(self):
        data = self.capture.read_bytes().replace(b"END OF TELEPRINT", b"CUT OFF")
        self.capture.write_bytes(data)
        with self.assertRaisesRegex(ValueError, "Incomplete capture"):
            teleprint_index.index(self.capture, self.database)

    def test_index_closes_owned_read_only_connection(self):
        class TrackingConnection(sqlite3.Connection):
            was_closed = False

            def close(self):
                self.was_closed = True
                super().close()

        connection = sqlite3.connect(self.database.as_uri() + "?mode=ro", uri=True,
                                     factory=TrackingConnection)
        with closing(connection), patch.object(teleprint_index, "connect", return_value=connection):
            self.assertEqual(teleprint_index.index(self.capture, self.database)["records"][1]["tablet"], 73)
            self.assertTrue(connection.was_closed, "Capture indexing retains its SQLite handle")

    def test_composition_reconstructs_exact_history_read_only(self):
        before = hashlib.sha256(self.database.read_bytes()).digest()
        capture = SelectedReader(self.capture, self.record["byte_start"], len(TARGET))
        statements = []
        original = experiment_b.connect

        def watched_connect(path):
            connection = original(path)
            self.assertEqual(connection.execute("pragma query_only").fetchone(), (1,))
            connection.set_trace_callback(statements.append)
            return connection

        with patch.object(experiment_b, "connect", watched_connect):
            result, logical_bytes, queries = experiment_b.composed(
                capture, URL, self.database, self.index_path)
        self.assertEqual(result, {
            "status": "byte-identical", "url": URL, "sha256": DIGEST, "git_blob": BLOB,
            "tablet": 73, "occurrences": [
                ("seed-fixture", "commit-alpha", "rail.js", "2026-11-27T00:00:00Z"),
                ("seed-fixture", "commit-beta", "rail.js", None),
            ],
        })
        self.assertEqual((capture.opens, capture.bytes_read), (1, len(TARGET)))
        self.assertEqual(logical_bytes, len(TARGET) + self.index_path.stat().st_size)
        self.assertEqual((queries, len(statements)), (3, 3))
        self.assertEqual(hashlib.sha256(self.database.read_bytes()).digest(), before)

    def test_corrupted_historical_bytes_never_receive_identity(self):
        with closing(sqlite3.connect(self.database)) as db, db:
            db.execute("update line set text=? where n=41", (b"another source line\n",))
        with self.assertRaisesRegex(ValueError, "Historical tablet integrity mismatch"):
            experiment_b.composed(self.capture, URL, self.database, self.index_path)

    def test_early_refusals_skip_the_historical_estate(self):
        catalogue = json.loads(self.index_path.read_text(encoding="utf-8"))
        with patch.object(experiment_b, "connect", side_effect=AssertionError("Opened STARS")):
            missing, _, queries = experiment_b.composed(
                self.capture, URL + "-nonexistent", self.database, self.index_path)
            self.assertEqual((missing["status"], queries), ("absent", 0))
            self.index_path.write_text(json.dumps(dict(catalogue, records=[self.record, self.record])),
                                       encoding="utf-8")
            duplicated, _, queries = experiment_b.composed(
                self.capture, URL, self.database, self.index_path)
            self.assertEqual((duplicated["status"], queries), ("ambiguous", 0))
            bad_record = dict(self.record, git_blob="0" * 40)
            self.index_path.write_text(json.dumps(dict(catalogue, records=[bad_record])),
                                       encoding="utf-8")
            corrupt, _, queries = experiment_b.composed(
                self.capture, URL, self.database, self.index_path)
            self.assertEqual((corrupt["status"], queries), ("index-identity-drift", 0))


class PlannerRegression(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        directory = tempfile.TemporaryDirectory()
        cls.addClassCleanup(directory.cleanup)
        cls.catalogue = Path(directory.name) / "prior-28.sqlite"
        cls.routes = seed_discover.read_json(seed_root / "economy/routes.json")
        records = list(seed_discover.base_catalogue())
        if len(records) != 28:
            raise AssertionError("Expected the original 28 contracts in this fixture")
        seed_discover.initialize(cls.catalogue, records)

    def test_complete_pinned_cosmic_contract_proposes_one_command(self):
        inputs = {"ordinal": "17901", "cartridge": "universe.json"}
        with patch("io.open", side_effect=AssertionError("Planner read a payload file")):
            result = seed_plan.plan(self.catalogue, self.routes,
                                    "Locate ordinal 17901 in the hierarchy", inputs)
        self.assertEqual(result["status"], "ready_for_checked_invocation")
        self.assertEqual(result["argv"], ["node", "rare_cosmic.mjs", "17901", "universe.json"])
        self.assertEqual(result["missing"], [])
        self.assertEqual(result["ai_inference_calls"], 0)

    def test_missing_or_invalid_cosmic_arguments_produce_no_command(self):
        result = seed_plan.plan(self.catalogue, self.routes, "Locate the ordinal inside the sector",
                                {"ordinal": "-1"})
        self.assertEqual(result["status"], "supply_inputs")
        self.assertEqual(result["invalid"], ["ordinal"])
        self.assertEqual(result["missing"], ["cartridge"])
        self.assertNotIn("argv", result)

    def test_lexical_match_cannot_claim_executable_coverage(self):
        result = seed_plan.plan(self.catalogue, self.routes, "Explain ordinal arithmetic", {})
        self.assertEqual(result["status"], "investigate")
        self.assertIn("cosmic-ordinal-address", {r["id"] for r in result["candidates"]})
        self.assertNotIn("argv", result)

    def test_ambiguous_edits_refuse_before_opening_catalogue(self):
        with patch.object(sqlite3, "connect", side_effect=AssertionError("Opened catalogue")):
            result = seed_plan.plan(self.catalogue, self.routes,
                "Audit captured historical source at an ordinal in a sector", {})
        self.assertEqual(result["status"], "ambiguous")
        self.assertEqual(set(result["known_contracts"]),
                         {"audit-captured-source", "cosmic-ordinal-address"})
        self.assertNotIn("argv", result)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--seed-root", type=Path, required=True)
    parser.add_argument("--with-planner", action="store_true")
    args = parser.parse_args()
    sys.dont_write_bytecode = True
    seed_root = args.seed_root.resolve()
    sys.path.insert(0, str(seed_root))
    import experiment_b
    import seed_discover
    import teleprint_index

    suite = unittest.defaultTestLoader.loadTestsFromTestCase(SeedRegression)
    if args.with_planner:
        import seed_plan
        suite.addTests(unittest.defaultTestLoader.loadTestsFromTestCase(PlannerRegression))
    outcome = unittest.TextTestRunner(verbosity=2).run(suite)
    print(json.dumps({"tests": outcome.testsRun, "passed": outcome.wasSuccessful(),
                      "stage": "deterministic synthetic SEED regression",
                      "scope": "Selected reads and SQL work, without machine-timing gates"}))
    sys.exit(not outcome.wasSuccessful())


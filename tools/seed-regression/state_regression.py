"""CVAA cross-instrument checks for the next recursive SEED composition."""
import argparse
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


class StateRegression(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.inputs = make_fixture(Path(directory.name))
        self.before, self.before_index, self.after, self.after_index, self.database = self.inputs

    def compare(self, *, mechanism=None, limit=3, budget=500):
        return state_compare.compare(*self.inputs, SCOPE, mechanism, limit, budget)

    def mutate_index(self, path, operation):
        manifest = json.loads(path.read_text(encoding="utf-8"))
        operation(manifest)
        path.write_text(json.dumps(manifest), encoding="utf-8")

    def test_recursive_witness_provenance_and_exact_scope(self):
        before = self.database.read_bytes()
        result, usage = self.compare(mechanism=MECHANISM)
        self.assertEqual(result["counts"], dict(identical=1, changed=1, before_only=1,
                                               after_only=1, unread=1))
        self.assertEqual([row["status"] for row in result["changes"] if row["url"] == UNAVAILABLE],
                         ["unread"])
        self.assertNotIn(UNAVAILABLE, {w["url"] for w in result["witnesses"]})
        witness = result["mechanism"]
        self.assertTrue(witness["same_source"])
        for side in ("before", "after"):
            self.assertEqual(witness[side]["tablet"], 7740)
            self.assertTrue(witness[side]["scope_literal"])
        self.assertGreater(usage["payload_bytes"], 0)
        self.assertLessEqual(usage["payload_bytes"], 500)
        self.assertEqual(self.database.read_bytes(), before)

    def test_metadata_only_plan_opens_no_payload(self):
        error = AssertionError("Metadata-only plan opened a payload")
        with patch.object(state_compare, "retrieve", side_effect=error), \
             patch.object(state_compare, "selected_source", side_effect=error), \
             patch.object(state_compare, "composed", side_effect=error):
            result, usage = self.compare(mechanism=None, limit=0, budget=0)
        self.assertEqual(result["counts"]["changed"], 1)
        self.assertEqual(result["witnesses"], [])
        self.assertEqual(result["deferred_witnesses"], 3)
        self.assertEqual((usage["payload_bytes"], usage["sqlite_queries"]), (0, 0))

    def test_mechanism_budget_fails_before_payload_read(self):
        with patch.object(state_compare, "composed", side_effect=AssertionError("Opened STARS")):
            with self.assertRaisesRegex(ValueError, "budget"):
                self.compare(mechanism=MECHANISM, limit=3, budget=0)

    def test_refuses_duplicate_url_and_noncanonical_identity(self):
        original = self.after_index.read_bytes()
        mutations = [
            lambda m: m["records"].append(m["records"][0]),
            lambda m: m["records"][0].update(text_sha256="?" * 64),
            lambda m: m["records"][0].update(byte_start=-1),
        ]
        for mutation in mutations:
            with self.subTest(mutation=mutation):
                self.after_index.write_bytes(original)
                self.mutate_index(self.after_index, mutation)
                with self.assertRaisesRegex(ValueError, "Ambiguous or malformed"):
                    self.compare(mechanism=MECHANISM)

    def test_refuses_inconsistent_stars_identity(self):
        self.mutate_index(self.after_index, lambda m: m.update(database_sha256="0" * 64))
        with self.assertRaisesRegex(ValueError, "disagree on the recorded STARS"):
            self.compare(mechanism=MECHANISM)

    def test_refuses_selected_witness_corrupted_after_indexing(self):
        manifest = json.loads(self.after_index.read_text(encoding="utf-8"))
        selected = next(row for row in manifest["records"] if row["url"] == SCOPE + "same-url.json")
        with self.after.open("r+b") as payload:
            payload.seek(selected["byte_start"])
            payload.write(b"!")
        with self.assertRaisesRegex(ValueError, "differs from the index"):
            self.compare(mechanism=MECHANISM)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--seed-root", required=True, type=Path)
    parser.add_argument("--composition-root", type=Path)
    args = parser.parse_args()
    sys.dont_write_bytecode = True
    root = args.seed_root.resolve()
    sys.path[:0] = [str(root), str(args.composition_root or root / "next-compose")]
    import experiment_b  # Select supplied release modules before loading the higher-order seed.
    import teleprint_index
    import state_compare
    from fixture import MECHANISM, SCOPE, UNAVAILABLE, make_fixture

    result = unittest.TextTestRunner(verbosity=2).run(
        unittest.defaultTestLoader.loadTestsFromTestCase(StateRegression))
    print(json.dumps({"tests": result.testsRun, "passed": result.wasSuccessful(),
                      "stage": "deterministic recursive SEED regression"}))
    sys.exit(not result.wasSuccessful())


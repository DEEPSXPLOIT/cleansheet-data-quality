import { readFile } from "node:fs/promises";
import { test } from "node:test";
import assert from "node:assert/strict";
const load = async (path) =>
  import(
    "data:text/javascript;base64," +
      Buffer.from(
        await readFile(new URL(path, import.meta.url), "utf8"),
      ).toString("base64")
  );
const a = await load("../src/lib/projectAnalytics.js");
const d = await load("../src/data/demoData.js");
test("CSV handles BOM, CRLF, escaped quotes, commas, and multiline fields", () => {
  const rows = a.parseCSV(
    '\uFEFFid,note\r\n1,"Hello, ""world"""\r\n2,"two\nlines"\r\n',
  );
  assert.deepEqual(rows, [
    { id: "1", note: 'Hello, "world"' },
    { id: "2", note: "two\nlines" },
  ]);
});
test("CSV rejects duplicate headers, ragged rows, unclosed quotes, trailing quoted garbage, and oversized datasets", () => {
  for (const csv of [
    "id,id\n1,2",
    "id,name\n1",
    'id,name\n1,"bad',
    'id,name\n1,"value"garbage',
  ])
    assert.throws(() => a.parseCSV(csv));
  assert.throws(
    () =>
      a.parseCSV("id\n" + Array.from({ length: 2001 }, (_, i) => i).join("\n")),
    /2,000/,
  );
});
test("CSV export escapes quotes and neutralizes formula prefixes", () => {
  const csv = a.toCSV([{ name: "=SUM(A1:A2)", note: 'Hello, "world"' }]);
  assert.equal(a.parseCSV(csv)[0].name, "'=SUM(A1:A2)");
  assert.equal(a.parseCSV(csv)[0].note, 'Hello, "world"');
});
test("Quality audit produces disjoint invalid and duplicate counts and preserves extra fields", () => {
  const report = a.auditRows(a.parseCSV(d.qualityCSV));
  assert.equal(report.clean.length, 4);
  assert.equal(report.invalid, 3);
  assert.equal(report.duplicates, 1);
  assert.equal(report.clean[0].email, "user.a@example.com");
  assert.equal(report.clean[0].name, "Demo User A");
  const rows = [
    { id: "A", name: "", email: "bad", department: "IT", extra: " keep " },
    {
      id: "A",
      name: "User",
      email: "USER@example.com",
      department: "IT",
      extra: " keep ",
    },
  ];
  assert.equal(a.auditRows(rows).clean[0].extra, "keep");
  assert.throws(() => a.auditRows([{ id: "1" }]), /Missing columns/);
});
test("All-empty CSV records remain visible to the quality auditor", () => {
  const rows = a.parseCSV(
    "id,name,email,department\n,,,\n1,User,user@example.com,IT",
  );
  assert.equal(rows.length, 2);
  assert.equal(a.auditRows(rows).invalid, 1);
});

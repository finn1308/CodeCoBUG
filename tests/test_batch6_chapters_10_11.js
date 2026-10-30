/**
 * CodeCoBUG Batch 6 Verification Suite: Chapter 10 (Files & Data) & Chapter 11 (OOP)
 */

const { CHAPTER_10_FILES_DATA, CHAPTER_11_OOP } = require('../src/lib/curriculum');
const { getExerciseBySlug } = require('../src/lib/fixtures/sampleCurriculum');
const { getServerExerciseTests } = require('../src/lib/judge/testCasesRepository');
const { evaluateSubmission } = require('../src/lib/judge/runner');

let passCount = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`  ✔ PASS: ${message}`);
  passCount++;
}

console.log('\n=============================================================');
console.log('🏛️ RUNNING BATCH 6: CHAPTER 10 & 11 CURRICULUM VERIFICATION');
console.log('=============================================================\n');

// Group 1: Structure & Pedagogical Completeness
console.log('--- Test Group 1: Chapter 10 & 11 Pedagogical Completeness ---');
const chapters = [CHAPTER_10_FILES_DATA, CHAPTER_11_OOP];

chapters.forEach((chap) => {
  assert(chap.lessons.length >= 3, `Chapter "${chap.title}" has >= 3 structured lessons (actual: ${chap.lessons.length})`);
  chap.lessons.forEach((lesson, lIdx) => {
    assert(lesson.learningObjectives && lesson.learningObjectives.length >= 2, `${chap.slug} - Lesson ${lIdx + 1} (${lesson.slug}) has >= 2 objectives`);
    assert(lesson.prerequisites && lesson.prerequisites.length >= 1, `${lesson.slug} has prerequisites`);
    assert(lesson.theoryContent && lesson.theoryContent.length > 50, `${lesson.slug} has rich Vietnamese explanation`);
    assert(lesson.codeExamples && lesson.codeExamples.length >= 1, `${lesson.slug} has runnable examples with output`);
    assert(lesson.commonMistakes && lesson.commonMistakes.length >= 1, `${lesson.slug} has common mistakes & fixes`);
    assert(lesson.guidedPracticeTask && lesson.guidedPracticeTask.instructions, `${lesson.slug} has guided practice task`);
    assert(lesson.recap && lesson.recap.length >= 2, `${lesson.slug} has recap points`);
    assert(lesson.referenceLinks && lesson.referenceLinks.some((l) => l.url.includes('w3schools.com')), `${lesson.slug} links to W3Schools`);
  });
});

// Group 2: Reference Solutions & Real Judge Evaluation
console.log('\n--- Test Group 2: Real Judge Evaluation on All Exercises ---');
const BATCH_6_SOLUTIONS = {
  // Chapter 10: Files & Data
  'ghi-va-doc-file-text': 's = input()\nwith open("output.txt", "w") as f:\n    f.write(s)\nwith open("output.txt", "r") as f:\n    print(f.read().upper())\n',
  'trich-xuat-thong-tin-json': 'import json\ns = input()\nd = json.loads(s)\nprint(f"Sinh vien: {d[\'ten\']} - Tuoi: {d[\'tuoi\']} - Diem: {d[\'diem\']}")\n',
  'tinh-tong-tien-don-hang-csv': 'n = int(input())\ntong = 0\nfor _ in range(n):\n    parts = input().split(",")\n    tong += int(parts[1]) * int(parts[2])\nprint(f"Tong don hang: {tong} VND")\n',

  // Chapter 11: OOP
  'lop-hinh-chu-nhat-oop': 'class HinhChuNhat:\n    def __init__(self, dai, rong):\n        self.dai = dai\n        self.rong = rong\n    def dien_tich(self):\n        return self.dai * self.rong\n    def chu_vi(self):\n        return (self.dai + self.rong) * 2\n\nd = float(input())\nr = float(input())\nhcn = HinhChuNhat(d, r)\nprint(f"{hcn.dien_tich():.2f}")\nprint(f"{hcn.chu_vi():.2f}")\n',
  'ke-thua-lop-nguoi-va-hoc-sinh': 'class Nguoi:\n    def __init__(self, ten, tuoi):\n        self.ten = ten\n        self.tuoi = tuoi\n\nclass HocSinh(Nguoi):\n    def __init__(self, ten, tuoi, lop):\n        super().__init__(ten, tuoi)\n        self.lop = lop\n    def gioi_thieu(self):\n        print(f"Em ten la {self.ten}, {self.tuoi} tuoi, hoc lop {self.lop}.")\n\nten = input()\ntuoi = int(input())\nlop = input()\nhs = HocSinh(ten, tuoi, lop)\nhs.gioi_thieu()\n',
  'cai-dat-phuong-thuc-str-dunder': 'class Sach:\n    def __init__(self, tieu_de, tac_gia):\n        self.tieu_de = tieu_de\n        self.tac_gia = tac_gia\n    def __str__(self):\n        return f"[{self.tieu_de}] - {self.tac_gia}"\n\ntieu_de = input()\ntac_gia = input()\nsach = Sach(tieu_de, tac_gia)\nprint(sach)\n',
  'tai-khoan-ngan-hang-dong-goi': 'class TaiKhoan:\n    def __init__(self, so_du):\n        self.__so_du = so_du\n    def lay_so_du(self):\n        return self.__so_du\n    def gui_tien(self, so_tien):\n        if so_tien > 0:\n            self.__so_du += so_tien\n    def rut_tien(self, so_tien):\n        if so_tien > self.__so_du:\n            print("Khong du so du")\n        else:\n            self.__so_du -= so_tien\n\nso_du_dau = int(input())\ntien_gui = int(input())\ntien_rut = int(input())\n\ntk = TaiKhoan(so_du_dau)\ntk.gui_tien(tien_gui)\ntk.rut_tien(tien_rut)\nprint(tk.lay_so_du())\n',
};

async function runBatch6Tests() {
  const allBatch6Exercises = chapters.flatMap((c) => c.lessons.flatMap((l) => l.exercises));
  assert(allBatch6Exercises.length === 7, `Batch 6 has exactly 7 exercises (actual: ${allBatch6Exercises.length})`);

  for (const ex of allBatch6Exercises) {
    console.log(`\nTesting exercise [${ex.slug}]...`);
    const match = getExerciseBySlug(ex.slug);
    assert(match !== null, `getExerciseBySlug resolves ${ex.slug}`);
    assert(match.exercise.id === ex.id, `Resolved exercise ID matches ${ex.id}`);

    const serverTests = getServerExerciseTests(ex.slug);
    assert(serverTests !== null, `Authoritative server test suite exists for "${ex.slug}"`);
    assert(serverTests.testCases.length >= 3, `Exercise has at least 3 test cases (actual: ${serverTests.testCases.length})`);

    const hasPublic = serverTests.testCases.some((t) => !t.isHidden);
    const hasHidden = serverTests.testCases.some((t) => t.isHidden);
    assert(hasPublic, `Has public example test cases`);
    assert(hasHidden, `Has hidden grading test cases`);

    const solutionCode = BATCH_6_SOLUTIONS[ex.slug];
    assert(solutionCode !== undefined, `Reference solution defined for ${ex.slug}`);

    // Run real judge evaluation
    const report = await evaluateSubmission(serverTests, solutionCode, ex.points);
    assert(report.verdict === 'accepted', `Submission verdict is accepted (got: ${report.verdict})`);
    assert(report.score === ex.points, `Score matches full points ${ex.points} (got: ${report.score})`);
    assert(report.passedTestsCount === report.totalTestsCount, `All ${report.totalTestsCount} tests passed`);
  }

  console.log(`\n=============================================================`);
  console.log(`🎉 BATCH 6 SUITE COMPLETE: ALL ${passCount} ASSERTIONS PASSED!`);
  console.log(`=============================================================\n`);
}

runBatch6Tests().catch((err) => {
  console.error('Fatal error during Batch 6 test:', err);
  process.exit(1);
});

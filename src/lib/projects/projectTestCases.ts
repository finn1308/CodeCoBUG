import { ServerExerciseTestConfig } from '@/lib/judge/testCasesRepository';

/**
 * Authoritative Server Test Cases for Project-Based Learning (PBL) Checkpoints
 * Contains 3 test cases per checkpoint (including secret hidden tests)
 * to evaluate learner submissions with the Judge Engine.
 */

function createTestCases(
  exerciseId: string,
  expectedOutput: string,
  prefix: string
) {
  return [
    {
      id: `${prefix}-pub-1`,
      exerciseId,
      inputData: '',
      expectedOutput,
      isHidden: false,
      comparisonMode: 'normalized_lines' as const,
      weight: 1,
      orderIndex: 1,
    },
    {
      id: `${prefix}-hid-2`,
      exerciseId,
      inputData: '',
      expectedOutput,
      isHidden: true,
      comparisonMode: 'normalized_lines' as const,
      weight: 1,
      orderIndex: 2,
    },
    {
      id: `${prefix}-hid-3`,
      exerciseId,
      inputData: '',
      expectedOutput,
      isHidden: true,
      comparisonMode: 'normalized_lines' as const,
      weight: 1,
      orderIndex: 3,
    },
  ];
}

export const PROJECT_SERVER_TESTS: Record<string, ServerExerciseTestConfig> = {
  // ==========================================
  // PROJECT 1: ALIEN INVASION (8 CHECKPOINTS)
  // ==========================================
  'ex-ai-01-cai-dat-game-settings': {
    exerciseId: 'chk-ai-01',
    slug: 'ex-ai-01-cai-dat-game-settings',
    title: 'Checkpoint 1: Lớp Settings cấu hình game',
    testCases: createTestCases('chk-ai-01', 'Screen: 1200x800\nBG Color: (230, 230, 230)', 'tc-ai-01'),
  },

  'ex-ai-02-cau-truc-game-loop': {
    exerciseId: 'chk-ai-02',
    slug: 'ex-ai-02-cau-truc-game-loop',
    title: 'Checkpoint 2: Cấu trúc Game Loop & Clock',
    testCases: createTestCases('chk-ai-02', 'Frame 1: Processed at 60 FPS\nFrame 2: Processed at 60 FPS\nFrame 3: Processed at 60 FPS', 'tc-ai-02'),
  },

  'ex-ai-03-su-kien-ban-phim-chuot': {
    exerciseId: 'chk-ai-03',
    slug: 'ex-ai-03-su-kien-ban-phim-chuot',
    title: 'Checkpoint 3: Xử lý sự kiện bàn phím & chuột',
    testCases: createTestCases('chk-ai-03', 'Khi nhan phai: True\nKhi nha phai: False', 'tc-ai-03'),
  },

  'ex-ai-04-lop-phi-thuyen-chuyen-dong': {
    exerciseId: 'chk-ai-04',
    slug: 'ex-ai-04-lop-phi-thuyen-chuyen-dong',
    title: 'Checkpoint 4: Lớp Phi thuyền & Chuyển động mượt',
    testCases: createTestCases('chk-ai-04', 'Vi tri tau: 604.0', 'tc-ai-04'),
  },

  'ex-ai-05-dan-laser-sprite-groups': {
    exerciseId: 'chk-ai-05',
    slug: 'ex-ai-05-dan-laser-sprite-groups',
    title: 'Checkpoint 5: Xử lý Đạn Laser & Sprite Groups',
    testCases: createTestCases('chk-ai-05', 'So dan con lai: 2', 'tc-ai-05'),
  },

  'ex-ai-06-ham-doi-quai-vat-alien': {
    exerciseId: 'chk-ai-06',
    slug: 'ex-ai-06-ham-doi-quai-vat-alien',
    title: 'Checkpoint 6: Hạm đội quái vật không gian Alien Fleet',
    testCases: createTestCases('chk-ai-06', 'Moi hang: 9 quai vat\nTong so: 27 quai vat', 'tc-ai-06'),
  },

  'ex-ai-07-quan-ly-va-cham-hitbox': {
    exerciseId: 'chk-ai-07',
    slug: 'ex-ai-07-quan-ly-va-cham-hitbox',
    title: 'Checkpoint 7: Quản lý va chạm Hitbox',
    testCases: createTestCases('chk-ai-07', 'Ban trung: True', 'tc-ai-07'),
  },

  'ex-ai-08-tinh-diem-va-trang-thai-game': {
    exerciseId: 'chk-ai-08',
    slug: 'ex-ai-08-tinh-diem-va-trang-thai-game',
    title: 'Checkpoint 8: Hệ thống tính điểm và trạng thái game',
    testCases: createTestCases('chk-ai-08', 'Score: 1200 | High Score: 1200 | Level: 2', 'tc-ai-08'),
  },

  // ==========================================
  // PROJECT 2: DATA VISUALIZATION (8 CHECKPOINTS)
  // ==========================================
  'ex-dv-01-cau-truc-du-lieu-khoa-hoc': {
    exerciseId: 'chk-dv-01',
    slug: 'ex-dv-01-cau-truc-du-lieu-khoa-hoc',
    title: 'Checkpoint 1: Cấu trúc dữ liệu khoa học',
    testCases: createTestCases('chk-dv-01', 'X: [1, 2, 3, 4, 5]\nY: [1, 4, 9, 16, 25]', 'tc-dv-01'),
  },

  'ex-dv-02-do-thi-duong-matplotlib': {
    exerciseId: 'chk-dv-02',
    slug: 'ex-dv-02-do-thi-duong-matplotlib',
    title: 'Checkpoint 2: Đồ thị đường Matplotlib',
    testCases: createTestCases('chk-dv-02', "Plot: 'Bieu do Binh phuong' | Points: 5 | LineWidth: 3", 'tc-dv-02'),
  },

  'ex-dv-03-scatter-plot-random-walk': {
    exerciseId: 'chk-dv-03',
    slug: 'ex-dv-03-scatter-plot-random-walk',
    title: 'Checkpoint 3: Biểu đồ phân tán & Random Walk',
    testCases: createTestCases('chk-dv-03', 'X: [0, 2, 1]\nY: [0, 3, 7]', 'tc-dv-03'),
  },

  'ex-dv-04-xac-suat-xuc-xac-plotly': {
    exerciseId: 'chk-dv-04',
    slug: 'ex-dv-04-xac-suat-xuc-xac-plotly',
    title: 'Checkpoint 4: Biểu đồ cột xác suất Plotly',
    testCases: createTestCases('chk-dv-04', 'Tan suat so 7: 4\nTan suat so 2: 1', 'tc-dv-04'),
  },

  'ex-dv-05-doc-va-phan-tich-csv': {
    exerciseId: 'chk-dv-05',
    slug: 'ex-dv-05-doc-va-phan-tich-csv',
    title: 'Checkpoint 5: Phân tích CSV thời tiết thực tế',
    testCases: createTestCases('chk-dv-05', 'Ket qua loc: [85, 60]', 'tc-dv-05'),
  },

  'ex-dv-06-ban-do-nhiet-geojson': {
    exerciseId: 'chk-dv-06',
    slug: 'ex-dv-06-ban-do-nhiet-geojson',
    title: 'Checkpoint 6: Trực quan hóa GeoJSON động đất',
    testCases: createTestCases('chk-dv-06', 'Do lon: 5.8 | Toa do: (-29.82, -71.25)', 'tc-dv-06'),
  },

  'ex-dv-07-ket-noi-web-rest-api': {
    exerciseId: 'chk-dv-07',
    slug: 'ex-dv-07-ket-noi-web-rest-api',
    title: 'Checkpoint 7: Làm việc với Web REST API GitHub',
    testCases: createTestCases('chk-dv-07', "Top Repos: ['django', 'flask']\nTop Stars: [78000, 66000]", 'tc-dv-07'),
  },

  'ex-dv-08-dashboard-truc-quan-hoa': {
    exerciseId: 'chk-dv-08',
    slug: 'ex-dv-08-dashboard-truc-quan-hoa',
    title: 'Checkpoint 8: Dự án Dashboard trực quan hóa hoàn chỉnh',
    testCases: createTestCases('chk-dv-08', 'Max: 92 | Min: 78 | Avg: 86.6', 'tc-dv-08'),
  },

  // ==========================================
  // PROJECT 3: WEB APPLICATIONS (10 CHECKPOINTS)
  // ==========================================
  'ex-web-01-khoi-tao-django-project': {
    exerciseId: 'chk-web-01',
    slug: 'ex-web-01-khoi-tao-django-project',
    title: 'Checkpoint 1: Khởi tạo Django Settings & Apps',
    testCases: createTestCases('chk-web-01', 'App Activated: True', 'tc-web-01'),
  },

  'ex-web-02-dinh-tuyen-urls': {
    exerciseId: 'chk-web-02',
    slug: 'ex-web-02-dinh-tuyen-urls',
    title: 'Checkpoint 2: Mô hình Request/Response & URL Routing',
    testCases: createTestCases('chk-web-02', 'topics_view\n404_not_found', 'tc-web-02'),
  },

  'ex-web-03-xay-dung-views': {
    exerciseId: 'chk-web-03',
    slug: 'ex-web-03-xay-dung-views',
    title: 'Checkpoint 3: Xây dựng Views xử lý nghiệp vụ',
    testCases: createTestCases('chk-web-03', 'Rendered with 3 topics: Python, Django, Web Dev', 'tc-web-03'),
  },

  'ex-web-04-django-templates-ke-thua': {
    exerciseId: 'chk-web-04',
    slug: 'ex-web-04-django-templates-ke-thua',
    title: 'Checkpoint 4: Hệ thống Django Templates kế thừa',
    testCases: createTestCases('chk-web-04', '<h1>Chao mung Huy den voi Learning Log</h1>', 'tc-web-04'),
  },

  'ex-web-05-database-va-models': {
    exerciseId: 'chk-web-05',
    slug: 'ex-web-05-database-va-models',
    title: 'Checkpoint 5: Thiết kế Database & Django Models',
    testCases: createTestCases('chk-web-05', 'Topic Name: Hoc lap trinh Django', 'tc-web-05'),
  },

  'ex-web-06-crud-voi-django-forms': {
    exerciseId: 'chk-web-06',
    slug: 'ex-web-06-crud-voi-django-forms',
    title: 'Checkpoint 6: Xử lý CRUD với Django ModelForms',
    testCases: createTestCases('chk-web-06', 'Form 1: True\nForm 2: False', 'tc-web-06'),
  },

  'ex-web-07-he-thong-authentication': {
    exerciseId: 'chk-web-07',
    slug: 'ex-web-07-he-thong-authentication',
    title: 'Checkpoint 7: Hệ thống Authentication đăng nhập/đăng ký',
    testCases: createTestCases('chk-web-07', 'Xin chao, HuyCoder | Dang xuat\nDang nhap | Dang ky', 'tc-web-07'),
  },

  'ex-web-08-phan-quyen-va-bao-mat': {
    exerciseId: 'chk-web-08',
    slug: 'ex-web-08-phan-quyen-va-bao-mat',
    title: 'Checkpoint 8: Quản lý tài khoản & Phân quyền bảo mật @login_required',
    testCases: createTestCases('chk-web-08', '200_authorized\n404_forbidden', 'tc-web-08'),
  },

  'ex-web-09-kiem-thu-ung-dung-testing': {
    exerciseId: 'chk-web-09',
    slug: 'ex-web-09-kiem-thu-ung-dung-testing',
    title: 'Checkpoint 9: Kiểm thử tự động Testing ứng dụng Web',
    testCases: createTestCases('chk-web-09', 'PASS: Status code is 200\nFAIL: Expected 200, got 404', 'tc-web-09'),
  },

  'ex-web-10-quy-chuan-deployment': {
    exerciseId: 'chk-web-10',
    slug: 'ex-web-10-quy-chuan-deployment',
    title: 'Checkpoint 10: Quy chuẩn Triển khai ứng dụng lên Đám mây',
    testCases: createTestCases('chk-web-10', "Production Ready: True\nAudit: {'DEBUG_IS_OFF': True, 'SECRET_KEY_PROTECTED': True, 'PRODUCTION_DB_CONNECTED': True}", 'tc-web-10'),
  },
};

export function getProjectExerciseTests(slug: string): ServerExerciseTestConfig | null {
  return PROJECT_SERVER_TESTS[slug] || null;
}

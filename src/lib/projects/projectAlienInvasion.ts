import { ProjectCourse } from '@/lib/types/project';

export const PROJECT_ALIEN_INVASION: ProjectCourse = {
  id: 'project-alien-invasion',
  slug: 'du-an-01-alien-invasion',
  title: 'Dự án 01: Alien Invasion Game (Pygame)',
  subtitle: 'Xây dựng trò chơi bắn phi thuyền không gian 2D kinh điển với Pygame và lập trình hướng đối tượng OOP',
  category: 'game',
  level: 'advanced',
  accentColor: 'mint',
  estimatedHours: 25,
  prerequisites: [
    'Chương 01 - 07: Nền tảng Python, Điều kiện if & Vòng lặp while',
    'Chương 08: Hàm trong Python (Functions & Modules)',
    'Chương 11: Lập trình hướng đối tượng OOP (Class, Object, Kế thừa)',
  ],
  learningObjectives: [
    'Làm chủ kiến trúc Game Loop 60 FPS chuẩn mực và điều phối sự kiện thời gian thực.',
    'Áp dụng thành thạo nguyên lý hướng đối tượng OOP: Encapsulation, Inheritance từ pygame.sprite.Sprite.',
    'Quản lý bộ nhớ và tối ưu hiệu năng: Tự động dọn dẹp các đối tượng Sprite ra ngoài màn hình.',
    'Xử lý thuật toán ma trận tọa độ để sinh hạm đội quái vật tự động theo kích thước màn hình.',
    'Lập trình toán học phát hiện va chạm Hitbox đa đối tượng (groupcollide, spritecollideany).',
    'Xây dựng hệ thống lưu trữ điểm cao (High Score), quản lý mạng sống và tăng cấp độ khó động.',
  ],
  overview: `Alien Invasion là dự án trò chơi điện tử đồ họa 2D kinh điển lấy cảm hứng từ game Space Invaders. Trong dự án này, bạn sẽ vào vai một kỹ sư Game Engine xây dựng toàn bộ trò chơi từ con số 0:
- Người chơi điều khiển một phi thuyền ở đáy màn hình bằng các phím mũi tên.
- Bắn các tia laser để tiêu diệt hạm đội quái vật không gian đang tiến dần xuống.
- Khi toàn bộ quái vật bị tiêu diệt, hạm đội mới sẽ xuất hiện với tốc độ di chuyển nhanh hơn.
- Nếu quái vật đâm trúng phi thuyền hoặc chạm đáy màn hình, người chơi sẽ mất một mạng. Hết 3 mạng, trò chơi kết thúc.`,
  architectureOverview: `Kiến trúc mã nguồn chuẩn module hóa của dự án:
alien_invasion/
├── alien_invasion.py    # Điểm khởi đầu chính (Main entry point & Game Loop)
├── settings.py          # Lớp Settings quản lý mọi thông số độ phân giải, tốc độ, màu sắc
├── game_stats.py        # Lớp GameStats theo dõi điểm số, mạng tàu, cấp độ
├── scoreboard.py        # Lớp Scoreboard hiển thị điểm số, điểm kỷ lục lên màn hình
├── button.py            # Lớp Button vẽ nút bấm Play tương tác
├── ship.py              # Lớp Ship quản lý tọa độ và hành vi phi thuyền
├── bullet.py            # Lớp Bullet kế thừa pygame.sprite.Sprite
├── alien.py             # Lớp Alien kế thừa pygame.sprite.Sprite
└── images/              # Thư mục tài nguyên ảnh (ship.bmp, alien.bmp)`,
  runtimeMode: 'pyodide_canvas',
  runtimeNotice: `LƯU Ý VỀ MÔI TRƯỜNG THỰC THI:
- Trong trình duyệt CodeCoBUG: Bạn có thể viết và kiểm thử tự động toàn bộ logic cốt lõi (Game Loop, Lớp Ship, Lớp Bullet, Lớp Alien, Thuật toán va chạm và Tính điểm) thông qua các bài kiểm thử xác thực (Test Cases) của Judge Engine.
- Chạy đồ họa gốc trên máy tính cá nhân (Native Window): Pygame yêu cầu cửa sổ đồ họa hệ điều hành (SDL Window). Hãy làm theo "Hướng dẫn chạy trên máy cá nhân" bên dưới để khởi chạy game với đầy đủ 60 FPS mượt mà!`,
  localExecutionGuide: {
    prerequisites: [
      'Python 3.10 trở lên đã được cài đặt trên máy tính (python --version)',
      'Trình quản lý gói pip (pip --version)',
      'Hệ điều hành: Windows, macOS hoặc Linux',
    ],
    installCommands: [
      '# 1. Tạo thư mục dự án và môi trường ảo độc lập',
      'mkdir alien_invasion && cd alien_invasion',
      'python3 -m venv .venv',
      '# Kích hoạt môi trường ảo (Windows: .venv\\Scripts\\activate | Mac/Linux: source .venv/bin/activate)',
      'source .venv/bin/activate',
      '# 2. Cài đặt thư viện Pygame',
      'pip install pygame',
    ],
    runCommand: 'python alien_invasion.py',
    folderStructure: `alien_invasion/
  ├── alien_invasion.py
  ├── settings.py
  ├── ship.py
  ├── bullet.py
  ├── alien.py
  ├── game_stats.py
  ├── scoreboard.py
  └── button.py`,
    notes: [
      'Đảm bảo luôn kích hoạt môi trường ảo (.venv) trước khi chạy lệnh python.',
      'Nếu trên macOS gặp cảnh báo màn hình Retina, Pygame 2.5+ đã tự động hỗ trợ DPI cao.',
    ],
  },
  checkpoints: [
    {
      id: 'chk-ai-01',
      projectId: 'project-alien-invasion',
      slug: 'khoi-tao-pygame-va-cai-dat-cua-so',
      orderIndex: 1,
      title: 'Checkpoint 1: Giới thiệu Pygame, Cấu hình Game Settings & Cửa sổ',
      description: 'Tìm hiểu thư viện Pygame, tạo lớp Settings tập trung hóa toàn bộ cấu hình trò chơi (độ phân giải 1200x800, màu nền RGB, tốc độ).',
      learningObjectives: [
        'Hiểu vai trò của Pygame trong phát triển phần mềm và game đồ họa.',
        'Thiết kế lớp Settings để tránh việc hardcode các giá trị cấu hình rải rác.',
        'Khởi tạo đối tượng cấu hình và kiểm tra tính hợp lệ của tham số màu nền và khung hình.',
      ],
      theoryContent: `Pygame là thư viện mã nguồn mở mạnh mẽ viết trên nền SDL (Simple DirectMedia Layer), cho phép lập trình viên Python tương tác trực tiếp với phần cứng đồ họa, âm thanh và thiết bị ngoại vi.

Khi bắt đầu một dự án game lớn, quy tắc bất thành văn của kỹ sư phần mềm là **không được hardcode** các thông số như kích thước cửa sổ \`1200\`, \`800\` hay màu nền \`(230, 230, 230)\` vào nhiều tệp khác nhau. Thay vào đó, ta tạo tệp \`settings.py\` chứa lớp \`Settings\`. Mọi thành phần trong game chỉ cần tham chiếu đến đối tượng cài đặt này.`,
      codeExplanation: `Lớp Settings khởi tạo các thuộc tính:
- screen_width, screen_height: kích thước cửa sổ game
- bg_color: bộ 3 số nguyên tuple RGB (0-255)
- ship_speed, bullet_speed: tốc độ di chuyển`,
      starterCode: `# Viết lớp Settings để quản lý cài đặt trò chơi
class Settings:
    def __init__(self):
        # Thiết lập kích thước màn hình 1200 x 800
        self.screen_width = 1200
        self.screen_height = 800
        # Màu nền xám nhạt (230, 230, 230)
        self.bg_color = (230, 230, 230)
        # Tốc độ phi thuyền mặc định
        self.ship_speed = 1.5

# Kiểm tra khởi tạo
settings = Settings()
print(f"Screen: {settings.screen_width}x{settings.screen_height}")
print(f"BG Color: {settings.bg_color}")
`,
      solutionCode: `class Settings:
    def __init__(self):
        self.screen_width = 1200
        self.screen_height = 800
        self.bg_color = (230, 230, 230)
        self.ship_speed = 1.5
        self.bullet_speed = 2.5
        self.alien_speed = 1.0

settings = Settings()
print(f"Screen: {settings.screen_width}x{settings.screen_height}")
print(f"BG Color: {settings.bg_color}")
`,
      exerciseSlug: 'ex-ai-01-cai-dat-game-settings',
      hints: [
        'Khai báo self.screen_width = 1200 và self.screen_height = 800 trong phương thức __init__.',
        'Tạo tuple màu RGB (230, 230, 230) gán cho self.bg_color.',
      ],
      localRunHint: 'Trên máy cá nhân, bạn gọi pygame.init() và pygame.display.set_mode((settings.screen_width, settings.screen_height)).',
      testCases: [
        {
          id: 'tc-ai-01-1',
          inputData: '',
          expectedOutput: 'Screen: 1200x800\nBG Color: (230, 230, 230)',
          explanation: 'Khởi tạo lớp Settings chuẩn mực với kích thước 1200x800 và màu nền (230, 230, 230).',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-ai-02',
      projectId: 'project-alien-invasion',
      slug: 'cau-truc-game-loop-va-clock',
      orderIndex: 2,
      title: 'Checkpoint 2: Cấu trúc Game Loop & Quản lý nhịp khung hình Clock',
      description: 'Xây dựng cấu trúc vòng lặp game loop chạy vô tận, điều phối chu kỳ: Lắng nghe sự kiện -> Cập nhật vị trí -> Vẽ lại khung hình -> Đồng bộ nhịp Clock.',
      learningObjectives: [
        'Nắm vững bản chất của Game Loop: vòng lặp while True kiểm soát toàn bộ vòng đời trò chơi.',
        'Hiểu cơ chế pygame.time.Clock() để cố định 60 khung hình/giây (FPS), ngăn game chạy quá nhanh trên máy cấu hình cao.',
        'Tách bạch 3 giai đoạn của một nhịp game: Input -> Update -> Render.',
      ],
      theoryContent: `Mọi trò chơi video đều hoạt động dựa trên một vòng lặp vô hạn gọi là **Game Loop**. Trong mỗi vòng lặp (frame):
1. **Kiểm tra sự kiện (Check Events)**: Người dùng có nhấn phím mũi tên, chuột, hoặc nút đóng cửa sổ không?
2. **Cập nhật trạng thái (Update State)**: Di chuyển phi thuyền, dịch chuyển đạn, hạ thấp quái vật, kiểm tra va chạm.
3. **Vẽ lại màn hình (Render / Flip Screen)**: Tô màu nền, vẽ lại toàn bộ sprite và gọi lật khung hình.
4. **Giới hạn tốc độ khung hình (Tick Clock)**: Dùng \`clock.tick(60)\` để game luôn chạy ổn định ở 60 FPS dù trên máy tính mạnh hay yếu.`,
      codeExplanation: `Mô hình lớp AlienInvasion điều khiển vòng lặp bằng cờ hiệu is_running. Phương thức step() mô phỏng 1 nhịp Game Loop.`,
      starterCode: `class MockGameLoop:
    def __init__(self, target_fps=60):
        self.target_fps = target_fps
        self.frame_count = 0
        self.is_running = True

    def process_frame(self):
        # Tăng số khung hình đã xử lý
        self.frame_count += 1
        return f"Frame {self.frame_count}: Processed at {self.target_fps} FPS"

game = MockGameLoop(60)
for _ in range(3):
    print(game.process_frame())
`,
      solutionCode: `class MockGameLoop:
    def __init__(self, target_fps=60):
        self.target_fps = target_fps
        self.frame_count = 0
        self.is_running = True

    def process_frame(self):
        self.frame_count += 1
        return f"Frame {self.frame_count}: Processed at {self.target_fps} FPS"

game = MockGameLoop(60)
for _ in range(3):
    print(game.process_frame())
`,
      exerciseSlug: 'ex-ai-02-cau-truc-game-loop',
      hints: [
        'Mỗi lần gọi process_frame(), tăng biến đếm self.frame_count lên 1.',
        'In ra định dạng Frame X: Processed at 60 FPS.',
      ],
      testCases: [
        {
          id: 'tc-ai-02-1',
          inputData: '',
          expectedOutput: 'Frame 1: Processed at 60 FPS\nFrame 2: Processed at 60 FPS\nFrame 3: Processed at 60 FPS',
          explanation: 'Mô phỏng 3 nhịp Game Loop ở tốc độ 60 FPS chuẩn mực.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-ai-03',
      projectId: 'project-alien-invasion',
      slug: 'xu-ly-su-kien-ban-phim-chuot',
      orderIndex: 3,
      title: 'Checkpoint 3: Xử lý sự kiện bàn phím và chuột (Event Handling)',
      description: 'Lắng nghe các sự kiện bàn phím pygame.KEYDOWN và pygame.KEYUP, xử lý cờ hiệu di chuyển moving_right, moving_left và thoát game khi nhấn phím Q.',
      learningObjectives: [
        'Hiểu cơ chế hàng đợi sự kiện pygame.event.get().',
        'Phân biệt sự kiện nhấn phím (KEYDOWN) và nhả phím (KEYUP) để chuyển động không bị giật cục.',
        'Kỹ thuật sử dụng cờ hiệu boolean (moving_right, moving_left) để tạo trải nghiệm điều khiển mượt mà.',
      ],
      theoryContent: `Nếu bạn chỉ kiểm tra phím khi người dùng ấn xuống, phi thuyền sẽ chỉ nhích một khoảng nhỏ rồi dừng lại. Để phi thuyền bay liên tục khi **giữ phím**:
- Khi có sự kiện \`KEYDOWN\` với phím mũi tên phải: đặt cờ \`moving_right = True\`.
- Khi có sự kiện \`KEYUP\` với phím mũi tên phải: đặt cờ \`moving_right = False\`.
- Trong hàm cập nhật \`update()\`: chỉ cần kiểm tra \`if moving_right: self.x += speed\`.
- Nếu người chơi ấn phím \`Q\` hoặc nhấp chuột vào nút X đóng cửa sổ: gọi lệnh thoát game an toàn \`sys.exit()\`.`,
      codeExplanation: `Hàm handle_key_event mô phỏng bộ giải mã sự kiện, nhận loại sự kiện và tên phím rồi cập nhật trạng thái cờ hiệu.`,
      starterCode: `class KeyEventHandler:
    def __init__(self):
        self.moving_right = False
        self.moving_left = False

    def handle_event(self, event_type, key):
        # Cập nhật cờ hiệu khi KEYDOWN và KEYUP
        if event_type == "KEYDOWN":
            if key == "RIGHT":
                self.moving_right = True
            elif key == "LEFT":
                self.moving_left = True
        elif event_type == "KEYUP":
            if key == "RIGHT":
                self.moving_right = False
            elif key == "LEFT":
                self.moving_left = False

handler = KeyEventHandler()
handler.handle_event("KEYDOWN", "RIGHT")
print("Khi nhan phai:", handler.moving_right)
handler.handle_event("KEYUP", "RIGHT")
print("Khi nha phai:", handler.moving_right)
`,
      solutionCode: `class KeyEventHandler:
    def __init__(self):
        self.moving_right = False
        self.moving_left = False

    def handle_event(self, event_type, key):
        if event_type == "KEYDOWN":
            if key == "RIGHT":
                self.moving_right = True
            elif key == "LEFT":
                self.moving_left = True
        elif event_type == "KEYUP":
            if key == "RIGHT":
                self.moving_right = False
            elif key == "LEFT":
                self.moving_left = False

handler = KeyEventHandler()
handler.handle_event("KEYDOWN", "RIGHT")
print("Khi nhan phai:", handler.moving_right)
handler.handle_event("KEYUP", "RIGHT")
print("Khi nha phai:", handler.moving_right)
`,
      exerciseSlug: 'ex-ai-03-su-kien-ban-phim-chuot',
      hints: [
        'Đặt cờ moving_right = True khi nhận KEYDOWN phím RIGHT, và đặt về False khi nhận KEYUP phím RIGHT.',
      ],
      testCases: [
        {
          id: 'tc-ai-03-1',
          inputData: '',
          expectedOutput: 'Khi nhan phai: True\nKhi nha phai: False',
          explanation: 'Cờ di chuyển được cập nhật chính xác theo chu trình nhấn và nhả phím.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-ai-04',
      projectId: 'project-alien-invasion',
      slug: 'tao-nhan-vat-phi-thuyen-ship',
      orderIndex: 4,
      title: 'Checkpoint 4: Tạo nhân vật Phi thuyền & Chuyển động mượt mà',
      description: 'Tạo lớp Ship quản lý hình ảnh, tọa độ số thực (float) và giới hạn biên màn hình để phi thuyền không bay ra ngoài lề.',
      learningObjectives: [
        'Sử dụng thuộc tính rect trong Pygame để quản lý hình chữ nhật bao quanh đối tượng.',
        'Lưu tọa độ vị trí dưới dạng số thực float để tốc độ di chuyển có thể nhận giá trị thập phân (ví dụ 1.5 pixel/nhịp).',
        'Cài đặt điều kiện chặn biên: rect.right < screen_rect.right và rect.left > 0.',
      ],
      theoryContent: `Trong Pygame, mọi đối tượng hiển thị đều được gắn với một hình chữ nhật \`rect\` (pygame.Rect). Hình chữ nhật này cung cấp các thuộc tính căn chỉnh rất tiện lợi như \`midbottom\`, \`centerx\`, \`top\`, \`bottom\`.
Vì thuộc tính \`rect.x\` trong Pygame chỉ lưu số nguyên (integer), nếu gán tốc độ \`ship_speed = 1.5\`, Pygame sẽ tự động làm tròn về 1. Để giải quyết, ta lưu một biến float riêng \`self.x\`, cộng dồn số thực mỗi nhịp, rồi mới gán \`self.rect.x = int(self.x)\`.`,
      codeExplanation: `Lớp Ship mô phỏng tọa độ x và hàm update() kiểm tra biên màn hình 1200 pixel.`,
      starterCode: `class Ship:
    def __init__(self, screen_width=1200, speed=1.5):
        self.screen_width = screen_width
        self.speed = speed
        self.x = 600.0  # Vị trí giữa màn hình
        self.moving_right = False
        self.moving_left = False

    def update(self):
        # Di chuyển sang phải nếu chưa chạm mép phải (1200)
        if self.moving_right and self.x < self.screen_width:
            self.x += self.speed
        # Di chuyển sang trái nếu chưa chạm mép trái (0)
        if self.moving_left and self.x > 0:
            self.x -= self.speed

ship = Ship(1200, 2.0)
ship.moving_right = True
ship.update()
ship.update()
print(f"Vi tri tau: {ship.x}")
`,
      solutionCode: `class Ship:
    def __init__(self, screen_width=1200, speed=1.5):
        self.screen_width = screen_width
        self.speed = speed
        self.x = 600.0
        self.moving_right = False
        self.moving_left = False

    def update(self):
        if self.moving_right and self.x < self.screen_width:
            self.x += self.speed
        if self.moving_left and self.x > 0:
            self.x -= self.speed

ship = Ship(1200, 2.0)
ship.moving_right = True
ship.update()
ship.update()
print(f"Vi tri tau: {ship.x}")
`,
      exerciseSlug: 'ex-ai-04-lop-phi-thuyen-chuyen-dong',
      hints: [
        'Cộng dồn self.speed vào self.x mỗi lần gọi update() khi moving_right là True.',
      ],
      testCases: [
        {
          id: 'tc-ai-04-1',
          inputData: '',
          expectedOutput: 'Vi tri tau: 604.0',
          explanation: 'Tàu di chuyển 2 nhịp với tốc độ 2.0 pixel: 600.0 + 2.0*2 = 604.0.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-ai-05',
      projectId: 'project-alien-invasion',
      slug: 'xu-ly-dan-laser-va-sprite-groups',
      orderIndex: 5,
      title: 'Checkpoint 5: Xử lý Đạn Laser & Quản lý đối tượng Sprite Groups',
      description: 'Tạo lớp Bullet kế thừa Sprite, bắn đạn khi ấn phím Space, lưu trữ đạn trong nhóm pygame.sprite.Group và tự động xóa đạn khi bay ra khỏi màn hình.',
      learningObjectives: [
        'Hiểu khái niệm Sprite và Sprite Group trong Game Development.',
        'Kế thừa từ pygame.sprite.Sprite và gọi super().__init__().',
        'Kỹ thuật quản lý tài nguyên bộ nhớ: Xóa bỏ các viên đạn có y <= 0 bằng copy list để tránh Memory Leak.',
      ],
      theoryContent: `Khi người chơi bắn đạn liên tục, hàng trăm viên đạn sẽ được tạo ra. Nếu không xóa đi khi chúng bay ra khỏi đỉnh màn hình, game sẽ tiêu tốn bộ nhớ RAM ngày càng nhiều và cuối cùng bị giật lag (Memory Leak).
Trong Pygame, ta nhóm các viên đạn vào \`pygame.sprite.Group()\`. Trong mỗi nhịp game:
\`\`\`python
for bullet in bullets.copy():
    if bullet.rect.bottom <= 0:
        bullets.remove(bullet)
\`\`\`
Việc duyệt qua bản sao \`.copy()\` là bắt buộc trong Python khi bạn muốn xóa phần tử của danh sách trong lúc đang lặp.`,
      codeExplanation: `Mô phỏng lớp BulletGroup quản lý danh sách đạn và hàm cleanup() loại bỏ các viên đạn bay khỏi màn hình.`,
      starterCode: `class Bullet:
    def __init__(self, y):
        self.y = y

class BulletManager:
    def __init__(self):
        self.bullets = []

    def add_bullet(self, y):
        self.bullets.append(Bullet(y))

    def cleanup(self):
        # Giữ lại các viên đạn có y > 0
        self.bullets = [b for b in self.bullets if b.y > 0]

bm = BulletManager()
bm.add_bullet(50)
bm.add_bullet(-10) # Đã ra ngoài màn hình
bm.add_bullet(120)
bm.cleanup()
print(f"So dan con lai: {len(bm.bullets)}")
`,
      solutionCode: `class Bullet:
    def __init__(self, y):
        self.y = y

class BulletManager:
    def __init__(self):
        self.bullets = []

    def add_bullet(self, y):
        self.bullets.append(Bullet(y))

    def cleanup(self):
        self.bullets = [b for b in self.bullets if b.y > 0]

bm = BulletManager()
bm.add_bullet(50)
bm.add_bullet(-10)
bm.add_bullet(120)
bm.cleanup()
print(f"So dan con lai: {len(bm.bullets)}")
`,
      exerciseSlug: 'ex-ai-05-dan-laser-sprite-groups',
      hints: [
        'Sử dụng list comprehension [b for b in self.bullets if b.y > 0] để lọc bỏ đạn ngoài màn hình.',
      ],
      testCases: [
        {
          id: 'tc-ai-05-1',
          inputData: '',
          expectedOutput: 'So dan con lai: 2',
          explanation: 'Viên đạn có y = -10 bị loại bỏ, chỉ còn lại 2 viên đạn hợp lệ.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-ai-06',
      projectId: 'project-alien-invasion',
      slug: 'ham-doi-quai-vat-alien-fleet',
      orderIndex: 6,
      title: 'Checkpoint 6: Xây dựng Hạm đội Quái vật ngoài hành tinh (Alien Fleet)',
      description: 'Tính toán toán học số lượng quái vật theo hàng và cột, dùng vòng lặp lồng nhau để tạo hạm đội Alien di chuyển nhịp nhàng.',
      learningObjectives: [
        'Thuật toán tính toán số lượng Alien vừa vặn với kích thước màn hình mà không bị chèn lên nhau.',
        'Sử dụng 2 vòng lặp for lồng nhau (hàng và cột) để sinh lưới quái vật.',
        'Cơ chế di chuyển hạm đội: đồng loạt dịch chuyển ngang, khi chạm mép thì hạ thấp và đổi hướng.',
      ],
      theoryContent: `Để tạo hạm đội quái vật đẹp mắt, ta không đặt tọa độ thủ công từng con quái vật. Thay vào đó, ta đo chiều rộng \`alien_width\` của một con quái vật, chừa khoảng cách an toàn giữa các con, và tính:
\`\`\`python
available_space_x = screen_width - (2 * alien_width)
number_aliens_x = available_space_x // (2 * alien_width)
\`\`\`
Tương tự cho trục dọc Y. Sau đó, ta dùng 2 vòng lặp \`for row_number\` và \`for alien_number\` để sinh ra toàn bộ ma trận hạm đội.`,
      codeExplanation: `Mô phỏng hàm calculate_fleet_size tính toán số lượng quái vật trên 1 hàng và tổng số quái vật trên ma trận.`,
      starterCode: `def calculate_fleet(screen_width, alien_width, rows):
    # Mỗi con alien chiếm 2 lần chiều rộng (1 thân + 1 khoảng trống)
    available_space = screen_width - (2 * alien_width)
    number_aliens_x = available_space // (2 * alien_width)
    total_aliens = number_aliens_x * rows
    return number_aliens_x, total_aliens

per_row, total = calculate_fleet(1200, 60, 3)
print(f"Moi hang: {per_row} quai vat")
print(f"Tong so: {total} quai vat")
`,
      solutionCode: `def calculate_fleet(screen_width, alien_width, rows):
    available_space = screen_width - (2 * alien_width)
    number_aliens_x = available_space // (2 * alien_width)
    total_aliens = number_aliens_x * rows
    return number_aliens_x, total_aliens

per_row, total = calculate_fleet(1200, 60, 3)
print(f"Moi hang: {per_row} quai vat")
print(f"Tong so: {total} quai vat")
`,
      exerciseSlug: 'ex-ai-06-ham-doi-quai-vat-alien',
      hints: [
        'Với screen_width = 1200 và alien_width = 60, available_space = 1080. 1080 // 120 = 9 quái vật mỗi hàng.',
      ],
      testCases: [
        {
          id: 'tc-ai-06-1',
          inputData: '',
          expectedOutput: 'Moi hang: 9 quai vat\nTong so: 27 quai vat',
          explanation: 'Hạm đội gồm 3 hàng, mỗi hàng có 9 quái vật, tổng cộng 27 con.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-ai-07',
      projectId: 'project-alien-invasion',
      slug: 'quan-ly-va-cham-hitbox',
      orderIndex: 7,
      title: 'Checkpoint 7: Quản lý va chạm Hitbox (Collision Detection)',
      description: 'Phát hiện va chạm giữa đạn và quái vật (pygame.sprite.groupcollide) để tiêu diệt quái vật; kiểm tra va chạm giữa quái vật và phi thuyền để trừ mạng.',
      learningObjectives: [
        'Hiểu bản chất của kiểm tra va chạm hộp chữ nhật AABB (Axis-Aligned Bounding Box).',
        'Ứng dụng hàm pygame.sprite.groupcollide(bullets, aliens, True, True) để xóa cả đạn và quái vật khi chạm nhau.',
        'Ứng dụng hàm pygame.sprite.spritecollideany(ship, aliens) để phát hiện tai nạn phi thuyền.',
      ],
      theoryContent: `Xử lý va chạm là trái tim của trò chơi hành động:
1. **Đạn bắn trúng quái vật**: \`pygame.sprite.groupcollide(bullets, aliens, True, True)\`
   - Hai tham số \`True, True\` báo cho Pygame biết cần xóa cả viên đạn và con quái vật va chạm.
   - Khi nhóm \`aliens\` trở nên rỗng (\`not aliens\`), người chơi đã chiến thắng đợt tấn công đó, ta gọi hàm tái tạo hạm đội mới và tăng tốc độ game!
2. **Quái vật chạm phi thuyền hoặc chạm đáy**:
   - Trừ 1 mạng sống của người chơi (\`ships_left -= 1\`).
   - Dọn sạch đạn và quái vật trên màn hình, đưa tàu về vị trí xuất phát, tạm dừng 0.5 giây để người chơi chuẩn bị.
   - Nếu \`ships_left <= 0\`, chuyển trạng thái \`game_active = False\`.`,
      codeExplanation: `Mô phỏng thuật toán va chạm AABB 1D giữa tọa độ x, y của đạn và quái vật.`,
      starterCode: `def check_collision(bullet_rect, alien_rect):
    # Kiểm tra va chạm hộp chữ nhật đơn giản: (bx, by) vs (ax, ay, aw, ah)
    bx, by = bullet_rect
    ax, ay, aw, ah = alien_rect
    return (ax <= bx <= ax + aw) and (ay <= by <= ay + ah)

bullet = (105, 50)
alien = (100, 40, 50, 30) # x=100..150, y=40..70
hit = check_collision(bullet, alien)
print(f"Ban trung: {hit}")
`,
      solutionCode: `def check_collision(bullet_rect, alien_rect):
    bx, by = bullet_rect
    ax, ay, aw, ah = alien_rect
    return (ax <= bx <= ax + aw) and (ay <= by <= ay + ah)

bullet = (105, 50)
alien = (100, 40, 50, 30)
hit = check_collision(bullet, alien)
print(f"Ban trung: {hit}")
`,
      exerciseSlug: 'ex-ai-07-quan-ly-va-cham-hitbox',
      hints: [
        'Tọa độ đạn x=105 nằm trong khoảng [100, 150], y=50 nằm trong [40, 70] nên kết quả là True.',
      ],
      testCases: [
        {
          id: 'tc-ai-07-1',
          inputData: '',
          expectedOutput: 'Ban trung: True',
          explanation: 'Phát hiện va chạm chính xác giữa đạn và quái vật.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-ai-08',
      projectId: 'project-alien-invasion',
      slug: 'tinh-diem-va-quan-ly-trang-thai-game',
      orderIndex: 8,
      title: 'Checkpoint 8: Hệ thống Tính điểm, Điểm cao & Quản lý Trạng thái Game',
      description: 'Xây dựng lớp GameStats và Scoreboard: Tính điểm thưởng khi tiêu diệt quái vật, lưu điểm kỷ lục High Score và nâng cấp độ khó theo từng màn chơi.',
      learningObjectives: [
        'Thiết kế lớp GameStats quản lý trạng thái trò chơi (mạng sống, điểm số, level, high_score).',
        'Tạo cơ chế cập nhật điểm kỷ lục: if stats.score > stats.high_score: stats.high_score = stats.score.',
        'Thiết kế cơ chế tăng độ khó động (Dynamic Difficulty Scaling): mỗi khi sang màn mới, tăng tốc độ 1.1 lần.',
      ],
      theoryContent: `Một trò chơi hoàn chỉnh không thể thiếu hệ thống tính điểm và lưu kỷ lục:
- Mỗi con quái vật bị bắn hạ sẽ cộng một số điểm nhất định (ví dụ 50 điểm ở màn 1, tăng dần ở các màn sau).
- Điểm kỷ lục \`high_score\` được duy trì xuyên suốt các lượt chơi mới.
- Quản lý trạng thái \`game_active\`: Khi \`game_active == False\`, hiển thị nút Play. Khi người chơi nhấn Play, ta reset lại điểm số, 3 mạng tàu, và bắt đầu màn chơi mới.`,
      codeExplanation: `Mô phỏng lớp GameStats xử lý cộng điểm, cập nhật kỷ lục High Score và tăng cấp độ màn chơi.`,
      starterCode: `class GameStats:
    def __init__(self):
        self.score = 0
        self.high_score = 1000
        self.level = 1

    def add_score(self, points):
        self.score += points
        if self.score > self.high_score:
            self.high_score = self.score

    def next_level(self):
        self.level += 1

stats = GameStats()
stats.add_score(500)
stats.add_score(700) # Tong 1200 > 1000
stats.next_level()
print(f"Score: {stats.score} | High Score: {stats.high_score} | Level: {stats.level}")
`,
      solutionCode: `class GameStats:
    def __init__(self):
        self.score = 0
        self.high_score = 1000
        self.level = 1

    def add_score(self, points):
        self.score += points
        if self.score > self.high_score:
            self.high_score = self.score

    def next_level(self):
        self.level += 1

stats = GameStats()
stats.add_score(500)
stats.add_score(700)
stats.next_level()
print(f"Score: {stats.score} | High Score: {stats.high_score} | Level: {stats.level}")
`,
      exerciseSlug: 'ex-ai-08-tinh-diem-va-trang-thai-game',
      hints: [
        '500 + 700 = 1200 điểm. Vì 1200 > 1000 nên High Score được cập nhật thành 1200. Level tăng lên 2.',
      ],
      testCases: [
        {
          id: 'tc-ai-08-1',
          inputData: '',
          expectedOutput: 'Score: 1200 | High Score: 1200 | Level: 2',
          explanation: 'Hệ thống tính điểm và cập nhật kỷ lục High Score hoạt động hoàn hảo.',
          isHidden: false,
        },
      ],
    },
  ],
};


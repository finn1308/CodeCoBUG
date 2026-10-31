import { ProjectCourse } from '@/lib/types/project';

export const PROJECT_DATA_VISUALIZATION: ProjectCourse = {
  id: 'project-data-visualization',
  slug: 'du-an-02-data-visualization',
  title: 'Dự án 02: Trực quan hóa Dữ liệu Khoa học (Matplotlib & Plotly)',
  subtitle: 'Khai phá và chuyển hóa dữ liệu số thành biểu đồ trực quan, phân tích thời tiết CSV, bản đồ động đất GeoJSON và Web APIs',
  category: 'data',
  level: 'advanced',
  accentColor: 'sky',
  estimatedHours: 20,
  prerequisites: [
    'Chương 01 - 05: Kiểu dữ liệu, Danh sách Lists, Cắt lát & Tuples',
    'Chương 06: Từ điển Dictionaries & Xử lý Key-Value',
    'Chương 10: Tệp tin (Files), Xử lý chuỗi JSON, CSV và Ngoại lệ (Exceptions)',
  ],
  learningObjectives: [
    'Thành thạo thư viện khoa học Matplotlib để tạo biểu đồ đường (Line Plot) và phân tán (Scatter Plot).',
    'Ứng dụng thư viện biểu đồ tương tác Plotly Express hiển thị trực tiếp trên trình duyệt Web.',
    'Mô phỏng toán học quá trình ngẫu nhiên Random Walk áp dụng trong vật lý hạt và tài chính.',
    'Kỹ năng phân tích và làm sạch dữ liệu bảng tính CSV thực tế (Data Cleansing) với module csv và datetime.',
    'Trực quan hóa dữ liệu địa lý toàn cầu GeoJSON với bản đồ tương tác.',
    'Khai thác dữ liệu trực tuyến qua REST API với Requests và trực quan hóa các dự án công nghệ mã nguồn mở hàng đầu.',
  ],
  overview: `Dự án Trực quan hóa Dữ liệu (Data Visualization) đưa bạn vào vai trò của một Kỹ sư Dữ liệu (Data Scientist):
- Bắt đầu từ các khái niệm cơ bản về trực quan hóa dữ liệu số với Matplotlib.
- Mô phỏng bước đi ngẫu nhiên 50.000 điểm dữ liệu tạo nên các tác phẩm nghệ thuật toán học.
- Dùng Plotly Express để phân tích thống kê xác suất khi gieo xúc xắc.
- Đọc và làm sạch bộ dữ liệu thời tiết thực tế từ hai trạm khí tượng Sitka và Death Valley (Thung lũng Chết).
- Vẽ bản đồ nhiệt địa chấn toàn cầu từ tệp GeoJSON của Cục Khảo sát Địa chất Hoa Kỳ (USGS).
- Tự động gọi API GitHub để tìm kiếm và vẽ đồ thị tương tác về các dự án mã nguồn mở hot nhất hiện nay.`,
  architectureOverview: `Cấu trúc các mô-đun phân tích dữ liệu trong dự án:
data_visualization/
├── mpl_squares.py       # Đồ thị đường bình phương với Matplotlib
├── scatter_squares.py   # Biểu đồ phân tán 1000 điểm với Colormap
├── random_walk.py       # Lớp RandomWalk mô phỏng chuyển động Brown
├── rw_visual.py         # Trực quan hóa 50,000 bước đi ngẫu nhiên
├── die.py               # Lớp Die mô phỏng con xúc xắc D6 & D10
├── dice_visual.py       # Biểu đồ cột tương tác Plotly Express
├── sitka_highs.py       # Phân tích tệp CSV nhiệt độ Sitka
├── death_valley.py      # Xử lý ngoại lệ khuyết thiếu dữ liệu CSV
├── eq_world_map.py      # Bản đồ nhiệt động đất toàn cầu GeoJSON
└── python_repos.py      # Khai thác REST API GitHub & Biểu đồ tương tác`,
  runtimeMode: 'pyodide_data',
  runtimeNotice: `LƯU Ý VỀ MÔI TRƯỜNG THỰC THI:
- Trong trình duyệt CodeCoBUG: Toàn bộ quá trình tính toán khoa học, phân tích mảng số liệu, xử lý chuỗi CSV, JSON, tính toán tần suất và làm sạch dữ liệu đều chạy 100% trên Pyodide WebAssembly.
- Matplotlib và Plotly trên máy cá nhân: Để mở cửa sổ biểu đồ tương tác trên máy tính hoặc xuất file HTML/PNG, bạn chỉ cần cài đặt pip theo hướng dẫn bên dưới.`,
  localExecutionGuide: {
    prerequisites: [
      'Python 3.10 trở lên',
      'Công cụ pip và môi trường ảo venv',
    ],
    installCommands: [
      '# 1. Tạo thư mục và môi trường ảo khoa học dữ liệu',
      'mkdir data_visualization && cd data_visualization',
      'python3 -m venv .venv',
      'source .venv/bin/activate',
      '# 2. Cài đặt các thư viện khoa học dữ liệu',
      'pip install matplotlib plotly pandas requests',
    ],
    runCommand: 'python sitka_highs.py',
    folderStructure: `data_visualization/
  ├── data/
  │   ├── sitka_weather_2021_simple.csv
  │   ├── death_valley_2021_simple.csv
  │   └── eq_data_30_day_m1.geojson
  ├── random_walk.py
  ├── die.py
  └── sitka_highs.py`,
    notes: [
      'Plotly sẽ tự động mở tab trình duyệt mới để hiển thị biểu đồ HTML tương tác khi chạy lệnh fig.show().',
    ],
  },
  checkpoints: [
    {
      id: 'chk-dv-01',
      projectId: 'project-data-visualization',
      slug: 'gioi-thieu-du-lieu-va-cau-truc-du-lieu',
      orderIndex: 1,
      title: 'Checkpoint 1: Giới thiệu Dữ liệu số & Xử lý Dữ liệu có cấu trúc',
      description: 'Làm quen với tư duy khoa học dữ liệu, cấu trúc mảng 1D, 2D và kỹ thuật List Comprehension để tính toán nhanh hàng ngàn điểm dữ liệu.',
      learningObjectives: [
        'Hiểu bản chất của dữ liệu số và quy trình trích xuất thông tin từ mảng thô.',
        'Sử dụng List Comprehension để sinh tọa độ x, y cho các hàm toán học (như y = x^2, y = x^3).',
        'Tách bạch dữ liệu đầu vào (data series) và giao diện hiển thị biểu đồ.',
      ],
      theoryContent: `Trực quan hóa dữ liệu (Data Visualization) là nghệ thuật và khoa học biến những con số khô khan thành hình ảnh trực quan giúp bộ não con người nắm bắt xu hướng, mô hình (patterns) và ngoại lệ (anomalies) trong tích tắc.
Trước khi vẽ biểu đồ, ta phải chuẩn bị dữ liệu dưới dạng các chuỗi số (data series) tương ứng với trục X và trục Y. Trong Python, cấu trúc \`list\` kết hợp \`range()\` và \`list comprehension\` là công cụ mạnh mẽ nhất để sinh tọa độ mẫu:
\`\`\`python
x_values = range(1, 1001)
y_values = [x**2 for x in x_values]
\`\`\``,
      codeExplanation: `Tạo chuỗi giá trị x từ 1 đến 5 và mảng giá trị bình phương y tương ứng.`,
      starterCode: `# Sinh dữ liệu x từ 1 đến 5 và y = x bình phương
x_vals = list(range(1, 6))
y_vals = [x**2 for x in x_vals]

print(f"X: {x_vals}")
print(f"Y: {y_vals}")
`,
      solutionCode: `x_vals = list(range(1, 6))
y_vals = [x**2 for x in x_vals]

print(f"X: {x_vals}")
print(f"Y: {y_vals}")
`,
      exerciseSlug: 'ex-dv-01-cau-truc-du-lieu-khoa-hoc',
      hints: [
        'Dùng list(range(1, 6)) để sinh [1, 2, 3, 4, 5].',
        'y_vals tính bằng [x**2 for x in x_vals] ra [1, 4, 9, 16, 25].',
      ],
      testCases: [
        {
          id: 'tc-dv-01-1',
          inputData: '',
          expectedOutput: 'X: [1, 2, 3, 4, 5]\nY: [1, 4, 9, 16, 25]',
          explanation: 'Sinh chuỗi dữ liệu trục X và Y chính xác.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-dv-02',
      projectId: 'project-data-visualization',
      slug: 'gioi-thieu-matplotlib-va-bieu-do-duong',
      orderIndex: 2,
      title: 'Checkpoint 2: Giới thiệu Matplotlib & Vẽ đồ thị đường cơ bản',
      description: 'Làm quen với thư viện Matplotlib (module pyplot), cấu trúc đối tượng Figure và Axes, thiết lập nhãn trục X/Y, tiêu đề và kích thước nét vẽ.',
      learningObjectives: [
        'Hiểu kiến trúc phân cấp của Matplotlib: Figure (toàn bộ khung tranh) và Axes (vùng đồ thị thực tế).',
        'Sử dụng plt.subplots() để tạo giao diện biểu đồ chuyên nghiệp.',
        'Thiết lập tiêu đề (set_title), nhãn trục (set_xlabel, set_ylabel) và kích thước chữ (fontsize).',
      ],
      theoryContent: `Matplotlib là thư viện trực quan hóa dữ liệu nền tảng lâu đời và phổ biến nhất trong hệ sinh thái Python. Module trung tâm là \`matplotlib.pyplot\`.
Quy chuẩn hiện đại của Matplotlib là sử dụng cú pháp hướng đối tượng:
\`\`\`python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot(x_values, y_values, linewidth=3)
ax.set_title("Bình phương các số", fontsize=20)
ax.set_xlabel("Giá trị", fontsize=14)
ax.set_ylabel("Bình phương", fontsize=14)
plt.show()
\`\`\`
Nếu không truyền \`x_values\`, Matplotlib sẽ tự động giả định X bắt đầu từ 0 (gây sai lệch nếu dữ liệu bắt đầu từ 1). Do đó, luôn luôn truyền đủ cặp (X, Y).`,
      codeExplanation: `Mô phỏng cấu trúc thông số cấu hình đồ thị đường Matplotlib.`,
      starterCode: `class MockMatplotlibPlot:
    def __init__(self, title, xlabel, ylabel, linewidth=2):
        self.title = title
        self.xlabel = xlabel
        self.ylabel = ylabel
        self.linewidth = linewidth

    def render_summary(self, x_len, y_len):
        return f"Plot: '{self.title}' | Points: {x_len} | LineWidth: {self.linewidth}"

plot = MockMatplotlibPlot("Bieu do Binh phuong", "Gia tri", "Ket qua", linewidth=3)
print(plot.render_summary(5, 5))
`,
      solutionCode: `class MockMatplotlibPlot:
    def __init__(self, title, xlabel, ylabel, linewidth=2):
        self.title = title
        self.xlabel = xlabel
        self.ylabel = ylabel
        self.linewidth = linewidth

    def render_summary(self, x_len, y_len):
        return f"Plot: '{self.title}' | Points: {x_len} | LineWidth: {self.linewidth}"

plot = MockMatplotlibPlot("Bieu do Binh phuong", "Gia tri", "Ket qua", linewidth=3)
print(plot.render_summary(5, 5))
`,
      exerciseSlug: 'ex-dv-02-do-thi-duong-matplotlib',
      hints: [
        'Khởi tạo đối tượng với title="Bieu do Binh phuong", linewidth=3 và in thông tin tóm tắt.',
      ],
      testCases: [
        {
          id: 'tc-dv-02-1',
          inputData: '',
          expectedOutput: "Plot: 'Bieu do Binh phuong' | Points: 5 | LineWidth: 3",
          explanation: 'Cấu hình đồ thị đường Matplotlib hoàn chỉnh.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-dv-03',
      projectId: 'project-data-visualization',
      slug: 'bieu-do-phan-tan-va-random-walk',
      orderIndex: 3,
      title: 'Checkpoint 3: Biểu đồ phân tán (Scatter Plot) & Bước đi ngẫu nhiên (Random Walk)',
      description: 'Xây dựng lớp RandomWalk mô phỏng chuyển động Brown trong vật lý, vẽ 5.000 điểm bước đi ngẫu nhiên với bảng màu chuyển sắc Colormap.',
      learningObjectives: [
        'Hiểu cách hoạt động của ax.scatter() để vẽ các điểm rời rạc thay vì nối đường thẳng.',
        'Sử dụng module random.choice([1, -1]) và random.choice([0, 1, 2, 3, 4]) để tính toán bước đi ngẫu nhiên.',
        'Ứng dụng dải màu gradient (c=point_numbers, cmap=plt.cm.Blues) để phân biệt thứ tự thời gian của các điểm bước đi.',
      ],
      theoryContent: `**Bước đi ngẫu nhiên (Random Walk)** là quá trình tạo ra một chuỗi bước đi, trong đó hướng đi và độ dài mỗi bước được quyết định hoàn toàn ngẫu nhiên. Khái niệm này xuất hiện khắp nơi trong thế giới thực:
- Chuyển động Brown của các hạt phấn hoa lơ lửng trong nước.
- Đường đi của phấn hoa thụ phấn nhờ gió.
- Biến động giá cổ phiếu trên thị trường chứng khoán.
Ta xây dựng lớp \`RandomWalk\`. Trong hàm \`fill_walk()\`, ta tính:
\`step = direction * distance\` cho cả trục X và trục Y, sau đó cộng dồn vào tọa độ điểm trước đó.`,
      codeExplanation: `Lớp RandomWalk mô phỏng 5 bước đi ngẫu nhiên dựa trên các giá trị có sẵn.`,
      starterCode: `class MockRandomWalk:
    def __init__(self, num_points=5):
        self.num_points = num_points
        self.x_values = [0]
        self.y_values = [0]

    def add_step(self, x_step, y_step):
        new_x = self.x_values[-1] + x_step
        new_y = self.y_values[-1] + y_step
        self.x_values.append(new_x)
        self.y_values.append(new_y)

rw = MockRandomWalk()
rw.add_step(2, 3)
rw.add_step(-1, 4)
print(f"X: {rw.x_values}")
print(f"Y: {rw.y_values}")
`,
      solutionCode: `class MockRandomWalk:
    def __init__(self, num_points=5):
        self.num_points = num_points
        self.x_values = [0]
        self.y_values = [0]

    def add_step(self, x_step, y_step):
        new_x = self.x_values[-1] + x_step
        new_y = self.y_values[-1] + y_step
        self.x_values.append(new_x)
        self.y_values.append(new_y)

rw = MockRandomWalk()
rw.add_step(2, 3)
rw.add_step(-1, 4)
print(f"X: {rw.x_values}")
print(f"Y: {rw.y_values}")
`,
      exerciseSlug: 'ex-dv-03-scatter-plot-random-walk',
      hints: [
        'Bước 1: 0+2=2, 0+3=3. Bước 2: 2+(-1)=1, 3+4=7. Tọa độ X là [0, 2, 1], Y là [0, 3, 7].',
      ],
      testCases: [
        {
          id: 'tc-dv-03-1',
          inputData: '',
          expectedOutput: 'X: [0, 2, 1]\nY: [0, 3, 7]',
          explanation: 'Mô phỏng chuỗi bước đi ngẫu nhiên chính xác.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-dv-04',
      projectId: 'project-data-visualization',
      slug: 'gioi-thieu-plotly-va-xac-suat-xuc-xac',
      orderIndex: 4,
      title: 'Checkpoint 4: Giới thiệu Plotly Express & Biểu đồ cột xác suất xúc xắc',
      description: 'Mô phỏng việc tung đồng thời 2 con xúc xắc 1.000 lần, thống kê tần suất tổng số điểm từ 2 đến 12 và vẽ biểu đồ cột tương tác với Plotly.',
      learningObjectives: [
        'Hiểu thế mạnh của Plotly Express so với Matplotlib: tạo biểu đồ Web tương tác (zoom, pan, hover tooltip).',
        'Xây dựng lớp Die mô phỏng con xúc xắc n mặt (D6, D10).',
        'Thuật toán tính tần suất xuất hiện (frequency analysis) bằng phương pháp đếm trong Python.',
      ],
      theoryContent: `Khi tung hai con xúc xắc 6 mặt, tổng số điểm có thể dao động từ 2 (1+1) đến 12 (6+6). Tuy nhiên, khả năng ra số 7 là cao nhất (vì có tới 6 cách phối hợp: 1+6, 2+5, 3+4, 4+3, 5+2, 6+1), trong khi số 2 và 12 chỉ có đúng 1 cách phối hợp.
Plotly Express (\`px.bar\`) tạo ra biểu đồ tương tác: khi rê chuột vào từng cột, người xem sẽ thấy chính xác số lần xuất hiện và tỷ lệ phần trăm.`,
      codeExplanation: `Thuật toán đếm tần suất tổng điểm của 2 con xúc xắc từ danh sách kết quả mẫu.`,
      starterCode: `def analyze_dice_rolls(results, min_sum=2, max_sum=12):
    frequencies = []
    for value in range(min_sum, max_sum + 1):
        count = results.count(value)
        frequencies.append(count)
    return frequencies

# Giả lập 10 lần tung xúc xắc
sample_results = [7, 7, 7, 2, 12, 6, 8, 7, 5, 6]
freqs = analyze_dice_rolls(sample_results, 2, 12)
print(f"Tan suat so 7: {sample_results.count(7)}")
print(f"Tan suat so 2: {sample_results.count(2)}")
`,
      solutionCode: `def analyze_dice_rolls(results, min_sum=2, max_sum=12):
    frequencies = []
    for value in range(min_sum, max_sum + 1):
        count = results.count(value)
        frequencies.append(count)
    return frequencies

sample_results = [7, 7, 7, 2, 12, 6, 8, 7, 5, 6]
freqs = analyze_dice_rolls(sample_results, 2, 12)
print(f"Tan suat so 7: {sample_results.count(7)}")
print(f"Tan suat so 2: {sample_results.count(2)}")
`,
      exerciseSlug: 'ex-dv-04-xac-suat-xuc-xac-plotly',
      hints: [
        'Trong mẫu có 4 số 7 và 1 số 2. Kết quả in ra lần lượt là 4 và 1.',
      ],
      testCases: [
        {
          id: 'tc-dv-04-1',
          inputData: '',
          expectedOutput: 'Tan suat so 7: 4\nTan suat so 2: 1',
          explanation: 'Thống kê tần suất xuất hiện số 7 và số 2 chuẩn xác.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-dv-05',
      projectId: 'project-data-visualization',
      slug: 'doc-va-phan-tich-csv-thoi-tiet',
      orderIndex: 5,
      title: 'Checkpoint 5: Đọc & Phân tích tệp CSV thời tiết thực tế & Xử lý ngoại lệ',
      description: 'Sử dụng module csv đọc dữ liệu thời tiết thực tế, trích xuất dòng tiêu đề header, chuyển đổi chuỗi ngày tháng datetime và bắt lỗi khuyết thiếu dữ liệu với try-except.',
      learningObjectives: [
        'Sử dụng csv.reader() để phân tích cú pháp tệp dữ liệu bảng tính CSV.',
        'Trích xuất dòng tiêu đề bằng next(reader) và tìm chỉ số cột tự động.',
        'Xử lý dữ liệu bị rỗng hoặc lỗi đo đạc bằng khối try - except ValueError.',
      ],
      theoryContent: `Trong thực tế, dữ liệu khí tượng không bao giờ hoàn hảo. Ví dụ tại trạm khí tượng Death Valley (Thung lũng Chết), một số ngày nhiệt kế bị hỏng hoặc cảm biến không ghi nhận dữ liệu, dẫn đến ô dữ liệu bị để trống \`""\`.
Nếu bạn cố tình ép kiểu \`int("")\`, chương trình sẽ sụp đổ ngay lập tức với lỗi \`ValueError\`. Kỹ thuật chuẩn trong Data Engineering:
\`\`\`python
try:
    high = int(row[4])
    low = int(row[5])
except ValueError:
    print(f"Khuyết thiếu dữ liệu ngày {current_date}")
else:
    dates.append(current_date)
    highs.append(high)
\`\`\``,
      codeExplanation: `Hàm parse_weather_row xử lý một dòng dữ liệu thời tiết, bỏ qua các dòng lỗi giá trị.`,
      starterCode: `def parse_temperature(val_str):
    try:
        return int(val_str)
    except ValueError:
        return None

row_data = ["2026-10-30", "85", "", "60"]
temps = [parse_temperature(v) for v in row_data[1:]]
valid_temps = [t for t in temps if t is not None]

print(f"Ket qua loc: {valid_temps}")
`,
      solutionCode: `def parse_temperature(val_str):
    try:
        return int(val_str)
    except ValueError:
        return None

row_data = ["2026-10-30", "85", "", "60"]
temps = [parse_temperature(v) for v in row_data[1:]]
valid_temps = [t for t in temps if t is not None]

print(f"Ket qua loc: {valid_temps}")
`,
      exerciseSlug: 'ex-dv-05-doc-va-phan-tich-csv',
      hints: [
        'Giá trị rỗng "" trả về None và bị loại bỏ, chỉ còn lại [85, 60].',
      ],
      testCases: [
        {
          id: 'tc-dv-05-1',
          inputData: '',
          expectedOutput: 'Ket qua loc: [85, 60]',
          explanation: 'Lọc dữ liệu rỗng an toàn không gây sụp đổ chương trình.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-dv-06',
      projectId: 'project-data-visualization',
      slug: 'truc-quan-hoa-geojson-dong-dat',
      orderIndex: 6,
      title: 'Checkpoint 6: Trực quan hóa dữ liệu bản đồ nhiệt GeoJSON động đất',
      description: 'Đọc dữ liệu địa chấn toàn cầu từ USGS bằng module json, trích xuất kinh độ, vĩ độ, độ Richter và vẽ bản đồ nhiệt tương tác px.scatter_geo.',
      learningObjectives: [
        'Hiểu cấu trúc định dạng tệp bản đồ địa lý GeoJSON: features, geometry, coordinates.',
        'Trích xuất kinh độ (longitude) và vĩ độ (latitude) từ mảng tọa độ [lon, lat, depth].',
        'Tùy biến kích thước điểm (size) và màu sắc (color) tỷ lệ thuận với độ lớn cơn địa chấn.',
      ],
      theoryContent: `GeoJSON là định dạng chuẩn hóa dựa trên JSON để biểu diễn các đối tượng địa lý. Trong tệp dữ liệu động đất của USGS, mỗi trận động đất là một phần tử trong danh sách \`features\`.
Chú ý quan trọng: Trong GeoJSON, tọa độ được lưu theo thứ tự **[Kinh độ (X), Vĩ độ (Y)]**, ngược lại với thói quen đọc thông thường (Vĩ độ trước, Kinh độ sau). Do đó:
- \`longitude = eq_dict['geometry']['coordinates'][0]\`
- \`latitude = eq_dict['geometry']['coordinates'][1]\`
- \`magnitude = eq_dict['properties']['mag']\``,
      codeExplanation: `Trích xuất thông số động đất từ đối tượng feature mẫu của USGS.`,
      starterCode: `sample_feature = {
    "properties": {"mag": 5.8, "place": "Near Coast of Northern Chile"},
    "geometry": {"coordinates": [-71.25, -29.82, 45.0]}
}

mag = sample_feature["properties"]["mag"]
lon = sample_feature["geometry"]["coordinates"][0]
lat = sample_feature["geometry"]["coordinates"][1]

print(f"Do lon: {mag} | Toa do: ({lat}, {lon})")
`,
      solutionCode: `sample_feature = {
    "properties": {"mag": 5.8, "place": "Near Coast of Northern Chile"},
    "geometry": {"coordinates": [-71.25, -29.82, 45.0]}
}

mag = sample_feature["properties"]["mag"]
lon = sample_feature["geometry"]["coordinates"][0]
lat = sample_feature["geometry"]["coordinates"][1]

print(f"Do lon: {mag} | Toa do: ({lat}, {lon})")
`,
      exerciseSlug: 'ex-dv-06-ban-do-nhiet-geojson',
      hints: [
        'Kinh độ là phần tử chỉ số 0 (-71.25), vĩ độ là phần tử chỉ số 1 (-29.82).',
      ],
      testCases: [
        {
          id: 'tc-dv-06-1',
          inputData: '',
          expectedOutput: 'Do lon: 5.8 | Toa do: (-29.82, -71.25)',
          explanation: 'Trích xuất độ lớn Richter và tọa độ kinh/vĩ độ chuẩn mực.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-dv-07',
      projectId: 'project-data-visualization',
      slug: 'lam-viec-voi-web-rest-api',
      orderIndex: 7,
      title: 'Checkpoint 7: Làm việc với Web REST API (GitHub Search) & Phân tích JSON',
      description: 'Sử dụng module urllib/requests gửi truy vấn HTTP GET tới GitHub API, kiểm tra mã trạng thái HTTP 200, phân tích JSON và trích xuất danh sách dự án nhiều sao nhất.',
      learningObjectives: [
        'Hiểu giao thức HTTP, phương thức GET và mã phản hồi 200 OK.',
        'Gửi Header tùy chỉnh (ví dụ Accept: application/vnd.github.v3+json) theo quy định của nhà cung cấp API.',
        'Lọc và trích xuất các trường thông tin chính: name, stargazers_count, html_url, description.',
      ],
      theoryContent: `Web API (Application Programming Interface) là cánh cổng cho phép các chương trình máy tính giao tiếp và trao đổi dữ liệu tự động với nhau qua mạng Internet.
Khi gọi GitHub API \`https://api.github.com/search/repositories?q=language:python+sort:stars+stars:>10000\`:
1. Kiểm tra mã trạng thái \`status_code == 200\`.
2. Chuyển đổi dữ liệu JSON sang Python Dictionary bằng \`response.json()\`.
3. Duyệt qua danh sách \`response_dict['items']\` để lấy các thông số cần thiết vẽ biểu đồ.`,
      codeExplanation: `Mô phỏng trích xuất danh sách repository từ phản hồi API JSON mẫu.`,
      starterCode: `mock_api_response = {
    "total_count": 2,
    "items": [
        {"name": "django", "stargazers_count": 78000},
        {"name": "flask", "stargazers_count": 66000}
    ]
}

repo_names = [item["name"] for item in mock_api_response["items"]]
repo_stars = [item["stargazers_count"] for item in mock_api_response["items"]]

print(f"Top Repos: {repo_names}")
print(f"Top Stars: {repo_stars}")
`,
      solutionCode: `mock_api_response = {
    "total_count": 2,
    "items": [
        {"name": "django", "stargazers_count": 78000},
        {"name": "flask", "stargazers_count": 66000}
    ]
}

repo_names = [item["name"] for item in mock_api_response["items"]]
repo_stars = [item["stargazers_count"] for item in mock_api_response["items"]]

print(f"Top Repos: {repo_names}")
print(f"Top Stars: {repo_stars}")
`,
      exerciseSlug: 'ex-dv-07-ket-noi-web-rest-api',
      hints: [
        'Tên các dự án: [django, flask], số sao tương ứng: [78000, 66000].',
      ],
      testCases: [
        {
          id: 'tc-dv-07-1',
          inputData: '',
          expectedOutput: "Top Repos: ['django', 'flask']\nTop Stars: [78000, 66000]",
          explanation: 'Trích xuất dữ liệu từ API JSON thành công.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-dv-08',
      projectId: 'project-data-visualization',
      slug: 'du-an-truc-quan-hoa-hoan-chinh',
      orderIndex: 8,
      title: 'Checkpoint 8: Dự án trực quan hóa dữ liệu hoàn chỉnh (Multi-source Dashboard)',
      description: 'Tổng hợp dữ liệu từ nhiều nguồn, xây dựng báo cáo phân tích khoa học hoàn chỉnh kết hợp biểu đồ cột, biểu đồ đường và bản đồ nhiệt tương tác.',
      learningObjectives: [
        'Kết nối toàn bộ quy trình: Thu thập dữ liệu -> Làm sạch -> Phân tích -> Trực quan hóa.',
        'Thực hành so sánh trực quan giữa hai tập dữ liệu (ví dụ nhiệt độ Sitka vs Thung lũng Chết).',
        'Xuất bản tệp HTML biểu đồ hoàn chỉnh có thể nhúng vào trang web hoặc gửi cho người dùng.',
      ],
      theoryContent: `Ở checkpoint cuối cùng, bạn tổng hợp mọi kỹ năng đã học:
1. Vẽ biểu đồ so sánh biên độ nhiệt giữa Sitka (vùng biển ôn đới ôn hòa) và Death Valley (sa mạc khắc nghiệt), tô màu bóng râm bán trong suốt giữa hai đường biên độ nhiệt (\`ax.fill_between\`).
2. Tích hợp thanh nhấp chuột: Khi nhấp vào thanh biểu đồ của Plotly, mở thẳng trang web GitHub của dự án tương ứng.
3. Xuất file báo cáo \`dashboard.html\` độc lập để chia sẻ với đồng nghiệp.`,
      codeExplanation: `Hàm generate_dashboard_metrics tính toán các chỉ số tóm tắt thống kê trung bình, cao nhất và thấp nhất từ tập dữ liệu.`,
      starterCode: `def calculate_data_metrics(data_series):
    max_val = max(data_series)
    min_val = min(data_series)
    avg_val = round(sum(data_series) / len(data_series), 1)
    return max_val, min_val, avg_val

scores = [85, 92, 78, 90, 88]
hi, lo, avg = calculate_data_metrics(scores)
print(f"Max: {hi} | Min: {lo} | Avg: {avg}")
`,
      solutionCode: `def calculate_data_metrics(data_series):
    max_val = max(data_series)
    min_val = min(data_series)
    avg_val = round(sum(data_series) / len(data_series), 1)
    return max_val, min_val, avg_val

scores = [85, 92, 78, 90, 88]
hi, lo, avg = calculate_data_metrics(scores)
print(f"Max: {hi} | Min: {lo} | Avg: {avg}")
`,
      exerciseSlug: 'ex-dv-08-dashboard-truc-quan-hoa',
      hints: [
        'max=92, min=78, sum=433, avg=433/5 = 86.6.',
      ],
      testCases: [
        {
          id: 'tc-dv-08-1',
          inputData: '',
          expectedOutput: 'Max: 92 | Min: 78 | Avg: 86.6',
          explanation: 'Tính toán các chỉ số thống kê chuẩn xác phục vụ Dashboard.',
          isHidden: false,
        },
      ],
    },
  ],
};


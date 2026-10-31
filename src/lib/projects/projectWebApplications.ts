import { ProjectCourse } from '@/lib/types/project';

export const PROJECT_WEB_APPLICATIONS: ProjectCourse = {
  id: 'project-django-web-app',
  slug: 'du-an-03-django-web-app',
  title: 'Dự án 03: Ứng dụng Web Full-Stack với Django',
  subtitle: 'Xây dựng ứng dụng web quản lý nhật ký học tập Learning Log chuẩn công nghiệp: Models, Views, Templates, Authentication và Deployment',
  category: 'web',
  level: 'advanced',
  accentColor: 'lavender',
  estimatedHours: 30,
  prerequisites: [
    'Chương 01 - 10: Toàn bộ nền tảng Python (Hàm, Cấu trúc dữ liệu, Files & Ngoại lệ)',
    'Chương 11: Lập trình hướng đối tượng OOP (Class, Method, Kế thừa)',
    'Hiểu biết cơ bản về giao thức Web (HTTP, HTML, CSS)',
  ],
  learningObjectives: [
    'Làm chủ kiến trúc Model - View - Template (MVT) tiêu chuẩn của Framework Web Django.',
    'Thiết kế cơ sở dữ liệu quan hệ (Relational Database) với Django ORM: Models, Migrations và khóa ngoại ForeignKey.',
    'Kỹ thuật kế thừa giao diện Template inheritance với base.html và Bootstrap 5.',
    'Bảo mật biểu mẫu với Django ModelForms, xác thực dữ liệu đầu vào và chống tấn công CSRF.',
    'Xây dựng hệ thống xác thực người dùng (Authentication): Đăng ký, Đăng nhập, Đăng xuất an toàn.',
    'Thực thi phân quyền truy cập dữ liệu (Row-Level Authorization & Data Isolation) với @login_required.',
    'Viết Unit Test tự động cho ứng dụng web với Django TestCase.',
    'Nắm vững quy chuẩn triển khai (Deployment) lên đám mây với PostgreSQL và cấu hình bảo mật production.',
  ],
  overview: `Trong dự án Web Applications, bạn sẽ xây dựng ứng dụng web "Learning Log" (Nhật ký Học tập) hoàn chỉnh:
- Cho phép người dùng tạo tài khoản, đăng nhập và ghi chép nhật ký tiến độ học tập các chủ đề công nghệ.
- Mỗi chủ đề (Topic) chứa nhiều bài viết (Entry) chi tiết theo dòng thời gian.
- Dữ liệu được bảo mật tuyệt đối: Mỗi người dùng chỉ có thể xem, thêm, sửa các bài viết do chính mình tạo ra.
- Giao diện được thiết kế hiện đại, responsive trên cả máy tính và điện thoại thông minh nhờ Bootstrap 5.
- Ứng dụng được kiểm thử tự động toàn diện và chuẩn bị cấu hình sẵn sàng triển khai lên dịch vụ đám mây (Render / Platform.sh).`,
  architectureOverview: `Cấu trúc thư mục dự án Django chuẩn mực:
learning_log/
├── manage.py            # Công cụ dòng lệnh quản trị dự án Django
├── ll_project/          # Cấu hình dự án mẹ
│   ├── settings.py      # Cài đặt database, installed apps, middleware, security
│   ├── urls.py          # Bộ định tuyến URL gốc của toàn dự án
│   └── wsgi.py          # Điểm kết nối máy chủ WSGI khi triển khai
├── learning_logs/       # Ứng dụng con quản lý bài viết
│   ├── models.py        # Định nghĩa Model Topic & Entry
│   ├── views.py         # Logic nghiệp vụ xử lý request/response
│   ├── urls.py          # Định tuyến URL của learning_logs
│   ├── forms.py         # Biểu mẫu TopicForm & EntryForm
│   ├── tests.py         # Kiểm thử tự động với TestCase
│   └── templates/       # Giao diện HTML (base.html, index.html, topics.html)
└── accounts/            # Ứng dụng con quản lý xác thực & tài khoản người dùng`,
  runtimeMode: 'hybrid_server_local',
  runtimeNotice: `LƯU Ý VỀ MÔI TRƯỜNG THỰC THI WEB SERVER:
- Trong CodeCoBUG: Để đảm bảo an toàn tuyệt đối theo chuẩn bảo mật điện toán (Zero Untrusted Code Execution on Main Server), bạn sẽ thực hành và được chấm điểm tự động từng thành phần kiến trúc web (Cấu hình Settings, Định tuyến URL, Thiết kế Model, Xử lý Form, Logic View và Phân quyền @login_required) thông qua Judge Engine.
- Chạy máy chủ Web cục bộ (Local Development Server): Django là web server độc lập. Bạn có thể dễ dàng khởi chạy máy chủ phát triển cục bộ (localhost:8000) trên máy tính cá nhân chỉ với 2 câu lệnh pip và python manage.py runserver theo hướng dẫn dưới đây.`,
  localExecutionGuide: {
    prerequisites: [
      'Python 3.10 trở lên',
      'Môi trường ảo venv',
    ],
    installCommands: [
      '# 1. Tạo thư mục và môi trường ảo',
      'mkdir learning_log && cd learning_log',
      'python3 -m venv .venv',
      'source .venv/bin/activate',
      '# 2. Cài đặt Django và các tiện ích',
      'pip install django django-bootstrap5',
      '# 3. Khởi tạo dự án và tạo bảng database',
      'django-admin startproject ll_project .',
      'python manage.py migrate',
    ],
    runCommand: 'python manage.py runserver',
    folderStructure: `learning_log/
  ├── manage.py
  ├── ll_project/
  │   ├── settings.py
  │   └── urls.py
  ├── learning_logs/
  │   ├── models.py
  │   ├── views.py
  │   └── forms.py
  └── accounts/`,
    notes: [
      'Mở trình duyệt truy cập http://localhost:8000/ để xem trang chủ Django.',
      'Tạo tài khoản quản trị viên Admin bằng lệnh: python manage.py createsuperuser',
    ],
  },
  checkpoints: [
    {
      id: 'chk-web-01',
      projectId: 'project-django-web-app',
      slug: 'gioi-thieu-django-va-khoi-tao-du-an',
      orderIndex: 1,
      title: 'Checkpoint 1: Giới thiệu Django & Khởi tạo dự án Web (Architecture & Settings)',
      description: 'Làm quen với Django Framework, cấu trúc tệp manage.py, thiết lập INSTALLED_APPS và kiểm tra cấu hình dự án trong settings.py.',
      learningObjectives: [
        'Hiểu triết lý thiết kế "Batteries-included" của Django: có sẵn ORM, Admin, Authentication, CSRF protection.',
        'Khái niệm dự án (Project) và ứng dụng con (App) trong kiến trúc Django.',
        'Đăng ký ứng dụng mới vào danh sách INSTALLED_APPS trong settings.py.',
      ],
      theoryContent: `Django là một trong những web framework bằng Python mạnh mẽ và bảo mật nhất hành tinh, đứng sau các hệ thống khổng lồ như Instagram, Spotify, Pinterest và Mozilla.
Một dự án Django bao gồm:
1. **Dự án mẹ (Project)**: Chứa các cấu hình toàn cục (\`settings.py\`) và bộ định tuyến URL chính (\`urls.py\`).
2. **Các ứng dụng con (Apps)**: Mỗi ứng dụng con đảm nhiệm một nghiệp vụ độc lập (ví dụ \`learning_logs\` quản lý bài viết, \`accounts\` quản lý người dùng).
Khi tạo app mới bằng lệnh \`python manage.py startapp learning_logs\`, việc đầu tiên bạn bắt buộc phải làm là khai báo nó vào \`INSTALLED_APPS\` trong \`settings.py\`.`,
      codeExplanation: `Mô phỏng cấu trúc cấu hình INSTALLED_APPS và kiểm tra việc kích hoạt ứng dụng learning_logs.`,
      starterCode: `def verify_installed_apps(app_list, target_app):
    # Kiểm tra target_app đã có trong danh sách hay chưa
    return target_app in app_list

installed_apps = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'learning_logs',
]

has_app = verify_installed_apps(installed_apps, 'learning_logs')
print(f"App Activated: {has_app}")
`,
      solutionCode: `def verify_installed_apps(app_list, target_app):
    return target_app in app_list

installed_apps = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'learning_logs',
]

has_app = verify_installed_apps(installed_apps, 'learning_logs')
print(f"App Activated: {has_app}")
`,
      exerciseSlug: 'ex-web-01-khoi-tao-django-project',
      hints: [
        'Ứng dụng learning_logs nằm ở vị trí cuối cùng trong danh sách installed_apps, kết quả là True.',
      ],
      testCases: [
        {
          id: 'tc-web-01-1',
          inputData: '',
          expectedOutput: 'App Activated: True',
          explanation: 'Kiểm tra đăng ký ứng dụng con vào Django settings thành công.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-web-02',
      projectId: 'project-django-web-app',
      slug: 'mo-hinh-request-response-va-urls',
      orderIndex: 2,
      title: 'Checkpoint 2: Mô hình Request / Response & Định tuyến URLs (URLconf)',
      description: 'Tìm hiểu chu kỳ tuần hoàn HTTP Request -> URL Routing -> View, sử dụng hàm path() và đặt tên name parameter để liên kết linh hoạt.',
      learningObjectives: [
        'Hiểu bản chất của giao thức HTTP: Trình duyệt gửi Request -> Máy chủ trả về Response.',
        'Sử dụng include() để chia nhỏ định tuyến URL theo từng ứng dụng con.',
        'Đặt app_name và name trong path() để sử dụng cú pháp {% url "app:name" %} trong template.',
      ],
      theoryContent: `Khi người dùng nhập địa chỉ web vào trình duyệt:
1. Yêu cầu (HTTP Request) đến máy chủ.
2. Django mở tệp \`ll_project/urls.py\`. Nhờ hàm \`path('', include('learning_logs.urls'))\`, Django chuyển tiếp yêu cầu đến tệp \`learning_logs/urls.py\`.
3. Tại đây, hàm \`path('topics/', views.topics, name='topics')\` khớp đường dẫn và gọi hàm \`views.topics\` tương ứng.
Việc đặt tham số \`name='topics'\` giúp ta có thể thay đổi đường dẫn URL sau này mà không làm hỏng các liên kết trong HTML.`,
      codeExplanation: `Mô phỏng bộ khớp đường dẫn URLconf nhận URL và tìm kiếm View tương ứng.`,
      starterCode: `class MockURLPattern:
    def __init__(self, route, view_name):
        self.route = route
        self.view_name = view_name

urlpatterns = [
    MockURLPattern("", "index_view"),
    MockURLPattern("topics/", "topics_view"),
]

def resolve_url(path):
    for p in urlpatterns:
        if p.route == path:
            return p.view_name
    return "404_not_found"

print(resolve_url("topics/"))
print(resolve_url("unknown/"))
`,
      solutionCode: `class MockURLPattern:
    def __init__(self, route, view_name):
        self.route = route
        self.view_name = view_name

urlpatterns = [
    MockURLPattern("", "index_view"),
    MockURLPattern("topics/", "topics_view"),
]

def resolve_url(path):
    for p in urlpatterns:
        if p.route == path:
            return p.view_name
    return "404_not_found"

print(resolve_url("topics/"))
print(resolve_url("unknown/"))
`,
      exerciseSlug: 'ex-web-02-dinh-tuyen-urls',
      hints: [
        'topics/ khớp với topics_view, unknown/ không khớp nên trả về 404_not_found.',
      ],
      testCases: [
        {
          id: 'tc-web-02-1',
          inputData: '',
          expectedOutput: 'topics_view\n404_not_found',
          explanation: 'Định tuyến URL và xử lý lỗi 404 chính xác.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-web-03',
      projectId: 'project-django-web-app',
      slug: 'xay-dung-views-xu-ly-nghiep-vu',
      orderIndex: 3,
      title: 'Checkpoint 3: Xây dựng Views xử lý nghiệp vụ và truy vấn dữ liệu',
      description: 'Viết hàm View nhận đối tượng request, truy vấn dữ liệu từ cơ sở dữ liệu, đóng gói vào Context Dictionary và truyền sang Template bằng hàm render().',
      learningObjectives: [
        'Hiểu đối tượng HttpRequest và HttpResponse trong Django.',
        'Đóng gói dữ liệu vào biến context (từ điển key-value) để truyền vào HTML.',
        'Sử dụng hàm render(request, "template.html", context) tiêu chuẩn.',
      ],
      theoryContent: `Trong mô hình MVT, View đóng vai trò "nhạc trưởng":
- Nhận yêu cầu từ người dùng (\`request\`).
- Truy vấn cơ sở dữ liệu (ví dụ: \`topics = Topic.objects.order_by('date_added')\`).
- Tạo từ điển ngữ cảnh: \`context = {'topics': topics}\`.
- Gọi hàm \`render(request, 'learning_logs/topics.html', context)\` để lấp đầy dữ liệu vào trang HTML và trả về cho trình duyệt.`,
      codeExplanation: `Mô phỏng hàm View nhận request, tạo context và trả về chuỗi phản hồi HTML giả lập.`,
      starterCode: `def mock_topics_view(request):
    topics = ["Python", "Django", "Web Dev"]
    context = {"topics": topics, "count": len(topics)}
    # Trả về chuỗi đại diện cho phản hồi từ hàm render
    return f"Rendered with {context['count']} topics: {', '.join(context['topics'])}"

response = mock_topics_view({"method": "GET"})
print(response)
`,
      solutionCode: `def mock_topics_view(request):
    topics = ["Python", "Django", "Web Dev"]
    context = {"topics": topics, "count": len(topics)}
    return f"Rendered with {context['count']} topics: {', '.join(context['topics'])}"

response = mock_topics_view({"method": "GET"})
print(response)
`,
      exerciseSlug: 'ex-web-03-xay-dung-views',
      hints: [
        'Hàm in ra: Rendered with 3 topics: Python, Django, Web Dev.',
      ],
      testCases: [
        {
          id: 'tc-web-03-1',
          inputData: '',
          expectedOutput: 'Rendered with 3 topics: Python, Django, Web Dev',
          explanation: 'Hàm View xử lý context và dữ liệu chuẩn mực.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-web-04',
      projectId: 'project-django-web-app',
      slug: 'django-templates-ke-thua',
      orderIndex: 4,
      title: 'Checkpoint 4: Hệ thống Giao diện Templates & Kế thừa bố cục (base.html)',
      description: 'Làm quen với Django Template Language (DTL): cú pháp thẻ biến {{ variable }}, thẻ khối {% block content %}, và kỹ thuật kế thừa {% extends "base.html" %}.',
      learningObjectives: [
        'Phân biệt thẻ in giá trị {{ ... }} và thẻ điều khiển logic {% ... %}.',
        'Kỹ thuật DRY (Don\'t Repeat Yourself) với Template Inheritance: định nghĩa khung layout chuẩn trong base.html.',
        'Sử dụng vòng lặp {% for item in list %} và điều kiện {% if %} trong giao diện.',
      ],
      theoryContent: `Thay vì phải viết lại thanh điều hướng (Navbar), thẻ meta và chân trang (Footer) trên mọi trang web:
1. Bạn tạo tệp khung mẹ \`base.html\`:
\`\`\`html
<!DOCTYPE html>
<html>
<body>
  <nav>Learning Log</nav>
  {% block content %}{% endblock content %}
</body>
</html>
\`\`\`
2. Trong các trang con (ví dụ \`topics.html\`), bạn chỉ cần khai báo:
\`\`\`html
{% extends "learning_logs/base.html" %}
{% block content %}
  <h1>Danh sách chủ đề</h1>
  {% for topic in topics %}
    <p>{{ topic.text }}</p>
  {% endfor %}
{% endblock content %}
\`\`\``,
      codeExplanation: `Mô phỏng bộ ghép Template đơn giản thay thế các placeholder bằng dữ liệu thực tế.`,
      starterCode: `def render_template(template_str, context):
    result = template_str
    for key, val in context.items():
        result = result.replace(f"{{{{ {key} }}}}", str(val))
    return result

template = "<h1>Chao mung {{ user }} den voi {{ site }}</h1>"
output = render_template(template, {"user": "Huy", "site": "Learning Log"})
print(output)
`,
      solutionCode: `def render_template(template_str, context):
    result = template_str
    for key, val in context.items():
        result = result.replace(f"{{{{ {key} }}}}", str(val))
    return result

template = "<h1>Chao mung {{ user }} den voi {{ site }}</h1>"
output = render_template(template, {"user": "Huy", "site": "Learning Log"})
print(output)
`,
      exerciseSlug: 'ex-web-04-django-templates-ke-thua',
      hints: [
        'Chuỗi sau khi thay thế là: <h1>Chao mung Huy den voi Learning Log</h1>.',
      ],
      testCases: [
        {
          id: 'tc-web-04-1',
          inputData: '',
          expectedOutput: '<h1>Chao mung Huy den voi Learning Log</h1>',
          explanation: 'Bộ phân tích cú pháp Template hoạt động chính xác.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-web-05',
      projectId: 'project-django-web-app',
      slug: 'database-va-django-models',
      orderIndex: 5,
      title: 'Checkpoint 5: Thiết kế Database & Django Models (Topic & Entry ForeignKey)',
      description: 'Định nghĩa các lớp Model trong models.py kế thừa models.Model, thiết lập trường CharField, DateTimeField, TextField và quan hệ khóa ngoại ForeignKey (1-to-N).',
      learningObjectives: [
        'Hiểu bản chất của Object-Relational Mapping (ORM): Mỗi Class là một Bảng, mỗi Object là một Dòng dữ liệu.',
        'Thiết lập quan hệ 1-Nhiều (One-to-Many): một Topic có nhiều Entry với models.ForeignKey(Topic, on_delete=models.CASCADE).',
        'Hiểu quy trình Migrations: python manage.py makemigrations -> python manage.py migrate.',
      ],
      theoryContent: `Django ORM giúp bạn thao tác với cơ sở dữ liệu (SQLite, PostgreSQL) bằng mã Python thuần túy mà không cần viết câu lệnh SQL thủ công:
\`\`\`python
from django.db import models

class Topic(models.Model):
    text = models.CharField(max_length=200)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text

class Entry(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    text = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)
\`\`\`
Tham số \`on_delete=models.CASCADE\` đảm bảo toàn vẹn dữ liệu: Khi một Chủ đề bị xóa, toàn bộ các bài viết thuộc chủ đề đó cũng sẽ được xóa sạch tự động.`,
      codeExplanation: `Mô phỏng đối tượng Model Topic và hàm __str__ trả về tiêu đề ngắn gọn.`,
      starterCode: `class MockTopicModel:
    def __init__(self, text):
        self.text = text

    def __str__(self):
        return self.text

topic = MockTopicModel("Hoc lap trinh Django")
print(f"Topic Name: {topic}")
`,
      solutionCode: `class MockTopicModel:
    def __init__(self, text):
        self.text = text

    def __str__(self):
        return self.text

topic = MockTopicModel("Hoc lap trinh Django")
print(f"Topic Name: {topic}")
`,
      exerciseSlug: 'ex-web-05-database-va-models',
      hints: [
        'In ra: Topic Name: Hoc lap trinh Django.',
      ],
      testCases: [
        {
          id: 'tc-web-05-1',
          inputData: '',
          expectedOutput: 'Topic Name: Hoc lap trinh Django',
          explanation: 'Mô hình Model và phương thức __str__ chuẩn xác.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-web-06',
      projectId: 'project-django-web-app',
      slug: 'crud-voi-django-forms',
      orderIndex: 6,
      title: 'Checkpoint 6: Xử lý biểu mẫu dữ liệu CRUD với Django ModelForms',
      description: 'Tạo lớp forms.ModelForm, xử lý hai luồng phương thức HTTP (GET hiển thị form trống, POST nhận dữ liệu, kiểm tra is_valid(), lưu form.save()) và thẻ bảo mật CSRF.',
      learningObjectives: [
        'Kế thừa forms.ModelForm để tự động sinh các trường nhập liệu tương thích với Database Model.',
        'Quy trình xử lý View 2 nhánh: if request.method != "POST" (hiển thị form) else (xử lý dữ liệu).',
        'Bảo mật chống tấn công giả mạo yêu cầu chéo trang bằng thẻ bắt buộc {% csrf_token %}.',
      ],
      theoryContent: `Khi người dùng nhập dữ liệu trên web (thêm chủ đề mới hoặc thêm bài viết):
- Luồng \`GET\`: Người dùng mới vào trang, ta khởi tạo biểu mẫu rỗng \`form = TopicForm()\`.
- Luồng \`POST\`: Người dùng nhấn nút Submit, ta nạp dữ liệu vào form \`form = TopicForm(data=request.POST)\`.
- Kiểm tra \`if form.is_valid(): form.save()\` để tự động làm sạch (clean) dữ liệu, ngăn ngừa lỗi SQL Injection, sau đó dùng \`redirect('learning_logs:topics')\` để điều hướng người dùng về trang danh sách.`,
      codeExplanation: `Mô phỏng bộ kiểm tra tính hợp lệ is_valid() của Form dữ liệu.`,
      starterCode: `class MockTopicForm:
    def __init__(self, data=None):
        self.data = data or {}

    def is_valid(self):
        text = self.data.get("text", "").strip()
        # Hợp lệ nếu có nội dung và độ dài <= 200 ký tự
        return bool(text) and len(text) <= 200

valid_form = MockTopicForm({"text": "Kien truc Microservices"})
empty_form = MockTopicForm({"text": "   "})

print(f"Form 1: {valid_form.is_valid()}")
print(f"Form 2: {empty_form.is_valid()}")
`,
      solutionCode: `class MockTopicForm:
    def __init__(self, data=None):
        self.data = data or {}

    def is_valid(self):
        text = self.data.get("text", "").strip()
        return bool(text) and len(text) <= 200

valid_form = MockTopicForm({"text": "Kien truc Microservices"})
empty_form = MockTopicForm({"text": "   "})

print(f"Form 1: {valid_form.is_valid()}")
print(f"Form 2: {empty_form.is_valid()}")
`,
      exerciseSlug: 'ex-web-06-crud-voi-django-forms',
      hints: [
        'Form 1 có nội dung nên hợp lệ (True), Form 2 chỉ có khoảng trắng nên không hợp lệ (False).',
      ],
      testCases: [
        {
          id: 'tc-web-06-1',
          inputData: '',
          expectedOutput: 'Form 1: True\nForm 2: False',
          explanation: 'Kiểm tra tính hợp lệ của Form dữ liệu chuẩn xác.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-web-07',
      projectId: 'project-django-web-app',
      slug: 'he-thong-authentication-dang-nhap',
      orderIndex: 7,
      title: 'Checkpoint 7: Hệ thống Xác thực Authentication (Login, Logout & Registration)',
      description: 'Xây dựng ứng dụng con accounts, sử dụng hệ thống URLs có sẵn của django.contrib.auth, và biểu mẫu đăng ký thành viên mới UserCreationForm.',
      learningObjectives: [
        'Hiểu hệ thống xác thực người dùng tích hợp sẵn của Django (django.contrib.auth).',
        'Cấu hình URL đăng nhập / đăng xuất tự động.',
        'Sử dụng UserCreationForm để tạo tài khoản mới với cơ chế băm mật khẩu bảo mật (PBKDF2/SHA256).',
      ],
      theoryContent: `Django cung cấp một hệ thống xác thực người dùng cấp độ doanh nghiệp:
- Tạo ứng dụng \`accounts\`.
- Trong \`accounts/urls.py\`: \`path('', include('django.contrib.auth.urls'))\`. Django sẽ tự động cung cấp các View và URL cho \`login\`, \`logout\`, đổi mật khẩu.
- Tạo trang đăng ký \`register.html\` sử dụng \`UserCreationForm\`: Khi người dùng nhập tên, mật khẩu và xác nhận mật khẩu, Django sẽ tự động kiểm tra độ mạnh của mật khẩu và băm an toàn trước khi lưu vào database.`,
      codeExplanation: `Mô phỏng trạng thái xác thực người dùng is_authenticated.`,
      starterCode: `class MockUser:
    def __init__(self, username, is_authenticated=True):
        self.username = username
        self.is_authenticated = is_authenticated

def render_navbar_user(user):
    if user.is_authenticated:
        return f"Xin chao, {user.username} | Dang xuat"
    return "Dang nhap | Dang ky"

logged_in = MockUser("HuyCoder")
guest = MockUser("Guest", is_authenticated=False)

print(render_navbar_user(logged_in))
print(render_navbar_user(guest))
`,
      solutionCode: `class MockUser:
    def __init__(self, username, is_authenticated=True):
        self.username = username
        self.is_authenticated = is_authenticated

def render_navbar_user(user):
    if user.is_authenticated:
        return f"Xin chao, {user.username} | Dang xuat"
    return "Dang nhap | Dang ky"

logged_in = MockUser("HuyCoder")
guest = MockUser("Guest", is_authenticated=False)

print(render_navbar_user(logged_in))
print(render_navbar_user(guest))
`,
      exerciseSlug: 'ex-web-07-he-thong-authentication',
      hints: [
        'Người dùng đăng nhập hiển thị: Xin chao, HuyCoder | Dang xuat. Khách vãng lai hiển thị: Dang nhap | Dang ky.',
      ],
      testCases: [
        {
          id: 'tc-web-07-1',
          inputData: '',
          expectedOutput: 'Xin chao, HuyCoder | Dang xuat\nDang nhap | Dang ky',
          explanation: 'Hiển thị giao diện theo trạng thái đăng nhập chuẩn xác.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-web-08',
      projectId: 'project-django-web-app',
      slug: 'phan-quyen-va-bao-mat-du-lieu',
      orderIndex: 8,
      title: 'Checkpoint 8: Quản lý tài khoản & Phân quyền bảo mật (@login_required & Data Isolation)',
      description: 'Gắn trường owner vào Model Topic, sử dụng decorator @login_required để bảo vệ các trang riêng tư, và kiểm tra quyền sở hữu topic.owner == request.user để ngăn truy cập trái phép.',
      learningObjectives: [
        'Bổ sung trường owner = models.ForeignKey(User, on_delete=models.CASCADE) vào Model.',
        'Sử dụng decorator @login_required để tự động chuyển hướng người chưa đăng nhập về trang login.',
        'Ngăn chặn lỗ hổng IDOR (Insecure Direct Object Reference) bằng cách ném ngoại lệ Http404 nếu xem trộm bài của người khác.',
      ],
      theoryContent: `Trong ứng dụng có nhiều người dùng, bảo mật dữ liệu là yêu cầu sống còn:
1. **Bảo vệ View**:
\`\`\`python
from django.contrib.auth.decorators import login_required

@login_required
def topics(request):
    # Chỉ lấy các chủ đề thuộc quyền sở hữu của chính người đang đăng nhập!
    topics = Topic.objects.filter(owner=request.user).order_by('date_added')
    ...
\`\`\`
2. **Kiểm tra quyền sở hữu chi tiết**:
\`\`\`python
@login_required
def topic(request, topic_id):
    topic = Topic.objects.get(id=topic_id)
    if topic.owner != request.user:
        raise Http404
\`\`\`
Kỹ thuật này đảm bảo dù kẻ xấu có đoán được URL \`/topics/12/\`, họ cũng không bao giờ xem trộm được nhật ký của người khác.`,
      codeExplanation: `Mô phỏng hàm kiểm tra quyền truy cập dữ liệu giữa người dùng và chủ sở hữu bài viết.`,
      starterCode: `def check_owner_access(owner_id, current_user_id):
    if owner_id != current_user_id:
        return "404_forbidden"
    return "200_authorized"

print(check_owner_access("user_1", "user_1")) # Chính chủ
print(check_owner_access("user_1", "user_2")) # Xem trộm
`,
      solutionCode: `def check_owner_access(owner_id, current_user_id):
    if owner_id != current_user_id:
        return "404_forbidden"
    return "200_authorized"

print(check_owner_access("user_1", "user_1"))
print(check_owner_access("user_1", "user_2"))
`,
      exerciseSlug: 'ex-web-08-phan-quyen-va-bao-mat',
      hints: [
        'Cùng ID trả về 200_authorized, khác ID trả về 404_forbidden.',
      ],
      testCases: [
        {
          id: 'tc-web-08-1',
          inputData: '',
          expectedOutput: '200_authorized\n404_forbidden',
          explanation: 'Bảo mật phân quyền dữ liệu và ngăn chặn IDOR chính xác.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-web-09',
      projectId: 'project-django-web-app',
      slug: 'kiem-thu-ung-dung-testing',
      orderIndex: 9,
      title: 'Checkpoint 9: Kiểm thử tự động Testing ứng dụng Web (Django TestCase & Client)',
      description: 'Viết các bài Unit Test tự động kế thừa django.test.TestCase, sử dụng Test Client giả lập gửi HTTP Request và kiểm tra mã trạng thái response.status_code == 200.',
      learningObjectives: [
        'Hiểu tầm quan trọng của kiểm thử tự động trong các dự án Web thương mại.',
        'Sử dụng self.client.get(url) để kiểm tra các trang web mà không cần mở trình duyệt thật.',
        'Kiểm tra mã trạng thái HTTP, template được sử dụng, và nội dung hiển thị.',
      ],
      theoryContent: `Một kỹ sư phần mềm chuyên nghiệp không bao giờ nhấp chuột thủ công từng trang để kiểm tra sau mỗi lần sửa code. Ta viết mã kiểm thử tự động trong tệp \`tests.py\`:
\`\`\`python
from django.test import TestCase
from django.urls import reverse

class IndexPageTest(TestCase):
    def test_index_page_status_code(self):
        url = reverse('learning_logs:index')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'learning_logs/index.html')
\`\`\`
Mỗi khi chạy lệnh \`python manage.py test\`, Django sẽ tự động dựng một cơ sở dữ liệu tạm thời trong RAM, chạy toàn bộ các bài test trong vài giây và dọn dẹp sạch sẽ.`,
      codeExplanation: `Mô phỏng assertion kiểm thử mã trạng thái HTTP phản hồi.`,
      starterCode: `def assert_status_code(actual_code, expected_code):
    if actual_code == expected_code:
        return f"PASS: Status code is {expected_code}"
    return f"FAIL: Expected {expected_code}, got {actual_code}"

print(assert_status_code(200, 200))
print(assert_status_code(404, 200))
`,
      solutionCode: `def assert_status_code(actual_code, expected_code):
    if actual_code == expected_code:
        return f"PASS: Status code is {expected_code}"
    return f"FAIL: Expected {expected_code}, got {actual_code}"

print(assert_status_code(200, 200))
print(assert_status_code(404, 200))
`,
      exerciseSlug: 'ex-web-09-kiem-thu-ung-dung-testing',
      hints: [
        '200 == 200 ra PASS: Status code is 200. 404 != 200 ra FAIL: Expected 200, got 404.',
      ],
      testCases: [
        {
          id: 'tc-web-09-1',
          inputData: '',
          expectedOutput: 'PASS: Status code is 200\nFAIL: Expected 200, got 404',
          explanation: 'Kiểm thử mã phản hồi HTTP của web server chính xác.',
          isHidden: false,
        },
      ],
    },
    {
      id: 'chk-web-10',
      projectId: 'project-django-web-app',
      slug: 'quy-chuan-deployment-dam-may',
      orderIndex: 10,
      title: 'Checkpoint 10: Quy chuẩn Triển khai ứng dụng lên Đám mây (Production Readiness)',
      description: 'Nắm vững các nguyên tắc bảo mật và cấu hình khi triển khai dự án Django lên môi trường sản xuất (Production): tắt DEBUG, cấu hình biến môi trường SECRET_KEY, và cơ sở dữ liệu PostgreSQL.',
      learningObjectives: [
        'Hiểu rủi ro bảo mật nghiêm trọng khi để DEBUG = True trên máy chủ thật (lộ mã nguồn và mật khẩu).',
        'Tách bạch thông tin nhạy cảm vào biến môi trường (Environment Variables) hoặc tệp .env.',
        'Sử dụng gunicorn và whitenoise để phục vụ các tệp tĩnh (CSS/JS/Images) tối ưu trên đám mây.',
      ],
      theoryContent: `Bước cuối cùng để trở thành Full-Stack Engineer là đưa ứng dụng ra thế giới thực:
1. **Tắt chế độ gỡ lỗi**: Đặt \`DEBUG = False\` và cấu hình \`ALLOWED_HOSTS = ['your-app.onrender.com', 'localhost']\`.
2. **Bảo mật SECRET_KEY**: Tuyệt đối không commit SECRET_KEY lên GitHub công khai. Sử dụng \`os.environ.get('DJANGO_SECRET_KEY')\`.
3. **Cơ sở dữ liệu sản xuất**: Chuyển từ SQLite (tệp cục bộ) sang PostgreSQL thông qua gói \`psycopg2\` và biến kết nối \`DATABASE_URL\`.
4. **Tệp tĩnh (Static files)**: Dùng \`whitenoise\` để máy chủ Python có thể phân phối các tệp CSS, JavaScript của Bootstrap cực nhanh mà không cần thiết lập máy chủ NGINX phức tạp.`,
      codeExplanation: `Hàm kiểm tra các tiêu chuẩn bảo mật trước khi xuất xưởng ứng dụng lên server đám mây.`,
      starterCode: `def check_production_readiness(debug_mode, secret_key_from_env, has_db_url):
    checks = {
        "DEBUG_IS_OFF": not debug_mode,
        "SECRET_KEY_PROTECTED": secret_key_from_env,
        "PRODUCTION_DB_CONNECTED": has_db_url,
    }
    all_ready = all(checks.values())
    return all_ready, checks

ready, audit = check_production_readiness(False, True, True)
print(f"Production Ready: {ready}")
print(f"Audit: {audit}")
`,
      solutionCode: `def check_production_readiness(debug_mode, secret_key_from_env, has_db_url):
    checks = {
        "DEBUG_IS_OFF": not debug_mode,
        "SECRET_KEY_PROTECTED": secret_key_from_env,
        "PRODUCTION_DB_CONNECTED": has_db_url,
    }
    all_ready = all(checks.values())
    return all_ready, checks

ready, audit = check_production_readiness(False, True, True)
print(f"Production Ready: {ready}")
print(f"Audit: {audit}")
`,
      exerciseSlug: 'ex-web-10-quy-chuan-deployment',
      hints: [
        'Cả 3 tiêu chí: debug_mode=False (DEBUG_IS_OFF: True), secret_key_from_env=True, has_db_url=True đều đạt, nên Production Ready là True.',
      ],
      testCases: [
        {
          id: 'tc-web-10-1',
          inputData: '',
          expectedOutput: "Production Ready: True\nAudit: {'DEBUG_IS_OFF': True, 'SECRET_KEY_PROTECTED': True, 'PRODUCTION_DB_CONNECTED': True}",
          explanation: 'Kiểm tra cấu hình bảo mật triển khai ứng dụng đạt chuẩn 100%.',
          isHidden: false,
        },
      ],
    },
  ],
};


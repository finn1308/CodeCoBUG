import { Topic } from '@/lib/types/curriculum';

export const CHAPTER_11_OOP: Topic = {
  id: 'topic-11-huong-doi-tuong-oop',
  courseId: 'course-codecobug-python-mastery',
  slug: 'chu-de-11-huong-doi-tuong-oop',
  title: 'Chủ đề 11: Lập trình hướng đối tượng (Object-Oriented Programming)',
  summary: 'Mô hình hóa thế giới thực vào phần mềm: Lớp (Class) và Đối tượng (Object), hàm khởi tạo __init__, biến self, kế thừa (Inheritance), phương thức dunder (__str__) và tính đóng gói (Encapsulation).',
  orderIndex: 11,
  category: 'Lập trình nâng cao',
  isPublished: true,
  isLocked: false,
  accentColor: 'lavender',
  lessons: [
    {
      id: 'lesson-11-01-class-va-object',
      topicId: 'topic-11-huong-doi-tuong-oop',
      slug: 'lop-va-doi-tuong-co-ban',
      title: 'Bài 01: Lớp (Class) và Đối tượng (Object)',
      theoryContent: `**Lập trình hướng đối tượng (OOP)** là một phương pháp lập trình mô hình hóa các thực thể thực tế thành mã nguồn thông qua 2 khái niệm cốt lõi:
1. **Lớp (Class)**: Là một bản thiết kế (blueprint) định nghĩa các thuộc tính (Attributes - dữ liệu) và phương thức (Methods - hành vi).
2. **Đối tượng (Object / Instance)**: Là một thể hiện cụ thể được sinh ra từ lớp thiết kế đó.

**Hàm khởi tạo \`__init__()\` và biến \`self\`**:
- \`__init__(self, ...)\`: Được tự động gọi khi một đối tượng mới được tạo ra nhằm gán giá trị khởi điểm cho các thuộc tính.
- \`self\`: Đại diện cho chính đối tượng hiện tại, cho phép truy cập các thuộc tính và phương thức bên trong lớp.

Ví dụ:
\`\`\`python
class Meo:
    def __init__(self, ten, mau_long):
        self.ten = ten          # Thuộc tính
        self.mau_long = mau_long

    def keu(self):              # Phương thức
        return f"{self.ten} keu meo meo!"

my_cat = Meo("Mimi", "trang")
print(my_cat.keu()) # Mimi keu meo meo!
\`\`\``,
      learningObjectives: [
        'Hiểu sự khác biệt giữa Lớp (bản vẽ) và Đối tượng (ngôi nhà cụ thể).',
        'Khai báo hàm khởi tạo __init__ và hiểu ý nghĩa của tham số self.',
        'Định nghĩa các phương thức và thuộc tính cho đối tượng.',
      ],
      prerequisites: [
        'Đã học cú pháp định nghĩa hàm và Dictionary.',
      ],
      codeExamples: [
        {
          title: 'Khởi tạo đối tượng hình chữ nhật',
          code: 'class HinhChuNhat:\n    def __init__(self, d, r):\n        self.d = d\n        self.r = r\n    def dien_tich(self):\n        return self.d * self.r\n\nh = HinhChuNhat(4, 5)\nprint("Dien tich:", h.dien_tich())',
          expectedOutput: 'Dien tich: 20',
          explanation: 'Đối tượng h được tạo với d=4, r=5 và tính được diện tích là 20.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Quên tham số self trong phương thức: def dien_tich():',
          explanation: 'Khi gọi h.dien_tich(), Python tự động truyền chính instance làm tham số đầu tiên, gây lỗi TypeError: takes 0 positional arguments but 1 was given.',
          fix: 'Mọi phương thức của lớp phải luôn có tham số đầu tiên là self.',
        },
      ],
      guidedPracticeTask: {
        title: 'Tạo lớp XeMay',
        instructions: 'Class XeMay có thuộc tính hang_xe và phuong thuc chay() in "Vrum vrum".',
        hint: 'class XeMay: def __init__(self, h): self.hang_xe = h',
      },
      recap: [
        'class là bản vẽ khuôn mẫu, object là thực thể cụ thể.',
        '__init__ khởi tạo thuộc tính cho đối tượng.',
        'self đại diện cho chính thực thể đối tượng đang xét.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Classes and Objects',
          url: 'https://www.w3schools.com/python/python_classes.asp',
        },
      ],
      orderIndex: 1,
      isPublished: true,
      exercises: [
        {
          id: 'ex-11-01',
          lessonId: 'lesson-11-01-class-va-object',
          topicId: 'topic-11-huong-doi-tuong-oop',
          slug: 'lop-hinh-chu-nhat-oop',
          title: 'Xây dựng lớp HinhChuNhat trong OOP',
          difficulty: 'easy',
          points: 15,
          description: 'Hãy xây dựng lớp `HinhChuNhat` gồm:\n1. Hàm khởi tạo `__init__(self, dai, rong)` gán 2 thuộc tính `self.dai` và `self.rong` (số thực).\n2. Phương thức `dien_tich(self)` trả về diện tích (`dai * rong`).\n3. Phương thức `chu_vi(self)` trả về chu vi (`(dai + rong) * 2`).\n\nNhập vào 2 số thực `d` và `r` (mỗi số trên một dòng). Tạo một đối tượng `HinhChuNhat`, sau đó in ra diện tích ở dòng 1 và chu vi ở dòng 2 (làm tròn 2 chữ số thập phân).',
          starterCode: 'class HinhChuNhat:\n    # Cài đặt hàm __init__, dien_tich, chu_vi\n    pass\n\nd = float(input())\nr = float(input())\nhcn = HinhChuNhat(d, r)\nprint(f"{hcn.dien_tich():.2f}")\nprint(f"{hcn.chu_vi():.2f}")\n',
          expectedLearningOutcome: 'Khai báo lớp, định nghĩa hàm khởi tạo và các phương thức tính toán với self.',
          skillTags: ['python_oop', 'classes_and_objects', 'methods'],
          hints: [
            'class HinhChuNhat:\n    def __init__(self, dai, rong):\n        self.dai = dai\n        self.rong = rong\n    def dien_tich(self):\n        return self.dai * self.rong\n    def chu_vi(self):\n        return (self.dai + self.rong) * 2',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-11-01-samp-1',
              exerciseId: 'ex-11-01',
              inputData: '5.0\n3.0',
              expectedOutput: '15.00\n16.00',
              explanation: 'Diện tích = 15.00, Chu vi = 16.00.',
              orderIndex: 1,
            },
            {
              id: 'ex-11-01-samp-2',
              exerciseId: 'ex-11-01',
              inputData: '4.5\n2.5',
              expectedOutput: '11.25\n14.00',
              explanation: 'Tính toán chính xác.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-11-02-ke-thua-inheritance',
      topicId: 'topic-11-huong-doi-tuong-oop',
      slug: 'ke-thua-inheritance',
      title: 'Bài 02: Kế thừa (Inheritance) & Tái sử dụng lớp',
      theoryContent: `**Kế thừa (Inheritance)** cho phép một lớp con (Subclass / Child Class) kế thừa toàn bộ thuộc tính và phương thức từ một lớp cha (Superclass / Parent Class) mà không cần phải viết lại mã nguồn.

Lớp con có thể:
1. Tái sử dụng nguyên vẹn các phương thức của lớp cha.
2. Bổ sung thêm các thuộc tính và phương thức mới.
3. Ghi đè (Override) phương thức của lớp cha để thực hiện hành vi phù hợp hơn.

**Hàm \`super()\`**:
Sử dụng \`super().__init__(...)\` để gọi hàm khởi tạo của lớp cha, giúp khởi tạo đầy đủ các thuộc tính nền tảng:
\`\`\`python
class DongVat:
    def __init__(self, ten):
        self.ten = ten

class Cho(DongVat):
    def __init__(self, ten, giong_cho):
        super().__init__(ten) # Gọi lớp cha DongVat
        self.giong_cho = giong_cho
\`\`\``,
      learningObjectives: [
        'Hiểu nguyên lý tái sử dụng mã nguồn bằng kế thừa.',
        'Sử dụng super().__init__() để kích hoạt hàm khởi tạo lớp cha.',
        'Mở rộng thêm thuộc tính và phương thức riêng cho lớp con.',
      ],
      prerequisites: [
        'Đã học Class và Object cơ bản.',
      ],
      codeExamples: [
        {
          title: 'Kế thừa đơn giản trong Python',
          code: 'class Cha:\n    def loi_chao(self):\n        return "Xin chao tu lop Cha"\n\nclass Con(Cha):\n    pass\n\nc = Con()\nprint(c.loi_chao())',
          expectedOutput: 'Xin chao tu lop Cha',
          explanation: 'Lớp Con kế thừa phương thức loi_chao từ lớp Cha.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Quên gọi super().__init__() khi lớp con có __init__ riêng',
          explanation: 'Làm mất đi quá trình khởi tạo các thuộc tính quan trọng của lớp cha.',
          fix: 'Luôn gọi super().__init__(...) ở dòng đầu tiên của hàm __init__ lớp con.',
        },
      ],
      guidedPracticeTask: {
        title: 'Tạo lớp NhanVien kế thừa Nguoi',
        instructions: 'Nguoi có ten; NhanVien kế thừa Nguoi và có them luong.',
        hint: 'class NhanVien(Nguoi): def __init__(self, t, l): super().__init__(t); self.luong = l',
      },
      recap: [
        'class LopCon(LopCha) biểu diễn quan hệ kế thừa.',
        'super() giúp gọi hàm khởi tạo hoặc phương thức của lớp cha.',
        'Kế thừa giúp mã nguồn mạch lạc và có phân cấp rõ ràng.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Inheritance',
          url: 'https://www.w3schools.com/python/python_inheritance.asp',
        },
      ],
      orderIndex: 2,
      isPublished: true,
      exercises: [
        {
          id: 'ex-11-02',
          lessonId: 'lesson-11-02-ke-thua-inheritance',
          topicId: 'topic-11-huong-doi-tuong-oop',
          slug: 'ke-thua-lop-nguoi-va-hoc-sinh',
          title: 'Kế thừa lớp Nguoi và lớp HocSinh',
          difficulty: 'medium',
          points: 20,
          description: '1. Xây dựng lớp `Nguoi` có hàm khởi tạo `__init__(self, ten, tuoi)`.\n2. Xây dựng lớp `HocSinh` kế thừa lớp `Nguoi`:\n   - Hàm khởi tạo `__init__(self, ten, tuoi, lop)`: sử dụng `super().__init__(ten, tuoi)` và gán thêm thuộc tính `self.lop`.\n   - Phương thức `gioi_thieu(self)` in ra màn hình chuỗi:\n     `Em ten la <ten>, <tuoi> tuoi, hoc lop <lop>.`\n\nNhập vào 3 dòng: Tên, Tuổi, Lớp. Khởi tạo đối tượng `HocSinh` và gọi phương thức `gioi_thieu()`.',
          starterCode: 'class Nguoi:\n    def __init__(self, ten, tuoi):\n        self.ten = ten\n        self.tuoi = tuoi\n\nclass HocSinh(Nguoi):\n    # Cài đặt __init__ với super() và phương thức gioi_thieu\n    pass\n\nten = input()\ntuoi = int(input())\nlop = input()\nhs = HocSinh(ten, tuoi, lop)\nhs.gioi_thieu()\n',
          expectedLearningOutcome: 'Khai báo lớp con kế thừa lớp cha và sử dụng super().__init__.',
          skillTags: ['python_oop', 'inheritance', 'super_function'],
          hints: [
            'class HocSinh(Nguoi):\n    def __init__(self, ten, tuoi, lop):\n        super().__init__(ten, tuoi)\n        self.lop = lop\n    def gioi_thieu(self):\n        print(f"Em ten la {self.ten}, {self.tuoi} tuoi, hoc lop {self.lop}.")',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-11-02-samp-1',
              exerciseId: 'ex-11-02',
              inputData: 'Minh\n15\n10A1',
              expectedOutput: 'Em ten la Minh, 15 tuoi, hoc lop 10A1.',
              explanation: 'Lớp HocSinh kế thừa Nguoi và in đúng định dạng.',
              orderIndex: 1,
            },
            {
              id: 'ex-11-02-samp-2',
              exerciseId: 'ex-11-02',
              inputData: 'Lan\n16\n11B2',
              expectedOutput: 'Em ten la Lan, 16 tuoi, hoc lop 11B2.',
              explanation: 'Khởi tạo và gọi hàm chuẩn xác.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-11-03-dunder-methods',
      topicId: 'topic-11-huong-doi-tuong-oop',
      slug: 'phuong-thuc-dac-biet-magic-methods',
      title: 'Bài 03: Phương thức đặc biệt (Dunder Methods / Magic Methods)',
      theoryContent: `Trong Python, các hàm có 2 dấu gạch dưới ở đầu và cuối (Double Underscore - hay viết tắt là **Dunder**) là những phương thức đặc biệt được Python gọi ngầm định khi đối tượng tham gia vào các thao tác tiêu chuẩn của ngôn ngữ.

**Các phương thức Dunder phổ biến**:
- **\`__str__(self)\`**: Được gọi khi bạn dùng hàm \`str(obj)\` hoặc \`print(obj)\`. Phương thức này phải trả về một chuỗi dễ đọc cho người dùng.
- **\`__len__(self)\`**: Được gọi khi dùng \`len(obj)\`.
- **\`__eq__(self, other)\`**: Được gọi khi so sánh bằng \`obj1 == obj2\`.

Ví dụ:
\`\`\`python
class Sach:
    def __init__(self, tieu_de, tac_gia):
        self.tieu_de = tieu_de
        self.tac_gia = tac_gia

    def __str__(self):
        return f"'{self.tieu_de}' boi {self.tac_gia}"

s = Sach("De Men Phieu Luu Ky", "To Hoai")
print(s) # In ra: 'De Men Phieu Luu Ky' boi To Hoai
\`\`\``,
      learningObjectives: [
        'Hiểu cơ chế hoạt động của các phương thức Dunder (Magic Methods).',
        'Tùy biến cách biểu diễn chuỗi của đối tượng với __str__.',
      ],
      prerequisites: [
        'Đã học Class và Object.',
      ],
      codeExamples: [
        {
          title: 'Cài đặt __str__ cho lớp SanPham',
          code: 'class SanPham:\n    def __init__(self, ten, gia):\n        self.ten = ten\n        self.gia = gia\n    def __str__(self):\n        return f"{self.ten}: {self.gia}k"\n\nsp = SanPham("Tra sua", 30)\nprint(sp)',
          expectedOutput: 'Tra sua: 30k',
          explanation: 'Lệnh print(sp) tự động kích hoạt sp.__str__().',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Phương thức __str__ dùng print thay vì return',
          explanation: '__str__ bắt buộc phải trả về kiểu dữ liệu chuỗi (str). Nếu dùng print hoặc return số, Python sẽ báo TypeError: __str__ returned non-string.',
          fix: 'Luôn dùng return để trả về một chuỗi trong __str__.',
        },
      ],
      guidedPracticeTask: {
        title: 'Cài đặt __len__',
        instructions: 'Cài đặt __len__ trả về số trang sách.',
        hint: 'def __len__(self): return self.so_trang',
      },
      recap: [
        'Dunder methods có dạng __ten__.',
        '__str__ trả về chuỗi mô tả thân thiện khi print(obj).',
        'Giúp đối tượng tùy biến hòa nhập tự nhiên vào các cú pháp Python.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python String Representation',
          url: 'https://www.w3schools.com/python/python_classes.asp',
        },
      ],
      orderIndex: 3,
      isPublished: true,
      exercises: [
        {
          id: 'ex-11-03',
          lessonId: 'lesson-11-03-dunder-methods',
          topicId: 'topic-11-huong-doi-tuong-oop',
          slug: 'cai-dat-phuong-thuc-str-dunder',
          title: 'Cài đặt phương thức hiển thị __str__ cho lớp Sach',
          difficulty: 'easy',
          points: 15,
          description: 'Hãy xây dựng lớp `Sach` gồm:\n1. Hàm khởi tạo `__init__(self, tieu_de, tac_gia)` lưu 2 thuộc tính tương ứng.\n2. Cài đặt phương thức đặc biệt `__str__(self)` trả về chuỗi theo đúng mẫu: `[<tieu_de>] - <tac_gia>`\n\nNhập vào tiêu đề (dòng 1) và tác giả (dòng 2). Khởi tạo đối tượng `Sach` và dùng lệnh `print(sach)` để in ra màn hình.',
          starterCode: 'class Sach:\n    # Cài đặt __init__ và __str__\n    pass\n\ntieu_de = input()\ntac_gia = input()\nsach = Sach(tieu_de, tac_gia)\nprint(sach)\n',
          expectedLearningOutcome: 'Nắm vững cách cài đặt phương thức dunder __str__ để tùy biến hiển thị chuỗi.',
          skillTags: ['python_oop', 'dunder_methods', 'string_representation'],
          hints: [
            'class Sach:\n    def __init__(self, tieu_de, tac_gia):\n        self.tieu_de = tieu_de\n        self.tac_gia = tac_gia\n    def __str__(self):\n        return f"[{self.tieu_de}] - {self.tac_gia}"',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-11-03-samp-1',
              exerciseId: 'ex-11-03',
              inputData: 'Dac Nhan Tam\nDale Carnegie',
              expectedOutput: '[Dac Nhan Tam] - Dale Carnegie',
              explanation: '__str__ định dạng thành công.',
              orderIndex: 1,
            },
            {
              id: 'ex-11-03-samp-2',
              exerciseId: 'ex-11-03',
              inputData: 'Cho Toi Xin Mot Ve Di Tuoi Tho\nNguyen Nhat Anh',
              expectedOutput: '[Cho Toi Xin Mot Ve Di Tuoi Tho] - Nguyen Nhat Anh',
              explanation: 'Hiển thị chuẩn xác.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-11-04-dong-goi-encapsulation',
      topicId: 'topic-11-huong-doi-tuong-oop',
      slug: 'dong-goi-va-quy-uoc-private',
      title: 'Bài 04: Tính đóng gói (Encapsulation) & Thuộc tính riêng tư',
      theoryContent: `**Tính đóng gói (Encapsulation)** là nguyên lý che giấu thông tin nội bộ của đối tượng, chỉ cung cấp các cổng giao tiếp công khai (phương thức getter/setter) nhằm bảo vệ tính toàn vẹn của dữ liệu và ngăn chặn việc can thiệp trái phép từ bên ngoài.

Trong Python:
- **Biến công khai (Public)**: \`self.ten\` (có thể truy cập tự do từ bất cứ đâu).
- **Quy ước bảo vệ (Protected)**: \`self._ten\` (bắt đầu bằng 1 dấu gạch dưới, ngầm hiểu là nội bộ trong lớp và lớp con).
- **Riêng tư (Private)**: \`self.__ten\` (bắt đầu bằng 2 dấu gạch dưới, Python áp dụng cơ chế Name Mangling biến thành \`_ClassName__ten\` để ngăn truy cập trực tiếp từ bên ngoài).

Ví dụ:
\`\`\`python
class TaiKhoan:
    def __init__(self, so_du):
        self.__so_du = so_du # Thuộc tính private

    def lay_so_du(self):
        return self.__so_du

    def gui_tien(self, so_tien):
        if so_tien > 0:
            self.__so_du += so_tien
\`\`\``,
      learningObjectives: [
        'Hiểu tầm quan trọng của tính đóng gói trong kiến trúc phần mềm.',
        'Sử dụng tiền tố __ để khai báo thuộc tính private.',
        'Xây dựng các phương thức an toàn để tương tác với dữ liệu được đóng gói.',
      ],
      prerequisites: [
        'Đã học Class, Object và các cấu trúc điều khiển.',
      ],
      codeExamples: [
        {
          title: 'Đóng gói số dư tài khoản',
          code: 'class ViTien:\n    def __init__(self):\n        self.__tien = 100\n    def lay_tien(self):\n        return self.__tien\n\nv = ViTien()\nprint("So tien:", v.lay_tien())',
          expectedOutput: 'So tien: 100',
          explanation: 'Dữ liệu __tien được bảo vệ an toàn và truy cập qua phương thức getter lay_tien.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Cố truy cập trực tiếp biến private từ bên ngoài: print(tk.__so_du)',
          explanation: 'Gây lỗi AttributeError: object has no attribute "__so_du".',
          fix: 'Luôn gọi phương thức getter/setter do lớp cung cấp.',
        },
      ],
      guidedPracticeTask: {
        title: 'Hàm rút tiền an toàn',
        instructions: 'Viết rut_tien(st): nếu st <= __so_du thì trừ tiền, ngược lại từ chối.',
        hint: 'if st <= self.__so_du: self.__so_du -= st',
      },
      recap: [
        'Tính đóng gói gom dữ liệu và phương thức thao tác vào làm một.',
        '__bien tạo thuộc tính riêng tư tránh sửa đổi ngoài ý muốn.',
        'Getter và Setter là cổng kiểm soát truy cập dữ liệu an toàn.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Classes',
          url: 'https://www.w3schools.com/python/python_classes.asp',
        },
      ],
      orderIndex: 4,
      isPublished: true,
      exercises: [
        {
          id: 'ex-11-04',
          lessonId: 'lesson-11-04-dong-goi-encapsulation',
          topicId: 'topic-11-huong-doi-tuong-oop',
          slug: 'tai-khoan-ngan-hang-dong-goi',
          title: 'Mô phỏng tài khoản ngân hàng với tính đóng gói',
          difficulty: 'medium',
          points: 20,
          description: 'Hãy xây dựng lớp `TaiKhoan` gồm:\n1. Hàm khởi tạo `__init__(self, so_du_ban_dau)` khởi tạo thuộc tính riêng tư `self.__so_du`.\n2. Phương thức `lay_so_du(self)` trả về giá trị của `self.__so_du`.\n3. Phương thức `gui_tien(self, so_tien)` cộng thêm `so_tien` vào `__so_du` nếu `so_tien > 0`.\n4. Phương thức `rut_tien(self, so_tien)`:\n   - Nếu `so_tien > self.__so_du`: in ra chuỗi `Khong du so du`.\n   - Ngược lại: trừ `so_tien` khỏi `__so_du`.\n\nNhập 3 dòng số nguyên: Số dư ban đầu, Số tiền gửi, Số tiền rút. Khởi tạo tài khoản, gửi tiền, rút tiền, và cuối cùng in ra số dư còn lại (qua phương thức `lay_so_du()`).',
          starterCode: 'class TaiKhoan:\n    # Cài đặt thuộc tính private __so_du và các phương thức\n    pass\n\nso_du_dau = int(input())\ntien_gui = int(input())\ntien_rut = int(input())\n\ntk = TaiKhoan(so_du_dau)\ntk.gui_tien(tien_gui)\ntk.rut_tien(tien_rut)\nprint(tk.lay_so_du())\n',
          expectedLearningOutcome: 'Sử dụng thuộc tính private __ và các phương thức nghiệp vụ để đảm bảo tính đóng gói.',
          skillTags: ['python_oop', 'encapsulation', 'private_attributes'],
          hints: [
            'class TaiKhoan:\n    def __init__(self, so_du):\n        self.__so_du = so_du\n    def lay_so_du(self):\n        return self.__so_du\n    def gui_tien(self, so_tien):\n        if so_tien > 0:\n            self.__so_du += so_tien\n    def rut_tien(self, so_tien):\n        if so_tien > self.__so_du:\n            print("Khong du so du")\n        else:\n            self.__so_du -= so_tien',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-11-04-samp-1',
              exerciseId: 'ex-11-04',
              inputData: '1000\n500\n300',
              expectedOutput: '1200',
              explanation: '1000 + 500 = 1500, rút 300 còn 1200.',
              orderIndex: 1,
            },
            {
              id: 'ex-11-04-samp-2',
              exerciseId: 'ex-11-04',
              inputData: '500\n200\n1000',
              expectedOutput: 'Khong du so du\n700',
              explanation: '500 + 200 = 700. Rút 1000 không đủ, in Khong du so du và số dư giữ nguyên 700.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
  ],
};


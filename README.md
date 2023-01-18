# SERVER WEBSITE NEWS

## PHÂN TÍCH DATABASE MONGO DB

### Collection: **users**, **tokens**, **categories**, **posts**

**1. Users: `Thành viên`**

- email
- password
- full_name
- role ["ADMIN", "USER"]
- image
- is_delete
- is_verified

**2. Tokens: `Lưu token của user khi gửi mail để xác thực hoặc thay đổi mật khẩu`**

- user_id
- token
- expire_at: {
  type: Date,
  default: Date.now
  expirse: 3 <=> 3s
  }

**3. Categories: `Danh mục`**

- name
- slug
- level
- parent_id
- childrens: **[{ name, slug, level, childrens }]**
- image
- is_delete

**1. Posts: `Bài viết`**

- title
- slug
- detail_text
- detail_html
- image_title
- category_id
- user_id
- images: **[String]**
- is_delete

### PHÂN TÍCH CÁC CHỨC NĂNG.

**1. Pagination và filter**

- Client: gửi lên page và limit hoặc có thể là các từ khoá dùng để sắp xếp hoặc tìm kiếm để thực thiện phân trang và lọc dữ liệu
- Server: trả về những gì Client gửi lên cùng với data

  > Server: **page** và **limit**
  >
  > - Xử lý như sau:
  > - Chúng ta cần có skip
  >   **skip = (page - 1) \* limit** => **_Nó sẽ bỏ qua trước vị trí skip
  >   VD: skip(3) thì bỏ qua 0, 1, 2 và vị trí bắt đầu là 3_**
  >   Tiếp theo chúng ta sẽ thực hiện phân trang với câu lệnh

```php
const skip = (page - 1) * limit;

const data = model.find().skip(skip).limit(limit);

const total = model.countDocuments();

const totalRows = Math.ceil(total / limit);

return {
  status: 200,
  elements: data,
  meta: {
    pagination: {
      page,
      limit,
      totalRows
    },
    message: "GET ALL SUCCESS."
  }
}
```

> VD: Tổng số bài viết trong db là 10 (bài) document. Chúng ta sẽ lấy ra 3 document, trang số 2.
> <=> limit = 3, page = 2
> => skip = (page - 1) _ limit = (2 - 1) _ 3 = 3
> => thì lúc này sẽ bỏ qua 3 vị trí đầu tiên.
> => posts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
> => results: [3, 4, 5]

**2. Đăng ký**

- Sau các bước validation data.

- Tạo user mới.

- Tạo 1 token để xác thực tài khoản và và lưu token vào db.

- Tạo ra 1 router để email có thể chuyển hướng tới

- VD: http://localhost:5050/api/v1/confirmation/:email?token=token

- Gửi mail xác thực đính kèm theo router trên.

- if error khi gửi thì nhấn resend

**3. Xác thực tài khoản**

- Router http://localhost:5050/api/v1/confirmation/:email?token=token
  - Kiểm tra: token có tồn tại ko
    - No: => Link xác thực đã hết hạn
    - Yes: => tìm được token => { \_userId, ... }
      - Tìm user theo trường { \_id: \_userId, email: req.params.email }
        - No (Không tìm thấy): => Không thể xác thực người dùng, vui lòng đăng ký
        - Yes (Tìm thấy) => user
          - if (user.isVerified) => return 'User đã xác thực thành công'.
          - else => Đi xác thực người dùng. + Cập nhật isVerified = true và lưu vào db.

**4. Đăng nhập**

- Client đăng nhập gửi email và password lên Server

* Tìm email trong db
  - No: => email ko tồn tại
  - Yes: => email tồn tại => kiểm tra password
* Check password:
  - No: => mật khẩu không chính xác.
  - Yes => kiểm tra người dùng đã xác thực chưa.
* Check isVerified
  - No => Kêu người dùng xác thực email
  - Yes => Đăng nhập thành công.

**5. Quên mật khẩu**

- Client:
  - Gửi request thay đổi mật khẩu kèm theo:
  - Email đã được xác thực.
- Server:
  - Tạo ra 1 token và lưu nó vào db.
  - Tạo ra router để khi người dùng nhận được mail sẽ chuyển hướng tới.
  - http://localhost:5050/api/v1/confirmation/change-password/:token
  - Gửi mail cho email mà client request lên.

**6. Xác nhận thay đổi mật khẩu**

- Xác nhận thay đổi mật khẩu:
  - http://localhost:5050/api/v1/confirmation/change-password/:token.
  - Tìm kiếm token trong db.
    - No: token hết hạn yêu cầu resend email.
    - Yes: lấy mật khẩu mới hash rồi cập nhật lại password cho user.

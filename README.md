# SERVER WEBSITE NEWS

## PHÂN TÍCH DATABASE MONGO DB

### Collection: **users**, **tokens**, **categories**, **posts**

1. Users: Thành viên

- email
- password
- full_name
- role ["ADMIN", "USER"]
- image
- is_delete
- is_verified

2. Tokens: Lưu token của user khi gửi mail để xác thực hoặc thay đổi mật khẩu

-
- user_id
- token
- expire_at: {
  type: Date,
  default: Date.now
  expirse: 3 <=> 3s
  }

3. Categories: Danh mục

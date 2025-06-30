Feature('Simple Web');

Scenario('Trang chủ hiển thị đúng tiêu đề và nút', ({ I }) => {
  I.amOnPage('http://localhost:3000');
  I.see('Welcome to CI/CD Test Page');
  I.seeElement('#hello-btn');
});

Scenario('Đăng nhập thành công', ({ I }) => {
  I.amOnPage('http://localhost:3000');
  I.fillField('input[name="username"]', 'admin');
  I.fillField('input[name="password"]', '123');
  I.click('button[type="submit"]');
  I.waitForText('Login success!', 3, '#login-result');
  I.see('Login success!', '#login-result');
});

Scenario('Đăng nhập thất bại', ({ I }) => {
  I.amOnPage('http://localhost:3000');
  I.fillField('input[name="username"]', 'user');
  I.fillField('input[name="password"]', 'wrong');
  I.click('button[type="submit"]');
  I.waitForText('Login failed!', 3, '#login-result');
  I.see('Login failed!', '#login-result');
}); 
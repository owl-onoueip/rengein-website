<?php
// 文字化け防止
mb_language("Japanese");
mb_internal_encoding("UTF-8");

// エラー表示（本番では不要ならコメントアウト）
ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 入力値の取得とサニタイズ
    $name = htmlspecialchars($_POST["name"], ENT_QUOTES, "UTF-8");
    $email = htmlspecialchars($_POST["email"], ENT_QUOTES, "UTF-8");
    $subject = htmlspecialchars($_POST["subject"], ENT_QUOTES, "UTF-8");
    $message = htmlspecialchars($_POST["message"], ENT_QUOTES, "UTF-8");

    // 送信先メールアドレス
    $to = "i.onoue@gmail.com"; // 必要に応じて変更

    $mail_subject = "お問い合わせ: " . $subject;
    $body = "お名前: $name\nメール: $email\n\n$message";

    // FromはLOLIPOPで作成したメールアドレスに必ずする
    $headers = "From: info@rengeinn.lolipop.jp";

    // メール送信
    if (mb_send_mail($to, $mail_subject, $body, $headers)) {
        // 送信成功時はcontact.htmlの完了画面へリダイレクト
        header("Location: contact.html?status=done");
        exit();
    } else {
        // 送信失敗時はエラーメッセージ表示
        echo "<!DOCTYPE html><html lang='ja'><head><meta charset='UTF-8'><title>送信エラー</title></head><body>";
        echo "<h2>送信に失敗しました。</h2>";
        echo "<p>お手数ですが、再度お試しください。</p>";
        echo "<a href='contact.html'>お問い合わせページに戻る</a>";
        echo "</body></html>";
        exit();
    }
} else {
    // POST以外のアクセスはフォームにリダイレクト
    header("Location: contact.html");
    exit();
}
?> 
<?php
// 文字化け防止
mb_language("Japanese");
mb_internal_encoding("UTF-8");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 入力値の取得とサニタイズ
    $name = htmlspecialchars($_POST["name"], ENT_QUOTES, "UTF-8");
    $email = htmlspecialchars($_POST["email"], ENT_QUOTES, "UTF-8");
    $subject = htmlspecialchars($_POST["subject"], ENT_QUOTES, "UTF-8");
    $message = htmlspecialchars($_POST["message"], ENT_QUOTES, "UTF-8");

    // 送信先メールアドレス
    $to = "i.onoue@gmail.com";

    $mail_subject = "お問い合わせ: " . $subject;
    $body = "お名前: $name\nメール: $email\n\n$message";

    $headers = "From: $email";

    // メール送信
    if (mb_send_mail($to, $mail_subject, $body, $headers)) {
        echo "送信完了しました。";
    } else {
        echo "送信に失敗しました。";
    }
} else {
    // POST以外のアクセスはフォームにリダイレクト
    header("Location: contact.html");
    exit();
}
?> 
<?php
// 文字化け防止
mb_language("Japanese");
mb_internal_encoding("UTF-8");

// エラー表示（本番では不要ならコメントアウト）
ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 必須項目のチェック
    $required_fields = array("name", "email", "subject", "message");
    $errors = array();

    foreach ($required_fields as $field) {
        if (empty($_POST[$field])) {
            $errors[] = $field . "は必須項目です。";
        }
    }

    // メールアドレスの形式チェック
    if (!empty($_POST["email"]) && !filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
        $errors[] = "メールアドレスの形式が正しくありません。";
    }

    // エラーがある場合はエラーメッセージを表示
    if (!empty($errors)) {
        echo "<!DOCTYPE html><html lang='ja'><head><meta charset='UTF-8'><title>入力エラー</title></head><body>";
        echo "<h2>入力内容にエラーがあります：</h2>";
        echo "<ul>";
        foreach ($errors as $error) {
            echo "<li>" . htmlspecialchars($error, ENT_QUOTES, "UTF-8") . "</li>";
        }
        echo "</ul>";
        echo "<a href='contact.html'>お問い合わせページに戻る</a>";
        echo "</body></html>";
        exit();
    }

    // 入力値の取得とサニタイズ
    $name = htmlspecialchars($_POST["name"], ENT_QUOTES, "UTF-8");
    $email = htmlspecialchars($_POST["email"], ENT_QUOTES, "UTF-8");
    $phone = htmlspecialchars($_POST["phone"], ENT_QUOTES, "UTF-8");
    $subject = htmlspecialchars($_POST["subject"], ENT_QUOTES, "UTF-8");
    $message = htmlspecialchars($_POST["message"], ENT_QUOTES, "UTF-8");

    // 送信先メールアドレス
    $to = "rengein@jowl.co.jp"; // メインの宛先に変更

    $mail_subject = "お問い合わせ(蓮花院HP): " . $subject;
    $body = "【お問い合わせ内容】\n\n";
    $body .= "お名前: $name\n";
    $body .= "メールアドレス: $email\n";
    $body .= "電話番号: $phone\n";
    $body .= "件名: $subject\n\n";
    $body .= "【お問い合わせ内容】\n$message";

    // Fromは独自ドメインのメールアドレスに変更
    $headers = "From: info@rengeinn.com";

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
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name    = $_POST['name'];
    $email   = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    $telegramToken = "7420385383:AAE2jyoYcLOqbhmV1zMrXqy4QkH6z7aK5dE";
    $chatId        = 1678813866;

    $text = "📩 New Message from Portfolio:\n\n"
          . "👤 Name: $name\n"
          . "📧 Email: $email\n"
          . "📝 Subject: $subject\n"
          . "💬 Message: $message";

    $url = "https://api.telegram.org/bot$telegramToken/sendMessage";

    $data = [
        'chat_id' => $chatId,
        'text'    => $text
    ];

    $options = [
        "http" => [
            "header"  => "Content-type: application/x-www-form-urlencoded\r\n",
            "method"  => "POST",
            "content" => http_build_query($data),
        ],
    ];
    $context  = stream_context_create($options);
    $result   = file_get_contents($url, false, $context);

    if ($result) {
        echo "Message sent successfully!";
    } else {
        echo "Failed to send message.";
    }
}
?>

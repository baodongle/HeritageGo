// Toggle Password Visibility
$(".toggle-password").click(function () {
    $(this).toggleClass("fa-lock fa-unlock-alt");
    let input = $("#defaultForm-pass");
    if (input.attr("type") === "password") {
        input.attr("type", "text");
    } else {
        input.attr("type", "password");
    }
});
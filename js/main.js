// Toggle Password Visibility
$('.toggle-password').click(function () {
  let input = $('#defaultForm-pass')
  $(this).toggleClass('fa-lock fa-unlock-alt')
  if (input.attr('type') === 'password') {
    input.attr('type', 'text')
  } else {
    input.attr('type', 'password')
  }
})

// Submit post comment without reload the page
$('.post__comment').submit(function () {
  // TODO: submit comment
  return false
})

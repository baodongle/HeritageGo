/* global mHeritageGoService */
let isLoading = false

// Render Photography Posts
function renderPhoto (image, photoPost, mainContent) {
  mHeritageGoService
    .getPhoto(image)
    .then(photo => {
      let newPost = photoPost.clone()
      newPost
        .find('.post__avatar')
        .attr('src', 'http:' + photo.account.picture_url)
      newPost.find('.post__caption').html(photo.title[0].content)
      newPost.find('.post__area-name').html(photo.area_name)
      newPost
        .find('.post__photo')
        .attr('src', 'http:' + photo.image_url + '?size=medium')
      if (photo.capture_time) {
        newPost.find('.post__date').find('span').html(photo.capture_time)
      } else {
        newPost.find('.post__date').remove()
      }
      newPost.find('.post__like-count').html(photo.like_count)
      newPost.find('.post__comment-count').html(photo.comment_count)
      newPost.find('.post__view-count').html(photo.view_count)

      newPost.removeAttr('id')
      newPost.removeAttr('hidden')

      newPost.hide().appendTo(mainContent).fadeIn()
    })
    .catch(error => {
      console.log(error)
    })
}

function renderPhotos (ignored) {
  let main = $('main')
  mHeritageGoService
    .getPhotos({
      limit: 2,
      offset: ignored
    })
    .then(photos => {
      let post = $('#defaultPost')
      isLoading = false
      $(photos).each(function () {
        renderPhoto(this, post, main)
      })
    })
    .catch(error => {
      console.log(error)
    })
}

$(function () {
  let ignored = 2
  renderPhotos(ignored)
  isLoading = false
  $(window).scroll(function () {
    if (!isLoading) {
      if ($(window).scrollTop() >= $(document).height() - $(window).height() - 1500) {
        isLoading = true
        ignored += 2
        renderPhotos(ignored)
      }
    }
  })
})
